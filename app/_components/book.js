"use client";

import { useSession } from "next-auth/react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookNowButton({ listing }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBookNow = async () => {
    if (!session) {
      alert("Please log in first to book.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("bookings").insert([
        {
          email: session.user.email,
          listing_id: listing.id,
          listing_name: listing.name,
          location: listing.location,
          price: listing.price,
          type: listing.type,
          listing_img: listing.image,
        },
      ]);

      if (error) {
        console.error(error);
        alert(error.message || "Booking failed. Try again.");
      } else {
        // 👇 Use URLSearchParams for safer URL building
        const params = new URLSearchParams({
          name: listing.name,
          location: listing.location,
          price: listing.price.toString(),
          type: listing.type,
          image: listing.image,
        });

        router.push(`/checkout?${params.toString()}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookNow}
      disabled={loading}
      className={`bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Booking...
        </div>
      ) : (
        "Book Now"
      )}
    </button>
  );
}
