import React, { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap } from "lucide-react";

function SetClasses() {
  const [formData, setFormData] = useState({
    std: "",
    time_table: null,
    exam_time_table: null,
    class_teacher: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/authority/csrf-token/`,
          {
            withCredentials: true,
          }
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  // ✅ Fetch teachers from the backend
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/dashboard/all-teachers-only/`,
          {
            withCredentials: true,
          }
        );
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setMessage("Failed to load teacher data. Please try again later.");
      }
    };

    fetchTeachers();
  }, [backendUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData({ ...formData, [name]: file });
  };

  // ✅ Submit form with CSRF and withCredentials
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("std", formData.std);
    if (formData.time_table)
      formDataToSend.append("time_table", formData.time_table);
    if (formData.exam_time_table)
      formDataToSend.append("exam_time_table", formData.exam_time_table);
    if (formData.class_teacher)
      formDataToSend.append("class_teacher", formData.class_teacher);

    try {
      const response = await axios.post(
        `${backendUrl}/api/principal/add-standard/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken, // ✅ Set CSRF header
          },
          withCredentials: true, // ✅ Send session cookies
        }
      );

      if (response.status === 201) {
        setMessage("Standard created successfully!");
        setFormData({
          std: "",
          time_table: null,
          exam_time_table: null,
          class_teacher: "",
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("Error submitting the form.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Create New Standard
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Create New Standard with Details
                </p>
              </div>
            </div>
          </div>
        </div>



      <form
  onSubmit={handleSubmit}
  className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100"
>
  {/* Standard Name */}
  <div>
    <label
      htmlFor="std"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Standard Name
    </label>
    <input
      type="text"
      id="std"
      name="std"
      value={formData.std}
      onChange={handleInputChange}
      required
      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
      placeholder="Enter class name"
    />
  </div>

  {/* Time Table */}
  <div>
    <label
      htmlFor="time_table"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Time Table
    </label>
    <input
      type="file"
      id="time_table"
      name="time_table"
      onChange={handleFileChange}
      accept="image/*"
      className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
  </div>

  {/* Exam Time Table */}
  <div>
    <label
      htmlFor="exam_time_table"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Exam Time Table
    </label>
    <input
      type="file"
      id="exam_time_table"
      name="exam_time_table"
      onChange={handleFileChange}
      accept="image/*"
      className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
  </div>

  {/* Class Teacher */}
  <div>
    <label
      htmlFor="class_teacher"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Class Teacher
    </label>
    <select
      id="class_teacher"
      name="class_teacher"
      value={formData.class_teacher}
      onChange={handleInputChange}
      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
    >
      <option value="">Select a teacher</option>
      {teachers.map((teacher) => (
        <option key={teacher.id} value={teacher.id}>
          {teacher.name}
        </option>
      ))}
    </select>
  </div>
{message && (
  <div
    className={`p-2 rounded-md text-white font-medium ${
      message.toLowerCase().includes("error")
        ? "bg-red-500"
        : "bg-green-500"
    }`}
  >
    {message}
  </div>
)}


  {/* Submit Button */}
  <div className="pt-4">
    <button
      type="submit"
      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200"
    >
      Create Standard
    </button>
  </div>
</form>

      </div>
    </div>
  );
}

export default SetClasses;
