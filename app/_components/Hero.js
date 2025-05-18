import Image from "next/image";
import Link from "next/link";
import apartment3 from "@/public/Apartment3.jpg";

export default function Hero() {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center p-2 overflow-hidden">
      <Image
        src={apartment3}
        alt="Hero Background"
        fill
        className="object-cover object-center z-0"
        priority
        quality={75}
      />

      {/* Overlay */}
      <div className="absolute rounded-[10px] bg-white/70 backdrop-blur z-10 flex items-center justify-center">
        <div className="lg:p-20 p-10 rounded-xl text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Find your perfect stay</h1>
          <p className="text-gray-700 mb-6 text-[18px]">
            Rooms tailored for your comfort — book your perfect stay today.
          </p>
          <Link href="/reservation" className="w-full">
            <button className="bg-blue-600 w-full text-[18.5px] cursor-pointer hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition duration-300">
              Reserve a room
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
