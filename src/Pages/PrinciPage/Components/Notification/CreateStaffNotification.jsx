import React, { useState, useEffect } from "react";
import { Bell, Upload, Mic, FileText, Send, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
// Mock axios for demonstration - replace with actual axios import


function CreateStaffNotification() {

  const [csrfToken, setCsrfToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch CSRF token
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

  const [notification, setNotification] = useState({
    text: "",
    image: null,
    voice: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification({ ...notification, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNotification({ ...notification, [name]: files[0] });
  };

  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData();
    formData.append("text", notification.text);
    if (notification.image) formData.append("image", notification.image);
    if (notification.voice) formData.append("voice", notification.voice);

    try {
      const response = await axios.post(
        `${backendUrl}/api/principal/create-notification/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );

      console.log("Notification Created:", response.data);
      setSubmitStatus({ type: 'success', message: 'Notification created successfully!' });

      // Reset form after successful submission
      setTimeout(() => {
        setNotification({ text: "", image: null, voice: null });
        setSubmitStatus(null);
      }, 2000);

    } catch (error) {
      console.error("Error creating notification:", error);
      let errorMessage = "Failed to create notification";

      if (error.response) {
        errorMessage = error.response.data.error || error.response.data || errorMessage;
      } else {
        errorMessage = error.message;
      }

      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
                {/* Header */}
            <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                      <Bell className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Create Staff Notification
                      </h1>

                      <p className="text-sm text-gray-600 mt-1 ms-2">
                       Send important updates and announcements to Teachers
                      </p>
                    </div>
                  </div>
                </div>
              </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-8 py-6">
            <h2 className="text-base md:text-2xl font-semibold text-white flex items-center">
              <FileText className="w-6 h-6 mr-3" />
              Notification Details
            </h2>
          </div>

          <div className="p-8 space-y-8">


            {/* Text Input Section */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-700 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Notification Message
                <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
              </label>
              <div className="relative">
                <textarea
                  name="text"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                  rows={6}
                  value={notification.text}
                  onChange={handleChange}
                  placeholder="Type your notification message here..."
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {notification.text.length} characters
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-700 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-green-600" />
                  Attach Image
                  <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">
                      {notification.image ? notification.image.name : "Click to upload image"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 1MB</span>
                  </div>
                </div>
              </div>

              {/* Voice Upload */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-700 flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-purple-600" />
                  Attach Voice Note
                  <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="voice"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="audio/*"
                  />
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200">
                    <Mic className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">
                      {notification.voice ? notification.voice.name : "Click to upload voice note"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">MP3, WAV, M4A up to 2MB</span>
                  </div>
                </div>
              </div>
            </div>
{/* Status Messages */}
            {submitStatus && (
              <div className={`rounded-lg p-4 border flex items-center space-x-3 ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="font-medium">{submitStatus.message}</span>
              </div>
            )}
            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={handleSubmitStaff}
                disabled={isSubmitting || (!notification.text && !notification.image && !notification.voice)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Notification...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="text-xs ">Send Notification</span>
                  </>
                )}
              </button>

              {!notification.text && !notification.image && !notification.voice && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Please add at least one form of content (text, image, or voice) to create a notification
                </p>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default CreateStaffNotification;