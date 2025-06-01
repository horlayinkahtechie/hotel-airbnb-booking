import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/app/lib/supabase";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const adminEmails = ["horlayinkah2005@gmail.com"];
        const isAdmin = adminEmails.includes(user.email);

        // Upsert user (insert or update if exists)
        const { error } = await supabase.from("users").upsert(
          {
            email: user.email,
            name: user.name,
            role: isAdmin ? "admin" : "user",
            email_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" } // This handles the duplicate key issue
        );

        if (error) throw error;

        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // Add role to token
      const adminEmails = ["horlayinkah2005@gmail.com"];
      token.role = adminEmails.includes(token.email) ? "admin" : "user";
      return token;
    },
    async session({ session, token }) {
      // Add role to session
      session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
