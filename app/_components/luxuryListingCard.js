import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import BookNowButton from "./book";
import AddToFavorite from "./AddToFavorite";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LuxuryListingCard() {
  const [luxurylisting, setLuxuryListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchLuxuryListing = async () => {
      setLoading(true);
      try {
        const { data: luxuryListings, error: luxuryListingsError } =
          await supabase
            .from("rooms")
            .select("*")
            .eq("room_type", "Luxury")
            .order("created_at", { ascending: false });

        if (!luxuryListingsError) {
          setLuxuryListing(luxuryListings);
        } else {
          console.error("Fetch error:", luxuryListingsError);
          setLuxuryListing([]);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLuxuryListing([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLuxuryListing();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-3 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (luxurylisting.length === 0) {
    return (
      <div className="p-3">
        <h2 className="text-2xl md:text-3xl text-center lg:mt-5 mt-20 font-bold mb-3">
          Luxury Listings
        </h2>
        <p className="text-gray-600 text-center lg:text-[20px] text-[19px] lg:mb-1 mb-10">
          No luxury listings available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:p-10 p-2 relative lg:mb-18">
      <h2 className="text-2xl md:text-3xl text-center lg:mt-5 mt-20 font-bold mb-3">
        Luxury Listings
      </h2>
      <p className="text-gray-600 text-center lg:text-[20px] text-[19px] lg:mb-1 mb-10 lg:mb-22">
        Discover top-rated luxury rooms, apartments, and shortlets across. Book
        your perfect stay that accomodates everything.
      </p>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex lg:flex-row flex-col gap-5 scrollbar-hide overflow-x-auto lg:overflow-x-hidden lg:overflow-y-hidden pb-4 lg:pb-0  w-full"
          style={{
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
          }}
        >
          {luxurylisting.map((listing) => (
            <div
              key={listing.id}
              className="flex-none"
              style={{
                scrollSnapAlign: "start",
                minWidth: "300px",
              }}
            >
              <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition h-full">
                <AddToFavorite favorite={listing} />
                <div>
                  <Image
                    src={listing.image_url || "/placeholder.jpg"}
                    alt={listing.room_type}
                    quality={60}
                    width={400}
                    height={250}
                    className="object-cover w-full lg:h-56 h-70"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <CardContent className="py-4">
                    <CardTitle className="text-lg">
                      {listing.room_type} listings
                    </CardTitle>
                    <CardDescription className="mb-2 text-[15.5px]">
                      {listing.capacity}{" "}
                      {listing.capacity === 1 ? "guest" : "guests"}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {listing.price_per_night} / night
                      </p>
                      <BookNowButton listing={listing} />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
