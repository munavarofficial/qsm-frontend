// src/components/TeachersLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

function TeachersLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [regNo, setRegNo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleLogin = async (e) => {
  e.preventDefault();   // ✅ important
  try {
    setError("");
    setIsLoading(true);

    // CSRF token
    const csrfResp = await axios.get(
      `${backendUrl}/api/teachers/csrf-token/`,
      { withCredentials: true }
    );
    const csrfToken = csrfResp?.data?.csrfToken;

    const payload = {
      name,
      password,
      reg_no: regNo,
    };

    // Login request
    const resp = await axios.post(
      `${backendUrl}/api/teachers/login/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );

    const responseData = resp.data;
    localStorage.setItem("teacher", JSON.stringify(responseData.teacher));
    navigate("/teacherspage"); // ✅ must exist in Routes
  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data?.error || "Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  return (
  <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="relative bg-white rounded-lg shadow-lg p-4 w-full max-w-sm text-center sm:p-6 mx-4 sm:mx-0 h-auto">
          {/* Image */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-1 sm:p-2">
            <img
              src="media/teacher3.png"
              alt="Principal"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full"
            />
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mt-16 sm:mt-20 mb-3 sm:mb-4">
            Teacher Login
          </h2>

          <form onSubmit={handleLogin}>
            {/* Name Input */}
            <div className="mb-3 sm:mb-4 text-center">
              <label htmlFor="name" className="block text-gray-800 text-sm">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full mt-1 px-3 py-2 sm:px-4 sm:py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Reg Number Input */}
            <div className="mb-3 sm:mb-4 text-center">
              <label htmlFor="reg_no" className="block text-gray-800 text-sm">
                Register Number
              </label>
              <input
                id="reg_no"
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="Enter Register Number"
                className="w-full mt-1 px-3 py-2 sm:px-4 sm:py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Password with toggle */}
            <div className="mb-3 sm:mb-4 text-center relative">
              <label htmlFor="password" className="block text-gray-800 text-sm">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full mt-1 px-3 py-2 sm:px-4 sm:py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Login Button with Loading State */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-3 sm:mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-2.5 px-4 rounded-lg transition text-sm sm:text-base ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && <div className="text-red-500 text-xs sm:text-sm mt-2">{error}</div>}

          {/* Forgot Password Link */}
          <div className="mt-3 sm:mt-4">
            <a
              href="/support"
              className="text-gray-500 text-xs sm:text-sm hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>
  );
}

export default TeachersLogin;
