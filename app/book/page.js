"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";

export default function BookPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 1,
    notes: "",
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!session) {
      alert("You must be logged in to make a reservation.");
      return;
    }

    const { error } = await supabase.from("reservations").insert([
      {
        email: session.user.email,
        ...form,
      },
    ]);

    if (!form.date || !form.time || !form.guests) {
      alert("Please fill all required fields.");
      return;
    }

    if (!error) {
      router.push("/success");
    } else {
      alert("Booking failed. Try again.");
    }
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
            <p className="text-sm text-gray-500">Step {step} of 2</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                onClick={next}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2 rounded-xl"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  min={1}
                  value={form.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prev}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 rounded-xl"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!session}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-colors text-white rounded-xl"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
