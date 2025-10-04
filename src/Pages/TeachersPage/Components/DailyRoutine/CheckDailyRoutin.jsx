import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  ArrowLeft,
  ListTodo,
  BookOpen
} from "lucide-react";
import axios from "axios";

function CheckDailyRoutin() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dailyRoutine, setDailyRoutine] = useState(null); // Store daily routine data
  const [selectedDate, setSelectedDate] = useState(""); // Store selected date
  const [loading, setLoading] = useState(false); // Manage loading state
  const [error, setError] = useState(null); // Manage error state
  const [students, setStudents] = useState([]);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const teacherDetails = useMemo(() => {
    return JSON.parse(localStorage.getItem("teacher"));
  }, []);

  useEffect(() => {
    if (teacherDetails && teacherDetails.class_charges) {
      setAllClasses(teacherDetails.class_charges);
    }
  }, [teacherDetails]);

  // Set the default date to today's date when the component mounts
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setSelectedDate(today);
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    if (selectedStudent) {
      const fetchDailyRoutine = async () => {
        setLoading(true);
        setError(null);
        try {
          const url = `${backendUrl}/api/teachers/get-daily-routine/${selectedStudent.id}?date=${selectedDate}`;
          console.log("API URL:", url);
          const response = await axios.get(url, { withCredentials: true });

          // Check if data is an empty array
          if (Array.isArray(response.data) && response.data.length === 0) {
            setDailyRoutine([]); // Show "no routine" message in frontend
          } else {
            setDailyRoutine(response.data);
          }
        } catch (error) {
          console.error("Error fetching daily routine:", error);
          setError("Failed to fetch daily routine.");
        } finally {
          setLoading(false);
        }
      };
      fetchDailyRoutine();
    } else {
      setDailyRoutine(null);
    }
  }, [selectedStudent, selectedDate, backendUrl]);

  const fetchClassStudents = async (classId) => {
    try {
      console.log("Fetching students for class ID:", classId); // Debugging line
      const response = await axios.get(
        `${backendUrl}/api/teachers/class-students/${classId}/`,
        { withCredentials: true }
      );
      console.log("Fetched students:", response.data); // Debugging line
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setSelectedStudent(null); // Clear selected student
    fetchClassStudents(classData.class_id); // Ensure class_id is valid
  };

  const handleStudentSelect = (studentData) => {
    setSelectedStudent(studentData);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-1 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="md:text-2xl text-base font-bold text-blue-600">
                Check Student's Routine
              </h1>
              <p className="text-sm text-gray-600">
                Track student Daily Activities
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto ">
          {/* Navigation Breadcrumb */}
          {(selectedClass || selectedStudent) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <button
                onClick={() => {
                  if (selectedStudent) {
                    setSelectedStudent(null);
                  } else {
                    setSelectedClass(null);
                    setStudents([]);
                  }
                }}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-gray-400">/</span>
              {selectedClass && (
                <>
                  <span className="text-gray-600">
                    Class {selectedClass.class_name}
                  </span>
                  {selectedStudent && (
                    <>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-800 font-medium">
                        {selectedStudent.name}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          )}

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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 mt-3">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Students in Class {selectedClass.std}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student, index) => (
                  <button
                    key={index}
                    onClick={() => handleStudentSelect(student)}
                    className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-transparent hover:border-green-200 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={getImageUrl(student.image)}
                          alt={student.name}
                          className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-md group-hover:shadow-lg transition-shadow"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {student.name}
                        </h4>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500 text-sm">
                            {student.place}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Daily Routine Display */}
          {selectedStudent && dailyRoutine && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {/* Student Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={getImageUrl(selectedStudent.image)}
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {selectedStudent.name}
                    </h4>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">
                        {selectedStudent.place}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          console.log("Selected Date:", e.target.value);
                          setSelectedDate(e.target.value);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Routine Content */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading routine...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center space-x-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <span className="text-red-700">{error}</span>
                </div>
              ) : dailyRoutine.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                  <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    No Routine Data
                  </h3>
                  <p className="text-yellow-600">
                    No routines available for the selected date.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Routine Activity
                          </th>
                          {dailyRoutine.map((data, index) => (
                            <th
                              key={index}
                              className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200 min-w-32"
                            ></th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {routineNames.map((routine, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 font-medium text-gray-800 border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>{routine}</span>
                              </div>
                            </td>
                            {dailyRoutine.map((data, dataIndex) => (
                              <td
                                key={dataIndex}
                                className="px-6 py-4 text-center border-b border-gray-100"
                              >
                                {data[routine.toLowerCase()] ? (
                                  <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckDailyRoutin;
