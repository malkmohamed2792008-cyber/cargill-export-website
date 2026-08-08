import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Delay importing Prisma until authorize is called (avoids loading server-only
        // native modules during middleware/edge evaluations).
        const { getPrismaClient } = await import("@/lib/prisma")
        const prisma = getPrismaClient()
        if (!prisma) {
          return null
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email as string },
        })

        if (!admin || !admin.isActive) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password as string, admin.password)

        if (!isValid) {
          return null
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  // Explicit secret is required by NextAuth v5. Read from environment.
  // The variable name used by NextAuth and in this project is NEXTAUTH_SECRET.
  secret: process.env.NEXTAUTH_SECRET,
})
