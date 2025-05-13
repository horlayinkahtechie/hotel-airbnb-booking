import { Heart } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "../lib/supabase";
import Spinner from "./Spinner";

export default function AddToFavorite({ favorite }) {
  const { data: session } = useSession();
  const [loading, setIsLoading] = useState(false);

  const handleAddToFavorite = async () => {
    if (!session) {
      alert("Please log in first to add to favorites.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("favorite").insert([
        {
          email: session.user.email,
          listing_id: favorite.id,
          listing_name: favorite.name,
          listing_img: favorite.image,
          price_per_night: favorite.price,
        },
      ]);

      if (error) {
        console.log("Error inserting to favorite", error);
      } else {
        console.log("Favorite added to database successfully", data);
      }
    } catch (err) {
      console.error("Something went wrong", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <button
          className="absolute top-3 right-3 z-10 bg-white p-3 rounded-full shadow"
          disabled
        >
          <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </button>
      ) : (
        <button
          className={`absolute top-3 right-3 z-10 bg-white p-3 rounded-full shadow hover:bg-blue-600 hover:text-white transition flex items-center justify-center ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handleAddToFavorite}
          disabled={loading}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Heart className="h-6 w-6" />
          )}
        </button>
      )}
    </>
  );
}
