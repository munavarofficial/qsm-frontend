import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

function AttendnaceTopers() {
  const [topers, setTopers] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchTopers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/get-attendance-topers/`
      );
      setTopers(response.data); // Set the fetched data to state
    } catch (error) {
      console.error("Failed to fetch attendance toppers:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchTopers();
  }, [fetchTopers]);

  return (
    <div>
      <div className="">
        <h3 className="text-sm md:text-xl font-bold bg-white rounded p-3 mb-4 sm:text-lg text-gray-500 shadow-xl text-center">
          Attendance Toppers
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="items-center p-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all duration-200 text-xs sm:text-sm">
              <tr>
                <th className="p-2 sm:p-3 text-left">Name</th>
                <th className="p-2 sm:p-3 text-left">Parent's Name</th>
                <th className="p-2 sm:p-3 text-left">Class</th>
                <th className="p-2 sm:p-3 text-left">Attendance %</th>
              </tr>
            </thead>

            <tbody>
              {topers.length > 0 ? (
                topers.map((student, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3 text-sm sm:text-base">{student.name}</td>
                    <td className="p-3 text-sm sm:text-base">
                      {student.father_name}
                    </td>
                    <td className="p-3 text-sm sm:text-base">
                      {student.class_name}
                    </td>
                    <td className="p-3  text-green-700 text-sm sm:text-base">
                      {student.attendance_percentage.toFixed(2)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-3 text-center text-sm sm:text-base text-gray-500"
                  >
                    No attendance toppers available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendnaceTopers;
