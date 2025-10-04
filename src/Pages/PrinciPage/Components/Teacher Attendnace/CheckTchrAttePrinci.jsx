import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  User,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

function CheckTchrAttePrinci() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [yearlyRecords, setYearlyRecords] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [loading, setLoading] = useState(false);
  const [yearlyLoading, setYearlyLoading] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalPresent: 0,
    totalAbsent: 0,
  });
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch all teachers
  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/all-teachers-only/`)
      .then((response) => response.json())
      .then((data) => setTeachers(data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, [backendUrl]);

  // Fetch attendance summary for all teachers
  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/principal/all-teachers-attendance-summery/`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attendance summary");
        }
        const data = await response.json();
        setAttendanceSummary({
          totalPresent: data.total_present,
          totalAbsent: data.total_absent,
          session: data.last_updated_session,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceSummary();
  }, [backendUrl]);

  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendanceSummary.totalPresent, attendanceSummary.totalAbsent],
        backgroundColor: ["#12a30d", "#e80918"],
        borderWidth: 0,
        hoverBackgroundColor: ["#059669", "#dc2626"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 8,
      },
    },
    cutout: "60%",
  };

  // Fetch monthly attendance
  useEffect(() => {
    if (selectedTeacher) {
      setLoading(true);
      let url = `${backendUrl}/api/principal/all-tchr-attendance/${selectedTeacher}/?year=${selectedYear}&timestamp=${new Date().getTime()}`;
      if (selectedMonth !== "all") {
        url += `&month=${selectedMonth}`;
      }
      fetch(url, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setAttendanceRecords(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching attendance records:", error);
          setLoading(false);
        });
    }
  }, [selectedTeacher, selectedYear, selectedMonth, backendUrl]);

  // Fetch yearly attendance
  useEffect(() => {
    if (selectedTeacher) {
      setYearlyLoading(true);
      const url = `${backendUrl}/api/principal/all-tchr-attendance/${selectedTeacher}/?year=${selectedYear}`;
      fetch(url, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setYearlyRecords(data);
          setYearlyLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching yearly attendance records:", error);
          setYearlyLoading(false);
        });
    }
  }, [selectedTeacher, selectedYear, backendUrl]);

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacher(teacherId);
    setAttendanceRecords([]);
    setYearlyRecords([]);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const calculateAttendanceSummary = (records) => {
    const attendanceByDate = {};
    records.forEach((record) => {
      if (!attendanceByDate[record.date]) {
        attendanceByDate[record.date] = { AM: null, PM: null };
      }
      attendanceByDate[record.date][record.session] = record.status;
    });

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalWorkingDays = 0;

    for (const date in attendanceByDate) {
      const sessions = attendanceByDate[date];
      totalWorkingDays += 1;

      if (sessions.AM === "present" && sessions.PM === "present") {
        totalPresent += 1;
      } else if (sessions.AM === "present" || sessions.PM === "present") {
        totalPresent += 0.5;
        totalAbsent += 0.5;
      } else {
        totalAbsent += 1;
      }
    }

    return { totalPresent, totalAbsent, totalWorkingDays };
  };

  const { totalPresent, totalAbsent, totalWorkingDays } =
    calculateAttendanceSummary(attendanceRecords);

  const {
    totalPresent: yearlyPresent,
    totalAbsent: yearlyAbsent,
    totalWorkingDays: yearlyWorkingDays,
  } = calculateAttendanceSummary(yearlyRecords);

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-3 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-2xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Teachers Attendance Records
                </h1>

                <p className="text-gray-600  ms-2 text-sm">
                  Monitor and track attendance records
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Attendance Summary Chart */}
            <div className="bg-white rounded-2xl shadow-lg py-4 px-1 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 ml-3 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-semibold text-blue-600 text-center">
                    Today's Attendance
                  </h2>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Current attendance overview
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="ml-4 text-gray-600">
                    Loading attendance summary...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    {error}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <Doughnut data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-3 gap-1 md:gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">
                          Present
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {attendanceSummary.totalPresent}
                      </p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-sm font-medium text-red-800">
                          Absent
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {attendanceSummary.totalAbsent}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">
                          Session
                        </span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {attendanceSummary.session}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Teacher Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-semibold text-blue-600">
                    Select Teacher
                  </h2>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Choose a teacher to view attendance history
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {teachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => handleTeacherSelect(teacher.id)}
                    className={`w-full flex items-center p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      selectedTeacher === teacher.id
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    <img
                      src={getImageUrl(teacher.image)}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 mr-3"
                    />
                    <span
                      className={`font-medium ${
                        selectedTeacher === teacher.id
                          ? "text-purple-700"
                          : "text-gray-700"
                      }`}
                    >
                      {teacher.name}
                    </span>
                    {selectedTeacher === teacher.id && (
                      <CheckCircle className="h-5 w-5 text-purple-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher Attendance Records */}
          {selectedTeacher && (
            <div className="bg-white rounded-2xl shadow-lg px-2 py-4 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm  md:text-xl font-semibold text-blue-600">
                    Attendance Records for <br />
                    {teachers.find((t) => t.id === selectedTeacher)?.name}
                  </h2>
                  <p className="text-gray-600 text-xs">
                    View detailed attendance history
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Year
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {[...Array(10).keys()].map((i) => (
                      <option key={i} value={selectedYear - i}>
                        {selectedYear - i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Month
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    <option value="all">All Months</option>
                    {[
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
                    ].map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg mb-6">
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Session
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceRecords.length > 0 ? (
                        attendanceRecords.map((record, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(record.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  record.status === "present"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {record.status === "present" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {record.status.charAt(0).toUpperCase() +
                                  record.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                                {record.session}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            No attendance records found for the selected period.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-1 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <h3 className="text-xs md:text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Monthly Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Present Days:
                      </span>
                      <span className="font-semibold text-green-600">
                        {totalPresent}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Absent Days:
                      </span>
                      <span className="font-semibold text-red-600">
                        {totalAbsent}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Working Days:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {totalWorkingDays}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <h3 className="text-xs md:text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-purple-600" />
                    Yearly Summary
                  </h3>
                  {yearlyLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <p className="ml-2 text-sm text-gray-600">
                        Calculating...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-xs md:text-sm text-gray-600">
                          Present Days:
                        </span>
                        <span className="font-semibold text-green-600">
                          {yearlyPresent}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs md:text-sm text-gray-600">
                          Absent Days:
                        </span>
                        <span className="font-semibold text-red-600">
                          {yearlyAbsent}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs md:text-sm text-gray-600">
                          Working Days:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {yearlyWorkingDays}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckTchrAttePrinci;
