import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Users, GraduationCap, UserMinus, CheckCircle,BookOpen } from 'lucide-react';

function PassStudents() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/principal/csrf-token/`,
          { withCredentials: true }
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

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

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
  };

  const handlePassStudent = async (studentId) => {
    const confirmed = window.confirm("Are you sure you want to pass this student?");
    if (!confirmed) return;

    try {
      await axios.put(
        `${backendUrl}/api/principal/pass-student/${studentId}/`,
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      // ✅ Remove student from local state
      if (selectedClass) {
        const updatedStudents = selectedClass.students.filter(
          (student) => student.id !== studentId
        );
        setSelectedClass({ ...selectedClass, students: updatedStudents });
      }

      alert("Student passed successfully!");
    } catch (error) {
      console.error("Error passing student:", error.response?.data || error.message);
      alert("Failed to pass student");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    const confirmed = window.confirm("Are you sure you want to remove this student?");
    if (!confirmed) return;

    try {
      await axios.delete(
        `${backendUrl}/api/principal/remove-student/${studentId}/`,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      // ✅ Remove student from local state
      if (selectedClass) {
        const updatedStudents = selectedClass.students.filter(
          (student) => student.id !== studentId
        );
        setSelectedClass({ ...selectedClass, students: updatedStudents });
      }

      alert("Student removed successfully!");
    } catch (error) {
      console.error("Error removing student:", error);
      alert("Failed to remove student");
    }
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
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Students Management
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                 Pass Or Remove Students
                </p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Students List */}
        {selectedClass && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center flex-wrap gap-3 mb-6">
              <Users className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base md:text-xl font-semibold text-blue-600 text-center">
                Students in Class {selectedClass.std}
              </h3>
              <span className="bg-indigo-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {selectedClass.students?.length || 0} students
              </span>
            </div>

            <div className="space-y-4">
              {selectedClass.students.map((student, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl py-4 px-2 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <img
                          src={getImageUrl(student.image)}
                          alt={student.name}
                          className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-sm md:text-lg font-semibold text-gray-800 mb-1">
                          {student.name}
                        </h4>
                        <p className="text-gray-600 flex items-center gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          {student.place}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row flex-wrap gap-3 w-full sm:w-auto">
                      <button
                        className="group/btn flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1 sm:flex-none"
                        onClick={() => handlePassStudent(student.id)}
                      >
                        <CheckCircle className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        Pass
                      </button>

                      <button
                        className="group/btn flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1 sm:flex-none"
                        onClick={() => handleRemoveStudent(student.id)}
                      >
                        <UserMinus className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PassStudents;
