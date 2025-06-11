"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import {
  BarChart,
  LineChart,
  PieChart,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Hotel,
  CreditCard,
} from "lucide-react";
import AdminNavbar from "@/app/_components/adminNav";
import AdminSidebar from "@/app/_components/adminSidebar";
import RevenueChart from "@/app/_components/adminRevenueChart";
import BookingChart from "@/app/_components/adminBookingChart";
import Link from "next/link";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [bookingsData, setBookingsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [reservationData, setReservationsData] = useState([]);
  const [roomsOccupancyRate, setRoomsOccupancyRate] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [
          { data: bookings, error: bookingsError },
          { data: occupancyRate, occupancyRateError },
          { data: ReservationsRate, error: ReservationsRateError },
        ] = await Promise.all([
          supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false }),

          supabase
            .from("rooms")
            .select("*")
            .order("created_at", { ascending: false }),

          supabase
            .from("reservations")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (bookingsError || occupancyRateError || ReservationsRateError) {
          throw new Error(
            bookingsError?.message ||
              occupancyRateError?.message ||
              ReservationsRateError?.message
          );
        }

        setBookingsData(bookings || []);
        setRevenueData(bookings || []);
        setRoomsOccupancyRate(occupancyRate || []);
        setReservationsData(ReservationsRate || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const availableRooms = roomsOccupancyRate.filter(
    (room) => room.status === "available"
  ).length;
  const occupiedRooms = roomsOccupancyRate.length - availableRooms;
  const monthlyOccupancyRates = Math.round(
    (occupiedRooms / availableRooms) * 100
  );

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

  const aggregateBookingsByMonth = (bookings) => {
    const monthlyData = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.created_at);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: `${date.toLocaleString("default", {
            month: "short",
          })} ${date.getFullYear()}`,
          revenue: 0,
          bookings: 0,
        };
      }

      monthlyData[monthYear].revenue += Number(booking.price || 0);
      monthlyData[monthYear].bookings += 1;
    });

    return Object.values(monthlyData);
  };

  const monthlyData = aggregateBookingsByMonth(bookingsData);

  // Get the last 6 months of data for display
  const last6MonthsData = monthlyData.slice(-6);

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
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Insights and performance metrics for your hotel
            </p>
          </header>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Total Revenue"
              value={formatPrice(totalPrice)}
              change="+12% from last month"
              trend="up"
            />
            <MetricCard
              icon={<Hotel className="w-6 h-6" />}
              title="Total Bookings"
              value={bookingsData.length}
              change="+8 from last week"
              trend="up"
            />
            <MetricCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Occupancy Rate"
              value={`${monthlyOccupancyRates}%`}
              change="+5% from last month"
              trend="up"
            />
            <MetricCard
              icon={<Calendar className="w-6 h-6" />}
              title="Avg. Stay Duration"
              value="80%"
              change="No change"
              trend="neutral"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Monthly Revenue</h2>
                <select className="text-sm border rounded-md px-3 py-1">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>All Time</option>
                </select>
              </div>
              <div className="h-64">
                <RevenueChart data={last6MonthsData} />
              </div>
            </div>

            {/* Booking Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Bookings Analytics</h2>
                <select className="text-sm border rounded-md px-3 py-1">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>All Time</option>
                </select>
              </div>
              <div className="h-64">
                <BookingChart data={last6MonthsData} />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Bookings</h2>
                {bookingsData.length > 4 && (
                  <Link
                    href="/admin/bookings"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View All
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {bookingsData
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .slice(0, 4)
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {booking.full_name || "Guest"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {booking.type}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Upcoming Arrivals */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Upcoming Arrivals</h2>
                {reservationData.length > 4 && (
                  <Link
                    href="/admin/reservations"
                    className="text-sm text-blue-600 hover:underline mt-4 inline-block"
                  >
                    View All ({reservationData.length})
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {reservationData
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .slice(0, 4)
                  .map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {reservation.fullName || "Guest"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              reservation.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {reservation.roomType || "Standard"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper components
function MetricCard({ icon, title, value, change, trend }) {
  const trendColor = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full bg-blue-50 text-blue-600`}>
          {icon}
        </div>
        {trend !== "neutral" && (
          <span
            className={`text-xs ${trendColor[trend]} bg-${
              trend === "up" ? "green" : "red"
            }-100 px-2 py-1 rounded-full`}
          >
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}

// Helper function for chart colors
function getSourceColor(source) {
  const colors = {
    Website: "#3b82f6",
    "Booking.com": "#10b981",
    Expedia: "#f59e0b",
    "Walk-in": "#ef4444",
    Phone: "#8b5cf6",
  };
  return colors[source] || "#6b7280";
}
