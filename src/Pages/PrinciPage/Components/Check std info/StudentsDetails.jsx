import React, { useState, useEffect } from "react";
import {User,BookOpen} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentsDetails = () => {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
const navigate = useNavigate();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/principal/get-class-with-stds/`,
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

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setSelectedStudent(null); // Reset selected student when changing class
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);

 const editStudentInfo = () => navigate("/edit-student-princi", { state: { selectedStudent } });
  return (
       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Students Info
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  View Details of students
                </p>
              </div>
            </div>
          </div>
        </div>

      <div className="mt-2">

         {/* Class Selection */}
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

        {/* Student Selection */}
        {selectedClass && !selectedStudent && (
          <div className="bg-white rounded-2xl px-3 py-4 shadow-sm border border-slate-200 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-base md:text-lg font-semibold text-blue-600">
                Students in Class {selectedClass.class}
              </h2>
            </div>

            <div className="grid gap-2">
              {selectedClass.students.map((student, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-left"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                    {student.image ? (
                      <img
                        src={getImageUrl(student.image)}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm md:text-xl font-semibold text-slate-900">{student.name}</h3>
                    <p className="text-xs text-slate-600 ">{student.place}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Student Profile */}
        {selectedStudent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3">
              <div className="flex items-center gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
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
                  <h2 className="text-sm md:text-xl font-bold mb-2">{selectedStudent.name}</h2>
                  <p className="text-sm text-blue-100 mb-1">{selectedStudent.place}</p>
                  <p className="text-sm text-blue-100">Class {selectedClass?.class}</p>
                </div>
                <button
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => setSelectedStudent(null)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-blue-600">Personal Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-600">Parent's Name :</p>
                        <p className="font-medium text-slate-900">{selectedStudent.parent_name}</p>
                      </div>
                    </div>



                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-600">Gender:</p>
                        <p className="font-medium text-slate-900">
                          {selectedStudent.gender === "M" ? "Male" : selectedStudent.gender === "F" ? "Female" : "Other"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-600">Blood Group:</p>
                        <p className="font-medium text-slate-900">{selectedStudent.blood_grp}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-600">Phone Number:</p>
                        <p className="font-medium text-slate-900">{selectedStudent.phone_no}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic & Additional Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-blue-600">Academic Details:</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-600">Class:</p>
                        <p className="font-medium text-slate-900">{selectedClass?.class}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-600">Admission Number:</p>
                        <p className="font-medium text-slate-900">{selectedStudent.admission_no}</p>
                      </div>
                    </div>



                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-600">Address:</p>
                        <p className="font-medium text-slate-900">{selectedStudent.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Last updated on {new Date().toLocaleDateString()}
                  </p>
                  <button
                    className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-1 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all"
                    onClick={() => editStudentInfo()}
                  >
                   <span className='text-sm'>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default StudentsDetails;