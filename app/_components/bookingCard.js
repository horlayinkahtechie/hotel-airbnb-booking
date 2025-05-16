import Image from "next/image";

export default function BookingCard({ booking }) {
  return (
    <div className="rounded-xl shadow p-4 flex gap-6 mb-4 bg-white">
      <div className="relative w-30 h-30 lg:w-32 lg:h-32">
        <Image
          src={booking.listing_img}
          alt={booking.listing_name}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex-1">
        <h2 className="lg:text-xl text-[18.3px] font-semibold">
          {booking.listing_name}
        </h2>
        <p className="text-gray-600 lg:text-[16px] text-[13px]">
          {booking.checkin_date} → {booking.checkout_date}
        </p>
        <p className="lg:text-[16px] text-[13px] text-gray-600">
          {booking.listing_id} | Status:{" "}
          <span className="capitalize font-medium text-green-600">
            {booking.payment_status}
          </span>
        </p>
        <p className="font-bold mt-2">
          ₦{Number(booking.price).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
