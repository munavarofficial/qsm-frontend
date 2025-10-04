import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  CheckCircle,
  Reply,
  Image as ImageIcon,
  Volume2
} from "lucide-react";

function TchrNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readNotifications, setReadNotifications] = useState([]);
  const [replies, setReplies] = useState({});
  const [existingReplies, setExistingReplies] = useState({});
  const [error, setError] = useState(null);
  const [isReplying, setIsReplying] = useState({});
  const [csrfToken, setCsrfToken] = useState("");

  const teacherDetails = JSON.parse(localStorage.getItem("teacher"));
  const teacher_id = teacherDetails?.id;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/teachers/csrf-token/`, {
          withCredentials: true
        });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to get CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/teachers/notification/`, {
          withCredentials: true
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch notifications");
        setLoading(false);
      }
    };

    fetchNotifications();

    const storedReadNotifications =
      JSON.parse(localStorage.getItem("readNotifications")) || [];
    setReadNotifications(storedReadNotifications);

    const storedReplies = JSON.parse(localStorage.getItem("replies")) || {};
    setExistingReplies(storedReplies);
  }, [teacher_id, backendUrl]);

  const markAsRead = async (id) => {
    if (readNotifications.includes(id)) return;

    const updatedReadNotifications = [...readNotifications, id];
    setReadNotifications(updatedReadNotifications);
    localStorage.setItem("readNotifications", JSON.stringify(updatedReadNotifications));

    try {
      await axios.post(
        `${backendUrl}/api/teachers/read-staff-notification/${id}/${teacher_id}/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
          },
          withCredentials: true
        }
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const toggleReplyInput = (id) => {
    setIsReplying((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReplySubmit = async (id) => {
    const replyText = replies[id];
    if (!replyText) {
      alert("Enter a reply.");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/teachers/submit-staff-replay/`,
        {
          replay: replyText,
          notification: id,
          teacher: teacher_id
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
          },
          withCredentials: true
        }
      );

      const updatedReplies = { ...replies, [id]: "" };
      setReplies(updatedReplies);

      const updatedExistingReplies = { ...existingReplies, [id]: replyText };
      setExistingReplies(updatedExistingReplies);

      localStorage.setItem("replies", JSON.stringify(updatedExistingReplies));
      setIsReplying((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply.");
    }
  };

  const unreadCount = notifications.filter(
    (n) => !readNotifications.includes(n.id)
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
        <div className="text-center text-white text-xl font-semibold">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-500 text-white text-xl font-semibold">
        {error}
      </div>
    );
  }
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-1 md:p-6">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="md:text-3xl text-base font-bold text-blue-600">
                Notification
              </h1>
              <p className="text-sm text-gray-600">Notification of Teachers</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white px-3 text-center py-2 rounded-full text-xs font-semibold animate-pulse">
              {unreadCount} New
            </div>
          )}
        </div>

        {/* Notifications list */}
        <div className="grid gap-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl p-6 shadow-lg ${
                readNotifications.includes(notification.id)
                  ? "bg-white border border-green-100"
                  : "bg-white border border-gray-100"
              }`}
            >
              <p className="text-gray-800 mb-4">
                {notification.text || "No message"}
              </p>

              {notification.image && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold">Attachment</span>
                  </div>
                  <img
                    src={getImageUrl(notification.image)}
                    alt="Attachment"
                    className="rounded-lg shadow w-full max-w-md"
                  />
                </div>
              )}

              {notification.voice && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Volume2 className="w-5 h-5" />
                    <span className="text-sm font-semibold">Voice Message</span>
                  </div>
                  <audio controls className="w-full">
                    <source
                      src={`${backendUrl}${notification.voice}`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />{" "}
                  {notification.date || "N/A"}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {notification.time || "N/A"}
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => markAsRead(notification.id)}
                  disabled={readNotifications.includes(notification.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                    readNotifications.includes(notification.id)
                      ? "bg-green-500"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {readNotifications.includes(notification.id) ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Read
                    </span>
                  ) : (
                    "Mark as Read"
                  )}
                </button>

                <button
                  onClick={() => toggleReplyInput(notification.id)}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                >
                  <Reply className="w-4 h-4" /> Reply
                </button>
              </div>

              {isReplying[notification.id] && (
                <div className="mb-4">
                  <textarea
                    rows={3}
                    placeholder="Write your reply..."
                    value={replies[notification.id] || ""}
                    onChange={(e) =>
                      setReplies({
                        ...replies,
                        [notification.id]: e.target.value
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                  />
                  <button
                    onClick={() => handleReplySubmit(notification.id)}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-green-500 hover:bg-green-600 text-white"
                  >
                    Submit Reply
                  </button>
                </div>
              )}

              {existingReplies[notification.id] && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-green-700 font-semibold mb-1">
                    Your Reply:
                  </div>
                  <p className="text-gray-700 italic">
                    {existingReplies[notification.id]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TchrNotification;
