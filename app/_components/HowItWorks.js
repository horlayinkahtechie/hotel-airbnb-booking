import { Hotel, Search, BookOpen } from "lucide-react";

const steps = [
  {
    icon: <Search size={43} />,
    title: "Search",
    desc: "Browse hotels, shortlets, and apartments.",
  },
  {
    icon: <BookOpen size={43} />,
    title: "Book",
    desc: "Pick your dates and book securely online.",
  },
  {
    icon: <Hotel size={43} />,
    title: "Stay",
    desc: "Check-in and enjoy your stay with ease.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 px-4 text-center">
      <h2 className="text-2xl font-bold mb-10">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-xl shadow-sm text-center flex flex-col items-center"
          >
            <div className="text-primary mb-4">{step.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
