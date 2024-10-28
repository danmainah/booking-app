import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import type { Provider } from "next-auth/providers"
import { db } from "./lib/db";


const providers: Provider[] = [
    Credentials({
        name: "Password",
        credentials: {
            email: {
                label: "Email",
                type: "email",
                placeholder: "Email",
            },
            password: {
                label: "Password",
                type: "password",
                placeholder: "Password",
            },
        },
        async authorize(credentials) {
           const user = await db.user.findUnique({
                where: {
                  email: credentials.email as string,
                }
            })
            if (!user) {
                return null
            }
            const isValid = await compare(credentials.password as string, user.password)
            if (!isValid) {
                return null
            }
            return {
              id: user.id,
              name: user.username,
              email: user.email,
            }
        }
    }), GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
        async profile(profile) {
          const user = await db.user.findUnique({
            where: {
              email: profile.email
            }
          })  
          if (!user) {
            return null
          }
          return {
            id:user.id,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          }
        },
      })
]

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers,
    pages: {
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        newUser: '/auth/signup' // New users will be directed here on first sign in (leave the property out if not of interest)
      },
      callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Add user ID to token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string; // Add user ID to session
                session.user.name = token.name; // Optional: add name if needed
                session.user.email = token.email as string; // Optional: add email if needed
            }
            return session;
        },
      },
})