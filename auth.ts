import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { db } from "./lib/db";

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
        throw new Error("Invalid password");
      }
      return { id: user.id, name: user.username, email: user.email };
    },
  }),
  Google({
    clientId: process.env.GOOGLE_ID || "",
    clientSecret: process.env.GOOGLE_SECRET || "",
    async profile(profile) {
      const user = await db.user.findUnique({ where: { email: profile.email } });
      if (!user) {
        return { error: "No user found with email " + profile.email + "please signup first" };
      }
      return { id: profile.sub, name: profile.name, email: profile.email, image: profile.picture };
    },
  }),
];

export default NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user, error }) {
      if (error) {
        throw new Error(error.message);
      }
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id ;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    verifyRequest: "/", 
    error: "/auth/error",
  },
});