import Image from "next/image";

export default function FavoriteCard({ favorite }) {
  return (
    <div className="rounded-xl shadow p-4 flex gap-6 mb-4 bg-white">
      <div className="relative w-30 h-30 lg:w-32 lg:h-32">
        <Image
          src={favorite.listing_img}
          alt={favorite.listing_name}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex-1">
        <h2 className="lg:text-xl text-[18.3px] font-semibold">
          {favorite.listing_name}
        </h2>
        <p className="mt-3 text-gray-600 lg:text-[16px] text-[13px]">
          {favorite.listing_id}
        </p>
      </div>
      {/* <p className="font-bold mt-2">
        ₦{Number(favorite.price).toLocaleString()}
      </p> */}
    </div>
  );
}
