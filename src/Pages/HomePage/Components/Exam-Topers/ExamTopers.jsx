import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

function ExamTopers() {
  const [topers, setTopers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

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
      setLoading(false); // Set loading to false after fetch attempt
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
        <p>Loading...</p> // Show a loading message while fetching data
      ) : topers.length === 0 ? (
        <p className="text-gray-500">Exam Topers will update soon</p> // Show message if no toppers available
      ) : (
        // Grid Container
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topers.map((group, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-2 flex flex-col space-y-2"
            >
              {/* Grade Title */}
              <h4 className="text-sm md:text-lg font-semibold text-gray-500">{`Class ${group.std}`}</h4>
              <div className="overflow-x-auto">
                {/* Toppers Table */}
                <table className="min-w-full text-left text-sm">
                  <thead className="items-center p-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all duration-200 text-xs sm:text-sm">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Parent</th>
                      <th className="p-2">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* First Topper */}
                    <tr className="border-b hover:bg-gray-100 transition duration-200">

                      <td className="p-2">{group.first_name}</td>
                      <td className="p-2">{group.first_father_name}</td>
                      <td className="p-2 text-green-700 font-semibold">
                        {group.first_score}
                      </td>
                    </tr>

                    {/* Second Topper */}
                    <tr className="border-b hover:bg-gray-100 transition duration-200">

                      <td className="p-2">{group.second_name}</td>
                      <td className="p-2">{group.second_father_name}</td>
                      <td className="p-2 text-green-700 font-semibold">
                        {group.second_score}
                      </td>
                    </tr>

                    {/* Third Topper */}
                    <tr className="border-b hover:bg-gray-100 transition duration-200">
                      
                      <td className="p-2">{group.third_name}</td>
                      <td className="p-2">{group.third_father_name}</td>
                      <td className="p-2 text-green-700 font-semibold">
                        {group.third_score}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExamTopers;
