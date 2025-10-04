import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";

function MarkTchrAtte() {
  const [teachers, setTeachers] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

useEffect(() => {
  const fetchAttendance = async () => {
    if (!selectedDate || !selectedSession) return;

    try {
      setIsLoading(true);
     const response = await fetch(
  `${backendUrl}/api/principal/teachers-attendance-by-date/?date=${selectedDate}&session=${selectedSession}`,
  { credentials: "include" }
);

      const data = await response.json();

      if (response.status === 200) {
        // Map attendance to teacher IDs
        const attendanceMap = {};
        data.forEach((record) => {
          attendanceMap[record.teacher] = record.status;
        });
        setAttendance(attendanceMap);
      } else {
        // If no records, set default attendance as absent
        const defaultAttendance = teachers.reduce((acc, teacher) => {
          acc[teacher.id] = "absent";
          return acc;
        }, {});
        setAttendance(defaultAttendance);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAttendance();
}, [selectedDate, selectedSession, teachers, backendUrl]);


  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/principal/csrf-token/`,
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

  const fetchTeachers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${backendUrl}/api/dashboard/all-teachers-only/`
      );
      const data = await response.json();
      setTeachers(data);
      const defaultAttendance = data.reduce((acc, teacher) => {
        acc[teacher.id] = "absent";
        return acc;
      }, {});
      setAttendance(defaultAttendance);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchTeachers();
    const currentDate = new Date().toISOString().split("T")[0];
    setSelectedDate(currentDate);
  }, [fetchTeachers]);

  const handleAttendanceChange = (teacherId, status) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [teacherId]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const attendanceData = teachers.map((teacher) => ({
      teacher_id: teacher.id,
      date: selectedDate,
      session: selectedSession,
      status: attendance[teacher.id] || "absent",
    }));

    try {
      const response = await fetch(
        `${backendUrl}/api/principal/mark-teachers-attendance/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify(attendanceData),
        }
      );

      if (response.status === 200) {
        setMessage("Attendance marked successfully.");
      } else {
        setMessage("Error marking attendance. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error marking attendance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const presentCount = Object.values(attendance).filter(
    (status) => status === "present"
  ).length;
  const absentCount = teachers.length - presentCount;


  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

<div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-3 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-2xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Mark Teachers Attendance
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Mark Teachers Attendance Records
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 mb-8">
          {/* Teachers */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 sm:p-4 md:p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="ml-4 mt-2">
                <p className="text-gray-600 text-xs sm:text-sm font-medium text-center">
                  Total Teachers
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">
                  {teachers.length}
                </p>
              </div>
              <div className="  flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Present */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 sm:p-4 md:p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="ml-4 mt-2">
                <p className="text-gray-600 text-xs sm:text-sm font-medium text-center">
                  Total Present
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 text-center">
                  {presentCount}
                </p>
              </div>
              <div className="w-10 h-5 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Absent */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 sm:p-4 md:p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="ml-4 mt-2">
                <p className="text-gray-600 text-xs sm:text-sm font-medium text-center">
                  Total Absent
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 text-center">
                  {absentCount}
                </p>
              </div>
              <div className="w-8 h-5 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-3">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-3">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Select Session
                  </label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  >
                    <option value="" className="text-gray-800">
                      Select Session
                    </option>
                    <option value="AM" className="text-gray-800">
                      Morning (AM)
                    </option>
                    <option value="PM" className="text-gray-800">
                      Afternoon (PM)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Teachers List */}
            <div className=" mt-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-4 text-gray-600">
                    Loading teachers...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm md:text-lg font-semibold text-blue-600 mb-4 text-center">
                    Mark Attendance ({teachers.length} Teachers)
                  </h3>

                  <div className="grid gap-2 p-1 sm:p-4 md:p-8 lg:p-10">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-2 md:p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <img
                                src={getImageUrl(teacher.image)}
                                alt={teacher.name}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                                onError={(e) => {
                                  e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                                }}
                              />
                              <div
                                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                                  attendance[teacher.id] === "present"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                            </div>
                            <div>
                              <h4 className="text-xs md:text-xl font-semibold text-gray-900">
                                {teacher.name}
                              </h4>
                            </div>
                          </div>

                          <div className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleAttendanceChange(teacher.id, "present")
                              }
                              className={`relative group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                                attendance[teacher.id] === "present"
                                  ? "bg-green-500 text-white shadow-lg shadow-green-200"
                                  : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500"
                              }`}
                            >
                              <CheckCircle className="w-6 h-6" />
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Present
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleAttendanceChange(teacher.id, "absent")
                              }
                              className={`relative group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                                attendance[teacher.id] === "absent"
                                  ? "bg-red-500 text-white shadow-lg shadow-red-200"
                                  : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
                              }`}
                            >
                              <XCircle className="w-6 h-6" />
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Absent
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Message Display */}
            {message && (
              <div
                className={`mt-2 mb-2 p-4 rounded-2xl border ${
                  message.includes("successfully")
                    ? "bg-green-50 border-green-200 text-sm  text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center">
                  {message.includes("successfully") ? (
                    <CheckCircle className="w-5 h-5 mr-3" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-3" />
                  )}
                  {message}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="p-4 bg-gray-50/50">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-5 rounded-2xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  "Mark Attendance"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarkTchrAtte;
