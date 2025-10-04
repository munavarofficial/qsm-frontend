import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../HomePage/Components/Footer/Footer'
import { Bell, LogOut } from "lucide-react";
import axios from "axios";


function StudentsPage() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));

    } else {
      navigate("/studentlogin");
    }
  }, [navigate]);

  const profile = () => navigate("/studentsprofile");
  const studentsattendance = () => navigate("/studentattendance");
  const studentsProgress = () => navigate("/studentprogress");
  const contactTeacher = () => navigate("/contact-teacher");
  const checkTimeTable = () => navigate("/time-table");
  const classroom = () => navigate("/classroom");
  const checkRoutine = () => navigate("/check-my-routine");
  const markRoutine = () => navigate("/mark-my-routine");
  const goNotification = () => navigate("/student-notification");
  const chatbot = () => navigate("/chat-bot-student");
  useEffect(() => {

    const getCsrfToken = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/students/csrf-token/`,
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

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/students/logout/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("principal");
        localStorage.removeItem("management"); // ✅ Remove session data
        localStorage.removeItem("student"); // ✅ Remove session data
        localStorage.removeItem("teacher");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error(error)
    }
  };


const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
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
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-1">
              <div>
                <h1 className="md:text-4xl text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Edusafa
                </h1>
                <p className="text-sm text-gray-600">Parents Dashboard</p>
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
        <div className="mb-4" onClick={profile}>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border  border-white/20">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                  <img
                   src={
                      student?.image
                        ? getImageUrl(student.image)
                        : "/media/icons/default-avatar.png"
                    }
                    alt="Student Avatar"
                    className="h-full w-full rounded-full object-cover bg-white"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-xl  font-bold text-gray-800 mb-2">
                  Welcome,
                </h2>
                <h5 className="text-sm  ">Parent of</h5>
                <h3 className="text-xl md:text-3xl  font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {student?.name || "No Name Available"}
                </h3>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium shadow-lg">
                    🎓 Parents
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-700 text-sm font-medium shadow-md">
                    📍 Place: {student?.place || "Not Available"}
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
            onClick={classroom}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🏫
              </div>
              <h3 className="md:text-sm text-xs  font-semibold text-gray-800 leading-tight">
                Check Class Rooms
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-blue-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={studentsattendance}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                ✅
              </div>
              <h3 className="md:text-sm text-xs font-semibold text-gray-800 leading-tight">
                Check Student Attendance
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-green-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={contactTeacher}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                👤
              </div>
              <h3 className="md:text-sm text-xs font-semibold text-gray-800 leading-tight">
                Contact Class Teacher
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-indigo-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={studentsProgress}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="md:text-sm text-xs  font-semibold text-gray-800 leading-tight">
                Progress Report
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-green-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={checkTimeTable}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🗓️
              </div>
              <h3 className="md:text-sm text-xs  font-semibold text-gray-800 leading-tight">
                Check TimeTable
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-pink-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={checkRoutine}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                📝
              </div>
              <h3 className="md:text-sm text-xs font-semibold text-gray-800 leading-tight">
                Check Daily Routine
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-green-400 transition-all duration-300"></div>
          </div>

          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={markRoutine}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                📝
              </div>
              <h3 className="md:text-sm text-xs  font-semibold text-gray-800 leading-tight">
                Mark Daily Routine
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-pink-400 transition-all duration-300"></div>
          </div>
          <div
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
            onClick={profile}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                👤
              </div>
              <h3 className="md:text-sm text-xs  font-semibold text-gray-800 leading-tight">
                Check your profile
              </h3>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-indigo-400 transition-all duration-300"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default StudentsPage;
