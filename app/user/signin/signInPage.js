"use client";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome Back 👋</h1>
          <p className="text-gray-600 mb-6">
            Sign in or Sign up to access your dashboard
          </p>

          <button
            onClick={handleSignIn}
            className="w-full flex cursor-pointer items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
          >
            <FcGoogle size={22} />
            Sign in with Google
          </button>

          <p className="mt-6 text-sm text-gray-400">
            You must sign in or sign up with your Google account to continue.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
