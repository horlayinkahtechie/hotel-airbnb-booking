"use client";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import ListingCard from "./_components/ListingCard";
import HowItWorks from "./_components/HowItWorks";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <ListingCard />
      <HowItWorks />
      <Footer />
    </div>
  );
}
