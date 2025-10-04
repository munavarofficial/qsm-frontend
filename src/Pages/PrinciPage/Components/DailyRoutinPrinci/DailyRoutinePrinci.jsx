import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import axios from "axios";

function DailyRoutinePrinci() {
  const [allClasses, setAllClasses] = useState([]); // All classes data
  const [selectedClass, setSelectedClass] = useState(null); // Selected class
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student
  const [dailyRoutine, setDailyRoutine] = useState([]); // Daily routine data
  const [selectedDate, setSelectedDate] = useState(""); // Selected date
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Helper: Get today's date in YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/principal/get-class-with-stds/`,
          {
            withCredentials: true,
          }
        );
        setAllClasses(response.data || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchAllClasses();
  }, [backendUrl]);

  // ✅ Fetch routine when student OR date changes
  useEffect(() => {
    if (selectedStudent) {
      const fetchDailyRoutine = async () => {
        setLoading(true);
        setError("");

        try {
          const dateToUse = selectedDate || getTodayDate();
          const response = await axios.get(
            `${backendUrl}/api/principal/get-daily-routine/${selectedStudent.id}/?date=${dateToUse}`,
            { withCredentials: true }
          );
          setDailyRoutine(response.data);
        } catch (error) {
          console.error("Error fetching daily routine:", error);
          setError("Failed to fetch daily routine.");
        } finally {
          setLoading(false);
        }
      };

      fetchDailyRoutine();
    } else {
      setDailyRoutine([]);
    }
  }, [selectedStudent, selectedDate, backendUrl]);

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setSelectedStudent(null);
    setSelectedDate("");
    setDailyRoutine([]);
  };

  const handleStudentSelect = (studentData) => {
    setSelectedStudent(studentData);
    setSelectedDate(getTodayDate()); // ✅ Pre-fill with today's date
  };

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
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Daily Routine
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Monitor and track student daily activities
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="">
         <div className="max-w-7xl mx-auto p-1 mb-4">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-base md:text-lg font-semibold text-blue-600">Select Your Class</h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-1">
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
                  <div className="text-xs md:text-sm opacity-80 ">Class</div>
                  <div className="text-xs md:text-sm font-bold">{classData.class}</div>
                </div>
                {selectedClass !== classData && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
                {/* Daily Routine */}
          {selectedStudent && (
            <div className="bg-white rounded-2xl shadow-lg p-4 mt-4 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className=" text-base md:text-xl font-semibold text-blue-600">
                      Daily Report of {selectedStudent.name}
                    </h4>
                    <p className="text-sm text-gray-600">Track daily activities</p>
                  </div>
                </div>
              </div>

              {/* Date Picker */}
              <div className="mb-6">
                <label
                  htmlFor="date-picker"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date-picker"
                    className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={getTodayDate()}
                  />
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Loading/Error States */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="ml-4 text-gray-600">Loading routine data...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    {error}
                  </p>
                </div>
              )}

              {!loading && !error && dailyRoutine.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No routines available for this date range.
                  </p>
                </div>
              )}

              {/* Routine Table */}
              {!loading && !error && dailyRoutine.length > 0 && (
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50">
                              Routine Activity
                            </th>
                            {dailyRoutine.map((data, index) => (
                              <th
                                key={index}
                                className="px-6 py-4 text-center text-sm font-semibold text-gray-900 whitespace-nowrap"
                              >
                                {new Date(data.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {routineNames.map((routine, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <span>{routine}</span>
                                </div>
                              </td>
                              {dailyRoutine.map((data, idx) => (
                                <td
                                  key={idx}
                                  className="px-6 py-4 whitespace-nowrap text-center"
                                >
                                  <div className="flex items-center justify-center">
                                    {data[routine.toLowerCase()] ? (
                                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                                        <XCircle className="h-5 w-5 text-red-600" />
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
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Student Selection */}
          {selectedClass && (
            <div className="bg-white rounded-2xl shadow-lg mt-3 p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-base md:text-xl font-semibold text-blue-600">
                  Students in Class {selectedClass.std}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedClass.students.map((student, index) => (
                  <button
                    key={index}
                    className={`group p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      selectedStudent?.id === student.id
                        ? "border-green-500 bg-green-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-green-300"
                    }`}
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={getImageUrl(student.image)}
                          alt={student.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        {selectedStudent?.id === student.id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p
                          className={`font-medium ${
                            selectedStudent?.id === student.id
                              ? "text-green-700"
                              : "text-gray-700"
                          }`}
                        >
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">{student.place}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}

export default DailyRoutinePrinci;
