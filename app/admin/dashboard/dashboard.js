"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InsertRoomModal from "@/app/_components/insertRoomModal";
import {
  BarChart2,
  BedDouble,
  Users,
  CalendarCheck2,
  Plus,
} from "lucide-react";
import AdminSidebar from "@/app/_components/adminSidebar";
import AdminNavbar from "@/app/_components/adminNav";
import Link from "next/link";
import ChatWidget from "@/app/_components/chatWidget";
import { supabase } from "@/app/lib/supabase";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [bookingsData, setBookingsData] = useState([]);
  const [reservationsData, setReservationsData] = useState([]);
  const [totalRoomsData, setTotalRooms] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingsChange, setBookingsChange] = useState("Loading...");
  const [reservationChange, setReservationChange] = useState("Loading...");
  const [revenueChange, setRevenueChange] = useState("Loading...");

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  // Combined data fetching with loading state
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const now = new Date();
        const currentMonthBooking = now.getMonth();
        const currentYearBooking = now.getFullYear();

        // Calculate previous month (handle year change if needed)
        const prevMonthBookings =
          currentMonthBooking === 0 ? 11 : currentMonthBooking - 1;
        const prevYearBookings =
          currentMonthBooking === 0
            ? currentYearBooking - 1
            : currentYearBooking;

        const currentMonthReservation = now.getMonth();
        const currentYearReservation = now.getFullYear();
        const prevMonthReservations =
          currentMonthReservation === 0 ? 11 : currentMonthReservation - 1;
        const prevYearReservations =
          currentMonthBooking === 0
            ? currentYearReservation - 1
            : currentYearReservation;

        const [
          { data: bookings, error: bookingsError },
          { data: reservations, error: reservationsError },
          { data: allRooms, error: roomsError },
          { data: currentMonthBookings, error: currentMonthBookingsError },
          { data: previousMonthBookings, error: previousMonthBookingsError },
          {
            data: currentMonthReservations,
            error: currentMonthReservationsError,
          },
          {
            data: previousMonthReservations,
            error: previousMonthReservationsError,
          },
          { data: currentMonthRevenue, error: currentMonthRevenueError },
          { data: previousMonthRevenue, error: previousMonthRevenueError },
        ] = await Promise.all([
          supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("reservations")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("rooms")
            .select("*")
            .order("created_at", { ascending: false }),

          // Get bookings created in current month
          supabase
            .from("bookings")
            .select("*")
            .gte(
              "created_at",
              new Date(currentYearBooking, currentMonthBooking, 1).toISOString()
            )
            .lt(
              "created_at",
              new Date(
                currentYearBooking,
                currentMonthBooking + 1,
                1
              ).toISOString()
            ),
          // Get bookings created in previous month
          supabase
            .from("bookings")
            .select("*")
            .gte(
              "created_at",
              new Date(prevMonthBookings, prevMonthBookings, 1).toISOString()
            )
            .lt(
              "created_at",
              new Date(prevYearBookings, prevMonthBookings + 1, 1).toISOString()
            ),
          // Get reservations created in current month
          supabase
            .from("reservations")
            .select("*")
            .gte(
              "created_at",
              new Date(
                currentYearReservation,
                currentMonthReservation,
                1
              ).toISOString()
            )
            .lt(
              "created_at",
              new Date(
                currentYearReservation,
                currentMonthReservation + 1,
                1
              ).toISOString()
            ),
          // Get reservations created in previous month
          supabase
            .from("reservations")
            .select("*")
            .gte(
              "created_at",
              new Date(
                prevYearReservations,
                prevMonthReservations,
                1
              ).toISOString()
            )
            .lt(
              "created_at",
              new Date(
                prevYearReservations,
                prevMonthReservations + 1,
                1
              ).toISOString()
            ),

          // Current month bookings for revenue calculation
          supabase
            .from("bookings")
            .select("price")
            .gte(
              "created_at",
              new Date(currentYearBooking, currentMonthBooking, 1).toISOString()
            )
            .lt(
              "created_at",
              new Date(
                currentYearBooking,
                currentMonthBooking + 1,
                1
              ).toISOString()
            ),

          // Previous month bookings for revenue calculation
          supabase
            .from("bookings")
            .select("price")
            .gte(
              "created_at",
              new Date(prevYearBookings, prevMonthBookings, 1).toISOString()
            )
            .lt(
              "created_at",
              new Date(prevYearBookings, prevMonthBookings + 1, 1).toISOString()
            ),
        ]);

        if (
          bookingsError ||
          reservationsError ||
          roomsError ||
          currentMonthBookingsError ||
          previousMonthBookingsError ||
          currentMonthReservationsError ||
          previousMonthReservationsError ||
          currentMonthRevenueError ||
          previousMonthRevenueError
        ) {
          throw new Error(
            bookingsError?.message ||
              reservationsError?.message ||
              roomsError?.message ||
              currentMonthBookingsError?.message ||
              previousMonthBookingsError?.message ||
              currentMonthReservationsError?.message ||
              previousMonthReservationsError?.message ||
              currentMonthRevenueError?.message ||
              previousMonthRevenueError?.message
          );
        }

        setBookingsData(bookings || []);
        setReservationsData(reservations || []);
        setTotalRooms(allRooms || []);

        // Calculate Reservation change
        const currentReservationCount = currentMonthReservations?.length || 0;
        const prevReservationCount = previousMonthReservations?.length || 0;
        const ReservationDifference =
          currentReservationCount - prevReservationCount;

        let changeReservationText = "";
        if (ReservationDifference > 0) {
          changeReservationText = `+${ReservationDifference} this month`;
        } else if (ReservationDifference < 0) {
          changeReservationText = `${ReservationDifference} this month`;
        } else {
          changeReservationText = "No change";
        }

        setReservationChange(changeReservationText);

        // Calculate bookings change
        const currentBookingCount = currentMonthBookings?.length || 0;
        const prevBookingCount = previousMonthBookings?.length || 0;
        const BookingDifference = currentBookingCount - prevBookingCount;

        let changeText = "";
        if (BookingDifference > 0) {
          changeText = `+${BookingDifference} this month`;
        } else if (BookingDifference < 0) {
          changeText = `${BookingDifference} this month`;
        } else {
          changeText = "No change";
        }

        setBookingsChange(changeText);

        // Calculate revenue changes
        const currentMonthRevenueTotal =
          currentMonthRevenue?.reduce(
            (sum, booking) => sum + Number(booking.price || 0),
            0
          ) || 0;

        const previousMonthRevenueTotal =
          previousMonthRevenue?.reduce(
            (sum, booking) => sum + Number(booking.price || 0),
            0
          ) || 0;

        let revenueChangeText = "No change";
        if (previousMonthRevenueTotal > 0) {
          const percentageChange =
            ((currentMonthRevenueTotal - previousMonthRevenueTotal) /
              previousMonthRevenueTotal) *
            100;

          if (percentageChange > 0) {
            revenueChangeText = `+${percentageChange.toFixed(
              1
            )}% from last month`;
          } else if (percentageChange < 0) {
            revenueChangeText = `${percentageChange.toFixed(
              1
            )}% from last month`;
          }
        } else if (currentMonthRevenueTotal > 0) {
          revenueChangeText = "+100% (new revenue)";
        }

        setRevenueChange(revenueChangeText);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const formatPrice = (price) => {
    if (!price) return "₦0";
    if (price >= 1_000_000_000)
      return `₦${(price / 1_000_000_000).toFixed(1)}B`;
    if (price >= 1_000_000) return `₦${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `₦${(price / 1_000).toFixed(0)}k`;
    return `₦${price}`;
  };

  const totalPrice = bookingsData.reduce(
    (sum, booking) => sum + Number(booking.price || 0),
    0
  );
  const availableRooms = totalRoomsData.filter(
    (room) => room.status === "available"
  ).length;
  const occupiedRooms = totalRoomsData.length - availableRooms;

  const openInsertModal = () => setIsModalOpen(true);
  const closeInsertModal = () => setIsModalOpen(false);
  const handleInsertSuccess = () => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setTotalRooms(data || []);
    };
    fetchRooms();
  };

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        setLoading(true);
        const { data: bookings, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(2);

        if (!error) {
          setRecentBookings(bookings);
        } else {
          setRecentBookings([]);
        }
      } catch (err) {
        console.error("Something went wrong", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-4 md:p-8">
          {/* Welcome Header */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back,{" "}
              <span className="text-blue-600">{session?.user?.name}</span>
            </h1>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with your hotel today
            </p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<BedDouble className="w-6 h-6" />}
              title="Total Rooms"
              value={totalRoomsData.length}
              iconColor="text-blue-500"
              bgColor="bg-blue-50"
            />

            <StatCard
              icon={<BedDouble className="w-6 h-6" />}
              title="Total Bookings"
              value={bookingsData.length}
              change={bookingsChange}
              iconColor="text-blue-500"
              bgColor="bg-blue-50"
            />

            <StatCard
              icon={<CalendarCheck2 className="w-6 h-6" />}
              title="Reservations"
              value={reservationsData.length}
              change={reservationChange}
              iconColor="text-purple-500"
              bgColor="bg-purple-50"
            />

            <StatCard
              icon={<BarChart2 className="w-6 h-6" />}
              title="Monthly Revenue"
              value={formatPrice(totalPrice)}
              change={revenueChange}
              iconColor="text-amber-500"
              bgColor="bg-amber-50"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((recentBooking) => (
                    <div
                      key={recentBooking.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {recentBooking.full_name || "Guest"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              recentBooking.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {recentBooking.type || "Standard"}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/admin/bookings"
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  View all bookings →
                </Link>
              </CardContent>
            </Card>

            {/* Room Status */}
            <Card>
              <CardHeader>
                <CardTitle>Room Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Available</span>
                    </div>
                    <span className="font-bold">{availableRooms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Occupied</span>
                    </div>
                    <span className="font-bold">{occupiedRooms}</span>
                  </div>
                  <div className="pt-4">
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-gradient-to-r from-blue-500 to-green-500"
                        style={{
                          width: `${
                            (availableRooms / totalRoomsData.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      {Math.round(
                        (availableRooms / totalRoomsData.length) * 100
                      )}
                      % available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              icon={<Plus className="w-5 h-5" />}
              title="Add New Room"
              description="Create a new room listing"
              onClick={openInsertModal}
              className="cursor-pointer"
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <ActionCard
              icon={<CalendarCheck2 className="w-5 h-5" />}
              title="Manage Bookings"
              description="View all reservations"
              href="/admin/bookings"
              bgColor="bg-purple-50"
              className="cursor-pointer"
              iconColor="text-purple-600"
            />
            <ActionCard
              icon={<Users className="w-5 h-5" />}
              title="Guest Management"
              description="View guest information"
              href="/admin/users"
              bgColor="bg-green-50"
              className="cursor-pointer"
              iconColor="text-green-600"
            />
            <ActionCard
              icon={<BarChart2 className="w-5 h-5" />}
              title="View Reports"
              description="Analytics and insights"
              href="/admin/analytics"
              bgColor="bg-amber-50"
              className="cursor-pointer"
              iconColor="text-amber-600"
            />
          </div>
        </main>
      </div>
      <ChatWidget />

      <InsertRoomModal
        isOpen={isModalOpen}
        onClose={closeInsertModal}
        onSuccess={handleInsertSuccess}
      />
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ icon, title, value, change, iconColor, bgColor }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>
            {icon}
          </div>
          {change && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {change}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// Reusable Action Card Component
function ActionCard({
  icon,
  title,
  description,
  onClick,
  href,
  bgColor,
  iconColor,
}) {
  // Use Link if href is provided, otherwise use button
  const Content = ({ children }) =>
    href ? (
      <Link href={href}>{children}</Link>
    ) : (
      <button onClick={onClick}>{children}</button>
    );

  return (
    <Content>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Content>
  );
}
