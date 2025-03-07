import { randomBytes, randomUUID } from "crypto";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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
  ],
};
