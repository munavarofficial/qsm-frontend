import React, { useCallback, useEffect, useState } from "react";
import { FcBusinesswoman, FcBusinessman, FcCalendar } from "react-icons/fc";
import ExamTopers from "./Components/Exam-Topers/ExamTopers";
import AttendnaceTopers from "./Components/Atnd-Topers/AttendnaceTopers";
import Footer from "./Components/Footer/Footer";
import Calandar from "./Components/Calandar/Calandar";
import Events from "./Components/UpcomingEvents/Events";
import AttendancePie from "./Components/Atnd-summery/AttendancePie";
import ClassWiseAtndPie from "./Components/Atnd-Class-waise/ClassWiseAtndPie";
import { Link } from "react-router-dom";
import axios from "axios";
import RouteenTopers from "./Components/Routine-Toperse/RouteenTopers";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [schoolDetails, setSchoolDetails] = useState({});
  const [studetsCount, setStudentsCount] = useState("");
  const [teacherCount, setTeacherCount] = useState("");
  const [Notice, setNotice] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchSchoolDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/school-details/`
      );
      setSchoolDetails(response.data[0]);
    } catch (error) {
      console.error("Failed to fetch school details:", error);
    }
  }, [backendUrl]);

  const fetchStudentsCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/all-students-count/`
      );
      setStudentsCount(response.data);
    } catch (error) {
      console.error("Failed to fetch students count:", error);
    }
  }, [backendUrl]);

  const fetchteachersCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/all-teachers-count/`
      );
      setTeacherCount(response.data);
    } catch (error) {
      console.error("Failed to fetch teachers count:", error);
    }
  }, [backendUrl]);

  const fetchNoticeCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/get-notice/`
      );
      setNotice(response.data);
    } catch (error) {
      console.error("Failed to fetch notice count:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchSchoolDetails();
    fetchStudentsCount();
    fetchteachersCount();
    fetchNoticeCount();
  }, [
    fetchNoticeCount,
    fetchSchoolDetails,
    fetchteachersCount,
    fetchStudentsCount,
  ]);



  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (!schoolDetails || !schoolDetails.name) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-600 via-purple-00 to-cyan-800 overflow-hidden relative">
        {/* Islamic Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          {/* Traditional Islamic geometric pattern */}
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M30 0l15 15-15 15L15 15zM0 30l15 15-15 15L15 45zM60 30l-15 15 15 15-15-15zM30 60l-15-15 15-15 15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              animation: "float 15s ease-in-out infinite",
            }}
          ></div>

          {/* Floating crescents */}
        </div>

        <div className="text-center p-8 relative z-10">
          {/* Main Islamic-inspired Loading Animation */}
          <div className="mx-auto mb-8 relative">
            {/* Outer Islamic geometric ring */}
            <div className="h-36 w-36 md:h-44 md:w-44 relative">
              {/* Eight-pointed star pattern */}
            </div>
          </div>

          {/* Arabic & English Text Animation */}
          <div className="space-y-6">
            {/* Arabic greeting */}
            <div className="animate-fade-in-out">
              <h2
                className="text-xl md:text-3xl font-bold text-white mb-2"
                dir="rtl"
              >
                أهلاً وسهلاً
              </h2>
              <p className="text-sm md:text-lg text-white/80">Welcome</p>
            </div>

            {/* Main title with Islamic styling */}
            <h1 className="text-2xl md:text-4xl font-bold text-white relative">
              <span className="bg-gradient-to-r from-gray-100 via-green-300 to-purple-50 bg-clip-text text-transparent">
                QSM Madrasa App
              </span>
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
            </h1>

            <div className="relative">
              <p className="text-sm md:text-base text-white/70 mt-1">
                Preparing Edusafa Dashboard <br /> Please Wait...
              </p>
            </div>

            <div className="h-12 mt-8 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                {/* Clean animated spinner */}
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-transparent border-t-blue-100 rounded-full animate-spin"></div>
                  <div
                    className="absolute inset-1 border border-transparent border-t-green-400 rounded-full animate-spin"
                    style={{
                      animationDuration: "1.5s",
                      animationDirection: "reverse",
                    }}
                  ></div>
                </div>

                {/* Smooth wave dots */}
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-gray-100 to-purple-500 rounded-full animate-bounce"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: "1.2s",
                      }}
                    ></div>
                  ))}
                </div>

                {/* Simple text with subtle animation */}
                <div className="text-white/90 text-sm md:text-base font-medium">
                  <span className="animate-pulse">Loading Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Islamic border elements */}
          <div className="absolute top-4 left-4 w-16 h-16 opacity-20">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full animate-spin"
              style={{ animationDuration: "12s" }}
            >
              <path
                d="M50 10 Q90 50 50 90 Q10 50 50 10"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="absolute top-4 right-4 w-16 h-16 opacity-20 rotate-45">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full animate-spin"
              style={{
                animationDuration: "10s",
                animationDirection: "reverse",
              }}
            >
              <path
                d="M50 10 Q90 50 50 90 Q10 50 50 10"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="mt-5 text-center">
            <a
              href="https://www.aionespark.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent no-underline hover:text-blue-600 transition-colors duration-300 text-sm"
            >
              Powered by <br />
              <span className="font-semibold">AioneSpark TechHive LLP</span>
            </a>
          </div>
        </div>

        {/* Custom animations */}
        <style>{`
          @keyframes fadeInOut {
            0%,
            100% {
              opacity: 0;
              transform: translateY(10px);
            }
            50% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          .animate-fade-in-out {
            animation: fadeInOut 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Sidebar Overlay (Mobile Only) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] lg:hidden"
          onClick={toggleMenu}
        />
      )}

      <div className="flex relative">
        {/* Sidebar */}
{/* Sidebar */}
<aside
  className={`fixed top-0 left-0 h-full lg:w-[20rem] w-[16rem] py-3
  bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white
  transform transition-transform duration-300 ease-in-out shadow-2xl
  z-[9999] will-change-transform backface-hidden
  ${menuOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0 flex flex-col justify-between`}
>
  {/* Sidebar Header */}
  <div>
    <div className="px-3 md:p-4 border-b border-slate-700/50">
      <div className="flex items-center justify-center mb-1">
        <div>
          <h1 className="mt-5 md:text-4xl text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edusafa
          </h1>
        </div>
      </div>
      <p className="text-xs text-slate-300 text-center mb-3">
        {schoolDetails.sub_name} <br />
        <span className="text-xs md:text-sm text-slate-500">
          Busthanabad, Calicut, Kerala
        </span>
      </p>
    </div>

    {/* Close Button (Mobile) */}
    <button
      className="absolute top-4 right-4 lg:hidden text-gray-400 hover:bg-white/10 rounded-full p-2 transition-colors"
      onClick={toggleMenu}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    {/* Navigation */}
{/* Navigation */}
<nav className="px-4 py-2 md:p-5 space-y-2 mt-3">
  <Link
    to="/about"
    className="flex items-center p-2 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-200 group no-underline"
  >
    <span className="mr-3 text-2xl">🏠</span>
    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
      About
    </span>
  </Link>

  <Link
    to={localStorage.getItem("teacher") ? "/teacherspage" : "/teacherlogin"}
    className="flex items-center p-2 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-200 group no-underline"
  >
    <span className="mr-3 text-2xl">👨‍🏫</span>
    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
      Teachers
    </span>
  </Link>

  <Link
    to={localStorage.getItem("student") ?"/studentspage" : "/studentlogin"}
    className="flex items-center p-2 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-200 group no-underline"
  >
    <span className="mr-3 text-2xl">👨‍👩‍👧‍👦</span>
    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
      Parents
    </span>
  </Link>

  <Link
    to={localStorage.getItem("principal") ? "/principalpage" : "/principal-login"}
    className="flex items-center p-2 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-200 group no-underline"
  >
    <span className="mr-3 text-2xl">🏛️</span>
    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
      Principal
    </span>
  </Link>

  <Link
    to={localStorage.getItem("management") ? "/management-details" : "/management-login"}
    className="flex items-center p-2 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-200 group no-underline"
  >
    <span className="mr-3 text-2xl">🏢</span>
    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
      Management
    </span>
  </Link>

  <Link
    to="/support"
    className="flex items-center p-2 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-200 group no-underline"
  >
    <span className="mr-3 text-2xl">🛠️</span>
    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
      Support
    </span>
  </Link>
</nav>
  </div>

  {/* Bottom Footer */}
  <div className="p-4 border-t border-slate-700/50 text-center">
    <a
      href="https://www.aionespark.com"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent no-underline hover:text-blue-600 transition-colors duration-300 text-sm"
    >
      Powered by <br />
      <span className="font-semibold mt-5">AioneSpark TechHive LLP</span>
    </a>
  </div>
</aside>


        {/* Main Content */}
        <div className="flex-1 lg:ml-80 overflow-x-hidden">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b rounded-3xl border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between py-3 px-3">
              <button
                onClick={toggleMenu}
                className="lg:hidden p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 active:scale-95"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-1 ml-auto md:p-5 p-2">
                <div className="text-right">
                  <h1 className="text-base md:text-2xl font-bold text-gray-800">
                    {schoolDetails.name}
                  </h1>
                  <p className="text-xs text-gray-600">
                    {schoolDetails.sub_name}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">🏫</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="pt-4 pb-1 px-1 overflow-x-hidden">
            {/* Stats Cards */}
            <div
              className="
    grid gap-2 mb-2
    grid-flow-col auto-cols-[250px] overflow-x-auto no-scrollbar p-1
    md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:overflow-visible md:p-0
  "
            >
              {/* Students Card */}
              <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group mb-2">
                <div className="flex items-center justify-between md:mb-5">
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-gray-600 mb-1">
                      Total Students
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600">
                      {studetsCount.all_students_count
                        ? `0${studetsCount.all_students_count}`
                        : "00"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl">
                    <FcBusinesswoman className="text-4xl" />
                  </div>
                </div>
              </div>

              {/* Teachers Card */}
              <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group mb-2">
                <div className="flex items-center justify-between ">
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-gray-600 mb-1">
                      Total Teachers
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600">
                      {teacherCount.teachers_count
                        ? `0${teacherCount.teachers_count}`
                        : "00"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-2xl">
                    <FcBusinessman className="text-4xl" />
                  </div>
                </div>
              </div>

              {/* Events Card */}
              <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group mb-2">
                <div className="flex items-center justify-between ">
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-gray-600 ">
                      Upcoming Events
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-purple-600">
                      {Notice.events_count ? `0${Notice.events_count}` : "00"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-2xl">
                    <FcCalendar className="text-4xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/90 rounded-2xl px-2 py-4 shadow-lg w-full overflow-x-auto">
                <AttendancePie />
              </div>
              <div className="bg-white/90 rounded-2xl px-2 py-4 shadow-lg w-full overflow-x-auto">
                <ClassWiseAtndPie />
              </div>
            </div>

            {/* Calendar and Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/90 rounded-2xl   shadow-lg w-full overflow-x-auto">
                <Calandar />
              </div>
              <div className="bg-white/90 rounded-2xl  shadow-lg w-full overflow-x-auto">
                <Events />
              </div>
            </div>

            {/* Toppers Sections */}
            <div className="space-y-6">
              <div className="bg-white/90 rounded-2xl p-3 shadow-lg w-full overflow-x-auto">
                <AttendnaceTopers />
              </div>
              <div className="bg-white/90 rounded-2xl p-3 shadow-lg w-full overflow-x-auto">
                <RouteenTopers />
              </div>
              <div className="bg-white/90 rounded-2xl p-2 pb-3 shadow-lg w-full overflow-x-auto">
                <ExamTopers />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 bg-white/90 rounded-2xl shadow-lg w-full overflow-x-hidden">
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
