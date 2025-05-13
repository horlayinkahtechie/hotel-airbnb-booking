// components/Spinner.jsx
export default function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent border- black-500 sm:h-4 sm:w-4 md:h6 md:w-6 lg:h-10 lg:w-10 `}
      ></div>
    </div>
  );
}
