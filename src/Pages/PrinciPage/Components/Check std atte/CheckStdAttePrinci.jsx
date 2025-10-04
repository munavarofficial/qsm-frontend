import React, { useState, useEffect } from "react";
import { Calendar,  BookOpen, TrendingUp, User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import axios from "axios";

function CheckStdAttePrinci() {
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
          `${backendUrl}/api/principal/get-class-with-stds/`,
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
        `${backendUrl}/api/principal/all-students-attendance/`,
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const filteredAttendanceRecords = attendanceRecords.filter((record) => {
    const recordDate = new Date(record.date);
    const matchesYear = recordDate.getFullYear() === parseInt(selectedYear);
    const matchesMonth = selectedMonth === "all" || recordDate.getMonth() + 1 === parseInt(selectedMonth);
    return matchesYear && matchesMonth;
  });

  const totalPresent = filteredAttendanceRecords.filter(r => r.status.toLowerCase() === "present").length;
  const totalAbsent = filteredAttendanceRecords.filter(r => r.status.toLowerCase() === "absent").length;
  const totalWorkingDays = filteredAttendanceRecords.length;

  const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">

       {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Students Attendance
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  View Attendance Records of students
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{errorMessage}</span>
          </div>
        )}

 {/* Class Selection */}
      <div className="max-w-7xl mx-auto p-1 mb-4">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-base md:text-lg font-semibold text-blue-600">Select Your Class</h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
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
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-base font-semibold text-blue-600">
                Students in Class {selectedClass.std}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedClass.students.map((student, index) => (
                <button
                  key={index}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 text-left group"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(student.image)}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 group-hover:border-green-300 transition-colors"
                    />
                    <div>
                      <div className="font-medium text-gray-800 group-hover:text-green-700">
                        {student.name}
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
          <div className="space-y-6">
            {/* Student Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(selectedStudent.image)}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full border-3 border-blue-200"
                />
                <div>
                  <h3 className="text-base md:text-2xl text-center font-bold text-blue-600">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-gray-600">Class {selectedClass.std}</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
                <h3 className="text-base font-semibold text-blue-600">Filter Attendance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Array.from({ length: 10 }, (_, i) => (currentYear - i).toString()).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Months</option>
                    {monthNames.map((month, index) => (
                      <option key={index + 1} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading attendance records...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-1">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Present</p>
                        <p className="text-3xl font-bold text-green-600">{totalPresent}</p>
                      </div>
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Absent</p>
                        <p className="text-3xl font-bold text-red-600">{totalAbsent}</p>
                      </div>
                      <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Working Days</p>
                        <p className="text-3xl font-bold text-blue-600">{totalWorkingDays}</p>
                      </div>
                      <Clock className="w-12 h-12 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <h3 className="text-base font-semibold text-blue-600">Attendance Records</h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto" style={{ maxHeight: "500px" }}>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAttendanceRecords.length > 0 ? (
                          filteredAttendanceRecords.map((record, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  record.status.toLowerCase() === "present"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {record.status.toLowerCase() === "present" ? (
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                  ) : (
                                    <XCircle className="w-4 h-4 mr-1" />
                                  )}
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {record.remarks || "-"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <Calendar className="w-12 h-12 text-gray-400" />
                                <p className="text-gray-500">No attendance records found for this period.</p>
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
}

export default CheckStdAttePrinci;