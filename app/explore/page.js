"use client";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import BasicListingCard from "../_components/BasicListingCard";
import StandardListingCard from "../_components/StandardListingCard";
import LuxuryListingCard from "../_components/luxuryListingCard";

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <div className="px-4 py-1 w-full mx-auto">
        <BasicListingCard />
        <StandardListingCard />
        <LuxuryListingCard />
      </div>
      <Footer />
    </>
  );
}
