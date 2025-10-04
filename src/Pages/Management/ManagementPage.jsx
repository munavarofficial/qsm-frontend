import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../HomePage/Components/Footer/Footer";
import { LogOut } from "lucide-react";
import { FcInspection } from "react-icons/fc";

const Details = () => {
  const navigate = useNavigate();
  const [management, setManagement] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/authority/csrf-token/`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, [backendUrl]);

  useEffect(() => {
    const storedManagement = localStorage.getItem("management");
    if (!storedManagement) {
      navigate("/management-login");
    } else {
      try {
        setManagement(JSON.parse(storedManagement));
      } catch (error) {
        console.error("Error parsing management data:", error);
        navigate("/management-login");
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/authority/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("management");
        localStorage.removeItem("student");
        localStorage.removeItem("teacher");
        localStorage.removeItem("principal");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const chatbot = () => navigate("/chat-bot-teacher");
  const go = {
    classRoom: () => navigate("/classroom-auth"),
    addManagement: () => navigate("/add-management"),
    checkTchrAttendance: () => navigate("/check-teachers-attendance"),
    markTchrAttendance: () => navigate("/mark-teacher-attendance"),
    stdAttendance: () => navigate("/check-students-attendance"),
    stdProgress: () => navigate("/check-students-progress"),
    addGallery: () => navigate("/add-gallery"),
    tchrInfo: () => navigate("/check-teacher-info"),
    addTchr: () => navigate("/add-teacher"),
    stdInfo: () => navigate("/check-students-info"),
    addParent: () => navigate("/add-parents-management"),
    viewParents: () => navigate("/view-parents-management"),
    memorial: () => navigate("/add-memorial"),
    Chatbot: () => navigate("/chat-bot-management"),
  };

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
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

      <div className="relative bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="md:text-4xl text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Edusafa
                </h1>
                <p className="text-xs md:text-sm text-gray-600">
                  Management Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
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

      {/* Welcome Card */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 mt-2">
        <div className="mb-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                  <img
                    src={
                      management?.image
                        ? getImageUrl(management.image)
                        : "/media/icons/default-avatar.png"
                    }
                    alt={management?.name || "Management Avatar"}
                    className="h-full w-full rounded-full object-cover bg-white"
                  />
                </div>

                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Welcome,
                </h2>
                <h3 className="text-xl md:text-3xl  font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {management?.name || "No Name Available"}
                </h3>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium shadow-lg">
                    🎓 {management?.position || "No Position"}
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-700 text-sm font-medium shadow-md">
                    📞 Number: {management?.number || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
          {[
            {
              title: "Check Class Rooms",
              icon: "🏫",
              color: "from-blue-500 to-purple-600",
              action: go.classRoom,
            },
            {
              title: "Mark Teachers Attendance",
              icon: <FcInspection className="text-4xl" />,
              color: "from-green-500 to-teal-600",
              action: go.markTchrAttendance,
            },
            {
              title: "Check Teachers Attendance",
              icon: "👨‍🏫",
              color: "from-purple-500 to-pink-600",
              action: go.checkTchrAttendance,
            },
            {
              title: "Check Students Attendance",
              icon: "👨‍🎓",
              color: "from-cyan-500 to-blue-600",
              action: go.stdAttendance,
            },
            {
              title: "Check Students Info",
              icon: "👤",
              color: "from-indigo-500 to-purple-600",
              action: go.stdInfo,
            },
            {
              title: "Progress Report",
              icon: "📊",
              color: "from-green-500 to-emerald-600",
              action: go.stdProgress,
            },
            {
              title: "Events / Gallery",
              icon: "🎉",
              color: "from-pink-500 to-rose-600",
              action: go.addGallery,
            },
            {
              title: "Add Management",
              icon: "➕",
              color: "from-teal-500 to-cyan-600",
              action: go.addManagement,
            },
            {
              title: "Add Teacher",
              icon: "👨‍🏫",
              color: "from-yellow-500 to-orange-600",
              action: go.addTchr,
            },
            {
              title: "Teacher Info",
              icon: "📘",
              color: "from-green-500 to-emerald-600",
              action: go.tchrInfo,
            },
            {
              title: "View Parents",
              icon: "➕",
              color: "from-violet-500 to-purple-600",
              action: go.viewParents,
            },
            {
              title: "Add Parents",
              icon: "👨‍🏫",
              color: "from-pink-500 to-rose-600",
              action: go.addParent,
            },
            {
              title: "Add Memorial",
              icon: "👤",
              color: "from-green-500 to-emerald-600",
              action: go.memorial,
            },
            {
              title: "Chat Bot",
              icon: "🧠",
              color: "from-cyan-500 to-blue-600",
              action: go.Chatbot,
            },
          ].map((card, index) => (
            <div
              key={index}
              className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
              onClick={card.action}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {card.icon}
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                  {card.title}
                </h3>
              </div>
              <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full group-hover:via-blue-400 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Details;
