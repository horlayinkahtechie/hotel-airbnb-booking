import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import BookNowButton from "./book";

const listings = [
  {
    id: 1,
    type: "Hotel",
    roomType: "Basic",
    name: "Basic room with dining table",
    image: "/basic_room1.jpg",
    price: "₦30,000",
    location: "Lekki, Lagos",
  },
  {
    id: 2,
    type: "Apartment",
    roomType: "Basic",
    name: "Cozy Apartment",
    image: "/Apartment2.jpg",
    price: "₦100,000",
    location: "Abuja, Nigeria",
  },
  {
    id: 3,
    type: "Shortlet",
    roomType: "Basic",
    name: "Beachside Shortlet",
    image: "/Apartment3.jpg",
    price: "₦80,000",
    location: "Lekki, Lagos",
  },
  {
    id: 4,
    type: "Shortlet",
    roomType: "Basic",
    name: "Beachside Shortlet",
    image: "/Apartment4.jpg",
    price: "₦80,000",
    location: "Lekki, Lagos",
  },
];

export default function BasicListingCard() {
  return (
    <>
      <h2 className="text-2xl md:text-3xl text-center mt-40 font-bold mb-2">
        Basic Listings
      </h2>
      <p className="text-gray-600 text-center text-[20px]">
        Discover top-rated standard rooms, apartments, and shortlets across.
        Book your perfect stay with just a few clicks.
      </p>
      <div className="grid lg:grid-cols-4 grid-cols-1 lg:p-30 lg:pt-20 gap-5">
        {listings.map((listing) => (
          <Card
            key={listing.id}
            className=" overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <div>
              <Image
                src={listing.image}
                alt={listing.name}
                quality={70}
                width={400}
                height={250}
                className="object-cover w-full h-56"
              />
              <CardContent className="py-4">
                <CardTitle className="text-lg">{listing.name}</CardTitle>
                <CardDescription className="mb-2 text-[15.5px]">
                  {listing.location} ({listing.roomType})
                </CardDescription>

                <div className="flex items-center justify-between">
                  <p className="font-semibold">{listing.price} / night</p>
                  <BookNowButton listing={listing} />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
