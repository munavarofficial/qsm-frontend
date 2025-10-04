import React, { useState, useEffect } from "react";
import axios from "axios";

function AddMemorial() {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [image, setImage] = useState(null);
  const [deathDate, setDeathDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null); // ✅ for preview

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/authority/csrf-token/`, {
          credentials: "include",
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("place", place);
    formData.append("deathDate", deathDate); // ✅ include date
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/authority/add-memorial/`,
        formData,
        {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      );

      setMessage(`✅ ${response.data.message || "Memorial added successfully"}`);
      setName("");
      setPlace("");
      setDeathDate("");
      setImage(null);
      setPreview(null); // ✅ reset preview
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage(`❌ Error: ${error.response.data.message || "Failed to add memorial"}`);
      } else {
        setMessage("❌ Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // ✅ preview for drag-drop
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // ✅ preview for click-upload
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 flex items-center justify-center p-2">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Add Memorial</h2>
          <p className="text-gray-300 text-sm">Create a lasting tribute</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Place */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
              placeholder="Enter location"
              required
            />
          </div>

          {/* Death Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Death</label>
            <input
              type="date"
              value={deathDate}
              onChange={(e) => setDeathDate(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Memorial Image</label>
            <div
              className={`relative border-2 border-dashed ${
                dragActive ? "border-violet-400 bg-violet-500/10" : "border-white/30"
              } rounded-xl p-6 text-center`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {preview ? (
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-violet-400 shadow-lg"
                  />
                  <span className="text-green-400 font-medium">{image?.name}</span>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300">
                    <span className="text-violet-400 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-gray-500 text-xs">PNG, JPG, GIF up to 1MB</p>
                </div>
              )}
            </div>
          </div>
  {/* Message */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-xl border ${
              message.includes("✅")
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <p className="text-center font-medium">{message}</p>
          </div>
        )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="text-base w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl "
          >
            {loading ? "Creating Memorial..." : "Add Memorial"}
          </button>
        </form>


      </div>
    </div>
  );
}

export default AddMemorial;
