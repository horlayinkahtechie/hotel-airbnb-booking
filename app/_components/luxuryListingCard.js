import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import BookNowButton from "./book";
import AddToFavorite from "./AddToFavorite";

const listings = [
  {
    id: "LUXURY1",
    type: "Hotel",
    roomType: "Luxury",
    name: "Luxury cabin room",
    image: "/luxury_room1.jpg",
    price: "₦120,000",
    location: "Lekki, Lagos",
  },
  {
    id: "LUXURY2",
    type: "Apartment",
    roomType: "Luxury",
    name: "Luxury Apartment",
    image: "/luxury_room2.jpg",
    price: "₦100,000",
    location: "Abuja, Nigeria",
  },
  {
    id: "LUXURY3",
    type: "Shortlet",
    roomType: "Luxury",
    name: "Luxury cabin room",
    image: "/luxury_room3.jpg",
    price: "₦120,000",
    location: "Lekki, Lagos",
  },
  {
    id: "LUXURY4",
    type: "Shortlet",
    roomType: "Luxury",
    name: "Beachside Shortlet",
    image: "/luxury_room4.jpg",
    price: "₦130,000",
    location: "Lekki, Lagos",
  },
];

export default function LuxuryListingCard() {
  return (
    <div className="p-3">
      <h2 className="text-2xl md:text-3xl text-center lg:mt-5 mt-20 font-bold mb-3">
        Luxury Listings
      </h2>
      <p className="text-gray-600 text-center lg:text-[20px] text-[19px] lg:mb-1 mb-10">
        Discover top-rated luxury rooms, apartments, and shortlets across. Book
        your perfect stay that accomodates everything.
      </p>
      <div className="grid lg:grid-cols-4 grid-cols-1 lg:p-30 p-1 lg:pt-20 gap-5">
        {listings.map((listing) => (
          <Card
            key={listing.id}
            className="relative overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <AddToFavorite favorite={listing} />
            <div>
              <Image
                src={listing.image}
                alt={listing.name}
                quality={60}
                width={400}
                height={250}
                className="object-cover w-full lg:h-56 h-70"
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
    </div>
  );
}
