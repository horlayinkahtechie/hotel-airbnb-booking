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
    signIn: "/",
    error: "/unauthorized",
  },
  callbacks: {
    async signIn({ user }) {
      console.log("User signed in:", user);
      return true;
    },
  },
});

export { handler as GET, handler as POST };
