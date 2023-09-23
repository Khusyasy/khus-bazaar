import NextAuth, { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/db";
import bcrypt from "bcrypt";

if (!process.env.GOOGLE_CLIENT_ID) throw new Error("Missing GOOGLE_CLIENT_ID");
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error("Missing GOOGLE_CLIENT_SECRET");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const user = await prisma.user.upsert({
          where: { email: profile.email },
          create: {
            email: profile.email,
            role: "USER",
          },
          update: {
            email: profile.email,
          }
        })

        return {
          ...profile,
          ...user,
          id: user.id.toString(),
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "khusyasy@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          }
        })
        if (!user) return null
        if (!user.password) return null

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
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.role = token.role
      session.id = token.sub ?? token.id ?? "-1"
      return session
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
