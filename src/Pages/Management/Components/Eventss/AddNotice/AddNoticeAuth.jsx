import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, Image, Trash2, Plus, Bell } from "lucide-react";

function AddNoticeAuth() {
  const [notice, setNotice] = useState([]);
  const [formData, setFormData] = useState({
    event: "",
    date: "",
    time: "",
    posters: null,
  });
  const [csrfToken, setCsrfToken] = useState("");
  const [message, setMessage] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      posters: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("event", formData.event);
    form.append("date", formData.date);
    form.append("time", formData.time);
    if (formData.posters) {
      form.append("posters", formData.posters);
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/authority/add-notice/`,
        {
          method: 'POST',
          body: form,
          headers: {
            "X-CSRFToken": csrfToken,
          },
          credentials: 'include',
        }
      );

      const data = await response.json();
      setMessage(data.message);
      setFormData({ event: "", date: "", time: "", posters: null });
      fetchImages();
    } catch (error) {
      setMessage("Failed to add notice. Please try again.");
      console.error("Error:", error);
    }
  };

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/dashboard/get-notice/`
      );
      const data = await response.json();
      setNotice(data.notices);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDelete = async (noticeId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/authority/delete-notice/${noticeId}/`,
        {
          method: 'DELETE',
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          credentials: 'include',
        }
      );

      const data = await response.json();
      setMessage(data.message || "Notice deleted successfully.");
      fetchImages();
    } catch (error) {
      console.error("Error deleting notice:", error);
      setMessage("Failed to delete notice. Please try again.");
    }
  };

  const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-1 pt-3 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

      {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-2 ">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-2xl mt-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  School Notices
                </h1>

                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Manage and Create School Notices efficiently
                </p>
              </div>
            </div>
          </div>
        </div>




        {/* Add Notice Form */}
        <div className="max-w-7xl mx-auto p-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-base md:text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Add New Notice
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  name="event"
                  value={formData.event}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Image className="inline w-4 h-4 mr-1" />
                  Upload Poster (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    name="posters"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="text-sm w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Notice
              </button>
            </form>
          </div>
        </div>
 {/* Alert Message */}
        {message && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow-lg">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-500 font-medium">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notices Grid */}
        <div className="mb-8">
          <h2 className="text-base md:text-2xl font-bold text-center text-blue-600 mb-3 mt-3">
            Current Notices
          </h2>

          {notice.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
              {notice.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(item.posters)}
                      alt={item.event}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2 pb-3">
                    <h3 className="text-xs font-bold text-gray-800 md:text-lg mb-2 line-clamp-2">
                      {item.event || "No description available."}
                    </h3>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span><br />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mt-1" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notices Yet</h3>
                <p className="text-gray-500">Start by creating your first notice above.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddNoticeAuth;