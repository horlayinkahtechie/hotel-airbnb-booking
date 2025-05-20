import Image from "next/image";

export default function BookingCard({ reservation }) {
  return (
    <div className="rounded-xl shadow p-4 flex flex-col lg:flex-row gap-6 mb-4 bg-white">
      {/* Image */}

      {/* Booking Info */}
      <div className="flex-1 space-y-1">
        <h2 className="lg:text-xl text-[18.3px] font-semibold">
          {reservation.listing_name}
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

        {/* Additional Reservation Info */}
        <div className="pt-4 border-t mt-3 space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-medium">Guest Name:</span>{" "}
            {reservation.fullname}
          </p>
          <p>
            <span className="font-medium">Email:</span> {booking.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {booking.phone}
          </p>
          <p>
            <span className="font-medium">Guests:</span> {booking.guests}
          </p>
          <p>
            <span className="font-medium">Room Type:</span> {booking.room_type}
          </p>
          <p>
            <span className="font-medium">Arrival Time:</span>{" "}
            {booking.arrival_time}
          </p>
          {booking.notes && (
            <p>
              <span className="font-medium">Notes:</span> {booking.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
