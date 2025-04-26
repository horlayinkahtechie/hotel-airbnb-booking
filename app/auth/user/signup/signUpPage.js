"use client";

import Navbar from "@/app/_components/Navbar";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-2">Create Your Account 🚀</h1>
          <p className="text-gray-600 mb-6">
            Sign up with Google to get started
          </p>

          <button
            onClick={() => signIn("google")}
            className="w-full flex cursor-pointer items-center justify-center gap-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition"
          >
            <FcGoogle size={22} />
            Sign up with Google
          </button>

          <p className="mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="/auth/user/signin"
              className="text-blue-600 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
