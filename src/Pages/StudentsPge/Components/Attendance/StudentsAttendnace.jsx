import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Calendar,
  TrendingUp,
  Users,
   XCircle,
  Filter,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

function StudentsAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const currentYear = new Date().getFullYear();
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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
  useEffect(() => {
    const fetchAttendanceData = async () => {
      const studentDetails = JSON.parse(localStorage.getItem("student"));

      if (!studentDetails || !studentDetails.id) {
        console.error("No valid student details found.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/students/attendance-data/${studentDetails.id}/`,
          {
            withCredentials: true,
          }
        );

        if (
          response.status === 200 &&
          Array.isArray(response.data.attendance_record)
        ) {
          setAttendance(response.data.attendance_record);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [backendUrl]);

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  const filteredAttendance = attendance.filter((record) => {
    const recordDate = new Date(record.date);
    const matchesMonth = selectedMonth
      ? recordDate.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchesYear = selectedYear
      ? recordDate.getFullYear() === parseInt(selectedYear)
      : true;
    return matchesMonth && matchesYear;
  });

  const totalPresent = filteredAttendance.filter(
    (record) => record.status.toLowerCase() === "present"
  ).length;
  const totalAbsent = filteredAttendance.filter(
    (record) => record.status.toLowerCase() === "absent"
  ).length;

  const attendancePercentage =
    filteredAttendance.length > 0
      ? Math.round((totalPresent / filteredAttendance.length) * 100)
      : 0;

  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [totalPresent, totalAbsent],
        backgroundColor: ["#1a850c", "#c40a16"],
        hoverBackgroundColor: ["#059669", "#dc2626"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    cutout: "70%",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Attendance Records
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Monitor and track attendance records
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 p-4">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      {attendancePercentage}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Attendance</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Present <br /> ({totalPresent} days)
                </span>
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>{" "}
                <span className="text-sm font-medium text-gray-700">
                  Absent <br /> ({totalAbsent} days)
                </span>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-700">
                  {attendancePercentage >= 75
                    ? "🎉 Excellent attendance! Keep up the great work."
                    : attendancePercentage >= 60
                    ? "⚠️ Good attendance, but there's room for improvement."
                    : "🚨 Attendance needs attention to meet requirements."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-base md:text-2xl font-semibold text-blue-600">
              Filter Records
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Year:
              </label>
              <div className="relative">
                <select
                  id="year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition duration-200"
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 10 }, (_, i) => currentYear - i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Month:
              </label>
              <div className="relative">
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition duration-200"
                >
                  <option value="">All Months</option>
                  {monthNames.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {filteredAttendance.length > 0 ? (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-6 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs md:text-sm font-medium">
                      Present Days
                    </p>
                    <p className="text-xl md:text-3xl font-bold">
                      {totalPresent}
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-xs md:text-sm font-medium">
                      Absent Days
                    </p>
                    <p className="text-xl md:text-3xl font-bold">
                      {totalAbsent}
                    </p>
                  </div>
                  <XCircle className="w-6 h-6 text-red-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs md:text-sm  font-medium">
                      Working Days
                    </p>
                    <p className="text-xl md:text-3xl font-bold">
                      {filteredAttendance.length}
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs md:text-sm font-medium">
                      Attendance %
                    </p>
                    <p className="text-xl md:text-3xl font-bold">
                      {attendancePercentage.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-base md:text-2xl font-semibold text-blue-600 text-center">
                  Detailed Records
                </h2>
              </div>
              <div className="overflow-x-auto">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>

                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAttendance.map((record, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-3 py-2 text-sm  md:text-sm text-gray-900 font-medium">
                            {record.date} - 
                            <span className="text-sm ml-3 text-gray-600">
                                    {getDayName(record.date)}
                                  </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                record.status.toLowerCase() === "present"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)}
                            </span>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Records Found
            </h3>
            <p className="text-gray-600">
              No attendance records found for the selected period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentsAttendance;
