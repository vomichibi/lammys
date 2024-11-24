import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      isAdmin: boolean
      role: 'user' | 'admin'
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    isAdmin?: boolean
    role?: 'user' | 'admin'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isAdmin: boolean
    role: 'user' | 'admin'
  }
}
