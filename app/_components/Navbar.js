"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") return null;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <header className="w-full px-4 py-4 flex justify-between items-center shadow-sm">
        <Link href="/" className="text-xl font-bold text-primary">
          BookNest
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/explore" className="hover:underline">
            Explore
          </Link>
          <Link href="/aboutus" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/user/profile">
                <FaUserCircle size={24} className="text-gray-700" />
              </Link>
              <Button
                variant="outline"
                className="hover:bg-black hover:outline-0 hover:text-white cursor-pointer"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="hover:bg-black hover:outline-0 hover:text-white cursor-pointer"
            >
              <Link href="/auth/user/signin">Login</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button className="md:hidden" onClick={toggleSidebar}>
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </header>

      {/* Sidebar for mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            BookNest
          </Link>
          <button onClick={toggleSidebar}>
            <HiX size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4">
          <Link href="/explore" onClick={toggleSidebar}>
            Explore
          </Link>
          <Link href="/aboutus" onClick={toggleSidebar}>
            About
          </Link>
          <Link href="/contact" onClick={toggleSidebar}>
            Contact
          </Link>

          {session ? (
            <>
              <Link href="/user/profile" onClick={toggleSidebar}>
                <div className="flex items-center gap-2">
                  <FaUserCircle size={24} className="text-gray-700" />
                  Profile
                </div>
              </Link>
              <Button
                variant="outline"
                className="hover:bg-black hover:outline-0 hover:text-white cursor-pointer"
                onClick={() => {
                  signOut();
                  toggleSidebar();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={toggleSidebar}
              className="hover:bg-black hover:outline-0 hover:text-white cursor-pointer"
            >
              <Link href="/auth/user/signin">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </>
  );
}
