import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  GraduationCap,
  Users,
  User,
  Calendar,
  BookOpen,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

function CheckStdProgrTCH() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const [selectedTermYear, setSelectedTermYear] = useState("");
  const [availableTermYears, setAvailableTermYears] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const teacherDetails = useMemo(() => {
    return JSON.parse(localStorage.getItem("teacher"));
  }, []);

  useEffect(() => {
    if (teacherDetails && teacherDetails.class_charges) {
      setAllClasses(teacherDetails.class_charges);
    }
  }, [teacherDetails]);

  const fetchStudentProgress = useCallback(
  async (studentId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/teachers/get-student-progress/${studentId}/`,
        {
          withCredentials: true,
        }
      );
      const progressData = response.data.progress || [];
      setStudentProgress(progressData);

      // Extract unique term-year combinations and sort them
      const termYears = extractTermYears(progressData);
      setAvailableTermYears(termYears);

      // Set default to the latest term in current year, or latest overall
      if (termYears.length > 0) {
        setSelectedTermYear(termYears[0].value);
      }
    } catch (error) {
      console.error("Error fetching student progress:", error);
      setStudentProgress([]);
      setAvailableTermYears([]);
    } finally {
      setLoading(false);
    }
  },
  [backendUrl] // Remove backendUrl from dependencies
);

  const extractTermYears = (progressData) => {
    const termYearMap = new Map();

    progressData.forEach(record => {
      const key = `${record.term}-${record.year}`;
      if (!termYearMap.has(key)) {
        termYearMap.set(key, {
          term: record.term,
          year: record.year,
          timestamp: new Date(record.year, getTermOrder(record.term))
        });
      }
    });

    // Convert to array and sort by year and term order (latest first)
    return Array.from(termYearMap.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(item => ({
        label: `${item.term} ${item.year}`,
        value: `${item.term}-${item.year}`,
        term: item.term,
        year: item.year
      }));
  };

  const getTermOrder = (term) => {
    const termOrder = {
      'first term': 0,
      'second term': 1,
      'third term': 2
    };
    return termOrder[term.toLowerCase()] || 0;
  };

  const getFilteredProgress = () => {
    if (!selectedTermYear) return studentProgress;

    const [selectedTerm, selectedYear] = selectedTermYear.split('-');
    return studentProgress.filter(
      record => record.term === selectedTerm && record.year.toString() === selectedYear
    );
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentProgress(selectedStudent.id);
    }
  }, [selectedStudent, fetchStudentProgress]);

  const fetchClassStudents = async (classId) => {
    try {
      console.log("Fetching students for class ID:", classId);
      const response = await axios.get(
        `${backendUrl}/api/teachers/class-students/${classId}/`,
        {
          withCredentials: true,
        }
      );
      console.log("Fetched students:", response.data);
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setSelectedStudent(null);
    setStudentProgress([]);
    setAvailableTermYears([]);
    setSelectedTermYear("");
    fetchClassStudents(classData.class_id);
  };

  const handleStudentSelect = (studentData) => {
    setSelectedStudent(studentData);
  };

  const handleTermYearChange = (e) => {
    setSelectedTermYear(e.target.value);
  };

  const handleBack = () => {
    if (selectedStudent) {
      setSelectedStudent(null);
      setStudentProgress([]);
      setAvailableTermYears([]);
      setSelectedTermYear("");
    } else if (selectedClass) {
      setSelectedClass(null);
      setStudents([]);
    }
  };

  const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="md:text-2xl text-sm font-bold text-blue-600">
                  Check Student's Progress
                </h1>
                <p className="text-xs md:text-sm text-gray-600">Analyze Student's Progress Report</p>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          {(selectedClass || selectedStudent) && (
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {selectedClass && (
                <>
                  <span className="text-gray-600">
                    Class {selectedClass.class_name}
                  </span>
                  {selectedStudent && (
                    <>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {selectedStudent.name}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Class Selection */}
            {!selectedClass && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <GraduationCap className="w-6 h-6 text-white" />
                    <h2 className="mt-2 text-base md:text-xl font-semibold text-white">
                      Select a Class
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
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
            )}

            {/* Student Selection */}
            {selectedClass && !selectedStudent && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-white" />
                    <h3 className="text-sm md:text-xl font-semibold text-white">
                      Students in Class {selectedClass.std}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {students.map((student, index) => (
                      <button
                        key={index}
                        onClick={() => handleStudentSelect(student)}
                        className="w-full group p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={getImageUrl(student.image)}
                                alt={student.name}
                                className="w-12 h-12 rounded-full border-2 border-gray-200 group-hover:border-indigo-300 transition-colors object-cover"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <h4 className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {student.name}
                              </h4>
                              <p className="text-gray-500 text-sm">
                                {student.place}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Student Progress */}
            {selectedStudent && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">

                      <h3 className="text-sm md:text-xl text-white">
                        Progress Report for {selectedStudent.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">

                      <select
                        value={selectedTermYear}
                        onChange={handleTermYearChange}
                        className="bg-white bg-opacity-20 text-dark border border-white border-opacity-30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      >
                        <option value="">All Terms</option>
                        {availableTermYears.map((termYear, index) => (
                          <option key={index} value={termYear.value}>
                            {termYear.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading progress...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                              Subject
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Marks
                            </th>

                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getFilteredProgress().length > 0 ? (
                            getFilteredProgress().map((record, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                      <BookOpen className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      {record.subject}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-2xl font-bold text-gray-900">
                                    {record.marks}
                                  </span>
                                  <span className="text-gray-500 ml-1">
                                    /100
                                  </span>
                                </td>


                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-6 py-12 text-center"
                              >
                                <div className="flex flex-col items-center gap-3">
                                  <div className="p-4 bg-gray-100 rounded-full">
                                    <Search className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <p className="text-gray-500">
                                    {selectedTermYear
                                      ? `No progress records found for ${selectedTermYear.split('-')[0]} ${selectedTermYear.split('-')[1]}`
                                      : "No progress records found for this student."
                                    }
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

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-base text-center font-semibold text-blue-600 mb-4">
                Actions
              </h3>
              <Link
                to="/add-prgrss-teacher"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-500 to-purple-600 hover:to-indigo-700 transition-all duration-200 text-white"
              >
                <TrendingUp className="w-5 h-5" />
                Add Student Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckStdProgrTCH;