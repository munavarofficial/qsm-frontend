import React, { useState, useEffect, useCallback } from "react";
import { Users, BookOpen } from "lucide-react";
const StdProgressAuth = () => {
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
        const response = await fetch(
          `${backendUrl}/api/authority/all-class-with-stds/`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch classes");
        const data = await response.json();
        setAllClasses(data || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchAllClasses();
  }, [backendUrl]);

  const fetchStudentProgress = useCallback(
    async (studentId, year) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/authority/get-student-progress/${studentId}/?year=${year}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch student progress");
        const data = await response.json();
        setStudentProgress(data.progress || []);
      } catch (error) {
        console.error("Error fetching student progress:", error);
      } finally {
        setLoading(false);
      }
    },
    [backendUrl]
  );

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentProgress(selectedStudent.id, selectedYear);
    }
  }, [selectedStudent, selectedYear, fetchStudentProgress]);

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
    if (marks >= 90) return "text-green-600 bg-green-50";
    if (marks >= 80) return "text-blue-600 bg-blue-50";
    if (marks >= 70) return "text-yellow-600 bg-yellow-50";
    if (marks >= 60) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getGradeIcon = (marks) => {
    if (marks >= 90) return "🏆";
    if (marks >= 80) return "🥇";
    if (marks >= 70) return "🥈";
    if (marks >= 60) return "🥉";
    return "📚";
  };

  const averageMarks =
    studentProgress.length > 0
      ? (
          studentProgress.reduce((sum, record) => sum + record.marks, 0) /
          studentProgress.length
        ).toFixed(1)
      : 0;

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ">
      <div className="max-w-7xl mx-auto p-1 ">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Progress Records
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Analyze Progress records of students
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="w-6 h-6 text-white" />
              <h2 className="mt-2 text-base md:text-xl font-semibold text-white">
                Select a Class
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-4 md:grid-cols-5 gap-1">
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
          <div className="bg-white rounded-2xl shadow-xl p-2 py-4 mt-3 mb-8">
            <div className="flex items-center mb-6">
              <h3 className=" text-base md:text-xl font-bold text-blue-600 ">
                Students in Class {selectedClass.std}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedClass.students.map((student, index) => (
                <button
                  key={index}
                  className="p-2 py-4 rounded-xl border-2 border-gray-200 hover:border-green-300 bg-white hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={getImageUrl(student.image)}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.place}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Report */}
        {selectedStudent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Student Info Header */}
            <div className="bg-gradient-to-r mb-4 from-blue-600 to-indigo-600 text-white p-2 py-3">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                    {selectedStudent.image ? (
                      <img
                        src={getImageUrl(selectedStudent.image)}
                        alt={`${selectedStudent.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/30 flex items-center justify-center text-white text-2xl font-bold">
                        {selectedStudent.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base md:text-2xl font-bold mb-2">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-xs text-blue-100 ">
                      {selectedStudent.place}
                    </p>
                    <p className="text-xs text-blue-100">
                      Class {selectedClass?.class}
                    </p>
                    <p className="">
                      Average Score :
                      <span className="font-semibold text-sm md:text-xl text-white">
                        {" "}
                        {averageMarks}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Year Selection */}
            <div className="mb-6">
              <label className="text-center text-sm block  sm:text-lg font-semibold text-gray-700 mb-2">
                📅 Academic Year
              </label>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:outline-none transition-colors duration-300 text-base sm:text-lg"
              >
                {[0, 1, 2].map((offset) => {
                  const year = new Date().getFullYear() - offset;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Progress Table */}
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600 text-base sm:text-lg">
                  Loading progress...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[500px]">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="text-xs md:text-sm  px-2 sm:px-4 py-3 text-left font-semibold">
                        Subject
                      </th>
                      <th className=" text-xs md:text-sm  px-2 sm:px-4 py-3 text-center font-semibold">
                        Score
                      </th>
                      <th className="text-xs md:text-sm px-2 sm:px-6 py-3 text-center font-semibold">
                        Term
                      </th>
                      <th className="text-xs md:text-sm px-2 sm:px-6 py-3 text-center font-semibold">
                        Year
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentProgress.length > 0 ? (
                      studentProgress.map((record, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-2 sm:px-6 py-3">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <span className="text-lg sm:text-2xl">📖</span>
                              <span className="text-xs font-medium text-gray-800">
                                {record.subject}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-3 text-center">
                            <div
                              className={`text-xs inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold ${getGradeColor(
                                record.marks
                              )}`}
                            >
                              <span className="mr-1 sm:mr-2">
                                {getGradeIcon(record.marks)}
                              </span>
                              {record.marks}
                            </div>
                          </td>
                          <td className="px-2 py-3 text-center">
                            <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
                              {record.term}
                            </span>
                          </td>
                          <td className="px-2 sm:px-6 py-3 text-center">
                            <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                              {record.year}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center">
                          <div className="text-gray-400">
                            <div className="text-4xl sm:text-6xl mb-3">📝</div>
                            <p className="text-base sm:text-lg">
                              No progress records found for this student.
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
        )}
      </div>
    </div>
  );
};

export default StdProgressAuth;
