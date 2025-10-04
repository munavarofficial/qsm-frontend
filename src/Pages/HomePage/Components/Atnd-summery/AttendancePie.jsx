import React, { useCallback, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Clock, Users, Calendar } from 'lucide-react';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

function AttendancePie() {
  const [attendance, setAttendance] = useState(null);

  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchSummary = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/attendance-summery/`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance summary:', error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return <div>Loading attendance data...</div>;
  }

  if (!attendance) {
    return <div>Failed to load attendance data.</div>;
  }

  const data = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [
          attendance.total_present || 0,
          attendance.total_absent || 0,
          attendance.total_late || 0,
        ],
        backgroundColor: ['#098a04', '#eb0505', '#f5a623'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Modern Animation Component for "Attendance will update soon"
  const AttendanceUpdateAnimation = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-8 mt-5">
      {/* Floating Icons Animation */}
      <div className="relative mb-3">
        {/* Central Clock Icon */}
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Clock className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Orbiting Icons */}
        <div className="absolute inset-0 w-32 h-32 -translate-x-8 -translate-y-8">
          {/* Users Icon */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Calendar Icon */}
          <div className="absolute bottom-0 right-0 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Additional floating element */}
          <div className="absolute bottom-0 left-0 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2s' }}>
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full shadow-md opacity-80"></div>
          </div>
        </div>

        {/* Ripple Effect */}
        <div className="absolute inset-0 w-32 h-32 -translate-x-8 -translate-y-8">
          <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-20"></div>
          <div className="absolute inset-4 rounded-full border-2 border-purple-300 animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-8 rounded-full border-2 border-indigo-300 animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Text with gradient and animation */}
      <div className="text-center space-y-2 mt-5">
        <h4 className="text-sm md:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
          Attendance Update in Progress
        </h4>
        <p className="text-gray-600 text-sm md:text-base font-medium">
          Refreshing data for today's summary...
        </p>

        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Title always shown */}
      <h3 className="text-sm md:text-xl font-bold bg-white rounded p-3 mb-4 sm:text-lg text-gray-500 shadow-xl text-center">
        Today's Attendance Summary
      </h3>

      {/* Chart area */}
      <div className="flex items-center justify-center h-64">
        {attendance.attendance_marked === false ? (
          <AttendanceUpdateAnimation />
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default AttendancePie;