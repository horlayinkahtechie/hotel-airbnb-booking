"use client";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Hotel,
  MessageSquare,
  BarChart2,
  Users,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Reservations", href: "/admin/reservations", icon: CalendarDays },
  { name: "Rooms", href: "/admin/rooms", icon: Hotel },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Your Profile", href: "/admin/profile", icon: User },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);

  return (
    <div>
      <div className="md:hidden p-4 justify-between items-center bg-white shadow">
        <button onClick={toggleSidebar}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300 md:relative md:translate-x-0 md:flex md:flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 mt-7 text-2xl font-bold border-b border-gray-700">
          Hotel Admin
        </div>
        <nav className="flex-1 flex flex-col gap-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-5 rounded hover:bg-gray-800 ${
                  pathname === link.href ? "bg-gray-800" : ""
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
