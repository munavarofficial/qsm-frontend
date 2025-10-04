import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";


function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchGallery = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/gallery/`);
      console.log("API Response:", response.data); // Debugging the response
      setGallery(response.data.gallery); // Accessing the gallery array
    } catch (error) {
      console.error("Failed to fetch gallery data", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const closeModal = () => {
    setSelectedImage(null);
  };
// Handle both Cloudinary (http...) and local (/media/...) paths
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 px-4 py-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="relative mb-2">
            <div className="inline-flex items-center justify-center w-20 h-20  bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-8 shadow-2xl shadow-purple-500/50 animate-pulse">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl md:text-6xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Gallery
          </h1>

          <div className="relative">
            <h2 className="text-sm md:text-3xl font-bold text-gray-300 mb-8 tracking-wide">
              Capturing Memories & Celebrating Achievements
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-600 to-blue-600  rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="relative px-2 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto">
            <div className="grid grid-rows-2 grid-flow-col gap-2 sm:gap-3">
              {gallery.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer border border-white/60 w-36 sm:w-44 flex-shrink-0"
                  onClick={() => setSelectedImage(item)} // ✅ FIXED
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animation: "fadeInUp 0.5s ease-out forwards",
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Title */}
                  <div className="p-1.5">
                    <h3 className="text-xs font-semibold text-slate-800 text-center truncate">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {gallery.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full mb-8 shadow-2xl shadow-purple-500/50 animate-pulse mx-auto">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            No Images Yet
          </h3>
          <p className="text-gray-400 text-lg">
            Check back soon for new gallery updates!
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Holographic Border for Modal */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-60"></div>

            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
              <div className="relative">
                <img
              src={getImageUrl(selectedImage.image)}
                  alt={selectedImage.title}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <div className="p-8 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
                <div className="text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    {selectedImage.title}
                  </h2>
                  <div className="flex items-center justify-center text-gray-400 text-sm">
                    <span>School Event</span>
                  </div>

                  {/* Decorative Bottom */}
                  <div className="mt-6 flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
