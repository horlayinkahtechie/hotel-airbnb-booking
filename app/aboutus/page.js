"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import Image from "next/image";
import apartment3 from "@/public/Apartment3.jpg";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-800 py-10">
        <section className="max-w-6xl mx-auto space-y-20">
          {/* Hero Section */}
          <div className="text-center pt-13">
            <h1 className="text-4xl font-bold mb-4">About BookNest</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              BookNest is more than a booking platform — it&apos;s a
              mission-driven solution to transform how people across Nigeria and
              Africa find and reserve quality accommodation.
            </p>
          </div>

          {/* Our Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center pt-17">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Journey</h2>
              <p className="text-gray-700 text-[16.5px]">
                BookNest was founded out of necessity. In a country with a
                growing population and increasing travel needs, the process of
                booking a stay was often filled with confusion, delays, and
                mistrust. We set out to change that.
              </p>
              <p className="text-gray-700 mt-4 text-[16.5px]">
                Our team — a mix of tech professionals and hospitality
                enthusiasts — envisioned a platform where users could browse
                real listings, make instant reservations, and interact directly
                with property managers. With persistence, innovation, and
                feedback from real users, BookNest was born.
              </p>
            </div>
            <div>
              <Image
                src={apartment3}
                placeholder="blur"
                quality={50}
                alt="Our journey"
                className="rounded-xl shadow-lg w-full object-cover"
              />
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid md:grid-cols-3 gap-8 pt-17">
            <Card className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
                <p className="text-gray-600">
                  To simplify and enhance how people find, reserve, and manage
                  their stays across Nigeria and beyond, using technology and
                  customer-first thinking.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
                <p className="text-gray-600">
                  To become Africa’s most reliable and user-centric booking
                  platform, enabling smooth and secure access to hotels,
                  apartments, and shortlets.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Our Values</h2>
                <p className="text-gray-600">
                  At BookNest, we live by trust, innovation, accessibility, and
                  transparency. Every feature we build is shaped by these values
                  to deliver the best for our users.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Us */}
          <div className="text-center max-w-4xl mx-auto pt-17">
            <h2 className="text-2xl font-bold mb-4">Why BookNest?</h2>
            <p className="text-gray-600 text-[16.5px]">
              With BookNest, you&apos;re not just reserving a room — you&apos;re
              choosing reliability, simplicity, and peace of mind. We offer a
              wide range of verified listings, real-time availability, and a
              seamless reservation experience, supported by responsive customer
              care.
            </p>
          </div>

          {/* Meet the Team */}
          <div className="text-center pt-17">
            <h2 className="text-2xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 mb-10 max-w-xl mx-auto">
              Behind BookNest is a passionate team committed to transforming
              Africa’s hospitality tech space.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Abdul-salam",
                  role: "Founder & Lead Developer",
                  image: "/luxury_room3.jpg",
                },
                {
                  name: "Kareemah",
                  role: "Marketing & Partnerships",
                  image: "/luxury_room4.jpg",
                },
                {
                  name: "Tunde",
                  role: "Customer Experience Lead",
                  image: "/basic_room1.jpg",
                },
              ].map((member, i) => (
                <div key={i} className="text-center">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width="50"
                    height="50"
                    quality={100}
                    className="rounded-full mx-auto w-28 h-28 object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Testimonials */}
          <div className="text-center pt-17">
            <h2 className="text-2xl font-bold mb-4">
              What Our Users Are Saying
            </h2>
            <p className="text-gray-600 mb-10 max-w-xl mx-auto">
              Real feedback from happy customers who trust BookNest for their
              stays.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Ngozi E.",
                  feedback:
                    "Booking a room was so fast and smooth. I love the interface!",
                },
                {
                  name: "Chinedu A.",
                  feedback:
                    "I love their Interface, it is sleek, user-friendly and responsive. Great service.",
                },
                {
                  name: "Fatima Y.",
                  feedback:
                    "I reserved a room without upfront payment and still got it ready when I arrived.",
                },
              ].map((review, i) => (
                <div key={i} className="bg-gray-100 p-6 rounded-xl shadow">
                  <p className="italic text-gray-700">“{review.feedback}”</p>
                  <p className="mt-4 font-semibold text-sm text-gray-800">
                    — {review.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="text-center pt-17">
            <h2 className="text-2xl font-bold mb-4">Our Journey So Far</h2>
            <p className="text-gray-600 mb-10 max-w-xl mx-auto">
              A timeline of key milestones that shaped BookNest.
            </p>
            <div className="relative border-l-2 border-gray-300 ml-6 max-w-2xl mx-auto space-y-10">
              {[
                {
                  year: "2023",
                  text: "BookNest idea was born to fix the chaotic hotel booking experience.",
                },
                {
                  year: "2024",
                  text: "First MVP launched with reservation-only functionality and local listings.",
                },
                {
                  year: "2025",
                  text: "Expanded to 20+ Nigerian cities and integrated full online bookings.",
                },
              ].map((step, i) => (
                <div key={i} className="ml-6 relative">
                  <div className="absolute left-[-18px] top-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow"></div>
                  <h3 className="font-semibold text-lg">{step.year}</h3>
                  <p className="text-gray-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-17 pb-10">
            <h2 className="text-2xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-gray-600 mb-6">
              Discover a smarter way to book your next stay.
            </p>
            <Link
              href="/explore"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Explore Listings
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
