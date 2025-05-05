import Image from "next/image";
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
      <div className="absolute inset-0 bg-white/70 backdrop-blur z-10 flex items-center justify-center">
        <div className="lg:p-20 p-10 rounded-xl text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Find your perfect stay</h1>
          <p className="text-gray-700 mb-6">
            Hotels, Apartments, and Shortlets — all in one place.
          </p>
          <input
            type="text"
            placeholder="Search hotel or shortlet"
            className="px-4 py-2 w-full rounded-md border focus:outline-none focus:ring"
          />
        </div>
      </div>
    </section>
  );
}
