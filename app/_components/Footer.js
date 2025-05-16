import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 px-6 text-gray-600">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/aboutus" className="hover:text-blue-600 transition">
                About us
              </Link>
            </li>
            <li>
              <Link href="/explore" className="hover:text-blue-600 transition">
                Explore Rooms
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-blue-600 transition">
                Book a Room
              </Link>
            </li>
            <li>
              <Link
                href="/user/login"
                className="hover:text-blue-600 transition"
              >
                Log In
              </Link>
            </li>
            <li>
              <Link
                href="/user/profile"
                className="hover:text-blue-600 transition"
              >
                Your Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              4, Hill Valley Estate, Phase 3, Abule Oko, Olaogun, Lagos State.
            </li>
            <li>📞 08924092333, 0931948232</li>
            <li>✉️ contact@gmail.com</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Stay in Touch
          </h3>
          <p className="text-sm mb-4">
            Subscribe to our newsletter for updates and offers.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom text */}
      <div className="mt-12 text-center text-sm text-gray-500 border-t pt-6">
        <p className="mb-2">
          Discover top-rated standard rooms, apartments, and shortlets. Book
          your perfect stay with just a few clicks.
        </p>
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">BookNest</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
