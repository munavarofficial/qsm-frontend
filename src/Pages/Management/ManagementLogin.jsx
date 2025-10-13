import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function ManagementLoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Fetch CSRF Token
  const fetchCSRFToken = async () => {
    try {
      const csrfResponse = await fetch(`${backendUrl}/api/authority/csrf-token/`, {
        credentials: "include",
      });
      const csrfData = await csrfResponse.json();
      return csrfData.csrfToken;
    } catch (error) {
      console.error("CSRF fetch error:", error);
      return null;
    }
  };

  // ✅ Handle Login
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    const csrfToken = await fetchCSRFToken();
    if (!csrfToken) {
      setError("Failed to fetch CSRF token.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/authority/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          name: name.trim(),
          number: number.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Store user data
      localStorage.setItem("management", JSON.stringify(data.management));
      setError("");
      navigate("/management-details");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm text-center p-6 sm:p-8 mx-auto min-h-[400px]">
        {/* Profile Image */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-1">
          <img
            src="/media/teacher3.png"
            alt="Management"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full"
          />
        </div>

        {/* Heading */}
        <h2 className="text-lg sm:text-2xl font-semibold text-blue-800 mt-20 mb-4">
          Management Login
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div className="text-left">
            <label htmlFor="name" className="block text-gray-700 text-sm mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Number */}
          <div className="text-left">
            <label htmlFor="number" className="block text-gray-700 text-sm mb-1">
              Number
            </label>
            <input
              id="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter your number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password with Show/Hide */}
          <div className="text-left relative">
            <label htmlFor="password" className="block text-gray-700 text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-2.5 px-4 rounded-lg transition text-sm sm:text-base ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? (
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
                    d="M4 12a8 8 0 018-8V0C5.373
                    0 0 5.373 0 12h4zm2 5.291A7.962
                    7.962 0 014 12H0c0 3.042
                    1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-xs sm:text-sm mt-2">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagementLoginPage;
