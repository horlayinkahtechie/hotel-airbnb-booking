import AdminNavbar from "@/app/_components/adminNav";
import AdminSidebar from "@/app/_components/adminSidebar";
import {
  FiSearch,
  FiPlus,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const UsersPage = () => {
  // Sample user data
  const users = [
    {
      id: "USR-1001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      status: "Active",
      lastLogin: "2023-06-15 09:30",
      joinDate: "2022-01-15",
    },
    {
      id: "USR-1002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 987-6543",
      role: "Receptionist",
      status: "Active",
      lastLogin: "2023-06-14 14:45",
      joinDate: "2022-03-10",
    },
    {
      id: "USR-1003",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "+1 (555) 456-7890",
      role: "Housekeeping",
      status: "Inactive",
      lastLogin: "2023-05-20 11:15",
      joinDate: "2022-05-22",
    },
    {
      id: "USR-1004",
      name: "Emily Wilson",
      email: "emily@example.com",
      phone: "+1 (555) 789-0123",
      role: "User",
      status: "Active",
      lastLogin: "2023-06-15 08:00",
      joinDate: "2021-11-05",
    },
    {
      id: "USR-1005",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 (555) 234-5678",
      role: "Receptionist",
      status: "Pending",
      lastLogin: "Never",
      joinDate: "2023-06-01",
    },
  ];

  const statusColors = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Suspended: "bg-red-100 text-red-800",
  };

  const roleColors = {
    Admin: "bg-blue-100 text-blue-800",
    Manager: "bg-purple-100 text-purple-800",
    Receptionist: "bg-indigo-100 text-indigo-800",
    Housekeeping: "bg-teal-100 text-teal-800",
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
                  Users Management
                </h1>
                <p className="text-gray-600">
                  Manage all system users and their permissions
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
                    placeholder="Search users..."
                  />
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FiPlus className="mr-2" />
                  Add User
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                    <FiUser size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">24</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-50 text-green-600">
                    <FiCheckCircle size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-semibold text-gray-900">18</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                    <FiXCircle size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Inactive
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">4</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                    <FiCalendar size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Roles</option>
                    <option>User</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Receptionist</option>
                    <option>Housekeeping</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                    <option>Suspended</option>
                  </select>
                </div>

                <button className="ml-auto flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        User ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                      >
                        Role
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
                        Last Login
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
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <FiUser />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              roleColors[user.role]
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[user.status]
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin}
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
                <span className="font-medium">24</span> users
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

export default UsersPage;
