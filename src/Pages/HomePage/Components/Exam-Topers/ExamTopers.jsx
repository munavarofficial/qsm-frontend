import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

function ExamTopers() {
  const [topers, setTopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchTopers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/get-exam-topers/`
      );
      setTopers(response.data);
    } catch (error) {
      console.error("Failed to fetch exam toppers:", error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchTopers();
  }, [fetchTopers]);

  return (
    <div className="">
      <h3 className="text-sm md:text-xl font-bold bg-white rounded p-3 mb-4 sm:text-lg text-gray-500 shadow-xl text-center">
        Top Rankers
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : topers.length === 0 ? (
        <p className="text-gray-500 text-center">Exam Toppers will update soon</p>
      ) : (
        <>
          {/* ✅ Horizontal scroll on mobile */}
          <div className="flex md:hidden overflow-x-auto space-x-1 pb-3">
            {topers.map((group, index) => (
              <div
                key={index}
                className="min-w-[85%] bg-white rounded-lg shadow-md p-3 flex-shrink-0"
              >
                {/* Class Title */}
                <h4 className="text-sm md:text-lg font-semibold text-gray-600 mb-2">
                  Class {group.class}
                </h4>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded text-xs sm:text-sm">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Parent</th>
                        <th className="p-2">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.top_scorers.map((student, i) => (
                        <tr
                          key={i}
                          className="border-b hover:bg-gray-100 transition duration-200"
                        >
                          <td className="p-2 font-medium">{student.student_name}</td>
                          <td className="p-2">{student.father_name}</td>
                          <td className="p-2 text-green-700 font-semibold">
                            {student.total_marks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Grid layout on larger screens */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
            {topers.map((group, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-3 flex flex-col space-y-2"
              >
                <h4 className="text-sm md:text-lg font-semibold text-gray-600">
                  Class {group.class}
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded text-xs sm:text-sm">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Parent</th>
                        <th className="p-2">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.top_scorers.map((student, i) => (
                        <tr
                          key={i}
                          className="border-b hover:bg-gray-100 transition duration-200"
                        >
                          <td className="p-2 font-medium">{student.student_name}</td>
                          <td className="p-2">{student.father_name}</td>
                          <td className="p-2 text-green-700 font-semibold">
                            {student.total_marks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ExamTopers;
