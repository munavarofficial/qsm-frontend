import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../HomePage/Components/Footer/Footer";
import axios from "axios";
import { Bell, LogOut } from "lucide-react";

function TeachersPage() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
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
    const storedTeacher = localStorage.getItem("teacher");

    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/teachers/logout/`,
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("management"); // ✅ Remove session data
        localStorage.removeItem("student"); // ✅ Remove session data
        localStorage.removeItem("teacher"); // ✅ Remove session data
        localStorage.removeItem("principal"); // ✅ Remove session data
        navigate("/teacherlogin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const goNotification = () => navigate("/teacher-notification");
  const profile = () => navigate("/teacherprofile");
  const checkattendnace = () => navigate("/teacher-attendnace");
  const studentsInfo = () => navigate("/students-info-teacher");
  const markAtte = () => navigate("/mark-attendance-teacher");
  const checkAtte = () => navigate("/check-std-attendance-teacher");
  const checkprogress = () => navigate("/check-std-progress-teacher");
  const addtimetable = () => navigate("/add-timetable-teacher");
  const givNotification = () => navigate("/give-notification-teacher");
  const dailyRoutine = () => navigate("/daily-routine");
  const classRoom = () => navigate("/classroom-teacher");
  const chatbot = () => navigate("/chat-bot-teacher");
  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          right: "13px",
          zIndex: 9999,
        }}
        onClick={chatbot}
      >
        <img
          src="/media/icons/chat-bot.png"
          alt="Chatbot"
          style={{
            width: "50px",
            height: "50px",
            cursor: "pointer",
            borderRadius: "50%",
            boxShadow: "0 6px 16px rgba(38, 39, 41)",
            backgroundColor: "#222324",
          }}
        />
      </div>
      {/* Header Section */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b rounded-xl border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-3  sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-1">
              <div>
                <h1 className="md:text-4xl text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Edusafa
                </h1>
                <p className="text-xs md:text-sm text-gray-600">Teachers Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={goNotification}
                className="relative p-3 bg-white rounded-full shadow-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <Bell className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
              </button>

              <button
                onClick={handleLogout}
                className="p-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <LogOut className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {/* Principal Details Section */}
        <div className="mb-8" onClick={profile}>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                  <img
                    src={
                      teacher?.image
                        ? getImageUrl(teacher.image)
                        : "/media/icons/default-avatar.png"
                    }
                    alt="Principal Avatar"
                    className="h-full w-full rounded-full object-cover bg-white"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
                  Welcome,
                </h2>
                <h3 className=" text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {teacher?.name || "No Name Available"}
                </h3>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium shadow-lg">
                    🎓 Teacher
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-700 text-sm font-medium shadow-md">
                    📍 Place: {teacher?.place || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Functional Cards Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={classRoom}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🏫
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Check Class Rooms
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-blue-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={checkattendnace}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                ✅
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Check My Attendance
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-green-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={markAtte}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                📝
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Mark Student's Attendance
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-orange-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={checkAtte}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                👨‍🏫
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Check Student's Attendance
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-purple-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={studentsInfo}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                👤
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Check Student's Info
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-indigo-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={checkprogress}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Progress Report
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-green-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={addtimetable}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🗓️
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Add TimeTable
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-pink-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={givNotification}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🔔
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Add Class Notification
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-teal-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={dailyRoutine}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                📝
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                Daily Routine
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-green-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={chatbot}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🧠
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                EduBot
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-blue-400 transition-all duration-300"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TeachersPage;
