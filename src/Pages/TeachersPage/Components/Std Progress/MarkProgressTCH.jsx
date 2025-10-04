import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  BookOpen,
  Calendar,
  User,
  Award,
  AlertCircle,
} from "lucide-react";

function MarkProgressTCH() {
  const [allClasses, setAllClasses] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marks, setMarks] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [csrfToken, setCsrfToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Memoize teacherDetails to prevent unnecessary recomputations
  const teacherDetails = useMemo(() => {
    return JSON.parse(localStorage.getItem("teacher"));
  }, []);

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/teachers/csrf-token/`, {
          credentials: "include",
        });
        const data = await response.json();

        if (data?.csrfToken) {
          setCsrfToken(data.csrfToken);
        } else {
          console.warn("No CSRF token received.");
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    getCsrfToken();
  }, [backendUrl]);

  useEffect(() => {
    if (teacherDetails && teacherDetails.class_charges) {
      setAllClasses(teacherDetails.class_charges);
    }
  }, [teacherDetails]);

  useEffect(() => {
    const getCurrentYear = () => new Date().getFullYear();

    const fetchAllTerms = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/teachers/terms/`, {
          credentials: "include",
        });
        const data = await response.json();
        const currentYear = getCurrentYear();
        const filteredTerms = data.filter((term) => term.year === currentYear);
        setAllTerms(filteredTerms || []);
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };

    fetchAllTerms();
  }, [backendUrl]);

  const fetchClassStudents = async (classId) => {
    try {
      console.log("Fetching students for class ID:", classId);
      const response = await fetch(
        `${backendUrl}/api/teachers/class-students/${classId}/`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("Fetched students:", data);
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  const handleClassSelect = (classData) => {
    console.log("Selected class:", classData);
    setSelectedClass(classData);
    setSelectedTerm(null);
    setSelectedStudent(null);
    setMarks({});
    fetchClassStudents(classData.class_id);
  };

  const handleTermSelect = (termId) => {
    setSelectedTerm(termId);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    const initialMarks = {};
    (selectedClass.subjects || []).forEach((subject) => {
      initialMarks[subject.subject_id] = "";
    });
    setMarks(initialMarks);
  };

  const handleMarkChange = (subjectId, mark) => {
    setMarks((prev) => ({ ...prev, [subjectId]: mark }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedTerm || !selectedStudent) {
      setError("Please select a class, term, and student.");
      return;
    }

    setIsSubmitting(true);
    try {
      for (let subject of selectedClass.subjects || []) {
        const progressData = {
          student: selectedStudent.id,
          subject: subject.id,
          term: selectedTerm,
          marks: Number(marks[subject.id]),
        };
        console.log("progress data", progressData);

        const response = await fetch(
          `${backendUrl}/api/teachers/create-progress-report/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify(progressData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit progress");
        }
      }

      setSuccess("Progress submitted successfully.");
      setError(null);
      setMarks({});
    } catch (error) {
      console.error("Error during submission:", error);
      setError("Failed to submit progress. Please try again.");
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="md:text-3xl text-sm font-bold text-blue-600">
                Mark Student Progress
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                Record Academic Performance
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8 bg-white rounded-2xl p-3 ">
          <div className="flex items-center space-x-1">
            <div
              className={`flex items-center space-x-2 ${
                selectedClass ? "text-green-600" : "text-gray-400"
              }`}
            >

              <span className="md:text-lg text-xs font-medium">Class</span>
            </div>
            <div
              className={`w-8 h-px ${
                selectedClass ? "bg-green-300" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                selectedTerm ? "text-green-600" : "text-gray-400"
              }`}
            >

              <span className=" md:text-lg text-xs font-medium">Term</span>
            </div> <br />
            <div
              className={`w-8 h-px ${
                selectedTerm ? "bg-green-300" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                selectedStudent ? "text-green-600" : "text-gray-400"
              }`}
            >

              <span className=" md:text-lg text-xs font-medium">Student</span>
            </div>
            <div
              className={`w-8 h-px ${
                selectedStudent ? "bg-green-300" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                selectedStudent ? "text-blue-600" : "text-gray-400"
              }`}
            >

              <span className=" md:text-lg  text-xs font-medium">Marks</span>
            </div>
          </div>
        </div>

        {/* Class Selection */}
         <div className="mb-3 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <BookOpen className="w-6 h-6 text-white mt-2" />
                    <h2 className="mt-2 text-base md:text-xl font-semibold text-white">
                      Select a Class
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
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

        {/* Term Selection */}
        {selectedClass && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-sm md:text-2xl font-semibold text-gray-800">
                Select Term
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {allTerms.map((term) => (
                <button
                  key={term.id}
                  className={`px-6 py-3 rounded-full border-2 font-medium transition-all duration-200 ${
                    selectedTerm === term.id
                      ? "border-green-500 bg-green-500 text-white shadow-lg"
                      : "border-green-200 text-green-700 hover:border-green-400 hover:bg-green-50"
                  }`}
                  onClick={() => handleTermSelect(term.id)}
                >
                  {term.name} {term.year}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Student Selection */}
        {selectedTerm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Select Student
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleStudentSelect(student)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedStudent === student
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      src={getImageUrl(student.image)}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-gray-200"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {student.place}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Marks Entry */}
        {selectedStudent && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center mb-6">
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Enter Marks for {selectedStudent.name}
              </h2>
            </div>
            {selectedClass.subjects && selectedClass.subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedClass.subjects.map((subject) => (
                  <div key={subject.subject_id} className="space-y-2">
                    <label className="block font-semibold text-gray-700 text-lg">
                      {subject.name}
                    </label>
                    <input
                      type="number"
                      value={marks[subject.id] || ""}
                      onChange={(e) =>
                        handleMarkChange(subject.id, e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-lg"
                      placeholder="Enter marks"
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  No subjects available for this class.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {selectedStudent && selectedTerm && (
          <div className="text-center animate-in slide-in-from-bottom duration-300">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-700 shadow-lg hover:shadow-xl"
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Progress"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkProgressTCH;
