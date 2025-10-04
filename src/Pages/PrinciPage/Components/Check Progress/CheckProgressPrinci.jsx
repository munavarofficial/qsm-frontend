import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronDown,
  BookOpen,
  Calendar,
  TrendingUp,
  User,
  ArrowLeft,
} from "lucide-react";




function CheckProgressPrinci() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
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
      }
    };

    fetchAllClasses();
  }, [backendUrl]);

  useEffect(() => {
    const fetchStudentProgress = async (studentId, year) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/principal/get-student-progress/${studentId}/?year=${year}`,
          { withCredentials: true }
        );
        setStudentProgress(response.data.progress || []);
      } catch (error) {
        console.error("Error fetching student progress:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedStudent && selectedStudent.id) {
      fetchStudentProgress(selectedStudent.id, selectedYear);
    }
  }, [selectedStudent, selectedYear, backendUrl]);

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setSelectedStudent(null);
    setStudentProgress([]);
  };

  const handleStudentSelect = (studentData) => {
    setSelectedStudent(studentData);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const getGradeColor = (marks) => {
    if (marks >= 85) return "bg-green-100 text-green-800";
    if (marks >= 60) return "bg-blue-100 text-blue-800";
    if (marks >= 50) return "bg-yellow-100 text-yellow-800";
    if (marks >= 40) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const calculateAverage = () => {
    if (studentProgress.length === 0) return 0;
    const total = studentProgress.reduce(
      (sum, record) => sum + parseFloat(record.marks || 0),
      0
    );
    return (total / studentProgress.length).toFixed(1);
  };
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Student Progress Report
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Track and monitor Academic performance
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Class Selection */}
        {!selectedClass && (

           <div className="max-w-7xl mx-auto p-1 mb-4">
                <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <h2 className="text-base md:text-lg font-semibold text-blue-600">Select Your Class</h2>
                  </div>

                  <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-1">
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

        )}

        {/* Student Selection */}
        {selectedClass && !selectedStudent && (
          <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3 py-4 p-2">
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSelectedClass(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-sm md:text-xl font-semibold text-blue-600">
                Students in Class {selectedClass.std}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedClass.students?.map((student, index) => (
                <button
                  key={index}
                  className="group p-3 bg-white rounded-xl shadow-sm border border-gray-200  transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={getImageUrl(student.image)}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200  transition-colors"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-sm md:text-xl font-semibold text-gray-900  transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600">{student.place}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Student Progress */}
        {selectedStudent && (
          <div className="space-y-6">
            {/* Student Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 py-4 px-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>

                  <div>
                    <h2 className="text-base md:text-xl font-bold text-blue-600">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedStudent.place}</p>
                  </div>
                </div>

                {/* Year Selector */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value={new Date().getFullYear().toString()}>
                        {new Date().getFullYear()}
                      </option>
                      <option value={(new Date().getFullYear() - 1).toString()}>
                        {new Date().getFullYear() - 1}
                      </option>
                      <option value={(new Date().getFullYear() - 2).toString()}>
                        {new Date().getFullYear() - 2}
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              {studentProgress.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-3 gap-1 md:gap-4 mt-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-600 md:text-sm font-medium">
                          Total Subjects
                        </p>
                        <p className="text-base md:text-2xl font-bold text-blue-900">
                          {studentProgress.length}
                        </p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-600 md:text-sm font-medium">
                          Average Score
                        </p>
                        <p className="text-base md:text-2xl font-bold text-green-900">
                          {calculateAverage()}%
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-xs md:text-sm font-medium">
                          Academic Year
                        </p>
                        <p className="text-base md:text-2xl font-bold text-purple-900">
                          {selectedYear}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-base text-center font-semibold text-blue-600">
                  Academic Progress
                </h3>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Loading progress...</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Subject
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                          Marks
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                          Term
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                          Year
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {studentProgress.length > 0 ? (
                        studentProgress.map((record, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-900">
                                  {record.subject}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(
                                  record.marks
                                )}`}
                              >
                                {record.marks}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                                {record.term}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-gray-600 font-medium">
                              {record.year}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <BookOpen className="w-12 h-12 text-gray-300" />
                              <p className="text-gray-500 text-lg">
                                No progress records found
                              </p>
                              <p className="text-gray-400 text-sm">
                                Try selecting a different year
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
{/* <MarkStdProgressPrinci/> */}
    </div>
  );
}

export default CheckProgressPrinci;
