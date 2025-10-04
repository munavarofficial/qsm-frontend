import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Clock, CheckCircle, XCircle, BookOpen } from "lucide-react";
import axios from "axios";

function MyRoutine() {
  const [student, setStudent] = useState(null); // Student details
  const [dailyRoutine, setRoutineData] = useState([]); // Daily routine data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [selectedDate, setSelectedDate] = useState(""); // Selected date
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Get student from localStorage
    const storedStudent = localStorage.getItem("student");
    setStudent(JSON.parse(storedStudent));
  }, []);

  // Set the default date to today's date when the component mounts
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setSelectedDate(today);
  }, []); // Empty dependency array to run only on mount

  // Use useCallback to memoize the function, ensuring it doesn't change unless its dependencies change
  const fetchRoutineData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backendUrl}/api/students/get-daily-routine/${student.id}?date=${selectedDate}/`,
        {
          params: { date: selectedDate },
          withCredentials: true, // 👈 Add this line
        }
      );
      setRoutineData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching routine data:", err);
      setError("Failed to fetch routine data.");
      setLoading(false);
    }
  }, [student, selectedDate, backendUrl]);
  // Use student and selectedDate as dependencies

  useEffect(() => {
    if (student) {
      fetchRoutineData();
    }
  }, [student, selectedDate, fetchRoutineData]); // Only depend on student, selectedDate, and fetchRoutineData

  const routineNames = [
    "Subahi",
    "Luhur",
    "Asar",
    "Maqrib",
    "Isha",
    "Thabaraka",
    "Waqiha",
    "Swalath",
    "Haddad",
  ];

  const getCompletionStats = () => {
    if (!dailyRoutine.length) return { completed: 0, total: 0, percentage: 0 };

    const data = dailyRoutine[0];
    const completed = routineNames.filter(
      (routine) => data[routine.toLowerCase()]
    ).length;
    const total = routineNames.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  My Daily Routine
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Track your spiritual journey
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto ">
          {/* Date Picker and Stats */}
          <div className="max-w-7xl mx-auto mb-3 ">
            {/* Date Picker */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-base md:text-xl font-semibold text-blue-600">
                    Select Date
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    id="date-picker"
                    value={selectedDate}
                    onChange={(e) => {
                      console.log("Selected Date:", e.target.value);
                      setSelectedDate(e.target.value);
                    }}
                    className="text-sm flex-1 px-1 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 md:text-lg"
                  />
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-xl">
                    {selectedDate && formatDate(selectedDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Stats */}
            {!loading && !error && dailyRoutine.length > 0 && (
            <div className="mt-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white flex flex-col items-center">
  <div className="flex items-center space-x-2 mb-4">
    <Clock className="h-4 w-4" />
    <h2 className="text-sm md:text-xl font-semibold text-center">Today's Progress</h2>
  </div>

  <div className="text-center mb-2">
    <div className="text-xl md:text-4xl font-bold">{stats.percentage}%</div>
    <div className="text-indigo-100">{stats.completed} of {stats.total} completed</div>
  </div>

  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-500 ease-out"
      style={{
        width: `${stats.percentage}%`,
        background: `linear-gradient(
          90deg,
          ${stats.percentage < 50 ? '#f87171,#fca5a5' :
          stats.percentage >= 90 ? '#16a34a,#15803d' :
          stats.percentage >= 75 ? '#4ade80,#22c55e' :
          '#facc15,#fde68a'}
        )`,
        backgroundSize: '200% 100%',
        animation: 'moveGradient 3s linear infinite',
      }}
    />
  </div>

  {/* Gradient animation keyframes */}
  <style>
    {`
      @keyframes moveGradient {
        0% { background-position: 0% 0%; }
        50% { background-position: 100% 0%; }
        100% { background-position: 0% 0%; }
      }
    `}
  </style>
</div>

            )}
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 text-lg">
                    Loading your routine...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 text-lg font-medium">{error}</p>
                  <p className="text-gray-500 mt-2">Please try again later</p>
                </div>
              </div>
            ) : dailyRoutine.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">
                    No routines available
                  </p>
                  <p className="text-gray-500 mt-2">for the selected date</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                          Routine
                        </th>
                        {dailyRoutine.map((data, index) => (
                          <th
                            key={index}
                            className="px-6 py-4 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider"
                          >
                            {new Date(data.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {routineNames.map((routine, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="bg-indigo-100 p-2 rounded-lg">
                                <BookOpen className="h-4 w-4 text-indigo-600" />
                              </div>
                              <span className="text-gray-800 font-medium">
                                {routine}
                              </span>
                            </div>
                          </td>
                          {dailyRoutine.map((data, dataIndex) => (
                            <td
                              key={dataIndex}
                              className="px-6 py-4 text-center"
                            >
                              <div className="flex justify-center">
                                {data[routine.toLowerCase()] ? (
                                  <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="bg-red-100 p-2 rounded-full">
                                    <XCircle className="h-6 w-6 text-red-500" />
                                  </div>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-4 space-y-4">
                  {routineNames.map((routine, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <BookOpen className="h-4 w-4 text-indigo-600" />
                          </div>
                          <span className="text-gray-800 font-medium">
                            {routine}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {dailyRoutine.map((data, dataIndex) => (
                            <div
                              key={dataIndex}
                              className="flex flex-col items-center"
                            >
                              <div className="text-xs text-gray-500 mb-1">
                                {new Date(data.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                              {data[routine.toLowerCase()] ? (
                                <div className="bg-green-100 p-1.5 rounded-full">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                              ) : (
                                <div className="bg-red-100 p-1.5 rounded-full">
                                  <XCircle className="h-5 w-5 text-red-500" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyRoutine;
