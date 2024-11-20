import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { createUser, getUser } from '@/lib/userManagement';

// List of admin emails
const adminEmails = ['team@lammys.au'];

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

        // Get user from Firestore
        const user = await getUser(credentials.email);
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

        return user;
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Create or update user in Firestore
        await createUser({
          email: user.email!,
          name: user.name || '',
        });
        return true;
      } catch (error) {
        console.error('Error creating user:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        const dbUser = await getUser(user.email!);
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      if (user) {
        token.isAdmin = adminEmails.includes(token.email || '');
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.role = token.role;
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
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };
