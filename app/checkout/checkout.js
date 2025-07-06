"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../_components/Navbar";
import Image from "next/image";
import Link from "next/link";
import Footer from "../_components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "../lib/supabase";
import dynamic from "next/dynamic";

const PaymentPage = dynamic(() => import("./payment/PaymentComponent"), {
  ssr: false,
});

export default function Checkout() {
  const searchParams = useSearchParams();

  const capacity = searchParams.get("capacity") || "";
  const amenities = searchParams.get("amenities") || "";
  const price_per_night = searchParams.get("price_per_night") || "₦0";
  const room_type = searchParams.get("room_type") || "";
  const image_url = searchParams.get("image_url") || "";
  const room_id = searchParams.get("room_id") || "";
  const room_number = searchParams.get("room_number") || "";

  const priceNumber = Number(price_per_night.replace(/[^\d.]/g, "")) || 0;
  const [days, setDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Paystack");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total_price = days * priceNumber;

  // Fetch already booked dates for this room
  useEffect(() => {
    const fetchBookedDates = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("checkin_date, checkout_date")
          .eq("room_id", room_id)
          .eq("payment_status", "Paid"); // Only consider Paid bookings

        if (error) throw error;

        if (data && data.length > 0) {
          const dates = data.flatMap((booking) => {
            const startDate = new Date(booking.checkin_date);
            const endDate = new Date(booking.checkout_date);
            const datesInRange = [];

            // Include all dates between checkin and checkout
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
              datesInRange.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }

            return datesInRange;
          });

          setBookedDates(dates);
        }
      } catch (err) {
        console.error("Error fetching booked dates:", err);
        setError("Failed to load booking availability");
      } finally {
        setLoading(false);
      }
    };

    if (room_id) {
      fetchBookedDates();
    }
  }, [room_id]);

  // Update checkout date when checkin date or days change
  useEffect(() => {
    if (checkInDate && days > 0) {
      const out = new Date(checkInDate);
      out.setDate(out.getDate() + days);
      setCheckOutDate(out.toISOString().split("T")[0]);
    } else {
      setCheckOutDate("");
    }
  }, [checkInDate, days]);

  // Check if selected dates are available
  const isDateRangeAvailable = () => {
    if (!checkInDate || !checkOutDate) return false;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const current = new Date(start);

    while (current <= end) {
      if (
        bookedDates.some(
          (date) => date.toDateString() === current.toDateString()
        )
      ) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }

    return true;
  };

  const handleCheckInChange = (date) => {
    setCheckInDate(date);
    // Reset days if new check-in date is in booked range
    if (bookedDates.some((d) => d.toDateString() === date.toDateString())) {
      setDays(1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: Customer Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Check-in Date
              </label>
              <DatePicker
                selected={checkInDate}
                onChange={handleCheckInChange}
                excludeDates={bookedDates}
                minDate={new Date()}
                placeholderText="Select a check-in date"
                className="w-full border p-3 rounded-lg"
                required
              />
              {checkInDate &&
                bookedDates.some(
                  (d) =>
                    d.toDateString() === new Date(checkInDate).toDateString()
                ) && (
                  <p className="text-red-500 text-sm mt-1">
                    This date is already booked
                  </p>
                )}
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Number of Days
              </label>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) =>
                  setDays(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Check-out Date
              </label>
              <input
                type="text"
                readOnly
                value={checkOutDate}
                className={`w-full border p-3 rounded-lg ${
                  checkOutDate && !isDateRangeAvailable()
                    ? "bg-red-100 border-red-300"
                    : "bg-gray-100"
                }`}
              />
              {checkOutDate && !isDateRangeAvailable() && (
                <p className="text-red-500 text-sm mt-1">
                  Some dates in this range are already booked
                </p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Room Number
              </label>
              <input
                readOnly
                type="number"
                value={room_number}
                className="w-full border p-3 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Room ID
              </label>
              <input
                readOnly
                type="text"
                value={room_id}
                className="w-full border p-3 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border p-3 rounded-lg"
              >
                <option value="Paystack">Paystack</option>
              </select>
            </div>

            {checkInDate &&
            checkOutDate &&
            fullName &&
            isDateRangeAvailable() ? (
              <Link
                href={{
                  pathname: "/checkout/payment",
                  query: {
                    price_per_night,
                    total_price: total_price,
                    capacity,
                    image_url,
                    room_type,
                    room_number,
                    room_id,
                    full_name: fullName,
                    checkout_date: checkOutDate,
                    checkin_date: new Date(checkInDate)
                      .toISOString()
                      .split("T")[0],
                    no_of_days: days,
                    payment_method: paymentMethod,
                  },
                }}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-xl flex justify-center items-center"
              >
                Confirm and Pay
              </Link>
            ) : (
              <button
                disabled
                className="w-full mt-4 bg-gray-400 text-white font-semibold py-3 rounded-xl flex justify-center items-center cursor-not-allowed"
              >
                {!isDateRangeAvailable() && checkOutDate
                  ? "Selected dates are not available"
                  : "Complete all fields to proceed"}
              </button>
            )}
          </div>

          {/* RIGHT: Booking Summary */}
          <div className="space-y-6">
            {image_url && (
              <div className="w-full h-64 relative rounded-xl overflow-hidden">
                <Image
                  src={image_url}
                  alt={room_type}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              </div>
            )}
            <div className="border rounded-lg p-4">
              <h2 className="text-2xl font-semibold">{room_type}</h2>
              <p className="text-gray-500 mt-2">
                {capacity} {parseInt(capacity) > 1 ? "Guests" : "Guest"}
              </p>
              {amenities && (
                <div className="mt-2">
                  <p className="text-gray-500">{amenities}</p>
                </div>
              )}

              <p className="text-gray-700 mt-2">Room Number: {room_number}</p>
              <div className="mt-4 space-y-2">
                <p className="text-lg">
                  Price per night: <strong>{price_per_night}</strong>
                </p>
                <p className="text-xl font-bold">
                  Total ({days} {days > 1 ? "nights" : "night"}): ₦
                  {total_price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
