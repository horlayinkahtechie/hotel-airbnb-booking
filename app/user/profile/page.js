"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/app/_components/Navbar";
import BookingCard from "@/app/_components/bookingCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Spinner from "@/app/_components/Spinner";
import FavoriteCard from "@/app/_components/favoriteCard";

export default function Profile() {
  const { data: session } = useSession();
  const [userBookings, setUserBookings] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const user = session?.user;

  // User bookings
  useEffect(() => {
    async function fetchUserBookings() {
      setIsLoading(true);
      if (!session?.user?.email) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("email", session.user.email);

      if (error) {
        console.error("Error fetching user bookings:", error);
      } else {
        setUserBookings(data);
        console.log("User bookings:", data);
      }

      setIsLoading(false);
    }

    fetchUserBookings();
  }, [session]);

  // User Favorites
  useEffect(() => {
    async function fetchUserFavorites() {
      setIsLoading(true);
      if (!session?.user?.email) return;

      const { data, error } = await supabase
        .from("favorite")
        .select("*")
        .eq("email", session.user.email);

      if (error) {
        console.error("Error fetching user favorite:", error);
      } else {
        setUserFavorites(data);
        console.log("User favorites:", data);
      }

      setIsLoading(false);
    }

    fetchUserFavorites();
  }, [session]);

  // User Reservations
  useEffect(() => {
    async function fetchUserReservations() {
      setIsLoading(true);
      if (!session?.user?.email) return;

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("email", session.user.email);

      if (error) {
        console.error("Error fetching user reservation:", error);
      } else {
        setUserReservations(data);
        console.log("User reservations:", data);
      }

      setIsLoading(false);
    }

    fetchUserReservations();
  }, [session]);

  if (!user) {
    return <p className="text-center text-red-500 py-10">Please log in</p>;
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <Badge variant="outline" className="mt-2">
              Verified User
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="bookings" className="cursor-pointer">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="reservations" className="cursor-pointer">
              Reservations
            </TabsTrigger>
            <TabsTrigger value="favorites" className="cursor-pointer">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="reviews" className="cursor-pointer">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardContent className="p-4">
                {loading ? (
                  <Spinner className="w-" />
                ) : userBookings.length > 0 ? (
                  userBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <p className="text-gray-600">No bookings found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardContent className="p-4">
                {loading ? (
                  <Spinner />
                ) : userFavorites.length > 0 ? (
                  userFavorites.map((favorite) => (
                    <FavoriteCard key={favorite.id} favorite={favorite} />
                  ))
                ) : (
                  <p className="text-gray-600">You have no favorites.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-600">
                  You haven’t reviewed any listings yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations">
            <Card>
              <CardContent className="p-4 space-y-3">
                {loading ? (
                  <Spinner />
                ) : userReservations.length > 0 ? (
                  userReservations.map((favorite) => (
                    <FavoriteCard key={favorite.id} favorite={favorite} />
                  ))
                ) : (
                  <p className="text-gray-600">You have no Reservation.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
