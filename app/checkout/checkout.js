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

export default function Checkout() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "";
  const location = searchParams.get("location") || "";
  const priceString = searchParams.get("price") || "₦0";
  const type = searchParams.get("type") || "";
  const image = searchParams.get("image") || "";
  const listing_id = searchParams.get("listing_id");

  const priceNumber = Number(priceString.replace(/[^\d]/g, ""));
  const [days, setDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Paystack");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [roomID] = useState(listing_id);

  const [bookedDates, setBookedDates] = useState([]);

  const disabledDates = bookedDates.map((dateStr) => new Date(dateStr));

  const totalPrice = days * priceNumber;

  useEffect(() => {
    async function fetchBookedDates() {
      if (!listing_id) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("checkin_date, checkout_date")
        .eq("listing_id", listing_id);

      if (error) {
        console.error("Error fetching booked dates:", error);
        return;
      }
      // Get all booked date ranges and flatten them into individual strings
      const dates = data.flatMap(({ checkin_date, checkout_date }) => {
        const start = new Date(checkin_date);
        const end = new Date(checkout_date);
        const tempDates = [];

        while (start <= end) {
          tempDates.push(new Date(start).toISOString().split("T")[0]);
          start.setDate(start.getDate() + 1);
        }

        return tempDates;
      });

      setBookedDates(dates);
    }

    fetchBookedDates();
  }, [roomID]);

  useEffect(() => {
    if (checkInDate && days > 0) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + days);

      const formattedCheckOut = checkOut.toISOString().split("T")[0];
      setCheckOutDate(formattedCheckOut);
    }
  }, [checkInDate, days]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

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
                Check in date
              </label>
              <DatePicker
                selected={checkInDate ? new Date(checkInDate) : null}
                onChange={(date) => setCheckInDate(date)}
                excludeDates={disabledDates}
                type="date"
                value={checkInDate}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Number of Days
              </label>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Check out date
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                readOnly
                required
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Room ID
              </label>
              <input
                readOnly
                type="text"
                value={roomID}
                required
                className="w-full border p-3 rounded-lg"
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

            {checkInDate && checkOutDate && fullName ? (
              <Link
                href={{
                  pathname: "/checkout/payment",
                  query: {
                    price: totalPrice,
                    name: name,
                    image: image,
                    type: type,
                    location: location,
                    listing_id: listing_id,
                    full_name: fullName,
                    checkout_date: checkOutDate,
                    checkin_date: checkInDate,
                    no_of_days: days,
                  },
                }}
                className="w-full mt-4 bg-green-600 hover:bg-green-700
                transition-colors text-white font-semibold py-3 rounded-xl flex
                justify-center items-center"
              >
                Confirm and Pay
              </Link>
            ) : (
              <button
                disabled
                className="w-full mt-4 bg-gray-400 text-white font-semibold py-3 rounded-xl flex justify-center items-center cursor-not-allowed"
              >
                Confirm and pay
              </button>
            )}
          </div>

          {/* RIGHT: Booking Summary */}
          <div className="space-y-6">
            {image && (
              <div className="w-full h-64 relative rounded-xl overflow-hidden">
                <Image src={image} alt={name} fill className="object-cover" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p className="text-gray-500">{location}</p>
              <p className="text-gray-700 mt-2">
                {type} ({roomID})
              </p>
              <p className="text-lg mt-4">
                Price per night: <strong>{priceString}</strong>
              </p>
              <p className="text-xl font-bold mt-2">
                Total ({days} {days > 1 ? "nights" : "night"}): ₦
                {totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
