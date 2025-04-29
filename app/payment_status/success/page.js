"use client";
import Link from "next/link";
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";

export default function Success() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your booking. We can&apos;t wait to host you!
          </p>

          <Link
            href="/explore"
            className="inline-block bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg"
          >
            Book More
          </Link>

          <p className="text-gray-500 text-sm mt-6">
            Want to make another booking?{" "}
            <Link href="/reservation" className="text-green-600 underline">
              Browse Listings
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
