import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  Clock,
  BookOpen,
} from "lucide-react";

function ClassRoomsPrinci() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/principal/get-class-with-stds/`,
          { withCredentials: true }
        );
        setAllClasses(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError(error.response?.data?.error || error.message || "Failed to fetch classes");
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) {
      fetchAllClasses();
    }
  }, [backendUrl]);

  const createStd = () => navigate("/create-std-princi");
  const editStd = () => navigate("/edit-std-princi");

  const handleClassSelect = async (classData) => {
    setSelectedClass(classData);
    setError("");
    setMessage("");
    setLoading(true);
    setAttendanceData(null);
    setTeacher(null);

    try {
      // Fetch attendance data
      const attendanceResponse = await axios.get(
        `${backendUrl}/api/principal/get-attendnace-by-class/${classData.id}/`,
        { withCredentials: true }
      );

      setAttendanceData(attendanceResponse.data);

      // Update selected class with class_status
      setSelectedClass(prev => ({
        ...prev,
        class_status: attendanceResponse.data.class_status
      }));

    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError(err.response?.data?.error || err.message || "Failed to fetch attendance data");
    }

    try {
      // Fetch teacher data
      const teacherResponse = await axios.get(
        `${backendUrl}/api/principal/class-teacher/${classData.id}/`,
        { withCredentials: true }
      );
      setTeacher(teacherResponse.data);
    } catch (err) {
      console.error("Error fetching teacher:", err);
      // Don't set error for teacher fetch as it's not critical
    } finally {
      setLoading(false);
    }
  };

  const markClassStatus = async () => {
    if (!selectedClass) {
      setMessage("Please select a class first");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await axios.post(
        `${backendUrl}/api/principal/mark-class-status/${selectedClass.id}/`,
        {},
        { withCredentials: true }
      );

      setMessage(response.data.message || "Class status updated successfully!");

      // Refresh the class data to get updated status
      handleClassSelect(selectedClass);

    } catch (error) {
      console.error("Error marking class status:", error);
      setMessage(error.response?.data?.error || error.message || "Failed to update class status");
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalStudents = () => {
    if (!attendanceData) return 0;
    return (
      (attendanceData.present_students?.length || 0) +
      (attendanceData.absent_students?.length || 0)
    );
  };

  const getAttendancePercentage = () => {
    const total = getTotalStudents();
    if (total === 0) return 0;
    return Math.round(
      ((attendanceData.present_students?.length || 0) / total) * 100
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Floating Header */}
      <div className="sticky p-1 mb-2">
        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-blue-500/10 p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="md:text-3xl text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Classroom Hub
                </h1>
                <p className="text-slate-600 text-sm">
                  Real-time attendance tracking
                </p>
              </div>
            </div>
            {selectedClass && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Active Class</p>
                  <p className="font-semibold text-slate-800">
                    Class {selectedClass.class}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl border-l-4 border-l-red-500">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className="max-w-6xl mx-auto p-4">
          <div className={`p-4 rounded-xl border-l-4 ${
            message.includes("Failed") || message.includes("Error")
              ? "bg-red-50 border-red-200 text-red-800 border-l-red-500"
              : "bg-green-50 border-green-200 text-green-800 border-l-green-500"
          }`}>
            <div className="flex items-center gap-2">
              {message.includes("Failed") || message.includes("Error") ? (
                <UserX className="w-5 h-5" />
              ) : (
                <UserCheck className="w-5 h-5" />
              )}
              <p className="font-medium">{message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Class Selection */}
      <div className="max-w-6xl mx-auto p-1 mb-4">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-600">
              Select Your Class
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : allClasses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No classes available
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
              {allClasses.map((classData, index) => (
                <button
                  key={classData.id || index}
                  onClick={() => handleClassSelect(classData)}
                  disabled={loading}
                  className={`group relative overflow-hidden rounded-xl p-2 md:p-4 font-medium transition-all duration-300 ${
                    selectedClass?.id === classData.id
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:scale-105"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="relative z-10">
                    <div className="text-xs md:text-sm opacity-80">Class</div>
                    <div className="text-xs md:text-sm font-bold">
                      {classData.class}
                    </div>
                  </div>
                  {selectedClass?.id !== classData.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Class Details */}
      {selectedClass && (
        <div className="max-w-6xl mx-auto px-2 space-y-8">
          {/* Class Header & Teacher Info */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-white/10 backdrop-blur p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Class Name & Status */}
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Class {selectedClass.class || selectedClass.std}
                  </h1>
                  <p className="text-sm text-blue-100">Academic Session Overview</p>

                  {/* Class Status */}
                  {selectedClass.class_status && (
                    <span
                      className={`mt-2 inline-block px-3 py-1 rounded-full font-semibold text-xs md:text-sm ${
                        selectedClass.class_status === "Class Not Started"
                          ? "bg-yellow-500 text-gray-100"
                          : selectedClass.class_status === "Class Going On"
                          ? "bg-red-700 text-gray-100"
                          : "bg-green-700 text-gray-100"
                      }`}
                    >
                      {selectedClass.class_status}
                    </span>
                  )}
                </div>

                {/* Class Teacher */}
                <div className="flex items-center gap-4 bg-white/20 rounded-xl p-4 min-w-fit">
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-sm opacity-90">Class Teacher</p>
                    <p className="font-semibold text-sm">
                      {teacher ? teacher.name : "Loading..."}
                    </p>
                  </div>
                </div>

                {/* Mark Class Completed Button */}
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={markClassStatus}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-2xl font-semibold text-xs md:text-lg text-white flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-xl ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-br from-blue-500 to-blue-700"
                    }`}
                  >
                    {isLoading ? "Submitting..." : "Mark class Completed"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Summary Cards */}
          {attendanceData && getTotalStudents() > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-3 gap-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <UserCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-green-600">
                    {attendanceData.present_students?.length || 0}
                  </span>
                </div>
                <p className="text-[12px] md:text-xs text-slate-600 font-medium">
                  Present Today
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <UserX className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm md:text-2xl font-bold text-red-600">
                    {attendanceData.absent_students?.length || 0}
                  </span>
                </div>
                <p className="text-[12px] md:text-xs text-slate-600 font-medium">
                  Absent Today
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs md:text-2xl font-bold text-blue-600">
                    {getAttendancePercentage()}%
                  </span>
                </div>
                <p className="text-[12px] md:text-xs text-slate-600 font-medium">
                  Attendance Rate
                </p>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div
                    className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin"
                    style={{
                      animationDirection: "reverse",
                      animationDuration: "1.5s",
                    }}
                  ></div>
                </div>
                <p className="text-slate-600 text-lg mt-6">
                  Loading attendance data...
                </p>
              </div>
            ) : !attendanceData || getTotalStudents() === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
                  {attendanceData ? "No Attendance Data" : "Session Pending"}
                </h3>
                <p className="text-base text-slate-600 max-w-md mx-auto">
                  {attendanceData
                    ? "No students found in attendance records for today."
                    : "Waiting for the class session to begin. Students will appear here once attendance starts."}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-12">
                {/* Present Students */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-sm md:text-xl font-bold text-slate-800">
                      Present Students
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs md:text-sm font-medium">
                      {attendanceData.present_students?.length || 0}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {attendanceData.present_students?.map((student, index) => (
                      <div
                        key={student.id || index}
                        className="group bg-white border border-green-200 rounded-2xl p-3 flex flex-col items-center shadow-sm hover:shadow-lg transition-transform duration-300 hover:scale-105"
                      >
                        {/* Avatar / Image */}
                        {student.image ? (
                          <img
                            src={getImageUrl(student.image)}
                            alt={student.name}
                            className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-green-400"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base lg:text-lg ${
                            student.image ? 'hidden' : 'flex'
                          }`}
                        >
                          {student.name?.charAt(0) || 'S'}
                        </div>

                        {/* Student Info */}
                        <div className="mt-2 text-center w-full">
                          <h5 className="text-[10px] md:text-sm lg:text-base font-semibold text-slate-800 truncate">
                            {student.name || "Unknown Student"}
                          </h5>
                          <span className="inline-flex items-center px-2 py-0.5 bg-green-500 text-white rounded-full text-[9px] md:text-xs lg:text-sm font-medium mt-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1"></span>
                            Present
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Absent Students */}
                {attendanceData.absent_students?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <UserX className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-sm md:text-xl font-bold text-slate-800">
                        Absent Students
                      </h3>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs md:text-sm font-medium">
                        {attendanceData.absent_students.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {attendanceData.absent_students.map((student, index) => (
                        <div
                          key={student.id || index}
                          className="group bg-white border border-red-200 rounded-2xl p-3 flex flex-col items-center shadow-sm hover:shadow-lg transition-transform duration-300 hover:scale-105 opacity-90"
                        >
                          {/* Avatar / Image */}
                          {student.image ? (
                            <img
                              src={getImageUrl(student.image)}
                              alt={student.name}
                              className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-red-400"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base lg:text-lg ${
                              student.image ? 'hidden' : 'flex'
                            }`}
                          >
                            {student.name?.charAt(0) || 'S'}
                          </div>

                          {/* Student Info */}
                          <div className="mt-2 text-center w-full">
                            <h5 className="text-[10px] md:text-sm lg:text-base font-semibold text-slate-800 truncate">
                              {student.name || "Unknown Student"}
                            </h5>
                            <span className="inline-flex items-center px-2 py-0.5 bg-red-500 text-white rounded-full text-[9px] md:text-xs lg:text-sm font-medium mt-2">
                              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1"></span>
                              Absent
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

{/* Action Buttons */}
<div className="bg-white/95 backdrop-blur-lg rounded-3xl p-4 shadow-2xl border border-white/20 max-w-6xl mx-auto mt-2 mb-6">
  <div className="flex justify-center gap-2">
    <button
      className="px-6 py-3 rounded-2xl font-semibold text-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-xl"
      onClick={createStd}
    >
      <span className="text-xs">Create Standard</span>
    </button>
    <button
      className="px-6 py-3 rounded-2xl font-semibold text-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-xl"
      onClick={editStd}
    >
      <span className="text-xs">Edit Standard</span>
    </button>
  </div>
</div>

    </div>
  );
}

export default ClassRoomsPrinci;