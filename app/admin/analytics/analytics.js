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
  Link,
} from "lucide-react";
import AdminNavbar from "@/app/_components/adminNav";
import AdminSidebar from "@/app/_components/adminSidebar";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    bookings: 0,
    occupancyRate: 0,
    averageStay: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [bookingSources, setBookingSources] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          { data: revenue },
          { data: sources },
          { data: bookings },
          { data: metricsData },
        ] = await Promise.all([
          supabase.rpc("get_monthly_revenue"),
          supabase.rpc("get_booking_sources"),
          supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.rpc("get_metrics_snapshot"),
        ]);

        setRevenueData(revenue || []);
        setBookingSources(sources || []);
        setRecentBookings(bookings || []);
        setMetrics(
          metricsData?.[0] || {
            totalRevenue: 0,
            bookings: 0,
            occupancyRate: 0,
            averageStay: 0,
          }
        );
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
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
              value={`₦${metrics.totalRevenue.toLocaleString()}`}
              change="+12% from last month"
              trend="up"
            />
            <MetricCard
              icon={<Hotel className="w-6 h-6" />}
              title="Bookings"
              value={metrics.bookings}
              change="+8 from last week"
              trend="up"
            />
            <MetricCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Occupancy Rate"
              value={`${metrics.occupancyRate}%`}
              change="+5% from last month"
              trend="up"
            />
            <MetricCard
              icon={<Calendar className="w-6 h-6" />}
              title="Avg. Stay Duration"
              value={`${metrics.averageStay} nights`}
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
                {/* Replace with your chart library (Chart.js, etc.) */}
                <div className="flex items-end justify-between h-full">
                  {revenueData.map((month) => (
                    <div
                      key={month.month}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="w-8 bg-blue-500 rounded-t-sm"
                        style={{ height: `${(month.revenue / 500000) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2">{month.month}</span>
                    </div>
                  ))}
                </div>
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
                {/* Replace with your chart library (Chart.js, etc.) */}
                <div className="flex items-end justify-between h-full">
                  {revenueData.map((month) => (
                    <div
                      key={month.month}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="w-8 bg-blue-500 rounded-t-sm"
                        style={{ height: `${(month.revenue / 500000) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Bookings</h2>
                <Link
                  href="/admin/bookings"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
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
                          {booking.guest_name || "Guest"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {booking.room_type || "Standard"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Arrivals */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Upcoming Arrivals</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Guest {item}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            Date.now() + item * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Arriving
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
