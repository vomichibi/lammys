import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createUser, getUser } from '@/lib/userManagement';

// List of admin emails
const adminEmails = ['team@lammys.au'];

type Credentials = Record<"email" | "password", string> | undefined;

interface User {
  id: string;
  email: string;
  name?: string;
  password: string;
  role?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
      async authorize(credentials: Credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const user = await getUser(credentials.email) as User | null;
        
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Type guard to check if user has password
        if (!('password' in user)) {
          throw new Error('Invalid user data');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password) as boolean;

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          isAdmin: adminEmails.includes(user.email),
          role: user.role || 'user'
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (user.email) {
          await createUser({
            email: user.email,
            name: user.name || '',
          });
        }
        return true;
      } catch (error) {
        console.error('Error creating user:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = adminEmails.includes(token.email || '');
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        if (url.includes('/login') || url === baseUrl) {
          return token?.isAdmin ? `${baseUrl}/admindash/dashboard` : `${baseUrl}/dashboard`;
        }
      }
      return url;
    }
  },
};
