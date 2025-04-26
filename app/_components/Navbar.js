"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <header className="w-full px-4 py-4 flex justify-between items-center border-b shadow-sm">
        <Link href="/" className="text-xl font-bold text-primary">
          BookNest
        </Link>

        <nav className="flex gap-6 items-center">
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
              <Link href="/user/profile" className="cursor-pointer">
                <FaUserCircle size={24} className="text-gray-700" />
              </Link>

              <Button
                variant="outline"
                onClick={() => signOut()}
                className="cursor-pointer"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="cursor-pointer">
              <Link href="/auth/user/signin">Login</Link>
            </Button>
          )}
        </nav>
      </header>
    </>
  );
}
