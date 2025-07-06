"use client";
import { useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import { BedDouble, X, CheckCircle2, Upload, Link } from "lucide-react";
import Image from "next/image";

export default function InsertRoomModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    room_number: "",
    room_id: "",
    room_type: "Basic",
    price_per_night: "",
    capacity: "1",
    amenities: "",
    status: "available",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState("url");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({ ...prev, image_url: "" }));
    }
  };

  const uploadImageToSupabase = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `room-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from("room-images")
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("room-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let imageUrl = formData.image_url;

      // Handle file upload if method is file and file is selected
      if (uploadMethod === "file" && imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile);
      }

      const { error } = await supabase.from("rooms").insert([
        {
          ...formData,
          price_per_night: Number(formData.price_per_night),
          capacity: Number(formData.capacity),
          amenities: formData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          image_url: imageUrl, // Set the image URL (either from input or upload)
        },
      ]);

      if (error) throw error;

      // Reset form
      setFormData({
        room_number: "",
        room_id: "",
        room_type: "Basic",
        price_per_night: "",
        capacity: "1",
        amenities: "",
        status: "available",
        image_url: "",
      });
      setImageFile(null);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || "Failed to add room");
      console.error("Insert error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Add Room Modal */}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  <option value="Luxury">Luxury</option>
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

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Image
              </label>

              <div className="flex space-x-2 mb-3">
                <button
                  type="button"
                  onClick={() => setUploadMethod("url")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    uploadMethod === "url"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Link className="w-4 h-4 mr-1" />
                  Use URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod("file");
                    fileInputRef.current?.click();
                  }}
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    uploadMethod === "file"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {uploadMethod === "url" ? (
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  {imageFile ? (
                    <div className="space-y-2">
                      <Image
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="max-h-40 mx-auto rounded-md"
                      />
                      <p className="text-sm text-gray-600">{imageFile.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          fileInputRef.current.value = "";
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rest of your form fields... */}

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

      {/* Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Room Added Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                The new room has been added to the database.
              </p>
              <button
                onClick={closeSuccessModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
