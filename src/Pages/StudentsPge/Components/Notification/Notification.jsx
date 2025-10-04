import React, { useEffect, useState } from "react";

// Mock icons since we can't import react-icons
const FaCalendarAlt = () => <span className="text-lg">📅</span>;
const FaClock = () => <span className="text-lg">🕐</span>;
const FaImage = () => <span className="text-lg">🖼️</span>;
const FaVolumeUp = () => <span className="text-lg">🔊</span>;
const FaCheck = () => <span className="text-lg">✓</span>;
const FaBell = () => <span className="text-2xl">🔔</span>;
const FaUsers = () => <span className="text-lg">👥</span>;
const FaGraduationCap = () => <span className="text-lg">🎓</span>;

function Notification() {
  const [publicNotifications, setPublicNotifications] = useState([]);
  const [classNotifications, setClassNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readClsNotifications, setReadClsNotifications] = useState([]);
  const [readPublicNotifications, setReadPublicNotifications] = useState([]);

  const studentDetails = JSON.parse(localStorage.getItem("student") || "{}");
  const classId = studentDetails?.std;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch Public Notifications
        const publicResponse = await fetch(
          `${backendUrl}/api/students/public-notification/`,
          { credentials: 'include' }
        );
        const publicData = await publicResponse.json();
        setPublicNotifications(publicData);
      } catch (error) {
        console.error("Error fetching public notifications:", error);
      }

      // Fetch Class Notifications
      if (classId) {
        try {
          const classResponse = await fetch(
            `${backendUrl}/api/students/class-notification/${classId}/`,
            { credentials: 'include' }
          );
          const classData = await classResponse.json();
          setClassNotifications(classData.notifications);
        } catch (error) {
          console.error("Error fetching class notifications:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [classId, backendUrl]);

  // Load read notifications from local storage on component mount
  useEffect(() => {
    const storedReadClsNotifications =
      JSON.parse(localStorage.getItem("readClsNotifications")) || [];
    setReadClsNotifications(storedReadClsNotifications);

    const storedReadPublicNotifications =
      JSON.parse(localStorage.getItem("readPublicNotifications")) || [];
    setReadPublicNotifications(storedReadPublicNotifications);
  }, []);

  const markClsAsRead = async (id) => {
    if (!readClsNotifications.includes(id)) {
      const updatedReadClsNotifications = [...readClsNotifications, id];
      setReadClsNotifications(updatedReadClsNotifications);
      localStorage.setItem(
        "readClsNotifications",
        JSON.stringify(updatedReadClsNotifications)
      );

      try {
        // Step 1: Fetch CSRF token
        const csrfResponse = await fetch(
          `${backendUrl}/api/students/csrf-token/`,
          { credentials: 'include' }
        );
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.csrfToken;

        // Step 2: Mark notification as read using POST
        const response = await fetch(
          `${backendUrl}/api/students/read-clas-notification/${id}/${studentDetails.id}/`,
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({})
          }
        );
        const data = await response.json();

        console.log("Class notification marked as read:", data);
      } catch (error) {
        console.error("Error marking class notification as read:", error);
      }
    }
  };

  const markPublicAsRead = async (id) => {
    if (!readPublicNotifications.includes(id)) {
      const updatedReadPublicNotifications = [
        ...readPublicNotifications,
        id,
      ];
      setReadPublicNotifications(updatedReadPublicNotifications);
      localStorage.setItem(
        "readPublicNotifications",
        JSON.stringify(updatedReadPublicNotifications)
      );

      try {
        // Step 1: Get CSRF token
        const csrfResponse = await fetch(
          `${backendUrl}/api/students/csrf-token/`,
          { credentials: 'include' }
        );
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.csrfToken;

        // Step 2: Mark notification as read
        const response = await fetch(
          `${backendUrl}/api/students/read-public-notification/${id}/${studentDetails.id}/`,
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({})
          }
        );
        const data = await response.json();

        console.log("Public notification marked as read:", data);
      } catch (error) {
        console.error("Error marking public notification as read:", error);
      }
    }
  };

  const NotificationCard = ({ notification, isRead, onMarkAsRead, type }) => (
    <div className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${!isRead ? 'border-l-4 border-blue-500 bg-blue-50/30' : ''}`}>
      {/* Unread indicator */}
      {!isRead && (
        <div className="absolute top-4 left-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      )}

      <div className="p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium ${type === 'class' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
            {type === 'class' ? <FaGraduationCap /> : <FaUsers />}
            <span>{type === 'class' ? 'Class' : 'Public'}</span>
          </div>
          {isRead && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <FaCheck />
              <span>Read</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed">
            {notification.text || "No content available"}
          </p>
        </div>

        {/* Media */}
        {notification.image && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-center gap-2 mb-3 text-gray-600 font-medium">
              <FaImage />
              <span>Attachment</span>
            </div>
            <img
              src={getImageUrl(notification.image)}
              alt="Notification attachment"
              className="w-full max-w-sm h-auto rounded-lg shadow-sm"
            />
          </div>
        )}

        {notification.voice && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center gap-2 mb-3 text-gray-600 font-medium">
              <FaVolumeUp />
              <span>Audio Message</span>
            </div>
            <audio controls className="w-full h-10">
              <source src={notification.voice} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FaCalendarAlt />
              {notification.date}
            </span>
            <span className="flex items-center gap-1">
              <FaClock />
              {notification.time}
            </span>
          </div>

          {!isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const totalUnread = (classNotifications.length - readClsNotifications.length) +
                     (publicNotifications.length - readPublicNotifications.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-1">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className=" px-8 py-6 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl backdrop-blur-sm">
                  <FaBell />
                </div>
                <div>
                  <h1 className="md:text-xl text-base ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                  <p className="text-gray-600 text-sm">Stay updated with school announcements</p>
                </div>
              </div>
              {totalUnread > 0 && (
                <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
                  <span className="font-semibold">{totalUnread} Unread</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Class Notifications */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaGraduationCap />
                  <span className="text-sm md:text-xl font-semibold">Class Notifications</span>
                </div>
                {classNotifications.length - readClsNotifications.length > 0 && (
                  <div className="bg-white/30 px-3 py-1 rounded-full text-sm font-medium">
                    {classNotifications.length - readClsNotifications.length}
                  </div>
                )}
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {classNotifications.length > 0 ? (
                <div className="p-2 space-y-2">
                  {classNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      isRead={readClsNotifications.includes(notification.id)}
                      onMarkAsRead={markClsAsRead}
                      type="class"
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Class Notifications</h3>
                  <p className="text-gray-500">You're all caught up! Check back later for class updates.</p>
                </div>
              )}
            </div>
          </div>

          {/* Public Notifications */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-purple-600 to-blue-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaUsers />
                  <span className="text-sm md:text-xl font-semibold">Public Notifications</span>
                </div>
                {publicNotifications.length - readPublicNotifications.length > 0 && (
                  <div className="bg-white/30 px-3 py-1 rounded-full text-sm font-medium">
                    {publicNotifications.length - readPublicNotifications.length}
                  </div>
                )}
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {publicNotifications.length > 0 ? (
                <div className="p-2 space-y-2">
                  {publicNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      isRead={readPublicNotifications.includes(notification.id)}
                      onMarkAsRead={markPublicAsRead}
                      type="public"
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📢</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Public Notifications</h3>
                  <p className="text-gray-500">No school-wide announcements at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;