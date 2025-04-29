"use client";

import { useState } from "react";
import { PaystackButton } from "react-paystack";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";

export default function PaymentPage() {
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const priceString = searchParams.get("price") || "₦0";
  const priceNumber = Number(priceString.replace(/[^\d]/g, ""));

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  const paymentProps = {
    email,
    amount: priceNumber * 100,
    publicKey,
    text: "Pay Now",
    onSuccess: () => {
      router.push("/payment_status/success");
    },
    onClose: () => {
      router.push("/payment_status/decline");
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Make a Payment
          </h2>

          <div className="space-y-4">
            <p className="text-lg text-center">
              Total Price:{" "}
              <span className="font-semibold text-green-600">
                ₦{priceNumber.toLocaleString()}
              </span>
            </p>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <PaystackButton
              {...paymentProps}
              className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all text-lg mt-4"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
