import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full px-4 py-4 flex justify-between items-center border-b shadow-sm">
      <Link href="/" className="text-xl font-bold text-primary">
        BookNest
      </Link>

      <nav className="flex gap-6 items-center">
        <Link href="/#listings" className="hover:underline">
          Explore
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
        <Button variant="outline">Login</Button>
      </nav>
    </header>
  );
}
