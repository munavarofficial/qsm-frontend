import React, { useState, useEffect, useCallback } from "react";
import {
  Eye,
  BookOpen,
  EyeOff,
  Trash2,
  X,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function DeleteNotifiTCHR() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [notification, setNotification] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewers, setViewers] = useState([]);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const teacherDetails = JSON.parse(localStorage.getItem("teacher") || "{}");
  const [csrfToken, setCsrfToken] = useState("");

const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/teachers/csrf-token/`, {
          credentials: "include",
        });
        const data = await response.json();

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

  const fetchClasNoti = useCallback(async () => {
    if (selectedClass) {
      try {
        const response = await fetch(
          `${backendUrl}/api/teachers/get-class-notification/${selectedClass.class_id}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setNotification(data.notifications);
      } catch (error) {
        console.log("Error fetching notifications:", error);
        setError("Failed to fetch notifications");
      }
    }
  }, [selectedClass, backendUrl]);

  useEffect(() => {
    fetchClasNoti();
  }, [selectedClass, fetchClasNoti]);

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setError("");
    setSuccess("");
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await fetch(
        `${backendUrl}/api/teachers/delete-class-notification/${notificationId}/`,
        {
          method: "DELETE",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
        }
      );
      setSuccess("Notification deleted successfully");
      setNotification(
        notification.filter((noti) => noti.id !== notificationId)
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.log("Error deleting notification:", error);
      setError("Failed to delete notification");
      setTimeout(() => setError(""), 3000);
    }
  };

  const fetchViewers = async (notificationId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/teachers/get-class-notification-viewer/${notificationId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data && data.viewers) {
        setViewers(data.viewers);
      } else {
        setViewers([]);
      }
      setShowViewerModal(true);
    } catch (error) {
      console.error("Error fetching viewers:", error);
      setError("Error fetching viewers");
      setTimeout(() => setError(""), 3000);
    }
  };

  const closeViewerModal = () => {
    setShowViewerModal(false);
    setViewers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50  mt-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="md:text-2xl text-base font-bold text-blue-600">
                Delete Notifications
              </h1>
              <p className="text-sm text-gray-600">
                Delete class Notifications
              </p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
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

        {/* Notifications List */}
        {selectedClass && notification.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                Notifications for Class {selectedClass.class_name}
              </h3>
              <p className="text-gray-600 mt-1">
                {notification.length} notification(s) found
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {notification.map((noti) => (
                <div
                  key={noti.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Notification Content */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <p className="text-gray-800 leading-relaxed">
                          {noti.text}
                        </p>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {noti.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {noti.time}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => fetchViewers(noti.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          noti.seen
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                        title="View readers"
                      >
                        {noti.seen ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteNotification(noti.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                        title="Delete notification"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedClass && notification.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Notifications Found
            </h3>
            <p className="text-gray-600">
              There are no notifications for {selectedClass.class_name} at the
              moment.
            </p>
          </div>
        )}

        {/* Viewer Modal */}
        {showViewerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-6 h-6 mr-3" />
                    <h2 className="text-xl font-semibold">
                      Notification Viewers
                    </h2>
                  </div>
                  <button
                    onClick={closeViewerModal}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {viewers.length > 0 ? (
                  <div className="space-y-4">
                    {viewers.map((viewer) => (
                      <div
                        key={viewer.teacher_id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1">
                              {viewer.student_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Viewed on{" "}
                              {new Date(viewer.read_at).toLocaleDateString()} at{" "}
                              {new Date(viewer.read_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <EyeOff className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No Viewers Yet
                    </h3>
                    <p className="text-gray-600">
                      This notification hasn't been viewed by any students yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={closeViewerModal}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeleteNotifiTCHR;
