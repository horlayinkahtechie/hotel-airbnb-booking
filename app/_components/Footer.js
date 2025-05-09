import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 pb-[13px] text-center text-gray-500">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
        <div className="w-80">
          <h3 className="font-bold mb-2 text-gray-800">QUICK LINKS</h3>
          <ul className="list-none">
            <li className="list-item">
              <Link href="/aboutus">About us</Link>
            </li>
            <li className="list-item">
              <Link href="/explore">Explore Rooms</Link>
            </li>
            <li className="list-item">
              <Link href="/book">Book a Room</Link>
            </li>
            <li className="list-item">
              <Link href="/user/login">Log In</Link>
            </li>
            <li className="list-item">
              <Link href="/user/profile">Your Profile</Link>
            </li>
          </ul>
        </div>

        <div className="w-80">
          <h3 className="font-bold mb-2 text-gray-800">CONTACT US</h3>
          <ul className="list-none">
            <li className="list-item">
              <p>
                4, Hill Valley estate, Phase 3, abule oko, Olaogun, Lagos state.
              </p>
            </li>
            <li className="list-item">
              <p>08924092333, 0931948232</p>
            </li>
            <li className="list-item">
              <p>contact@gmail.com</p>
            </li>
          </ul>
        </div>

        <div className="w-80">
          <h3 className="text-[23px] mb-1 text-gray-800 font-medium text-start">
            STAY IN TOUCH
          </h3>
          <p className="text-start mb-4 text-[18px] w-100">
            Subscribe to our newsletter for the latest news, events and updates.
          </p>

          <input
            type="email"
            className="block border p-3 rounded w-100 hover:shadow"
            required
            placeholder="Enter your Email"
          />
          <button
            type="submit"
            className="block bg-gray-800 text-white rounded px-5 py-2 mt-5 hover:bg-gray-700 cursor-pointer transition w-100 text-[17.4px]"
          >
            Subscribe
          </button>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-[18px]">
          Discover top-rated standard rooms, apartments, and shortlets across.
          Book your perfect stay with just a few clicks.
        </p>
      </div>
      <p className="mt-5">
        &copy; {new Date().getFullYear()} BookNest. All rights reserved.
      </p>
    </footer>
  );
}
