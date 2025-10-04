import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Upload,
  FileImage,
  Trash2,
  Camera,
  Book,
  Calendar,
  Plus,
} from "lucide-react";

function AddGalleryPrinci() {
  const [image, setImage] = useState(null);
  const [aboutEvents, setAboutEvents] = useState("");
  const [gallery, setGallery] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [csrfToken, setCsrfToken] = useState("");

const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/principal/csrf-token/`,
          { withCredentials: true }
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/dashboard/gallery/`);
      if (response.ok) {
        const data = await response.json();
        setGallery(data.gallery || data);
      } else {
        console.error(`Error fetching images: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

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
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      console.error("No image selected.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", aboutEvents);

    try {
      const response = await axios.post(
        `${backendUrl}/api/principal/add-gallery/`,
        formData,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        fetchImages();
        setImage(null);
        setAboutEvents("");
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } else {
        console.error("Error adding image:", response.data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/principal/delete-gallery/${imageId}/`,
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 204) {
        fetchImages();
      } else {
        console.error(`Error deleting image: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-1 mt-4 md:p-8">
         <div className="max-w-7xl mx-auto">
           {/* Header */}
           <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
             <div className="max-w-7xl mx-auto px-6 py-8">
               <div className="flex items-center space-x-2 ">
                 <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                   <Camera className="h-8 w-8 text-white" />
                 </div>
                 <div>
                   <h1 className="text-base md:text-3xl mt-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                     School Gallery
                   </h1>

                   <p className="text-xs md:text-sm text-gray-600 mt-1">
                     Capture and share memorable moments
                   </p>
                 </div>
               </div>
             </div>
           </div>

           <div className="max-w-7xl mx-auto p-1 space-y-8">
             {/* Upload Section */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                 <h2 className="text-base md:text-xl font-bold text-white flex items-center gap-2">
                   <Plus className="w-6 h-6" />
                   Add New Gallery
                 </h2>
               </div>

               {/* ✅ FIXED: Use <form> here */}
               <form onSubmit={handleSubmit} className="p-6 space-y-6">
                 {/* File Upload Area */}
                 <div
                   className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                     dragActive
                       ? "border-blue-400 bg-blue-50"
                       : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                   }`}
                   onDragEnter={handleDrag}
                   onDragLeave={handleDrag}
                   onDragOver={handleDrag}
                   onDrop={handleDrop}
                   onClick={() => fileInputRef.current?.click()}
                 >
                   <input
                     type="file"
                     ref={fileInputRef}
                     onChange={(e) => setImage(e.target.files[0])}
                     required
                     accept="image/*"
                     className="hidden"
                   />

                   {image ? (
                     <div className="space-y-4">
                       <img
                         src={URL.createObjectURL(image)}
                         alt="Preview"
                         className="mx-auto w-32 h-32 object-cover rounded-xl shadow-md"
                       />
                       <p className="text-sm font-medium text-gray-900">
                         {image.name}
                       </p>
                       <button
                         type="button"
                         onClick={(e) => {
                           e.stopPropagation();
                           setImage(null);
                           if (fileInputRef.current) {
                             fileInputRef.current.value = null;
                           }
                         }}
                         className="text-red-600 hover:text-red-700 font-medium"
                       >
                         Remove
                       </button>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                         <FileImage className="w-8 h-8 text-blue-600" />
                       </div>
                       <div>
                         <p className="text-lg font-medium text-gray-900">
                           Drop your image here
                         </p>
                         <p className="text-gray-500">or click to browse</p>
                       </div>
                       <p className="text-sm text-gray-400">
                         PNG, JPG, GIF up to 10MB
                       </p>
                     </div>
                   )}
                 </div>

                 {/* Event Description */}
                 <div className="space-y-2">
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                     <Book className="w-4 h-4" />
                     Event Description
                   </label>
                   <textarea
                     value={aboutEvents}
                     onChange={(e) => setAboutEvents(e.target.value)}
                     required
                     placeholder="Describe the event or occasion captured in this image..."
                     rows={3}
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
                   />
                 </div>

                 {/* Submit Button */}
                 <button
                   type="submit"
                   disabled={isUploading || !image}
                   className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   {isUploading ? (
                     <>
                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                       Uploading...
                     </>
                   ) : (
                     <>
                       <Upload className="w-5 h-5" />
                       Add to Gallery
                     </>
                   )}
                 </button>
               </form>
             </div>

             {/* Gallery Section */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <FileImage className="w-6 h-6 text-indigo-600" />
                     <h2 className="text-base md:text-xl font-semibold text-blue-600">
                       Gallery Collection
                     </h2>
                   </div>

                 </div>
               </div>

               <div className="p-2 pt-4">
                 {gallery.length > 0 ? (
                   <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-6">
                     {gallery.map((item, index) => (
                       <div
                         key={index}
                         className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                       >
                         <div className="relative overflow-hidden">
                           <img
                             src={getImageUrl(item.image)}
                             alt={item.title}
                             className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                           />
                           <div className="absolute inset-0 bg-opacity-400 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                             <button
                               onClick={() => handleDelete(item.id)}
                               className="opacity-900 group-hover:opacity-900 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 transform scale-90 hover:scale-100"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         </div>
                         <div className="p-4">
                           <div className="flex items-start gap-2">
                             <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                             <p className="text-sm text-gray-700 leading-relaxed">
                               {item.title || "No description available."}
                             </p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-16">
                     <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                       <FileImage className="w-12 h-12 text-gray-400" />
                     </div>
                     <h3 className="text-lg font-medium text-gray-900 mb-2">
                       No images yet
                     </h3>
                     <p className="text-gray-500">
                       Start building your school's gallery by uploading the first
                       image!
                     </p>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       </div>
  );
}

export default AddGalleryPrinci;
