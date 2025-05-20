"use client";
import Link from "next/link";
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";

export default function PaymentDeclined() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-8">
            Oops! Your payment was not successful. Please try again or choose a
            different payment method.
          </p>

          <Link
            href="/explore"
            className="inline-block bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg"
          >
            Try Again
          </Link>

          <p className="text-gray-500 text-sm mt-6">
            Need help?{" "}
            <Link href="/contact" className="text-red-600 underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
