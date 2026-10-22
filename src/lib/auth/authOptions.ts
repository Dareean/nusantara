import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ensureOAuthUser } from "@/app/auth/serverAuth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        ensureOAuthUser({
          email: user.email,
          name: user.name || user.email.split("@")[0],
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      let target = "/dashboard";
      if (url.startsWith(baseUrl)) {
        target = url.slice(baseUrl.length);
      } else if (url.startsWith("/")) {
        target = url;
      }

      if (target.startsWith("/api/auth/oauth-sync")) {
        return url.startsWith("http") ? url : `${baseUrl}${url}`;
      }

      return `${baseUrl}/api/auth/oauth-sync?redirect=${encodeURIComponent(target)}`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
};
