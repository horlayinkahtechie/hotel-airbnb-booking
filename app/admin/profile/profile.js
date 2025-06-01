"use client";
import AdminNavbar from "@/app/_components/adminNav";
import AdminSidebar from "@/app/_components/adminSidebar";
import Spinner from "@/app/_components/Spinner";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEdit,
  FiSave,
  FiCalendar,
} from "react-icons/fi";

const AdminProfilePage = () => {
  const { data: session, status } = useSession;
  const [loading, setIsLoading] = useState(false);
  // Sample admin profile data
  const adminProfile = {
    name: "Admin User",
    email: "admin@hotel.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    lastLogin: "2023-06-10 14:30",
    joinDate: "2022-01-15",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: adminProfile.name,
    email: adminProfile.email,
    phone: adminProfile.phone,
  });

  const handleInputChange = (e) => {
    if (session?.user?.role !== "admin") {
      // console.log("Unauthorized access - redirecting");
      router.push("/unauthorized");
      setLoading(false);
      return;
    }
    setIsLoading(true);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsLoading(false);
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
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-blue-800">
                  Admin Profile
                </h1>
                <p className="text-gray-600">Manage your account information</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`mt-4 sm:mt-0 flex items-center px-4 py-2 rounded-md ${
                  isEditing
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isEditing ? (
                  <>
                    <FiSave className="mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="relative">
                      {/* <img
                        className="h-32 w-32 rounded-full border-4 border-blue-100 object-cover"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Admin profile"
                      /> */}
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                          <FiEdit size={16} />
                        </button>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {adminProfile.name}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {adminProfile.role}
                      </p>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-grow">
                    <div className="space-y-4">
                      {/* Name Field */}
                      <div className="border-b border-gray-200 pb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiUser className="mr-2 text-blue-600" />
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">
                            {adminProfile.name}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="border-b border-gray-200 pb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiMail className="mr-2 text-blue-600" />
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">
                            {adminProfile.email}
                          </p>
                        )}
                      </div>

                      {/* Phone Field */}
                      <div className="border-b border-gray-200 pb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiPhone className="mr-2 text-blue-600" />
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">
                            {adminProfile.phone}
                          </p>
                        )}
                      </div>

                      {/* Read-only Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiCalendar className="mr-2 text-blue-600" />
                            Last Login
                          </label>
                          <p className="text-gray-900">
                            {adminProfile.lastLogin}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiCalendar className="mr-2 text-blue-600" />
                            Join Date
                          </label>
                          <p className="text-gray-900">
                            {adminProfile.joinDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <FiLock className="mr-2 text-blue-600" />
                      Password
                    </h3>
                    <p className="text-sm text-gray-600">
                      Change your password regularly for security
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminProfilePage;
