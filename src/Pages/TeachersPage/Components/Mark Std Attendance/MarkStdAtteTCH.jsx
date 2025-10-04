import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Users,
  Check,
  X,
  CheckCircle,
  XCircle,
  BookOpen,
  Clock,
} from "lucide-react";

function MarkStdAtteTCH() {
  const [allClasses, setAllClasses] = useState([]);
  const [date, setDate] = useState(getTodayDate());
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // FIXED: Improved fetchAttendance function with proper class ID handling
  const fetchAttendance = async (classData, selectedDate) => {
    if (!classData || !selectedDate || !backendUrl) {
      console.log("Missing required data:", { classData, selectedDate, backendUrl });
      return;
    }

    // FIXED: Use class_id instead of id
    const classId = classData.class_id || classData.id;
    if (!classId) {
      console.error("No class ID found in classData:", classData);
      setError("Invalid class data. Please select a class again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);



      const response = await fetch(
        `${backendUrl}/api/teachers/attendance-by-date-class/${classId}/?date=${selectedDate}`,
        {
          credentials: "include",

        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // No attendance records found for this date - this is normal for new dates
          console.log("No attendance records found for this date");
          initializeDefaultAttendance();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();


      if (response.status === 200 && Array.isArray(data)) {
        const attendanceMap = {};
        data.forEach((record) => {
          // Handle both student object and student ID formats
          const studentId = record.student?.id || record.student;
          if (studentId) {
            attendanceMap[studentId] = record.status || "absent";
          }
        });

        setAttendance(attendanceMap);
      } else {
        // If data format is unexpected, initialize default attendance

        initializeDefaultAttendance();
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to load attendance data. Showing default view.");
      initializeDefaultAttendance();
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Initialize default attendance based on current students
  const initializeDefaultAttendance = () => {
    if (students && students.length > 0) {
      const defaultAttendance = {};
      students.forEach((student) => {
        if (student && student.id) {
          defaultAttendance[student.id] = "absent";
        }
      });

      setAttendance(defaultAttendance);
    } else {
      console.log("No students available to initialize attendance");
      setAttendance({});
    }
  };

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  const teacherDetails = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("teacher")) || {};
    } catch (error) {
      console.error("Error parsing teacher details:", error);
      return {};
    }
  }, []);

  useEffect(() => {
    if (teacherDetails?.class_charges) {
      setAllClasses(teacherDetails.class_charges);
    }
  }, [teacherDetails]);

  // FIXED: Improved useEffect for attendance fetching
  useEffect(() => {
    if (selectedClass && date && backendUrl) {

      fetchAttendance(selectedClass, date);
    }
  }, [date, selectedClass, backendUrl]);

  const handleClassSelect = async (classData) => {

    setSelectedClass(classData);
    setError(null);
    setSuccess(null);
    setStudents([]);
    setAttendance({});

    try {
      await fetchClassStudents(classData);
    } catch (error) {
      setError("Failed to fetch students.");
      console.error("Error fetching students:", error);
    }
  };

  // FIXED: Updated to accept classData instead of just classId
  const fetchClassStudents = async (classData) => {
    if (!classData || !classData.class_id) {
      console.error("Invalid class data:", classData);
      setError("Invalid class selection.");
      return;
    }

    try {

      const response = await axios.get(
        `${backendUrl}/api/teachers/class-students/${classData.class_id}/`,
        {
          withCredentials: true,
        }
      );

      // FIXED: Ensure we always have an array
      const studentsList = Array.isArray(response.data) ? response.data : [];

      setStudents(studentsList);

      // Initialize default attendance after fetching students
      const defaultAttendance = {};
      studentsList.forEach((student) => {
        if (student && student.id) {
          defaultAttendance[student.id] = "absent";
        }
      });
      setAttendance(defaultAttendance);

      // Now fetch the actual attendance for the selected date
      if (date) {
        console.log("Fetching attendance after loading students");
        await fetchAttendance(classData, date);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students.");
      setStudents([]);
    }
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

    if (Object.keys(attendance).length === 0) {
      setError("No attendance data to submit.");
      return;
    }

    // FIXED: Use class_id from selectedClass
    const classId = selectedClass.class_id;
    if (!classId) {
      setError("Invalid class selection.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${backendUrl}/api/teachers/mark-all-std-attendnace/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            class_id: classId,
            attendance: attendance,
            date: date,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Network response was not ok");
      }

      setSuccess(result.message || "Attendance submitted successfully!");
      setError(null);
    } catch (error) {
      console.error("Error during attendance submission:", error);
      setError(error.message || "Failed to submit attendance. Please try again.");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  const presentCount = Object.values(attendance).filter(
    (status) => status === "present"
  ).length;
  const absentCount = Object.values(attendance).filter(
    (status) => status === "absent"
  ).length;

  const getImageUrl = (url) => {
    if (!url) return "/default-avatar.png"; // Fallback for missing images
    return url?.startsWith("http") ? url : `${backendUrl}${url}`;
  };

  // FIXED: Safe rendering of students list
  const renderStudents = () => {
    if (!students || !Array.isArray(students) || students.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No students found in this class.
          </p>
        </div>
      );
    }

    const validStudents = students.filter(student =>
      student && typeof student === 'object' && student.id
    );

    if (validStudents.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No valid student data available.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {validStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={getImageUrl(student.image)}
                  alt={student.name || 'Student'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"

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
                  {student.name || 'Unknown Student'}
                </h4>
                <p className="text-xs">{student.place || ''}</p>
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
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <p className="text-xs md:text-sm text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={isLoading || validStudents.length === 0}
            className={`w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 flex items-center justify-center gap-3 ${
              isLoading || validStudents.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-blue-600 hover:to-purple-500 hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Clock className="w-5 h-5" />
                Submit Attendance
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl px-2 py-4 shadow-xl mb-6 md:p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4 p-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="md:text-2xl text-base font-bold text-blue-600">
                Mark Students Attendance
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                Mark Daily Attendance of Students
              </p>
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
            <label
              htmlFor="attendanceDate"
              className="text-sm font-medium text-gray-700"
            >
              Attendance Date:
            </label>
            <input
              type="date"
              id="attendanceDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-30 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="w-6 h-6 text-white" />
              <h2 className="mt-2 text-base md:text-xl font-semibold text-white">
                Select a Class
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {allClasses.map((classData, index) => (
                <button
                  key={index}
                  onClick={() => handleClassSelect(classData)}
                  className={`group relative overflow-hidden rounded-xl p-2 md:p-4 font-medium transition-all duration-300 ${
                    selectedClass?.class_id === classData.class_id
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="text-sm opacity-80">Class</div>
                    <div className="text-sm font-bold">
                      {classData.class_name}
                    </div>
                  </div>
                  {selectedClass?.class_id !== classData.class_id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students Section */}
        {selectedClass && (
          <div className="mt-3 bg-white rounded-2xl shadow-xl px-2 py-4 sm:p-6 border border-gray-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="ml-3 p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm md:text-xl font-semibold text-blue-600">
                  Students in Class {selectedClass.class_name}
                  {isLoading && <span className="ml-2 text-sm text-gray-500">(Loading...)</span>}
                </h3>
              </div>

              {students && students.length > 0 && Object.keys(attendance).length > 0 && (
                <div className="ml-5 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="font-medium text-green-700">
                      {presentCount} Present
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="font-medium text-red-700">
                      {absentCount} Absent
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (!students || students.length === 0) && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading students...</p>
              </div>
            )}

            {/* Student List */}
            {!isLoading && renderStudents()}
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkStdAtteTCH;































