"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import PaystackButton from "@/app/_components/DynamicPaystackButton";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";

export default function PaymentComponent() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract all search params
  const total_price = searchParams.get("total_price") || "₦0";
  const amenities = searchParams.get("amenities") || "";
  const capacity = searchParams.get("capacity") || "";
  const room_type = searchParams.get("room_type") || "";
  const image_url = searchParams.get("image_url") || "";
  const room_id = searchParams.get("room_id");
  const room_number = searchParams.get("room_number");
  const fullName = searchParams.get("full_name") || "";
  const checkinDate = searchParams.get("checkin_date") || null;
  const checkoutDate = searchParams.get("checkout_date") || null;
  const noOfDays = searchParams.get("no_of_days") || "";

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  // Handle successful payment
  const handleSuccess = async () => {
    console.log("handleSuccess called");

    if (!session || !session.user?.email) {
      alert("Please log in first to book.");
      return;
    }

    try {
      // Insert booking record
      const { error: bookingError } = await supabase.from("bookings").insert([
        {
          email: session.user.email,
          room_number,
          room_id,
          amenities,
          capacity,
          price: total_price,
          room_type,
          room_name: "Unknown for now",
          room_status: "occupied",
          listing_img: image_url,
          payment_status: "Paid",
          full_name: fullName,
          checkin_date: checkinDate,
          checkout_date: checkoutDate,
          no_of_days: noOfDays,
        },
      ]);

      if (bookingError) {
        console.error("Booking insert error:", bookingError);
        alert("Failed to save booking.");
        return;
      }

      // Update room status to 'occupied'
      const { error: roomError } = await supabase
        .from("rooms")
        .update({ status: "occupied" })
        .eq("room_id", room_id);

      if (roomError) {
        console.error("Room update error:", roomError);
      }

      // Schedule room release based on checkout date
      const { error: releaseError } = await supabase
        .from("room_release_schedule")
        .insert([
          {
            room_id,
            release_date: checkoutDate,
          },
        ]);

      if (releaseError) {
        console.error("Release schedule insert error:", releaseError);
      }

      console.log("Booking and room updates successful.");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  // Prepare Paystack button props
  const paymentProps = {
    email: session?.user?.email || email,
    amount: Number(total_price.toString().replace(/[₦,]/g, "")) * 100 || 0, // Convert to kobo
    publicKey,
    text: "Pay Now",
    onSuccess: async () => {
      await handleSuccess();
      router.push("/payment_status/success");
    },
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
                ₦
                {Number(
                  total_price.toString().replace(/[₦,]/g, "")
                ).toLocaleString()}
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
