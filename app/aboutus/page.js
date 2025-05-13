"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";

export const metadata = {
  title: "About BookNest",
  description:
    "Booknest is a modern hotel with different ranges of room. Booknest also have a booking system to allow customers to book from their comfort",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-800 px-4 py-10">
        <section className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes our booking system the most trusted platform
              for Hotels, Apartments, and Shortlets.
            </p>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
                <p className="text-gray-600">
                  To simplify and enhance the way people find, book, and manage
                  their stays across Nigeria and beyond.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
                <p className="text-gray-600">
                  To become Africa’s leading platform for seamless and
                  affordable hotel & Airbnb bookings.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Our Values</h2>
                <p className="text-gray-600">
                  Transparency, trust, innovation, and customer satisfaction are
                  at the core of everything we do.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to explore?</h2>
            <p className="text-gray-600 mb-6">
              Book your next stay with ease and confidence.
            </p>
            <Link
              href="/explore"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Start Booking
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
