"use client";
import AdminNavbar from "@/app/_components/adminNav";
import AdminSidebar from "@/app/_components/adminSidebar";
import InsertRoomModal from "@/app/_components/insertRoomModal";
import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiHome,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const RoomsPage = () => {
  // const [rooms, setRooms] = useState([]);
  const [totalRoomsData, setTotalRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);

  // Sample room data
  const rooms = [
    {
      id: "RM-101",
      type: "Deluxe Suite",
      capacity: 2,
      price: "$250/night",
      status: "Available",
      amenities: ["WiFi", "AC", "TV", "Mini Bar"],
      lastCleaned: "2023-06-10",
    },
    {
      id: "RM-102",
      type: "Standard Room",
      capacity: 2,
      price: "$150/night",
      status: "Booked",
      amenities: ["WiFi", "AC", "TV"],
      lastCleaned: "2023-06-09",
    },
    {
      id: "RM-201",
      type: "Executive Suite",
      capacity: 4,
      price: "$350/night",
      status: "Maintenance",
      amenities: ["WiFi", "AC", "TV", "Mini Bar", "Jacuzzi"],
      lastCleaned: "2023-06-08",
    },
    {
      id: "RM-202",
      type: "Standard Room",
      capacity: 2,
      price: "$150/night",
      status: "Available",
      amenities: ["WiFi", "AC", "TV"],
      lastCleaned: "2023-06-10",
    },
    {
      id: "RM-301",
      type: "Family Room",
      capacity: 4,
      price: "$300/night",
      status: "Booked",
      amenities: ["WiFi", "AC", "TV", "Sofa"],
      lastCleaned: "2023-06-07",
    },
  ];
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
    const fetchTotalRooms = async () => {
      setIsLoading(true);
      const { data: totalRooms, error } = await supabase
        .from("rooms")
        .select("*");

      if (!error) {
        setTotalRooms(totalRooms);
        console.log("Total rooms", totalRooms);
        setIsLoading(true);
      } else {
        setTotalRooms([]);
        setIsLoading(false);
      }
    };
    fetchTotalRooms();
  }, []);

  const statusColors = {
    Available: "bg-green-100 text-green-800",
    Booked: "bg-blue-100 text-blue-800",
    Maintenance: "bg-yellow-100 text-yellow-800",
    Cleaning: "bg-purple-100 text-purple-800",
  };

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
                    <p className="text-2xl font-semibold text-gray-900">12</p>
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
                    <p className="text-2xl font-semibold text-gray-900">8</p>
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
                    <p className="text-2xl font-semibold text-gray-900">4</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Room Types</option>
                    <option>Standard</option>
                    <option>Deluxe</option>
                    <option>Suite</option>
                    <option>Family</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Statuses</option>
                    <option>Available</option>
                    <option>Booked</option>
                    <option>Maintenance</option>
                    <option>Cleaning</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Capacities</option>
                    <option>1-2 Guests</option>
                    <option>3-4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>

                <button className="ml-auto flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Rooms Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Room ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Capacity
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
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Last Cleaned
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
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {room.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {room.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.capacity} Guests
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {room.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[room.status]
                            }`}
                          >
                            {room.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.lastCleaned}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">5</span> of{" "}
                <span className="font-medium">24</span> rooms
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
      <InsertRoomModal
        isOpen={isModalOpen}
        onClose={closeInsertModal}
        onSuccess={handleInsertSuccess}
      />
    </>
  );
};

export default RoomsPage;
