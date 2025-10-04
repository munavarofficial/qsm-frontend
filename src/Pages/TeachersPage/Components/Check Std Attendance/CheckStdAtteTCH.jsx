import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { CheckCircle, BookOpen } from "lucide-react";

function CheckStdAtteTCH() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const teacherDetails = useMemo(() => {
    return JSON.parse(localStorage.getItem("teacher"));
  }, []);

  useEffect(() => {
    try {
      if (teacherDetails && teacherDetails.class_charges) {
        setAllClasses(teacherDetails.class_charges);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setErrorMessage("Failed to load classes.");
    }
  }, [teacherDetails]);

  const fetchAttendanceData = useCallback(
    async (classId, studentId) => {
      if (!classId || !studentId) {
        setErrorMessage("Class and student must be selected.");
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get(
          `${backendUrl}/api/teachers/all-students-attendance/`,
          {
            params: {
              class_id: classId,
              student_id: studentId,
              year: selectedYear,
              month: selectedMonth,
            },
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
    },
    [backendUrl, selectedYear, selectedMonth]
  );

  useEffect(() => {
    if (selectedClass && selectedStudent) {
      fetchAttendanceData(selectedClass.class_id, selectedStudent.id);
    }
  }, [
    selectedMonth,
    selectedYear,
    fetchAttendanceData,
    selectedClass,
    selectedStudent,
  ]);

  const getDayName = (date) => {
    const day = new Date(date).getDay();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[day];
  };

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setSelectedYear(currentYear.toString());
    setSelectedMonth(currentMonth.toString());
    setSelectedStudent(null);
    setAttendanceRecords([]);
    setErrorMessage("");
    fetchClassStudents(classData.class_id);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const fetchClassStudents = async (classId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/teachers/class-students/${classId}/`,
        {
          withCredentials: true,
        }
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleMonthChange = (event) => setSelectedMonth(event.target.value);

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
    const matchesYear = selectedYear
      ? recordDate.getFullYear() === parseInt(selectedYear)
      : true;
    const matchesMonth =
      selectedMonth === "all" ||
      recordDate.getMonth() + 1 === parseInt(selectedMonth);
    return matchesYear && matchesMonth;
  });

  const totalPresent = filteredAttendanceRecords.filter(
    (record) => record.status.toLowerCase() === "present"
  ).length;
  const totalAbsent = filteredAttendanceRecords.filter(
    (record) => record.status.toLowerCase() === "absent"
  ).length;
  const totalWorkingDays = filteredAttendanceRecords.length;

  const attendancePercentage =
    totalWorkingDays > 0
      ? ((totalPresent / totalWorkingDays) * 100).toFixed(1)
      : 0;
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-2 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="md:text-2xl text-sm font-bold text-blue-600">
                Check Student Attendance
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                Track and Analyze Student Attendance
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

 {/* Class Selection */}
        <div className=" mt-3 mb-3 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-4">
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
                    selectedClass === classData
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="text-sm opacity-80 ">Class</div>
                    <div className="text-sm font-bold">
                      {classData.class_name}
                    </div>
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
          <div className=" bg-white rounded-xl shadow-lg p-6 mb-2">
            <h3 className="text-base md:text-xl font-semibold text-blue-600 mb-4 flex items-center">
              Students in Class {selectedClass.std}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student, index) => (
                <button
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={getImageUrl(student.image)}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <span className="text-left font-medium text-gray-900">
                      {student.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Student Attendance Details */}
        {selectedStudent && (
          <div className="space-y-6">
            {/* Student Header */}
            <div className="bg-white rounded-xl shadow-lg p-3">
              <div className="text-center">
                <img
                  src={getImageUrl(selectedStudent.image)}
                  alt={selectedStudent.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-indigo-100 shadow-lg"
                />
                <h3 className="text-sm md:text-xl font-bold text-blue-600 mb-2">
                  Attendance Record of {selectedStudent.name}
                </h3>
                <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
                  <span className="bg-indigo-100 px-3 py-1 rounded-full">
                    Class {selectedClass.class_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-sm md:text-lg font-semibold text-blue-600 mb-4 text-center">
                Filter Records
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
            </div>

            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-gray-600">Loading attendance records...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-3">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-3 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-100 md:text-sm">Present Days</p>
                        <p className="text-xl md:text-3xl font-bold">{totalPresent}</p>
                      </div>
                      <svg
                        className="w-6 h-6 text-green-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl p-3 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-xs md:text-sm">Absent Days</p>
                        <p className="text-xs md:text-3xl font-bold">{totalAbsent}</p>
                      </div>
                      <svg
                        className="w-6 h-6 text-red-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-3 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-xs md:text-sm">Total Days</p>
                        <p className="text-xl md:text-3xl font-bold">{totalWorkingDays}</p>
                      </div>
                      <svg
                        className="w-6 h-6 text-blue-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-3 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-xs  md:text-sm">Attendance %</p>
                        <p className="text-xl md:text-3xl font-bold">
                          {attendancePercentage}%
                        </p>
                      </div>
                      <svg
                        className="w-6 h-6 text-purple-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="text-sm md:text-lg font-semibold text-blue-600 text-center">
                      Attendance Records
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Remarks
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredAttendanceRecords.length > 0 ? (
                            filteredAttendanceRecords.map((record, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {record.date}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {getDayName(record.date)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                      record.status.toLowerCase() === "present"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {record.status.charAt(0).toUpperCase() +
                                      record.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {record.remarks || "-"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="3"
                                className="px-6 py-12 text-center text-gray-500"
                              >
                                <svg
                                  className="w-12 h-12 mx-auto mb-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <p className="text-lg font-medium">
                                  No attendance records found
                                </p>
                                <p className="text-sm">
                                  Try selecting a different time period
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckStdAtteTCH;
