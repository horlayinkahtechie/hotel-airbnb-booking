export default function Hero() {
  return (
    <section
      placeholder="blur"
      className="w-full h-[100vh] bg-[url('/Apartment3.jpg')] bg-cover bg-center flex items-center justify-center p-2"
    >
      <div className="bg-white/70 backdrop-blur lg:p-20 p-10 rounded-xl text-center max-w-2xl">
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
    </section>
  );
}
