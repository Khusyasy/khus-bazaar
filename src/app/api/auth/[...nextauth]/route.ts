import NextAuth from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/db"
import bcrypt from "bcrypt"

if (!process.env.GOOGLE_CLIENT_ID) throw new Error("Missing GOOGLE_CLIENT_ID")
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error("Missing GOOGLE_CLIENT_SECRET")

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          ...profile,
          id: profile.id.toString(),
          role: "USER",
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "khusyasy@mail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          }
        })
        if (!user) return null

        const match = await bcrypt.compare(credentials.password, user.password)
        if (!match) return null

        return {
          ...user,
          id: user.id.toString(),
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    }
  }
})

export { handler as GET, handler as POST }
