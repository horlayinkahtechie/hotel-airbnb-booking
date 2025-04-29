"use client";

import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Navbar from "../_components/Navbar";
import BookNowButton from "../_components/book";
import Footer from "../_components/Footer";

const listings = [
  {
    id: 1,
    type: "Hotel",
    name: "Luxe Grand Hotel",
    image: "/luxe-grand.jpg",
    price: "₦30,000",
    location: "Victoria Island, Lagos",
  },
  {
    id: 2,
    type: "Apartment",
    name: "Palmview Apartment",
    image: "/palmview.jpg",
    price: "₦20,000",
    location: "Lekki Phase 1, Lagos",
  },
  {
    id: 3,
    type: "Shortlet",
    name: "Oceanview Shortlet",
    image: "/Apartment2.jpg",
    price: "₦15,000",
    location: "Ajah, Lagos",
  },
];

export default function ExplorePage() {
  const [activeType, setActiveType] = useState("All");

  const filteredListings =
    activeType === "All"
      ? listings
      : listings.filter((item) => item.type === activeType);

  return (
    <>
      <Navbar />
      <div className="px-4 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Explore Properties
        </h1>

        {/* Filter Tabs */}
        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="grid grid-cols-4 w-full sm:w-[400px] mx-auto">
            {["All", "Hotel", "Apartment", "Shortlet"].map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                onClick={() => setActiveType(type)}
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Listings Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id}>
              <div className="relative w-full h-56 rounded-t-xl overflow-hidden">
                <Image
                  src={listing.image}
                  alt={listing.name}
                  quality={100}
                  width={400}
                  height={250}
                  className="object-cover"
                />
              </div>

              <CardContent className="py-4">
                <CardTitle className="text-lg">{listing.name}</CardTitle>
                <CardDescription className="mb-2">
                  {listing.location}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{listing.price} / night</p>
                  <BookNowButton listing={listing} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
