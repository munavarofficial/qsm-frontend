import React, { useState, useEffect } from 'react';
import ExamTimeTable from './ExamTimeTable';
import {  Clock, BookOpen, GraduationCap, CalendarDays } from 'lucide-react';

function TimeTable() {
  const [timetableImage, setTimetableImage] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/dashboard/get-all-classes/`);
        const data = await response.json();
        setClasses(data.classes);
      } catch (error) {
        console.log("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [backendUrl]);

  const fetchTimeTable = async (classId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/students/time-table/${classId}/`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );
      const data = await response.json();
      console.log("Fetched timetable data:", data);
      setTimetableImage(data.timetable_url || null);
    } catch (error) {
      console.log("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    if (classId) {
      fetchTimeTable(classId);
    } else {
      setTimetableImage(null);
    }
  };

  // Mock ExamTimeTable component for demo

const getImageUrl = (url) => (url?.startsWith('http') ? url : `${backendUrl}${url}`);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-1">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <CalendarDays className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl  ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Time Table
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Check Your Class time table
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Glass morphism header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 border-b border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap className="w-6 h-6 text-white" />
              <label htmlFor="classSelect" className="text-lg font-semibold text-white">
                Select Your Class
              </label>
            </div>

            <div className="relative">
              <select
                id="classSelect"
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full px-6 py-4 text-lg font-medium bg-white border-2 border-blue-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-300 appearance-none cursor-pointer hover:bg-white/90"
              >
                <option value="">Choose your class...</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    Class {classItem.std}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin opacity-0 transition-opacity duration-300"
                     style={{ opacity: loading ? 1 : 0 }}></div>
                {!loading && (
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your timetable...</p>
              </div>
            ) : timetableImage ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <Clock className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Your Class Schedule</h2>
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                    <img
                      src={getImageUrl(timetableImage)}
                      alt="Class Timetable"
                      className="w-full h-auto rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>
                </div>

                {/* Download/Print Actions */}
                <div className="flex justify-center space-x-4 pt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300/50">
                    Download PDF
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300/50">
                    Print Schedule
                  </button>
                </div>
              </div>
            ) : selectedClass ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarDays className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Timetable Available</h3>
                <p className="text-gray-500">The class schedule for this class hasn't been uploaded yet.</p>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-2">Ready to View Your Schedule?</h3>
                <p className="text-gray-500">Select your class from the dropdown above to view your class timetable.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            Quick Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Keep your timetable handy for daily class planning</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Note any room changes or special announcements</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Download for offline access during school hours</span>
            </div>
          </div>
        </div>

        {/* ExamTimeTable Component */}
        <ExamTimeTable />
      </div>
    </div>
  );
}

export default TimeTable;