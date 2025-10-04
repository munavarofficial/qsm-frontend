import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const TeacherInfoAuth = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [showPrincipalDetails, setShowPrincipalDetails] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/authority/csrf-token/`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/authority/all-teachers/`,
          {
            withCredentials: true,
          }
        );
        setTeachers(response.data.teachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    const fetchPrincipal = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/authority/get-principal/`,
          {
            withCredentials: true,
          }
        );
        setPrincipal(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching principal:", error);
      }
    };

    fetchTeachers();
    fetchPrincipal();
  }, [backendUrl]);

  const editProfile = () => {
    navigate("/edit-teacher-info", { state: { selectedTeacher } });
  };

  const removeTeacher = async (teacher_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/authority/delete-teacher/${teacher_id}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/check-teacher-info");
      } else {
        const data = await response.json();
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the teacher.");
    }
  };

  const removePrincipal = async (principal_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this principal? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/authority/delete-principal/${principal_id}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        navigate("/management-details");
      } else {
        const data = await response.json();
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the principal.");
    }
  };

  const togglePrincipalDetails = () => {
    setShowPrincipalDetails(!showPrincipalDetails);
  };

  console.log("principal is ", principal);

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-2xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Teacher Info
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  View Details of Teachers
                </p>
              </div>
            </div>
          </div>
        </div>

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-1">
      <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-3">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedTeacher?.id === teacher.id
                        ? "bg-blue-50 border-2 border-blue-300 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(teacher.image)}
                        alt={teacher.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xs md:text-xl font-medium text-gray-800">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-gray-500">{teacher.place}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            {selectedTeacher && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-3">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <div className="flex items-center">
                    <img
                      src={getImageUrl(selectedTeacher.image)}
                      alt={selectedTeacher.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="ml-6">
                      <h2 className="text-xl md:text-3xl font-bold">
                        {selectedTeacher.name}
                      </h2>
                      <p className="text-blue-100 text-lg">
                        {selectedTeacher.place}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-sm md:text-xl font-semibold text-gray-800 flex items-center mb-4">
                        <span className="w-2 h-6 bg-green-500 rounded-full mr-3"></span>
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            Father:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.father_name}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            DOB:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.dob}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            Blood:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.blood_grp}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            Phone:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.phone_no}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            Email:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-sm md:text-xl font-semibold text-gray-800 flex items-center mb-4">
                        <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
                        Professional Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            Salary:
                          </span>
                          <span className="font-medium text-green-600">
                            ₹{selectedTeacher.salary}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            MSR No:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.msr_no}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            Joined:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.joined_date}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            Islamic:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.islamic_qualification}
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 w-24 text-sm">
                            Academic:
                          </span>
                          <span className="font-medium">
                            {selectedTeacher.academic_qualification}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="mt-8">
                    <h3 className="text-sm md:text-xl font-semibold text-gray-800 flex items-center mb-4">
                      <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 w-32 text-sm">
                          Registration No:
                        </span>
                        <span className="font-medium">
                          {selectedTeacher.reg_no}
                        </span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 w-32 text-sm">
                          Other Job:
                        </span>
                        <span className="font-medium">
                          {selectedTeacher.other_occupation || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-sm block mb-2">
                        Address:
                      </span>
                      <span className="font-medium">
                        {selectedTeacher.address}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 md:gap-2 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={editProfile}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      <span className="text-xs">Edit Profile</span>
                    </button>
                    <button
                      onClick={() => removeTeacher(selectedTeacher.id)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      <span className="text-xs">Remove Teacher</span>
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 text-center">
                  <p className="text-sm text-gray-500">
                    Last updated on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Principal Section */}
          {principal && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl md:2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-purple-600 rounded-full mr-3"></span>
                Principal
              </h2>
              <div
                onClick={togglePrincipalDetails}
                className="flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 bg-purple-50 hover:bg-purple-100 hover:shadow-md"
              >
                <div className="relative">
                  <img
                    src={getImageUrl(principal.image)}
                    alt={principal.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xs md:text-xl font-medium text-gray-800">
                    {principal.name}
                  </h3>
                  <p className="text-sm text-gray-500">{principal.place}</p>
                </div>
              </div>
            </div>
          )}
          {/* Principal Details */}
          {showPrincipalDetails && principal && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <div className="flex items-center">
                  <img
                    src={getImageUrl(principal.image)}
                    alt={principal.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="ml-6">
                    <h2 className="text-3xl font-bold">{principal.name}</h2>
                    <p className="text-purple-100 text-lg">{principal.place}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 w-24 text-sm">DOB:</span>
                      <span className="font-medium">
                        {principal.dob || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 w-24 text-sm">Phone:</span>
                      <span className="font-medium">
                        {principal.phone_no || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => removePrincipal(principal.id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Remove Principal
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 text-center">
                <p className="text-sm text-gray-500">
                  Last updated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherInfoAuth;
