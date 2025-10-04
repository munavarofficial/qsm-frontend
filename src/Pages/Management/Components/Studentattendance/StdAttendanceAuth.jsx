import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import axios from "axios";

const StdAttendanceAuth = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/authority/all-class-with-stds/`,
          { withCredentials: true }
        );
        setAllClasses(response.data || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setErrorMessage("Failed to load classes. Please try again.");
      }
    };
    fetchAllClasses();
  }, [backendUrl]);

  const fetchAttendanceData = async (classId, studentId) => {
    if (!classId || !studentId) {
      setErrorMessage("Class and student must be selected.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${backendUrl}/api/authority/all-students-attendance/`,
        {
          params: { class_id: classId, student_id: studentId },
          withCredentials: true,
        }
      );

      setAttendanceRecords(response.data.attendance_records || []);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setErrorMessage("Failed to load attendance records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setSelectedStudent(null);
    setSelectedYear(currentYear.toString());
    setSelectedMonth(currentMonth.toString());
    setAttendanceRecords([]);
    setErrorMessage("");
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchAttendanceData(selectedClass.id, student.id);
  };

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filteredAttendanceRecords = attendanceRecords.filter((record) => {
    const recordDate = new Date(record.date);
    const matchesYear = recordDate.getFullYear() === parseInt(selectedYear);
    const matchesMonth =
      selectedMonth === "all" ||
      recordDate.getMonth() + 1 === parseInt(selectedMonth);
    return matchesYear && matchesMonth;
  });

  const totalPresent = filteredAttendanceRecords.filter(
    (r) => r.status.toLowerCase() === "present"
  ).length;
  const totalAbsent = filteredAttendanceRecords.filter(
    (r) => r.status.toLowerCase() === "absent"
  ).length;
  const totalWorkingDays = filteredAttendanceRecords.length;
  const attendancePercentage =
    totalWorkingDays > 0
      ? ((totalPresent / totalWorkingDays) * 100).toFixed(1)
      : 0;

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-1">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-2 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-2xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Attendance Records of Students
                </h1>

                <p className="text-sm  text-gray-600 mt-1 ms-2">
                  Monitor and track attendance records
                </p>
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errorMessage}</span>
            </div>
          )}
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
            <div className="grid grid-cols-4 md:grid-cols-5 gap-1">
              {allClasses.map((classData, index) => (
                <button
                  key={index}
                  onClick={() => handleClassSelect(classData)}
                  className={`group relative overflow-hidden rounded-xl p-2 md:p-4 font-medium transition-all duration-300 ${
                    selectedClass === classData
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="text-sm opacity-80 ">Class</div>
                    <div className="text-sm font-bold">{classData.class}</div>
                  </div>
                  {selectedClass !== classData && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Student Selection */}
        {selectedClass && !selectedStudent && (
          <div className="bg-white rounded-2xl shadow-lg p-2 pb-5 pt-3 mt-3 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-sm md:text-2xl font-semibold mt-2 text-blue-600">
                Students in Class {selectedClass.std}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedClass.students.map((student, index) => (
                <button
                  key={index}
                  className="p-2 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(student.image)}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                    <div>
                      <div className="text-sm md:text-sm font-semibold text-gray-800">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        View attendance
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Records */}
        {selectedStudent && (
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-1 mt-3 pt-3">
            {/* Student Header */}
            <div className="flex items-center gap-4 mb-6 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(selectedStudent.image)}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white"
                />
                <div>
                  <h3 className="text-center text-lg md:text-2xl font-bold">
                    {selectedStudent.name}
                  </h3>
                  <p className="opacity-90">Class {selectedClass.class}</p>
                </div>
              </div>

              <button
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => setSelectedStudent(null)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-xs md:text-sm font-medium text-gray-700">
                  Year:
                </label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) =>
                    (currentYear - i).toString()
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs md:text-sm font-medium text-gray-700">
                  Month:
                </label>
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Months</option>
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Loading attendance...
                </span>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-6 pt-2">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <div className="text-xs md:text-2xl font-bold text-green-700">
                          {totalPresent}
                        </div>
                        <div className="text-xs text-green-600">Present</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <div className="text-xs  md:text-2xl font-bold text-red-700">
                          {totalAbsent}
                        </div>
                        <div className="text-xs text-red-600">Absent</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="text-xs md:text-2xl font-bold text-blue-700">
                          {totalWorkingDays}
                        </div>
                        <div className="text-xs text-blue-600">
                          Working Days
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <div>
                        <div className="text-xs md:text-2xl font-bold text-purple-700">
                          {attendancePercentage}%
                        </div>
                        <div className="text-xs text-purple-600">
                          Attendance
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-gray-50 rounded-xl p-1">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-800 text-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAttendanceRecords.length > 0 ? (
                          filteredAttendanceRecords.map((record, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(record.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    record.status.toLowerCase() === "present"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {record.status.toLowerCase() === "present" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {record.status.charAt(0).toUpperCase() +
                                    record.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {record.remarks || "No remarks"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              <div className="flex flex-col items-center gap-3">
                                <Calendar className="w-12 h-12 text-gray-400" />
                                <span>
                                  No attendance records found for this period
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StdAttendanceAuth;
