"use client";
import AdminNavbar from "@/app/_components/adminNav";
import AdminSidebar from "@/app/_components/adminSidebar";
import InsertRoomModal from "@/app/_components/insertRoomModal";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiSearch,
  FiPlus,
  FiHome,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const RoomsPage = () => {
  const { data: session, status } = useSession();
  const [totalRoomsData, setTotalRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Filter state
  const [filters, setFilters] = useState({
    roomType: "all",
    status: "all",
    search: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  const openInsertModal = () => setIsModalOpen(true);
  const closeInsertModal = () => setIsModalOpen(false);

  const handleInsertSuccess = () => {
    fetchRooms();
  };

  const fetchRooms = async () => {
    setIsLoading(true);
    const { data: totalRooms, error } = await supabase
      .from("rooms")
      .select("*");

    if (!error) {
      setTotalRooms(totalRooms || []);
      setFilteredRooms(totalRooms || []);
    } else {
      setTotalRooms([]);
      setFilteredRooms([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Apply filters whenever filters or rooms change
  useEffect(() => {
    const filtered = totalRoomsData.filter((room) => {
      const matchesType =
        filters.roomType === "all" || room.room_type === filters.roomType;
      const matchesStatus =
        filters.status === "all" || room.status === filters.status;
      const matchesSearch =
        filters.search === "" ||
        room.room_id.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.room_type.toLowerCase().includes(filters.search.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    });
    setFilteredRooms(filtered);
    setCurrentPage(1);
  }, [filters, totalRoomsData]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

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

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const statusColors = {
    available: "bg-green-100 text-green-800",
    booked: "bg-blue-100 text-blue-800",
    maintenance: "bg-yellow-100 text-yellow-800",
  };

  // Unique room types for filter dropdown
  const roomTypes = [...new Set(totalRoomsData.map((room) => room.room_type))];

  const availableRooms = totalRoomsData.filter(
    (room) => room.status === "available"
  ).length;
  const occupiedRooms = totalRoomsData.filter(
    (room) => room.status === "occupied"
  ).length;
  const maintenanceRooms = totalRoomsData.filter(
    (room) => room.status === "maintenance"
  ).length;

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
            {/* Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-blue-800">
                  Rooms Management
                </h1>
                <p className="text-gray-600">
                  Manage all rooms and their availability
                </p>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search rooms..."
                    value={filters.search}
                    onChange={handleSearchChange}
                  />
                </div>
                <button
                  onClick={openInsertModal}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2" />
                  Add Room
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                    <FiHome size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Rooms
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {totalRoomsData.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-50 text-green-600">
                    <FiCheckCircle size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Available
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {availableRooms}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FiEye size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Booked</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {occupiedRooms}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                    <FiXCircle size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Maintenance
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {maintenanceRooms}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <select
                    name="roomType"
                    value={filters.roomType}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Room Types</option>
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rooms Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Room ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Price per night
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
                      currentItems.map((room) => (
                        <tr key={room.id} className="hover:bg-blue-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {room.room_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {room.room_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {room.capacity} Guests
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {room.price_per_night}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                statusColors[room.status] ||
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {room.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <FiEdit2 />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No rooms found matching your filters
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
                  {Math.min(indexOfLastItem, filteredRooms.length)}
                </span>{" "}
                of <span className="font-medium">{filteredRooms.length}</span>{" "}
                rooms
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiChevronLeft className="inline" />
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
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiChevronRight className="inline" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <InsertRoomModal
        isOpen={isModalOpen}
        onClose={closeInsertModal}
        onSuccess={handleInsertSuccess}
      />
    </>
  );
};

export default RoomsPage;
