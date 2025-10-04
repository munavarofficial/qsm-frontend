import React, { useEffect, useState, useCallback } from 'react';
import { BookOpen, Calendar, Award, TrendingUp, User, GraduationCap } from 'lucide-react';
import axios from "axios";
function StudentsProgressSTD() {
  const studentDetails = JSON.parse(localStorage.getItem("student"));
  const currentYear = new Date().getFullYear();
  const [progressReport, setProgressReport] = useState(null);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProgressReport = useCallback(async (studentId, year = '') => {
    try {
      const url = `${backendUrl}/api/students/student-progress/${studentId}/?year=${year}`;
      const response = await axios.get(url, { withCredentials: true });
      setProgressReport(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Progress will be updated soon');
      setProgressReport(null);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (studentDetails) {
      fetchProgressReport(studentDetails.id, selectedYear);
    }
  }, [studentDetails, selectedYear, fetchProgressReport]);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    fetchProgressReport(studentDetails.id, year);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Report</h3>
            <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progressReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Progress Report</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredExams = progressReport.progress_report.filter(exam => {
    return selectedYear === '' || exam.term_year.toString() === selectedYear;
  });

  const examsByTerm = filteredExams.reduce((acc, exam) => {
    const termKey = `${exam.term_name} ${exam.term_year}`;
    if (!acc[termKey]) {
      acc[termKey] = [];
    }
    acc[termKey].push(exam);
    return acc;
  }, {});

  const getGradeColor = (marks) => {
    if (marks >= 90) return 'text-green-700 bg-green-50 border-green-200'; // more green
    if (marks >= 80) return 'text-green-600 bg-green-50 border-green-200'; // more green
    if (marks >= 70) return 'text-green-500 bg-green-50 border-green-200'; // green
    if (marks >= 50) return 'text-green-400 bg-green-50 border-green-200'; // light green
    if (marks >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200'; // yellow
    return 'text-red-600 bg-red-50 border-red-200'; // below 40 → red
  };


  return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-1 sm:p-0 mb-6 pb-4">
          {/* Header */}
                <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                          <GraduationCap className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Students Progress
                          </h1>

                          <p className="text-sm text-gray-600 mt-1 ms-2">
                            Analyze Progress Report
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

          {/* Student Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6" />
                <div>
                  <p className="text-blue-100 text-sm">Student Name</p>
                  <p className="font-semibold text-lg">{progressReport.student_name}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6" />
                <div>
                  <p className="text-indigo-100 text-sm">Class</p>
                  <p className="font-semibold text-lg">{progressReport.class}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-center text-base md:text-xl font-semibold text-blue-600">Academic Performance</h2>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Academic Year:</label>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="">All Years</option>
                {Array.from(new Set(progressReport.progress_report.map(exam => exam.term_year))).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Progress Report Content */}
        {Object.keys(examsByTerm).length > 0 ? (
          <div className="space-y-6">
            {Object.keys(examsByTerm).map((term, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{term}</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {examsByTerm[term].map((exam, idx) => (
                      <div key={idx} className="group hover:shadow-md transition-all duration-200 rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{exam.subject_name}</h4>
                              <p className="text-sm text-gray-600">Subject Performance</p>
                            </div>
                          </div>
                          <div className={`px-3 py-2 rounded-lg border font-bold text-lg ${getGradeColor(exam.marks)}`}>
                            <span className='text-sm'>{exam.marks} marks</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{width: `${Math.min(exam.marks, 100)}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600">No marks available for the selected year.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentsProgressSTD;