import React, { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  User,
  Clock,
  TrendingUp,
  Filter,
  CheckCircle,
  XCircle,
} from "lucide-react";

function TchrAttendanceTCH() {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const currentYear = currentDate.getFullYear().toString();

  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const teacherDetails = JSON.parse(localStorage.getItem("teacher"));

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchAttendanceData = useCallback(async () => {
    if (!teacherDetails) {
      console.error("No teacher details provided.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/teachers/attendance-data/${teacherDetails.id}/`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setAttendance(data.attendance_records);
      } else {
        console.warn("Failed to fetch attendance records.");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [teacherDetails, backendUrl]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

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

  const filterAttendanceRecords = () => {
    if (!attendance || attendance.length === 0) return [];
    return attendance.filter((record) => {
      const recordDate = new Date(record.date);
      const recordMonth = recordDate.getMonth() + 1;
      const recordYear = recordDate.getFullYear();
      return (
        (selectedMonth === "" || recordMonth === parseInt(selectedMonth)) &&
        (selectedYear === "" || recordYear === parseInt(selectedYear))
      );
    });
  };

  const calculateAttendanceStats = () => {
    let presentDays = 0;
    let absentDays = 0;

    const filteredRecords = filterAttendanceRecords();
    if (!filteredRecords || filteredRecords.length === 0) {
      return { presentDays, absentDays, workingDays: 0 };
    }

    const groupedRecords = {};
    filteredRecords.forEach((record) => {
      const date = record.date;
      if (!groupedRecords[date]) {
        groupedRecords[date] = { am: null, pm: null };
      }
      groupedRecords[date][record.session.toLowerCase()] = record.status;
    });

    let workingDays = 0;

    for (const date in groupedRecords) {
      const { am, pm } = groupedRecords[date];

      if (am === "present") {
        presentDays += 0.5;
      } else if (am === "absent") {
        absentDays += 0.5;
      }

      if (pm === "present") {
        presentDays += 0.5;
      } else if (pm === "absent") {
        absentDays += 0.5;
      }

      workingDays += 1;
    }

    return { presentDays, absentDays, workingDays };
  };

  const { presentDays, absentDays, workingDays } = calculateAttendanceStats();

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  const filteredRecords = filterAttendanceRecords();

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

  const attendancePercentage =
    workingDays > 0 ? (presentDays / (workingDays * 2)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="md:text-2xl text-base font-bold text-blue-600">
                Teachers Attendance
              </h1>
              <p className="text-sm text-gray-600">Track Your Attendance Records</p>
            </div>
          </div>
        </div>

{/* Filters Section */}
<div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
  <div className="flex items-center gap-2 mb-4">
    <Filter className="w-5 h-5 text-blue-600" />
    <h2 className="text-sm sm:text-base md:text-lg font-semibold text-blue-600">
      Filter Records
    </h2>
  </div>

  {/* ✅ Flex row always, with responsive gap */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    {/* Year */}
    <div className="flex-1 space-y-1 sm:space-y-2">
      <label
        htmlFor="year"
        className="block text-xs sm:text-sm font-medium text-gray-700"
      >
        Year
      </label>
      <select
        id="year"
        value={selectedYear}
        onChange={handleYearChange}
        className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-sm sm:text-base"
      >
        <option value="">All Years</option>
        {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>

    {/* Month */}
    <div className="flex-1 space-y-1 sm:space-y-2">
      <label
        htmlFor="month"
        className="block text-xs sm:text-sm font-medium text-gray-700"
      >
        Month
      </label>
      <select
        id="month"
        value={selectedMonth}
        onChange={handleMonthChange}
        className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-sm sm:text-base"
      >
        <option value="">All Months</option>
        {monthNames.map((month, index) => (
          <option key={index} value={index + 1}>
            {month}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">
                Loading attendance data...
              </span>
            </div>
          </div>
        ) : (
          <>
            {filteredRecords.length > 0 ? (
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
                          {presentDays.toFixed(1)}
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
                          {absentDays.toFixed(1)}
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
                        <p className="text-xl md:text-3xl font-bold">{workingDays}</p>
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

                {/* Attendance Records Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h2 className="text-base md:text-xl font-semibold text-blue-600">
                        Attendance Records
                      </h2>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="max-h-96 overflow-y-auto">
                      {" "}
                      {/* ✅ Added scroll */}
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                              Date
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                              Session
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                              Remarks
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredRecords.map((record, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-1 py-4">
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium text-gray-900">
                                    {record.date}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {getDayName(record.date)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                  {record.session.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    record.status.toLowerCase() === "present"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {record.status.toLowerCase() === "present" ? (
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                  ) : (
                                    <XCircle className="w-4 h-4 mr-1" />
                                  )}
                                  {record.status.charAt(0).toUpperCase() +
                                    record.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-gray-600">
                                  {record.remarks || "N/A"}
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
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Records Found
                </h3>
                <p className="text-gray-500">
                  No attendance records found for the selected period.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TchrAttendanceTCH;
