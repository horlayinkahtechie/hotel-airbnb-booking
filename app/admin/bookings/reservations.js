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
  FiX,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import Spinner from "@/app/_components/Spinner";

const ReservationsPage = () => {
  const { data: session, status } = useSession();
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "all",
    roomType: "all",
    startDate: null,
    endDate: null,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingsToDelete, setBookingsToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userBookings.length / itemsPerPage);

  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

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

  useEffect(() => {
    if (status === "authenticated") {
      applyFilters();
    }
  }, [filters.dateRange, filters.roomType, status]);

  const applyFilters = () => {
    setLoading(true);

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    // Date filters
    if (filters.dateRange === "today") {
      query = query
        .gte("checkin_date", today.toISOString())
        .lt("checkin_date", new Date(today.getTime() + 86400000).toISOString());
    } else if (filters.dateRange === "thisWeek") {
      query = query
        .gte("checkin_date", startOfWeek.toISOString())
        .lt(
          "checkin_date",
          new Date(startOfWeek.getTime() + 604800000).toISOString()
        );
    } else if (
      filters.dateRange === "custom" &&
      filters.startDate &&
      filters.endDate
    ) {
      query = query
        .gte("checkin_date", filters.startDate.toISOString())
        .lt(
          "checkin_date",
          new Date(filters.endDate.getTime() + 86400000).toISOString()
        );
    }

    // room type filter
    if (filters.roomType !== "all") {
      query = query.eq("type", filters.roomType);
    }

    query.then(({ data, error }) => {
      if (error) {
        console.error("Filter error:", error);
      } else {
        setUserBookings(data || []);
      }
      setLoading(false);
    });
  };

  const handleDeleteClick = (userId) => {
    setBookingsToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("bookings")
        .delete("*")
        .eq("booking_id", bookingsToDelete);

      if (error) throw error;

      // Update local state
      setUserBookings(
        userBookings.filter(
          (userBookings) => userBookings.booking_id !== bookingsToDelete
        )
      );
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                {/* Date Filter */}
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-blue-600" />
                  <select
                    className="border border-gray-300 cursor-pointer rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({ ...filters, dateRange: e.target.value })
                    }
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="custom">Custom Range</option>
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

                {/* Room Type Filter */}
                <div className="flex items-center space-x-2">
                  <FiHome className="text-blue-600" />
                  <select
                    className="border border-gray-300 cursor-pointer rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.roomType}
                    onChange={(e) =>
                      setFilters({ ...filters, roomType: e.target.value })
                    }
                  >
                    <option value="all">All Room Types</option>
                    <option value="Shortlet">Shortlet</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Apartment">Apartment</option>
                  </select>
                </div>

                {/* Filter button */}
                <button
                  onClick={applyFilters}
                  className="ml-auto flex items-center cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
                        Price/night
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
                    {loading ? (
                      <tr>
                        <td colSpan={12} className="px-6 py-4 text-center">
                          <Spinner />
                        </td>
                      </tr>
                    ) : currentItems.length > 0 ? (
                      currentItems.map((reservation) => (
                        <tr
                          key={reservation.booking_id}
                          className="hover:bg-blue-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {reservation.booking_id || "N/A"}{" "}
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
                            ${parseFloat(reservation.price || 0).toFixed(2)}{" "}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer rounded hover:bg-blue-50 transition-colors">
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(reservation.booking_id)
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
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, userBookings.length)}
                </span>{" "}
                of <span className="font-medium">{userBookings.length}</span>{" "}
                results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? "border-gray-300 bg-white text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium ${
                        currentPage === number
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? "border-gray-300 bg-white text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Confirm Deletion
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReservationsPage;
