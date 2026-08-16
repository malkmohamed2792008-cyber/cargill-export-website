import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getPrismaClient } from "@/lib/prisma"
import { loginSchema } from "@/lib/validation/auth"
import { isUserRole } from "@/lib/auth/roles"
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
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          return null
        }

        const prisma = getPrismaClient()
        if (!prisma) {
          return null
        }

        const admin = await prisma.admin.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        })

        if (!admin || !admin.isActive || !isUserRole(admin.role)) {
          return null
        }

        const isValid = await bcrypt.compare(parsed.data.password, admin.password)
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
      if (user && isUserRole((user as { role?: unknown }).role)) {
        token.id = user.id
        token.role = (user as { role: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && isUserRole(token.role)) {
        session.user.id = token.id as string
        session.user.role = token.role
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
})
