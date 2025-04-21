import Image from "next/image";
import { Star } from "lucide-react";

import ListingCardImage1 from "../../public/Apartment1.jpg";
import ListingCardImage2 from "../../public/Apartment2.jpg";
import ListingCardImage3 from "../../public/Apartment3.jpg";
import ListingCardImage4 from "../../public/apartment4.jpg";

export default function ListingCard({ title, location, price, image, rating }) {
  return (
    <>
      <h2 className="text-2xl md:text-3xl text-center mt-40 font-bold mb-2">
        Featured Listings
      </h2>
      <p className="text-gray-600 text-center text-[20px]">
        Discover top-rated hotels, apartments, and shortlets across Nigeria.
        Book your perfect stay with just a few clicks.
      </p>
      <div className="grid lg:grid-cols-4 grid-cols-1 lg:p-30 lg:pt-20 gap-5">
        <div className="rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition">
          <Image
            src={ListingCardImage1}
            alt="Listing image"
            placeholder="blur"
            quality={70}
            width={400}
            height={250}
            className="object-cover w-full h-56"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Lagos Lagoon View Hotel</h3>
            <p className="text-sm text-gray-500">Lekki, Lagos</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-primary font-bold text-base">
                ₦120k/night
              </span>
              <span className="flex items-center text-sm text-yellow-500">
                <Star size={16} className="mr-1" />
                {rating}
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition">
          <Image
            src={ListingCardImage2}
            alt="Listing image"
            placeholder="blur"
            quality={70}
            width={400}
            height={250}
            className="object-cover w-full h-56"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Cozy Apartment</h3>
            <p className="text-sm text-gray-500">Abuja, Nigeria</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-primary font-bold text-base">
                ₦100k/night
              </span>
              <span className="flex items-center text-sm text-yellow-500">
                <Star size={16} className="mr-1" />
                {rating}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition">
          <Image
            src={ListingCardImage3}
            placeholder="blur"
            quality={70}
            alt="Listing image"
            width={400}
            height={250}
            className="object-cover w-full h-56"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Beachside Shortlet</h3>
            <p className="text-sm text-gray-500">Victoria Island</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-primary font-bold text-base">
                ₦90k/night
              </span>
              <span className="flex items-center text-sm text-yellow-500">
                <Star size={16} className="mr-1" />
                {rating}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition">
          <Image
            src={ListingCardImage4}
            placeholder="blur"
            quality={70}
            alt="Listing image"
            width={400}
            height={250}
            className="object-cover w-full h-56"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Title from database</h3>
            <p className="text-sm text-gray-500">Lagos, Ikeja</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-primary font-bold text-base">
                ₦50k/night
              </span>
              <span className="flex items-center text-sm text-yellow-500">
                <Star size={16} className="mr-1" />
                {rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
