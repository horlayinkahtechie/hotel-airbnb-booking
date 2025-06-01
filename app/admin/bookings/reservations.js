"use client";
import AdminNavbar from "@/app/_components/adminNav";
import AdminSidebar from "@/app/_components/adminSidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

import {
  FiSearch,
  FiCalendar,
  FiUser,
  FiHome,
  FiClock,
  FiDollarSign,
  FiFilter,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import Spinner from "@/app/_components/Spinner";

const ReservationsPage = () => {
  const { data: session, status } = useSession();
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);

        // Debug current state

        if (status !== "authenticated") {
          setLoading(false);
          return;
        }

        if (session?.user?.role !== "admin") {
          console.log("Unauthorized access - redirecting");
          router.push("/unauthorized");
          setLoading(false);
          return;
        }

        console.log("Fetching bookings...");
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("Received bookings:", data.length);
        setUserBookings(data || []);
      } catch (err) {
        console.error("Fetch failed:", err);
        setUserBookings([]);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if authenticated
    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status]);

  const deleteBooking = async (bookingId) => {
    try {
      setUserBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));

      // Confirmation dialog
      if (!confirm("Are you sure you want to delete this booking?")) {
        const { data } = await supabase.from("bookings").select("*");
        setUserBookings(data);
        return;
      }

      // Execute deletion
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("booking_id", bookingId);

      if (error) throw error;
    } catch (err) {
      // Revert on error
      const { data } = await supabase.from("bookings").select("*");
      setUserBookings(data);
    }
  };

  const confirmDelete = (bookingId) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteBooking(bookingId);
    }
  };

  if (status === "loading" || loading) return <Spinner />;

  return (
    <>
      <div>
        <AdminNavbar />
      </div>

      <div className="lg:flex">
        <div>
          <AdminSidebar />
        </div>
        <div className="min-h-screen w-full bg-gray-50">
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-blue-600" />
                  <select className="border border-gray-300 cursor-pointer rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Dates</option>
                    <option>Today</option>
                    <option>This Week</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <FiUser className="text-blue-600" />
                  <select className="border border-gray-300 cursor-pointer rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Guests</option>
                    <option>New Guests</option>
                    <option>Returning</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <FiHome className="text-blue-600" />
                  <select className="border border-gray-300 cursor-pointer rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Room Types</option>
                    <option>Standard</option>
                    <option>Deluxe</option>
                    <option>Suite</option>
                  </select>
                </div>

                <button className="ml-auto flex items-center cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FiFilter className="mr-2" />
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Booking ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Listing ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Listing Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Room Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Checkin & Out
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Days
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* {userBookings.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {reservation.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {reservation.listing_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reservation.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.listing_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reservation.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiCalendar className="mr-1 text-blue-500" />
                            {reservation.checkin_date} -{" "}
                            {reservation.checkout_date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.no_of_days}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          reservation.payment_status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                          >
                            {reservation.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.email}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() =>
                              deleteBooking(reservation.booking_id)
                            }
                            className="text-red-600 hover:text-red-900 cursor-poin p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))} */}

                    {loading ? (
                      <tr>
                        <td colSpan={12} className="px-6 py-4 text-center">
                          <Spinner />
                        </td>
                      </tr>
                    ) : userBookings.length > 0 ? (
                      userBookings.map((reservation) => (
                        <tr
                          key={reservation.booking_id}
                          className="hover:bg-blue-50"
                        >
                          {" "}
                          {/* Changed key to booking_id */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {reservation.booking_id || "N/A"}{" "}
                            {/* Changed to booking_id */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {reservation.listing_id || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.full_name || "Guest"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {reservation.listing_name || "Unnamed Listing"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${parseFloat(reservation.price || 0).toFixed(2)}{" "}
                            {/* Format price */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reservation.type || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiCalendar className="mr-1 text-blue-500" />
                              {reservation.checkin_date || "Unknown"} -{" "}
                              {reservation.checkout_date || "Unknown"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reservation.no_of_days || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              reservation.payment_status === "Paid"
                ? "bg-green-100 text-green-800"
                : reservation.payment_status ===
                  "Pending" /* Fixed status comparison */
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
                            >
                              {reservation.payment_status || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {reservation.email || "No email"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${parseFloat(reservation.total || 0).toFixed(2)}{" "}
                            {/* Format total */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEdit(reservation.booking_id)}
                              className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer rounded hover:bg-blue-50 transition-colors"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() =>
                                deleteBooking(reservation.booking_id)
                              }
                              className="text-red-600 cursor-pointer hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={12}
                          className="px-6 py-4 text-center text-gray-600"
                        >
                          No bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">24</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ReservationsPage;
