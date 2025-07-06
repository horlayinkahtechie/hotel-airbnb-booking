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
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import Spinner from "@/app/_components/Spinner";

const Reservations = () => {
  const { data: session, status } = useSession();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "all",
    roomType: "all",
    status: "all",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchReservations() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("reservations")
          .select(
            `
            id,
            created_at,
            fullName,
            email,
            phoneNumber,
            guests,
            checkIn,
            notes,
            roomType,
            status
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReservations(data || []);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchReservations();
    }
  }, [status]);

  const applyFilters = () => {
    setLoading(true);
    let query = supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    // Date filters
    if (filters.dateRange === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query
        .gte("checkIn", today.toISOString())
        .lt("checkIn", new Date(today.getTime() + 86400000).toISOString());
    } else if (filters.dateRange === "thisWeek") {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      query = query
        .gte("checkIn", startOfWeek.toISOString())
        .lt(
          "checkIn",
          new Date(startOfWeek.getTime() + 604800000).toISOString()
        );
    }

    // Room type filter
    if (filters.roomType !== "all") {
      query = query.ilike("roomType", `%${filters.roomType}%`);
    }

    // Status filter
    if (filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    query.then(({ data, error }) => {
      if (error) {
        console.error("Filter error:", error);
      } else {
        setReservations(data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (status === "authenticated") {
      applyFilters();
    }
  }, [filters.dateRange, filters.roomType, filters.status, status]);

  const handleDeleteClick = (reservationId) => {
    setReservationToDelete(reservationId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("reservations")
        .delete()
        .eq("id", reservationToDelete);

      if (error) throw error;

      setReservations(
        reservations.filter((res) => res.id !== reservationToDelete)
      );
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && reservations.length === 0) {
    return <Spinner />;
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
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                {/* Date Filter */}
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-blue-600" />
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({ ...filters, dateRange: e.target.value })
                    }
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                  </select>
                </div>

                {/* Room Type Filter */}
                <div className="flex items-center space-x-2">
                  <FiHome className="text-blue-600" />
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.roomType}
                    onChange={(e) =>
                      setFilters({ ...filters, roomType: e.target.value })
                    }
                  >
                    <option value="all">All Room Types</option>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <FiUser className="text-blue-600" />
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={applyFilters}
                  className="ml-auto flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Room Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-blue-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {reservation.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(reservation.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.phoneNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(reservation.checkIn).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reservation.guests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reservation.roomType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reservation.notes || "No notes"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                reservation.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : reservation.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(reservation.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={11}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No reservations found
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
                  {Math.min(indexOfLastItem, reservations.length)}
                </span>{" "}
                of <span className="font-medium">{reservations.length}</span>{" "}
                results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium ${
                        currentPage === page
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              Are you sure you want to delete this reservation? This action
              cannot be undone.
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
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
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

export default Reservations;
