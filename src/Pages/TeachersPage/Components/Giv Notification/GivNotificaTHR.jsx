import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Bell,
  Send,
  CheckCircle,
  AlertCircle,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import DeleteNotifiTCHR from "./DeleteNotifiTCHR";

function GivNotificaTHR() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [notificationText, setNotificationText] = useState("");
  const [notificationImage, setNotificationImage] = useState(null);
  const [notificationVoice, setNotificationVoice] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const teacherDetails = JSON.parse(localStorage.getItem("teacher"));
  const [csrfToken, setCsrfToken] = useState("");

const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/teachers/csrf-token/`,
          {
            withCredentials: true,
          }
        );

        if (data?.csrfToken) {
          setCsrfToken(data.csrfToken);
        } else {
          console.warn("No CSRF token received.");
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    getCsrfToken();
  }, [backendUrl]);

  useEffect(() => {
    if (teacherDetails && teacherDetails.class_charges) {
      setAllClasses(teacherDetails.class_charges);
    }
  }, [teacherDetails]);

  // Log selectedClass whenever it changes
  useEffect(() => {
    console.log("Selected class updated:", selectedClass);
  }, [selectedClass]);

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setError(""); // Reset error on new selection
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      setError("Please select a class first.");
      return;
    }

    const formData = new FormData();
    formData.append("text", notificationText);
    formData.append("image", notificationImage);
    formData.append("voice", notificationVoice);

    try {
      const response = await axios.post(
        `${backendUrl}/api/teachers/add-class-notification/${selectedClass.class_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken, // Include CSRF token
          },
          withCredentials: true, // Send cookies (authentication)
        }
      );

      if (response.status === 201) {
        setSuccess("Notification sent successfully!");
        setNotificationText("");
        setNotificationImage(null);
        setNotificationVoice(null);
      }
    } catch (err) {
      console.error("Error creating notification:", err);
      setError(
        err.response?.data?.error ||
          "Failed to send notification. Please try again."
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNotificationImage(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleVoiceChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setNotificationVoice(file);
    } else {
      setError("Please upload a valid audio file.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-1 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="md:text-2xl text-base font-bold text-blue-600">
                Create Notifications
              </h1>
              <p className="text-sm text-gray-600">
                Give class Notifications for your Students
              </p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div className="text-green-700">{success}</div>
          </div>
        )}

        {/* Class Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="w-6 h-6 text-white" />
              <h2 className="mt-2 text-base md:text-xl font-semibold text-white">
                Select a Class
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {allClasses.map((classData, index) => (
                <button
                  key={index}
                  onClick={() => handleClassSelect(classData)}
                  className={`group relative overflow-hidden rounded-xl p-2 md:p-4 font-medium transition-all duration-300 ${
                    selectedClass === classData
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="text-sm opacity-80 ">Class</div>
                    <div className="text-sm font-bold">
                      {classData.class_name}
                    </div>
                  </div>
                  {selectedClass !== classData && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Form */}
        {selectedClass && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mt-3 p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              <h2 className="text-sm md:text-xl font-semibold text-blue-600">
                Create Notification for {selectedClass.class_name}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Text Input */}
              <div className="mb-3">
                <label
                  htmlFor="notificationText"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Notification Text
                </label>
                <textarea
                  id="notificationText"
                  className=" text-sm  w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  rows="3"
                  placeholder="Type your notification message here..."
                  value={notificationText}
                  onChange={(e) => setNotificationText(e.target.value)}
                ></textarea>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="mb-3">
                  <label
                    htmlFor="notificationImage"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Upload Image (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="notificationImage"
                      className="text-sm w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* Voice Upload */}
                <div className="mb-3">
                  <label
                    htmlFor="notificationVoice"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Upload Voice File (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="notificationVoice"
                      className="text-sm  w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      accept="audio/*"
                      onChange={handleVoiceChange}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Notifications Component */}
      </div>
      <DeleteNotifiTCHR />
    </div>
  );
}

export default GivNotificaTHR;
