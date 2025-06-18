"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PaystackButton from "@/app/_components/DynamicPaystackButton";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
// import emailjs from "@emailjs/browser";

export default function PaymentComponent() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const priceString = searchParams.get("price") || "₦0";
  const priceNumber = Number(priceString.replace(/[^\d]/g, ""));

  const name = searchParams.get("name") || "";
  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";
  const image = searchParams.get("image") || "";
  const listing_id = searchParams.get("listing_id");
  const [fullName] = useState(searchParams.get("full_name") || "");
  const [checkinDate] = useState(searchParams.get("checkin_date") || null);
  const [checkoutDate] = useState(searchParams.get("checkout_date") || null);
  const [noOfDays] = useState(searchParams.get("no_of_days") || "");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  useEffect(() => {
    const handleSuccess = async () => {
      console.log("handleSuccess called");
      if (!session) {
        alert("Please log in first to book.");
        return;
      }

      const { error } = await supabase.from("bookings").insert([
        {
          email: session.user.email,
          listing_id,
          listing_name: name,
          location,
          price: priceNumber,
          type,
          listing_img: image,
          payment_status: "Paid",
          full_name: fullName,
          checkin_date: checkinDate,
          checkout_date: checkoutDate,
          no_of_days: noOfDays,
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        alert("Failed to save booking. Please try again.");
      } else {
        console.log("Booking saved successfully:");
        // router.push("/payment_status/success");
      }
    };

    handleSuccess();
  }, []);

  const paymentProps = {
    email: session?.user?.email || email,
    amount: priceNumber * 100,
    publicKey,
    text: "Pay Now",
    onSuccess: () => router.push("/payment_status/success"),
    onClose: () => router.push("/payment_status/decline"),
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
