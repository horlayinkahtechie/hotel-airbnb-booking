// app/_components/InsertRoomModal.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { BedDouble, X } from "lucide-react";

export default function InsertRoomModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    room_number: "",
    room_id: "",
    room_type: "Basic",
    price_per_night: "",
    capacity: "1",
    amenities: "",
    status: "available",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // In your handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("rooms").insert([
        {
          ...formData,
          price_per_night: Number(formData.price_per_night),
          capacity: Number(formData.capacity),
          amenities: formData.amenities.split(",").map((item) => item.trim()),
        },
      ]);

      if (error) throw error;

      setFormData({
        room_number: "",
        room_type: "standard",
        price_per_night: "",
        capacity: "1",
        amenities: "",
        status: "available",
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to add room");
      console.error("Insert error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <BedDouble className="text-blue-600" />
            <h2 className="text-xl font-semibold">Add New Room</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number *
            </label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room ID *
            </label>
            <input
              type="text"
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type *
            </label>
            <select
              name="room_type"
              value={formData.room_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="luxury">Luxury</option>
              {/* <option value="family">Family</option> */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Night (₦) *
            </label>
            <input
              type="number"
              name="price_per_night"
              value={formData.price_per_night}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity *
            </label>
            <select
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "person" : "people"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities (comma separated)
            </label>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="WiFi, AC, TV, Mini Bar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
