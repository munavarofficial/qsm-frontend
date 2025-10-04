import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  UserCheck,
  Heart,
  Home,
  Briefcase,
  CreditCard,
  School,
  ChevronRight,
  Info,
  BookOpen,
} from "lucide-react";

function StudentsInfoTCH() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentInfo, setStudentInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Load teacher details only once on mount
  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      try {
        const parsedTeacher = JSON.parse(storedTeacher);
        if (parsedTeacher.class_charges) {
          setAllClasses(parsedTeacher.class_charges);
        }
      } catch (error) {
        console.error("Error parsing teacher details:", error);
        setError("Failed to load classes.");
      }
    }
  }, []);

  const fetchStudentInfo = async (student_id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${backendUrl}/api/teachers/student_info_by_id/${student_id}/`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setStudentInfo(data.student || {});
    } catch (error) {
      console.error("Error fetching student info:", error);
      setError("Failed to load student information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    fetchClassStudents(classData.class_id);
  };

  const handleStudentSelect = (studentData) => {
    setSelectedStudent(studentData);
    fetchStudentInfo(studentData.id);
  };

  const fetchClassStudents = async (classId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/teachers/class-students/${classId}/`,
        {
          credentials: "include",
        }
      );
      const studentsList = await response.json();
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
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
              <h1 className="md:text-2xl text-sm font-bold text-blue-600">
                Check Student Details
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                View Your Class Student's Details
              </p>
            </div>
          </div>
        </div>
        {/* Class Selection */}
        <div className="mb-3 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="mt-2 w-6 h-6 text-white" />
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

        {/* Student List */}
        {selectedClass && students.length > 0 && (
          <div className="mb-8 bg-white py-4 px-2 rounded-xl shadow-xl border">
            <div className="mb-4">
              <h3 className=" text-center text-base md:text-xl font-semibold text-blue-600">
                Students in Class {selectedClass.class_name}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {students.map((student, index) => (
                <button
                  key={index}
                  className="p-2 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-102 group"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={getImageUrl(student.image)}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {student.place}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Student Info */}
        {selectedStudent && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="relative">
                    {studentInfo.image ? (
                      <img
                        src={getImageUrl(studentInfo.image)}
                        alt={`${studentInfo.name}'s profile`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-base md:text-2xl font-bold mb-2">
                      {studentInfo.name}
                    </h3>
                    <p className="text-sm text-blue-100 md:text-lg flex items-center justify-center md:justify-start gap-2">
                      <MapPin className="w-5 h-5" />
                      {studentInfo.place}
                    </p>
                    <div className="mt-3 flex items-center justify-center md:justify-start gap-4 text-blue-100">
                      <span className="text-sm flex items-center">
                        Class: {studentInfo.std}
                      </span>
                      <span className="text-sm flex items-center">
                        Admission Number : {studentInfo.admission_no}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">
                    Loading student information...
                  </span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12 text-red-500">
                  <Info className="w-5 h-5 mr-2" />
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="text-base font-semibold text-blue-600 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Basic Information
                      </h5>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.gender}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Heart className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-500">Blood Group</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.blood_grp}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Home className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parent Details */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="text-base font-semibold text-blue-600  mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Parent Details
                      </h5>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Parent Name</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.parent_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Occupation</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.parent_occupation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.phone_no}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admission Details */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h5 className="text-base font-semibold text-blue-600  mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                        Admission Details
                      </h5>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Admission Number
                          </p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.admission_no}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Admission Date
                          </p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.admission_date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <School className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Class</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.std}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="text-base font-semibold text-blue-600 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-green-600" />
                        Additional Information
                      </h5>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Place</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.place}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <School className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Former School</p>
                          <p className="font-medium text-gray-800">
                            {studentInfo.former_school || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Last updated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentsInfoTCH;
