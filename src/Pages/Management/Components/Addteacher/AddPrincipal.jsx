import React, { useState, useEffect } from "react";
import axios from "axios";

function AddPrincipal() {
  const [principalData, setPrincipalData] = useState({
    name: "",
    dob: "",
    phone_no: "",
    place: "",
    reg_no: "",
    password: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [csrfToken, setCsrfToken] = useState(""); // ✅ Store CSRF token

const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // ✅ Fetch CSRF Token on Mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/authority/csrf-token/`,
          {
            credentials: "include", // ✅ Ensures CSRF cookie is set
          }
        );
        const data = await response.json();
        setCsrfToken(data.csrfToken); // ✅ Store CSRF token in state
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrincipalData({
      ...principalData,
      [name]: value,
    });
  };

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPrincipalData({
      ...principalData,
      image: file,
    });
    setImagePreview(URL.createObjectURL(file)); // Show preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in principalData) {
      formData.append(key, principalData[key]);
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/authority/add-new-principal/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken, // ✅ Include CSRF token
          },
          withCredentials: true, // ✅ Ensures session authentication
        }
      );

      if (response.status === 201) {
        setMessage("Principal added successfully!");
        setPrincipalData({
          name: "",
          dob: "",
          phone_no: "",
          place: "",
          reg_no: "",
          image: null,
        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage(`Error: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 md:p-6 ">
      <div className="max-w-7xl mx-auto mt-4 rounded-lg ">
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 pt-4 p-3 rounded-xl mb-4">
            <h2 className="text-base md:text-2xl font-semibold text-white text-center">Teacher Registration Form</h2>
            <p className="text-sm text-blue-100 mt-1 text-center">Please provide accurate information for all fields</p>
          </div>

<form
  onSubmit={handleSubmit}
  encType="multipart/form-data"
  className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-3 space-y-6"
>
  <h2 className="text-base md:text-2xl font-bold text-gray-800 mb-6 text-center">
    Principal Registration
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column */}
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={principalData.name}
          onChange={handleChange}
          placeholder="Enter Name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="phone_no"
          name="phone_no"
          value={principalData.phone_no}
          onChange={handleChange}
          placeholder="Enter Phone"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">
          Place <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="place"
          name="place"
          value={principalData.place}
          onChange={handleChange}
          placeholder="Enter Place"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <div>
        <label htmlFor="reg_no" className="block text-sm font-medium text-gray-700 mb-1">
          Admission No <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="reg_no"
          name="reg_no"
          value={principalData.reg_no}
          onChange={handleChange}
          placeholder="Enter Admission with QSM"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="password"
          name="password"
          value={principalData.password}
          onChange={handleChange}
          placeholder="Enter Password with DOB"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-600"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 w-36 h-36 rounded-xl object-cover border border-gray-200 shadow-sm"
          />
        )}
      </div>
    </div>
  </div>

  {/* Message */}
  {message && (
    <div className="mt-4 p-4 rounded-lg border-l-4 border-purple-500 bg-blue-50 text-purple-800 flex items-center space-x-2">
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
        />
      </svg>
      <span className="text-sm sm:text-base">{message}</span>
    </div>
  )}

  {/* Submit Button */}
  <div className="text-center">
    <button
      type="submit"
      className="mt-4 text-white bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all font-semibold rounded-xl px-8 py-3 shadow-md"
    >
      Submit
    </button>
  </div>
</form>



    </div>
      </div>
  );
}

export default AddPrincipal;
