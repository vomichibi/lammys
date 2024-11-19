import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

// List of admin emails
const adminEmails = ['team@lammys.au'];

// This is a temporary user store. In production, use a database.
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    // Password: "password123"
    password: '$2a$10$8Ux7YyXKxKcCZKCqJX4kB.qJpVZZpV5mh0TfHR1ZHwzDns4VeGHGi',
  },
];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        // Find user in the temporary store
        const user = users.find(user => user.email === credentials.email);

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = adminEmails.includes(token.email || '');
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in
      if (url.startsWith(baseUrl)) {
        if (url.includes('/login') || url === baseUrl) {
          const token = await fetch(`${baseUrl}/api/auth/session`).then(res => res.json());
          if (token?.user?.email && adminEmails.includes(token.user.email)) {
            return `${baseUrl}/admindash/dashboard`;
          }
          return `${baseUrl}/dashboard`;
        }
      }
      return url;
    }
  },
});

export { handler as GET, handler as POST };
