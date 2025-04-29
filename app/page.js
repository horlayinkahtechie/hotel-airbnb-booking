"use client";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import StandardListingCard from "./_components/StandardListingCard";
import HowItWorks from "./_components/HowItWorks";
import Footer from "./_components/Footer";
import LuxuryListingCard from "./_components/luxuryListingCard";
import BasicListingCard from "./_components/BasicListingCard";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <BasicListingCard />
      <StandardListingCard />
      <LuxuryListingCard />
      <HowItWorks />
      <Footer />
    </div>
  );
}
