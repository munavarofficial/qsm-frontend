import React, { useState, useEffect } from "react";
import {
  Upload,
  Calendar,
  BookOpen,
  CheckCircle,
  AlertCircle,
  School,
} from "lucide-react";

function AddTimeTables() {
  const [classes, setClasses] = useState([]); // State to store class options
  const [classId, setClassId] = useState("");
  const [timeTable, setTimeTable] = useState(null);
  const [examTimeTable, setExamTimeTable] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/dashboard/get-all-classes/`
        );
        const data = await response.json();
        setClasses(data.classes); // Assuming the API returns a list of classes
      } catch (err) {
        setError("Failed to fetch classes. Please try again later.");
        console.log(err)
      }
    };
    fetchClasses();
  }, [backendUrl]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!classId) {
      setError("Please select a class.");
      setMessage("");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("time_table", timeTable);
    formData.append("exam_time_table", examTimeTable);

    try {
      const response = await fetch(
        `${backendUrl}/api/teachers/add-timetable/${classId}/`,
        {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
        // Reset form
        setTimeTable(null);
        setExamTimeTable(null);
        // Reset file inputs
        document.getElementById("timeTable").value = "";
        document.getElementById("examTimeTable").value = "";
      } else {
        setError(
          data.error || "Failed to upload timetables. Please try again."
        );
        setMessage("");
      }
    } catch (err) {
      setError("Failed to upload timetables. Please try again.");
      console.log(err)
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  console.log("classes", classes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="md:text-2xl text-base font-bold text-blue-600">
                Upload Time Table
              </h3>
              <p className="text-sm text-gray-600">Upload and Manage Time Tables </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-8 py-6">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Add New Timetables
            </h2>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Class Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="classId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="classId"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Choose a class to upload timetables
                    </option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        Class {cls.std}
                      </option>
                    ))}
                  </select>
                  <BookOpen className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Regular Timetable */}
                <div className="space-y-2">
                  <label
                    htmlFor="timeTable"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Class Timetable
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="timeTable"
                      className="hidden"
                      onChange={(e) => setTimeTable(e.target.files[0])}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label
                      htmlFor="timeTable"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {timeTable
                          ? timeTable.name
                          : "Click to upload class timetable"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PDF, DOC, or Image files
                      </span>
                    </label>
                  </div>
                </div>

                {/* Exam Timetable */}
                <div className="space-y-2">
                  <label
                    htmlFor="examTimeTable"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Exam Timetable
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="examTimeTable"
                      className="hidden"
                      onChange={(e) => setExamTimeTable(e.target.files[0])}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label
                      htmlFor="examTimeTable"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {examTimeTable
                          ? examTimeTable.name
                          : "Click to upload exam timetable"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PDF, DOC, or Image files
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleFileUpload}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-500 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Timetables
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Success!</p>
                  <p className="text-green-700 text-sm">{message}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTimeTables;
