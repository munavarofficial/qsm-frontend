import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  BookOpen,
  User,
} from "lucide-react";

const MarkStdAttePrinci = () => {
  const [allClasses, setAllClasses] = useState([]);
  const [date, setDate] = useState(getTodayDate());
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(false);

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/principal/csrf-token/`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        setError("Failed to fetch CSRF token");
      }
    };

    if (backendUrl) {
      fetchCsrfToken();
    }
  }, [backendUrl]);

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${backendUrl}/api/principal/get-class-with-stds/`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAllClasses(data || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Failed to fetch classes");
      } finally {
        setIsLoading(false);
      }
    };

    if (backendUrl) {
      fetchAllClasses();
    }
  }, [backendUrl]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedClass || !date || !backendUrl) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${backendUrl}/api/principal/students-attendance-by-date/${selectedClass.id}/?date=${date}`,
          { credentials: "include" }
        );

        // Check if response is ok before parsing JSON
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (response.status === 200 && Array.isArray(data)) {
          const attendanceMap = {};
          data.forEach((record) => {
            // Fixed: Use student.id instead of just student
            attendanceMap[record.student.id || record.student] = record.status;
          });
          setAttendance(attendanceMap);
        } else {
          // No records → mark all absent
          const defaultAttendance = selectedClass.students?.reduce(
            (acc, student) => {
              acc[student.id] = "absent";
              return acc;
            },
            {}
          ) || {};
          setAttendance(defaultAttendance);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        // If no records found or error, set all to absent
        const defaultAttendance = selectedClass.students?.reduce(
          (acc, student) => {
            acc[student.id] = "absent";
            return acc;
          },
          {}
        ) || {};
        setAttendance(defaultAttendance);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedClass, date, backendUrl]);

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setError(null);
    setSuccess(null);

    // Fixed: Add null check for students array
    const defaultAttendance = {};
    classData.students?.forEach((student) => {
      defaultAttendance[student.id] = "absent";
    });
    setAttendance(defaultAttendance);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClass) {
      setError("Please select a class.");
      return;
    }

    if (!csrfToken) {
      setError("CSRF token not available. Please refresh the page.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${backendUrl}/api/principal/mark-all-std-attendnace/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            class_id: selectedClass.id,
            attendance: attendance,
            date: date,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit attendance");
      }

      setSuccess(data.message || "Attendance submitted successfully!");
      setError(null);
    } catch (error) {
      console.error("Error during attendance submission:", error);
      setError(error.message || "Failed to submit attendance. Please try again.");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed: Add null checks for calculations
  const presentCount = selectedClass
    ? Object.values(attendance).filter((status) => status === "present").length
    : 0;

  const totalStudents = selectedClass?.students?.length || 0;
  const absentCount = totalStudents - presentCount;

  const getImageUrl = (url) => {
    if (!url) return "/default-avatar.png"; // Fallback for missing images
    return url?.startsWith("http") ? url : `${backendUrl}${url}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
            <div className="max-w-7xl mx-auto p-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Mark Students Attendance
                  </h1>
                  <p className="text-sm text-gray-600 mt-1 ms-2">
                    Manage Students Attendance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl border-l-4 border-l-blue-500 mb-6">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
              <p className="font-medium">Loading...</p>
            </div>
          </div>
        )}

        {/* Date Selection */}
        <div className="bg-white mt-3 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-blue-600 md:text-lg">
              Select Date
            </h3>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full max-w-sm px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          />
        </div>

        {/* Class Selection */}
        <div className="max-w-7xl mx-auto p-1 mb-2">
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-sm md:text-lg font-semibold text-blue-600">
                Select Your Class
              </h2>
            </div>

            {allClasses.length === 0 && !isLoading ? (
              <div className="text-center py-8 text-gray-500">
                No classes available
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                {allClasses.map((classData, index) => (
                  <button
                    key={classData.id || index}
                    onClick={() => handleClassSelect(classData)}
                    disabled={isLoading}
                    className={`group relative overflow-hidden rounded-xl p-2 md:p-4 font-medium transition-all duration-300 ${
                      selectedClass?.id === classData.id
                        ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105"
                        : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:scale-105"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="relative z-10">
                      <div className="text-sm opacity-80">Class</div>
                      <div className="text-sm font-bold">{classData.class}</div>
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

        {/* Stats Cards */}
        {selectedClass && (
          <div className="grid grid-cols-3 gap-1 mt-5">
            {[
              {
                label: "Total Students",
                value: totalStudents,
                icon: <User className="w-6 h-6 text-blue-600" />,
                iconBg: "bg-blue-100",
                textColor: "text-gray-800",
              },
              {
                label: "Total Present",
                value: presentCount,
                icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                iconBg: "bg-green-100",
                textColor: "text-green-600",
              },
              {
                label: "Total Absent",
                value: absentCount,
                icon: <XCircle className="w-6 h-6 text-red-600" />,
                iconBg: "bg-red-100",
                textColor: "text-red-600",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow flex flex-col items-center justify-between space-y-2"
              >
                <div className="flex flex-col items-center justify-center space-y-1">
                  <p className="text-gray-600 text-sm font-medium text-center">
                    {card.label}
                  </p>
                  <p
                    className={`text-2xl md:text-3xl font-bold text-center ${card.textColor}`}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}
                >
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Students List */}
        {selectedClass && (
          <div className="bg-white rounded-2xl shadow-xl p-2 mb-6 border border-gray-200 mt-4">
            <div className="mt-2 mb-6">
              <h3 className="text-sm md:text-lg font-semibold text-blue-600 text-center">
                Students in Class {selectedClass.class}
              </h3>
            </div>

            {selectedClass.students?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No students in this class
              </div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                {selectedClass.students?.map((student, index) => (
                  <div
                    key={student.id || index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img
                          src={getImageUrl(student.image)}
                          alt={student.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            attendance[student.id] === "present"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <h4 className="text-xs md:text-xl font-semibold text-gray-900">
                          {student.name || "Unknown Student"}
                        </h4>
                        <p className="text-xs">{student.place || ""}</p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleAttendanceChange(student.id, "present")
                        }
                        disabled={isLoading}
                        className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          attendance[student.id] === "present"
                            ? "bg-green-500 text-white shadow-lg shadow-green-200"
                            : "bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-700"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          handleAttendanceChange(student.id, "absent")
                        }
                        disabled={isLoading}
                        className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          attendance[student.id] === "absent"
                            ? "bg-red-500 text-white shadow-lg shadow-red-200"
                            : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-700"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl border-l-4 border-l-red-500 mb-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl border-l-4 border-l-green-500 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {selectedClass && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !csrfToken}
              className={`text-sm w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white py-3 px-5 rounded-xl font-semibold md:text-lg hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform shadow-lg ${
                isLoading || !csrfToken
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-[1.02] hover:shadow-xl"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkStdAttePrinci;