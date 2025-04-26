import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/user/signin",
    error: "/unauthorized",
  },
  callbacks: {
    async signIn({ user }) {
      console.log("User signed in:", user);
      return true; // Always allow sign-in
    },
  },
});

export { handler as GET, handler as POST };
