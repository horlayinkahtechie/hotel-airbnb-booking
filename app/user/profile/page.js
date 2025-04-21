"use client";

import { useSession } from "next-auth/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/app/_components/Navbar";

export default function UserProfile() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <>
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
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-600">You have 3 upcoming bookings.</p>
                {/* Map your bookings here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-600">
                  Your saved listings will appear here.
                </p>
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

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="text-gray-600">
                  Update your profile settings here.
                </p>
                {/* Add settings form if needed */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
