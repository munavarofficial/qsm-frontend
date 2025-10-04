import React, { useState, useEffect, useCallback } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { BookOpen, Users, TrendingUp } from 'lucide-react';
import axios from 'axios';
ChartJS.register(ArcElement, Tooltip, Legend);

function ClassWiseAtndPie() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({ present: 0, absent: 0 });
  const [loading, setLoading] = useState(false);

  // const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/get-all-classes/`);
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, [backendUrl]);

  const fetchAttendanceData = useCallback(async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/class-attendance-summery/${classId}/`);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendanceData(selectedClass);
    }
  }, [selectedClass, fetchAttendanceData]);

  const handleClassChange = (e) => {
    const selectedId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedClass(selectedId);
    if (selectedId) {
      fetchAttendanceData(selectedId);
    }
  };

  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendanceData.present, attendanceData.absent],
        backgroundColor: ['#098a04', '#eb0505'],
        borderWidth: 0,
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    cutout: '65%',
  };

  return (
    <div className="w-full">
      {/* Title + Dropdown with gradient background */}
      <div className="flex items-center justify-between bg-white rounded-xl py-1 px-2 mb-6 shadow-sm  border-blue-100">
        <div className="flex justify-center space-x-2">
          <h3 className="text-sm md:text-xl font-bold text-gray-500 text-center">
            Class Attendance :
          </h3>
        </div>
        <select
          id="classSelect"
          className="border-1 border-blue-200 rounded-lg p-3 text-xs md:text-base bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300  hover:shadow-md"
          value={selectedClass || ''}
          onChange={handleClassChange}
        >
          <option value="">-- Select a Class --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.std}
            </option>
          ))}
        </select>
      </div>

      {/* Chart / Message with enhanced animations */}
      <div className="">
        <div className="flex items-center justify-center h-64">
          {!selectedClass ? (
            <div className="text-center space-y-6">
              {/* Animated Icons */}
              <div className="flex justify-center space-x-2 mb-4">
                <div className="animate-bounce" style={{ animationDelay: '0ms' }}>
                  <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg">
                    <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="animate-bounce" style={{ animationDelay: '150ms' }}>
                  <div className="p-3 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-lg">
                    <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="animate-bounce" style={{ animationDelay: '300ms' }}>
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg">
                    <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Main Message */}
              <div className="space-y-2">
                <h4 className="text-sm md:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                  Ready to Analyze Attendance
                </h4>
                <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
                  Please select a class from the dropdown above
                </p>
              </div>

                    {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
            </div>
          ) : loading ? (
            <div className="text-center space-y-4">
              {/* Loading Spinner */}
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 font-medium">Loading attendance data...</p>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <Doughnut data={data} options={options} />
              {/* Center Label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {attendanceData.present + attendanceData.absent}
                </div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassWiseAtndPie;