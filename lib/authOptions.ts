import { randomBytes, randomUUID } from "crypto";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma/prisma";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    maxAge: 60 * 24 * 60 * 60, // 30 days
    strategy: "jwt",
    generateSessionToken() {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_APP_CLIENT_ID || "id") as string,
      clientSecret: (process.env.GOOGLE_APP_CLIENT_SECRET ||
        "secret") as string,
    }),
    CredentialsProvider({
      name: "E-Mail-Adresse",
      credentials: {
        username: {
          label: "E-Mail-Adresse",
          type: "text",
          placeholder: "E-Mail",
        },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        // @ts-expect-error - we know this is a string
        const { password, email } = credentials || {};

        const user = await prisma.userCredentials.findFirst({
          where: {
            email,
          },
        });

        if (bcrypt.compareSync(password || "", user?.passwordHash || "")) {
          return { id: user?.id || "", email: user?.email || "" };
        }
        return null;
      },
    }),
  ],
};
