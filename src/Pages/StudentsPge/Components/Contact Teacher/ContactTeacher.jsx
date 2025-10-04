import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Phone,
  Mail,
  MessageCircle,
  User,
  GraduationCap,
  MapPin,
  Calendar,
} from "lucide-react";

function ContactTeacher() {
  const studentDetails = JSON.parse(localStorage.getItem("student"));
  const [teacherDetails, setTeacherDetails] = useState(null); // Store teacher details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const std = studentDetails ? studentDetails.std : null;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!std) {
      setError("Class details not available");
      setLoading(false);
      return;
    }

    const fetchTeacherDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/students/class-teacher/${std}/`,
          { withCredentials: true }
        );
        if (response.data) {
          setTeacherDetails(response.data);
        } else {
          setError("Class teacher not found");
        }
      } catch (err) {
        setError("Failed to fetch teacher details");
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [std, backendUrl]);

  const handleCall = (number) => {
    window.open(`tel:${number}`);
  };

  const handleWhatsApp = (number) => {
    const whatsappURL = `https://wa.me/${number}`;
    window.open(whatsappURL, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading class teacher details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-lg font-medium text-red-600 text-center">
            {error}
          </p>
        </div>
      </div>
    );
  }
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="container mx-auto mt-2">
        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <h2 className="text-xl md:text-3xl font-bold mb-2">
                {teacherDetails?.name}
              </h2>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <p className="text-blue-100">{teacherDetails?.place}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Image */}
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="relative">
                  {teacherDetails?.image ? (
                    <img
                      src={getImageUrl(teacherDetails?.image)}
                      alt={`${teacherDetails?.name}'s profile`}
                      className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                      <User className="w-20 h-20 text-gray-500" />
                    </div>
                  )}
                  <div className="text-xs text-center absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full  font-medium">
                    Class Teacher
                  </div>
                </div>


              </div>

              {/* Teacher Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-blue-600 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-800">
                            {teacherDetails?.phone_no}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-sm font-medium text-gray-800">
                            {teacherDetails?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-blue-600 mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
                      Teacher's Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Location : </span>
                        <span className="font-medium text-gray-800">
                          {teacherDetails?.place}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status : </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="w-8 h-8 text-blue-600" />
                    </div>
                    <h5 className="text-sm font-semibold text-blue-600 mb-2">
                      Islamic Qualifications
                    </h5>
                    <p className="text-sm text-gray-600">
                      {teacherDetails?.islamic_qualification}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="w-8 h-8 text-green-600" />
                    </div>
                    <h5 className="text-sm font-semibold text-blue-600 mb-2">
                      Academic Qualifications
                    </h5>
                    <p className="text-sm text-gray-600">
                      {teacherDetails?.academic_qualification}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Last updated on {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleCall(teacherDetails?.phone_no)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => handleWhatsApp(teacherDetails?.phone_no)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactTeacher;
