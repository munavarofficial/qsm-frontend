import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, User, Clock, BookOpen } from "lucide-react";
import axios from "axios";

function MarkMyRoutine() {
  const [routine, setRoutine] = useState({
    subahi: false,
    luhur: false,
    asar: false,
    maqrib: false,
    isha: false,
    thabaraka: false,
    waqiha: false,
    swalath: false,
    haddad: false,
  });

  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Keep original functionality
  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    if (student) {
      setStudentDetails(student);
    } else {
      console.error("No student found in localStorage");
    }
  }, []);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    if (!studentDetails) {
      alert("No student details found.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Step 1: Get CSRF token
      const csrfResponse = await axios.get(
        `${backendUrl}/api/students/csrf-token/`,
        { withCredentials: true }
      );
      const csrfToken = csrfResponse.data.csrfToken;

      // Step 2: Send POST request with CSRF token and credentials
      await axios.post(
        `${backendUrl}/api/students/mark-daily-routine/${studentDetails.id}/`,
        routine,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setSuccessMessage("Routine successfully updated!");
    } catch (error) {
      console.error("Error submitting routine:", error);
      setErrorMessage("Failed to submit the routine.");
    } finally {
      setLoading(false);
    }
  };

  const routineLabels = {
    subahi: "Subahi",
    luhur: "Dhuhr",
    asar: "Asr",
    maqrib: "Maghrib",
    isha: "Isha ",
    thabaraka: "Thabaraka",
    waqiha: "Waqiah",
    swalath: "Swalath",
    haddad: "Haddad"
  };

  const getCompletionPercentage = () => {
    const completedTasks = Object.values(routine).filter(value => value).length;
    return Math.round((completedTasks / Object.keys(routine).length) * 100);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!studentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in as a student to access your daily routine.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl  ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Mark Daily Routine
                </h1>
                <div className="text-right">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <span className="text-sm font-medium">{getCurrentDate()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-indigo-600">
                  {getCompletionPercentage()}% Complete
                </span>
              </div>
            </div>
              </div>
            </div>

          </div>

          {/* Progress Bar */}
         {/* Progress Bar */}
<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
  <div
    className={`h-full rounded-full transition-all duration-500 ease-out ${
      getCompletionPercentage() < 50
        ? "bg-gradient-to-r from-red-400 to-red-600"
        : getCompletionPercentage() >= 90
        ? "bg-gradient-to-r from-green-600 to-green-800"
        : getCompletionPercentage() >= 75
        ? "bg-gradient-to-r from-green-300 to-green-500"
        : "bg-gradient-to-r from-yellow-400 to-yellow-600"
    }`}
    style={{ width: `${getCompletionPercentage()}%` }}
  />
</div>

        </div>

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-2 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-base md:text-3xl font-bold text-blue-600 mb-2 ">Mark Today's Activities</h2>
            <p className="text-sm text-gray-600">Mark each task done after completing it</p>
          </div>

{/* Routine Grid */}
<div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 mb-8">
  {Object.entries(routine).map(([field, checked]) => (
    <div
      key={field}
      className={`relative group cursor-pointer transition-all duration-300 transform
        ${checked
          ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-200'
          : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg'
        } rounded-2xl p-2 sm:p-2.5 md:p-3 border border-gray-100`}
      onClick={() => handleCheckboxChange({ target: { name: field, checked: !checked } })}
    >
      <div className="flex items-center space-x-1">
        <div className={`transition-all duration-300 ${checked ? 'text-white' : 'text-gray-400'}`}>
          {checked ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-xs md:text-sm ${checked ? 'text-white' : 'text-gray-800'}`}>
            {routineLabels[field]}
          </h3>
          <p className={`text-[10px] sm:text-xs ${checked ? 'text-green-100' : 'text-gray-500'}`}>
            {checked ? 'Completed' : 'Pending'}
          </p>
        </div>
      </div>

      {/* Hidden checkbox */}
      <input
        type="checkbox"
        name={field}
        checked={checked}
        onChange={handleCheckboxChange}
        className="sr-only"
      />


    </div>
  ))}
</div>


          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                loading ? 'animate-pulse' : ''
              }`}
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Routine'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-green-800 ">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Circle className="w-5 h-5 text-red-500" />
                <p className="text-red-800 font-semibold">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarkMyRoutine;