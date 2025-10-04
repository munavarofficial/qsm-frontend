import React, { useEffect, useState } from "react";
import Footer from "../HomePage/Components/Footer/Footer";
import { Bell, LogOut } from "lucide-react";
import axios from "axios";
import { FcInspection } from "react-icons/fc";
import { useNavigate } from "react-router-dom";


const PrincipalPage = () => {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  useEffect(() => {
    try {
      const storedPrincipal = localStorage.getItem("principal");

      // Check if storedPrincipal exists and is a valid JSON string
      if (storedPrincipal) {
        // Try parsing the data and handle any errors
        setPrincipal(JSON.parse(storedPrincipal));
      } else {
        // If no principal data, redirect to login or show a fallback
        navigate("/principal-login");
      }
    } catch (error) {
      console.error("Error parsing principal data:", error);
      setPrincipal(null); // Optionally handle fallback
      // You can also redirect to the login page if data is invalid
      navigate("/principal-login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/principal/logout/`,
        {},
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true, // Important for session cookies
        }
      );

      if (response.status === 200) {
        // Clear session storage/localStorage
        localStorage.removeItem("principal");
        localStorage.removeItem("management"); // ✅ Remove session data
        localStorage.removeItem("student"); // ✅ Remove session data
        localStorage.removeItem("teacher"); // ✅ Remove session data

        // Optional: Clear more if needed
        // sessionStorage.clear();

        // Redirect to login page
        navigate("/");
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };



  const addstudent = () => {
    navigate("/add-student");
  };
  const checkTchrAtte = () => {
    navigate("/check-tchr-attendnace");
  };
  const markTchrAtte = () => {
    navigate("/mark-tchr-attendnace");
  };
  const checkStdAtte = () => {
    navigate("/check-std-atte-princi");
  };
  const checkStdInfo = () => {
    navigate("/check-std-Info-princi");
  };
  const checkStdProgress = () => {
    navigate("/check-std-progress-princi");
  };
  const markstdAttendnace = () => {
    navigate("/mark-std-atte-princi");
  };

  const addGallery = () => {
    navigate("/add-gallery-princi");
  };
  const classrooms = () => navigate('/classrooms-princi');
  const notification = () => navigate('/notification-princi');
  const passStudents = () => navigate('/passstudents');
  const parents = () => navigate('/parents-details-princi');
  const dailyRoutin = () => navigate('/daily-routin-princi');
  const chatbot = () => navigate("/chat-bot-principal");

  const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '13px',
          zIndex: 9999,
        }}
        onClick={chatbot}
      >
        <img
          src="/media/icons/chat-bot.png"
          alt="Chatbot"
          style={{
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            borderRadius: '50%',
            boxShadow: '0 6px 16px rgba(38, 39, 41)',
            backgroundColor:'#222324'
          }}
        />
      </div>


      {/* Header Section */}
            <div className="relative bg-white/80 backdrop-blur-sm border-b rounded-xl border-white/20 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-4">

                    <div>
                      <h1 className="md:text-4xl text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Edusafa
                      </h1>
                      <p className="text-sm text-gray-600">Principal Dashboard</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={notification}
                      className="relative p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                    >
                      <Bell className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                    </button>

                    <button
                      onClick={handleLogout}
                      className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                    >
                      <LogOut className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-2 sm:px-6 lg:px-8 p-2">

{/* Principal Details Section */}
<div className="mb-8">
  <div className="bg-white/70 backdrop-blur-sm rounded-3xl px-2 py-4 shadow-xl border border-white/20">
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
          <img
            src={principal?.image ? getImageUrl(principal.image) : "/media/icons/default-avatar.png"}
            alt="Principal Avatar"
            className="h-full w-full rounded-full object-cover bg-white"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      </div>

      <div className="text-center md:text-left">
        <h2 className=" text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Welcome,
        </h2>
        <h3 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {principal?.name || "No Name Available"}
        </h3>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium shadow-lg">
            🎓 Principal
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-700 text-sm font-medium shadow-md">
            📍 Place: {principal?.place || "Unknown"}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Functional Cards Section */}
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={classrooms}>
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

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={markTchrAtte}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        <FcInspection className="text-4xl" />
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Mark Teachers Attendance
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-green-400 transition-all duration-300"></div>
  </div>

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={markstdAttendnace}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        📝
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Mark Students Attendance
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-orange-400 transition-all duration-300"></div>
  </div>

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={checkTchrAtte}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        👨‍🏫
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Check Teachers Attendance
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-purple-400 transition-all duration-300"></div>
  </div>

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={checkStdAtte}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        👨‍🎓
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Check Students Attendance
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-cyan-400 transition-all duration-300"></div>
  </div>

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={checkStdInfo}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        👤
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Check Students Details
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-indigo-400 transition-all duration-300"></div>
  </div>

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={checkStdProgress}>
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

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={addGallery}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        🎉
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Madrasa Events
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-pink-400 transition-all duration-300"></div>
  </div>

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={addstudent}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        ➕
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Add Student
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-teal-400 transition-all duration-300"></div>
  </div>

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={passStudents}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        🎯
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Pass/Failed
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-yellow-400 transition-all duration-300"></div>
  </div>

  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={parents}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        👨‍👩‍👧‍👦
      </div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
        Parents Details
      </h3>
    </div>
    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-violet-400 transition-all duration-300"></div>
  </div>


  <div className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80" onClick={dailyRoutin}>
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


</div>

      </div>

      <Footer />
    </div>
  );
};

export default PrincipalPage;