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
    async signIn({ user }) {
      try {
        const adminEmails = ["horlayinkah2005@gmail.com"];
        const isAdmin = adminEmails.includes(user.email);

        const { error } = await supabase.from("users").upsert(
          {
            email: user.email,
            name: user.name,

            role: isAdmin ? "admin" : "user",
            email_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        );

        if (error) throw error;

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async jwt({ token }) {
      const adminEmails = ["horlayinkah2005@gmail.com"];
      token.role = adminEmails.includes(token.email) ? "admin" : "user";
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
