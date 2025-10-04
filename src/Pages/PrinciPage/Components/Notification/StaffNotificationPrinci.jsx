import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaRegEye, FaComments } from "react-icons/fa";

function StaffNotificationPrinci() {
  const [notifications, setNotifications] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [replays, setReplays] = useState([]);
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

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

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = () => {
      axios
        .get(`${backendUrl}/api/principal/get-notification/`, {
          withCredentials: true,
        })
        .then((response) => {
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
          alert("Error fetching notifications");
        });
    };

    fetchNotifications();
  }, [backendUrl]);

  const fetchViewers = (notificationId) => {
    axios
      .get(`${backendUrl}/api/principal/get-viewer/${notificationId}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.viewers) {
          setViewers(response.data.viewers);
          console.log('views list is',viewers)
        } else {
          setViewers([]);
        }
        setShowViewerModal(true);
      })
      .catch((error) => {
        console.error("Error fetching viewers:", error);
        alert("Error fetching viewers");
      });
  };

  const fetchReplays = (notificationId) => {
    axios
      .get(`${backendUrl}/api/principal/get-replay/${notificationId}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.replays) {
          setReplays(response.data.replays);
        } else {
          setReplays([]);
        }
        setShowReplayModal(true);
      })
      .catch((error) => {
        console.error("Error fetching replays:", error);
        alert("Error fetching replays");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      axios
        .delete(`${backendUrl}/api/principal/delete-notification/${id}/`, {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        })
        .then(() => {
          // Refetch notifications after delete
          axios
            .get(`${backendUrl}/api/principal/get-notification/`, {
              withCredentials: true,
            })
            .then((response) => {
              setNotifications(response.data);
            })
            .catch((error) => {
              console.error("Error refreshing notifications:", error);
            });
        })
        .catch((error) => {
          console.error("Error deleting notification:", error);
          alert("Error deleting notification");
        });
    }
  };

  const closeViewerModal = () => {
    setShowViewerModal(false);
    setViewers([]);
  };

  const closeReplayModal = () => {
    setShowReplayModal(false);
    setReplays([]);
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">

    {/* Notifications List */}
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
      <div className="p-4">
        <h3 className="text-base md:text-2xl font-bold text-blue-600 mb-6">
          Recent Notifications
        </h3>

        {notifications.length > 0 ? (
          <div className="space-y-6">
            {notifications.map((noti, index) => (
              <div key={noti.id} className="relative">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {/* Left border indicator */}
                  <div className={`absolute left-0 top-0 h-full w-1 ${noti.seen ? 'bg-gradient-to-b from-emerald-400 to-emerald-600' : 'bg-gradient-to-b from-amber-400 to-orange-500'}`}></div>

                  <div className="p-6 pl-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        {/* Serial Number */}
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                            #{index + 1}
                          </span>
                        </div>

                        <p className="text-gray-800 text-lg leading-relaxed font-medium mb-5 mt-5">
                          {noti.text}
                        </p>

                        <div className="flex items-center text-gray-500 space-x-6">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs md:text-sm">{noti.date}</span>
                          </div>

                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-6">
                        {/* View Readers Button + Count */}
                        <button
                          className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                          onClick={() => fetchViewers(noti.id)}
                          title="View Readers"
                        >
                          {noti.seen ? <FaEye size={18} /> : <FaRegEye size={18} />}
                          <span className="absolute -top-2 -right-2 bg-white text-indigo-600 text-xs font-bold rounded-full px-2 py-0.5 shadow">
                            {noti.viewerCount || 0}
                          </span>
                        </button>

                        {/* View Replies Button + Count */}
                        <button
                          className="relative w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                          onClick={() => fetchReplays(noti.id)}
                          title="View Replies"
                        >
                          <FaComments size={18} />
                          <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold rounded-full px-2 py-0.5 shadow">
                            {noti.replyCount || 0}
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                          onClick={() => handleDelete(noti.id)}
                          title="Delete Notification"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-gray-400">
              📭
            </div>
            <h4 className="text-xl font-semibold text-gray-600 mb-2">No notifications found</h4>
            <p className="text-gray-500">New notifications will appear here</p>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Viewer Modal */}
  {showViewerModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                👀
              </div>
              <h4 className="text-xl font-semibold">
                Notification Viewers ({viewers.length})
              </h4>
            </div>
            <button
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              onClick={closeViewerModal}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {viewers.length > 0 ? (
            <div className="space-y-4">
              {viewers.map((viewer, idx) => (
                <div key={viewer.teacher_id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300 hover:translate-x-2">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}.</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                      {viewer.teacher_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow">
                      <h6 className="font-semibold text-gray-800 mb-1">
                        {viewer.teacher_name}
                      </h6>
                      <p className="text-gray-500 text-sm">
                        Viewed at: {new Date(viewer.read_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-gray-400">
                👤
              </div>
              <h5 className="text-lg font-semibold text-gray-600 mb-2">No viewers yet</h5>
              <p className="text-gray-500">This notification hasn't been viewed by anyone</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )}

  {/* Reply Modal */}
  {showReplayModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                💬
              </div>
              <h4 className="text-xl font-semibold">
                Notification Replies ({replays.length})
              </h4>
            </div>
            <button
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              onClick={closeReplayModal}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {replays.length > 0 ? (
            <div className="space-y-4">
              {replays.map((replay, idx) => (
                <div key={replay.teacher_id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300 hover:translate-x-2">
                  <div className="flex items-start">
                    <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}.</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4 flex-shrink-0">
                      {replay.teacher.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow">
                      <h6 className="font-semibold text-gray-800 mb-2">
                        {replay.teacher.name}
                      </h6>
                      <div className="bg-gray-50 rounded-xl p-4 mb-2 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed">
                          {replay.replay}
                        </p>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Replied at: {new Date(replay.reply_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-gray-400">
                💭
              </div>
              <h5 className="text-lg font-semibold text-gray-600 mb-2">No replies yet</h5>
              <p className="text-gray-500">No one has replied to this notification</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>


  );
}

export default StaffNotificationPrinci;