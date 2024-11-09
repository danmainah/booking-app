import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { db } from "./lib/db";
import { redirect } from "next/dist/server/api-utils";

const providers = [
  Credentials({
    name: "Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials: any) {
      const user = await db.user.findUnique({ where: { email: credentials.email } });
      if (!user) {
        throw new Error(`No user found with email ${credentials.email}, please signup first.`);
      }
      const isValid = await compare(credentials.password, user.password);
      if (!isValid){
        throw new Error("Kindly enter correct password");
      }
      return { id: user.id, name: user.username, email: user.email, role: user.role };
    },
  }),
  Google({
    clientId: process.env.GOOGLE_ID || "",
    clientSecret: process.env.GOOGLE_SECRET || "",
  }),
];

export default NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user, error }) {
      if (error) {
        token.error = error.message;
      }
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account }) {
        if (account && account.provider !== "credentials") {
          const data = await db.user.findUnique({ where: { email: user.email } });
          if (!data) {
            return '/auth/signin?error=No user found with this email, please signup first';
          }
        }
        return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
    signOut: "/",
  },
});

