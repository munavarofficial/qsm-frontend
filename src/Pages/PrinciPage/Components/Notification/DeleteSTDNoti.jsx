import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, X, Users, Bell, Calendar, Clock } from 'lucide-react';

function DeleteSTDNoti() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewers, setViewers] = useState([]);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/principal/csrf-token/`,
          { credentials: 'include' }
        );
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  // Fetch notifications
  useEffect(() => {
    const fetchClasNoti = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/principal/get-public-notifi/`,
          { credentials: 'include' }
        );
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to fetch notifications');
      }
    };

    fetchClasNoti();
  }, [backendUrl]);

  const handleDeleteNotification = async (notificationId) => {
    try {
      await fetch(
        `${backendUrl}/api/principal/delete-std-notification/${notificationId}/`,
        {
          method: 'DELETE',
          headers: {
            "X-CSRFToken": csrfToken,
          },
          credentials: 'include',
        }
      );
      setSuccess('Notification deleted successfully');
      setNotifications((prevNotifications) =>
        prevNotifications.filter((noti) => noti.id !== notificationId)
      );
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification');
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchViewers = async (notificationId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/principal/get-students-viewer/${notificationId}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (data && data.viewers) {
        setViewers(data.viewers);
      } else {
        setViewers([]);
      }
      setShowViewerModal(true);
    } catch (error) {
      console.error('Error fetching viewers:', error);
      setError('Error fetching viewers');
      setTimeout(() => setError(''), 3000);
    }
  };

  const closeViewerModal = () => {
    setShowViewerModal(false);
    setViewers([]);
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Student Notification
                      </h1>
              <p className="text-sm text-gray-600 mt-1">Manage notification delivery</p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">{success}</span>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <div
                key={noti.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        <p className="text-gray-800 text-lg leading-relaxed font-medium">
                          {noti.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{noti.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{noti.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      {/* View Status & Viewers Button */}
                      <button
                        onClick={() => fetchViewers(noti.id)}
                        className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                          noti.seen
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                        title="View readers"
                      >
                        {noti.seen ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                        <Users className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteNotification(noti.id)}
                        className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 flex items-center gap-2"
                        title="Delete notification"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
              <div className="p-4 bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notifications</h3>
              <p className="text-gray-500">No notifications are currently available</p>
            </div>
          )}
        </div>

        {/* Viewer Modal */}
        {showViewerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Notification Viewers</h2>
                </div>
                <button
                  onClick={closeViewerModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {viewers.length > 0 ? (
                  <div className="space-y-4">
                    {viewers.map((viewer, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">
                              {viewer.student_name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                Viewed: {new Date(viewer.read_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-4 bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Viewers Yet</h3>
                    <p className="text-gray-500">This notification hasn't been viewed by any students</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeleteSTDNoti;