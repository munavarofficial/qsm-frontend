import React, { useCallback, useEffect, useState } from "react";
import { User2 } from "lucide-react";

function AddManagementAuth() {
  const [management, setManagement] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    number: "",
    position: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/authority/csrf-token/`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  const fetchManagement = useCallback(async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/authority/get-management/`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch management");
      const data = await response.json();
      console.log("Fetched Data:", data);
      setManagement(data.data);
    } catch (error) {
      console.error("Failed to fetch management", error);
    }
  }, [backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: file,
    }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/authority/add-management/`,
        {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: data,
        }
      );

      if (!response.ok) throw new Error("Failed to add management");
      const result = await response.json();
      setMessage(result.message);
      setFormData({
        name: "",
        place: "",
        number: "",
        position: "",
        image: null,
      });
      setPreview(null);
      fetchManagement();
    } catch (error) {
      setMessage(error.message || "Failed to add management.");
    }
  };

  const handleDelete = async (management_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this management? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/authority/delete-management/${management_id}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete management");
      setMessage("Management deleted successfully");
      fetchManagement();
    } catch (error) {
      setMessage(error.message || "Failed to delete management.");
    }
  };

  useEffect(() => {
    fetchManagement();
  }, [fetchManagement]);

  const getPositionIcon = (position) => {
    const pos = position.toLowerCase();
    if (pos.includes("principal") || pos.includes("director")) return "🎓";
    if (pos.includes("manager") || pos.includes("head")) return "👔";
    if (pos.includes("secretary") || pos.includes("admin")) return "📋";
    if (pos.includes("teacher") || pos.includes("faculty")) return "👨‍🏫";
    return "👤";
  };

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-1">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <User2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-2xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Add Management
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Add and manage your institution's leadership team
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Management Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center  mb-8">
                <h2 className="text-base  font-bold text-blue-600">
                  Add New Management
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      👤 Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📍 Place
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="Enter location"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📞 Contact Number
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="Enter contact number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💼 Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="Enter position/role"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    placeholder="Enter Password With DOB"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📷 Profile Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  {preview && (
                    <div className="mt-4 text-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200 shadow-lg"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Add Member
                </button>
                {message && (
                  <div
                    className={`p-4 rounded-xl mb-6 ${
                      message.includes("successfully")
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">
                        {message.includes("successfully") ? "✅" : "❌"}
                      </span>
                      {message}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Management List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-base md:text-xl font-bold text-blue-600">
                  Management Team
                </h3>
              </div>

              {management.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-lg">No management records available</p>
                    <p className="text-sm mt-2">
                      Add your first management member to get started
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {management.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <span className="mr-2">
                              {getPositionIcon(item.position)}
                            </span>
                            {item.position}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 flex-shrink-0"
                          title="Delete member"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddManagementAuth;
