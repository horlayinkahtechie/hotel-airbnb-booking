"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import Spinner from "../_components/Spinner";

export default function BookPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    time: "",
    guests: 1,
    checkIn: "",
    checkOut: "",
    roomType: "",
    notes: "",
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!session) {
      alert("You must be logged in to make a reservation.");
      setIsLoading(false);
      return;
    }

    const requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "roomType",
      "checkIn",
      "checkOut",
      "time",
      "guests",
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        alert(`Please fill in the ${field} field.`);
        setIsLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("reservations").insert([
      {
        email: session.user.email,
        ...form,
      },
    ]);

    if (!error) {
      alert("Booking successful");
      router.push("/success");
    } else {
      alert("Booking failed. Try again.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-6 space-y-6 mt-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Reservation
            </h2>
            <p className="text-sm text-gray-500">Step {step} of 3</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Fullname
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="Your fullname"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="example@gmail.com"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+234 8156714425"
                  name="phoneNumber"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                onClick={next}
                className="w-full mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2 rounded-xl"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Room Type
                </label>
                <select
                  name="roomType"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select a room type</option>

                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Check In Date
                </label>
                <input
                  type="date"
                  required
                  name="checkIn"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Check Out Date
                </label>
                <input
                  type="date"
                  required
                  name="checkOut"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prev}
                  className="w-50 mt-4 cursor-pointer  bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 font-medium py-2 rounded-xl"
                >
                  Previous
                </button>
                <button
                  onClick={next}
                  className="w-50 mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2 rounded-xl"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  min={1}
                  required
                  value={form.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Arrival Time
                </label>
                <input
                  type="time"
                  required
                  name="time"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prev}
                  className="w-50 py-2 mt-4 cursor-pointer bg-gray-200 hover:bg-gray-300 transition-colors  text-gray-800 rounded-xl"
                >
                  Previous
                </button>
                {loading ? (
                  <button className="w-50 py-2 mt-4 inline cursor-pointer bg-green-600 hover:bg-green-700 disabled::bg-gray-400 transition-colors text-white rounded-xl">
                    {" "}
                    <Spinner />
                    Reserving...
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!session}
                    className="w-50 py-2 mt-4 cursor-pointer bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-colors text-white rounded-xl"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
