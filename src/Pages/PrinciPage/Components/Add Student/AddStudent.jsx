import React, { useState, useEffect } from "react";
import { User, Users, MapPin, Calendar, Phone, Droplet, School, Hash, FileImage, Briefcase, Home } from "lucide-react";

function AddStudent() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "M",
    parent_name: "",
    parent_occupation: "",
    address: "",
    reg_no: "",
    std: "",
    password: "",
    former_school: "",
    admission_no: "",
    admission_date: "",
    image: null,
    phone_no: "",
    blood_grp: "",
    place: "",
  });

  const [csrfToken, setCsrfToken] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [standards, setStandards] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Get CSRF
    fetch(`${backendUrl}/api/principal/csrf-token/`)
    .then(res => res.json())
    .then((data) => {
      setCsrfToken(data.csrfToken);
    });
  }, [backendUrl]);

  // ✅ Get Standards
  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/dashboard/get-all-classes/`);
        const data = await response.json();
        setStandards(data.classes);
      } catch (error) {
        console.error("Error fetching standards:", error);
      }
    };
    fetchStandards();
  }, [backendUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });

      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    }

    fetch(`${backendUrl}/api/principal/add-student/`, {
      method: 'POST',
      body: form,
      headers: {
        "X-CSRFToken": csrfToken,
      },
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          setSuccess("Student added successfully!");
          setError("");
          // Reset form data
          setFormData({
            name: "",
            gender: "M",
            parent_name: "",
            parent_occupation: "",
            address: "",
            std: "",
            reg_no: "",
            password: "",
            former_school: "",
            admission_no: "",
            admission_date: "",
            image: null,
            phone_no: "",
            blood_grp: "",
            place: "",
          });
          setImagePreview(null);
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch((err) => {
        setError("Something went wrong! Please try again.",err);
        setSuccess("");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    // Reset file input
    const fileInput = document.querySelector('input[name="image"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Add Students
                </h1>
                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Add New Students to Register
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Personal Information Section */}
            <div className="mb-8">
              <h3 className="text-sm md:text-xl font-semibold text-blue-600 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter student's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="blood_grp"
                      value={formData.blood_grp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., A+, B-, O+"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="phone_no"
                      value={formData.phone_no}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Place</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter place"
                    />
                  </div>
                </div>

                {/* Image Preview and Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Photo</label>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative flex-shrink-0">
                      <FileImage className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 z-10" />
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full md:w-auto pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {imagePreview && (
                      <div className="relative">
                        <div className="w-32 h-32 border-2 border-blue-200 rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  {!imagePreview && (
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a photo of the student (optional)
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter complete address"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Parent Information Section */}
            <div className="mb-8">
              <h3 className="text-sm md:text-lg font-semibold text-blue-600 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Parent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name *</label>
                  <input
                    type="text"
                    name="parent_name"
                    value={formData.parent_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter parent's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="parent_occupation"
                      value={formData.parent_occupation}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="mb-8">
              <h3 className="text-sm md:text-lg font-semibold text-blue-600 mb-6 flex items-center">
                <School className="w-5 h-5 mr-2 text-blue-600" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standard *</label>
                  <select
                    name="std"
                    value={formData.std}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Standard</option>
                    {standards.map((std) => (
                      <option key={std.id} value={std.id}>{std.std}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Former School</label>
                  <input
                    type="text"
                    name="former_school"
                    value={formData.former_school}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter previous school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admission Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="admission_no"
                      value={formData.admission_no}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter admission number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admission Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="admission_date"
                      value={formData.admission_date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reg Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="reg_no"
                      value={formData.reg_no}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter Reg_no With QSM"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter Password "
                  />
                </div>
              </div>
            </div>

            {/* Alerts */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-200 shadow-lg transform hover:-translate-y-0.5 ${
                  isSubmitting
                    ? 'opacity-70 cursor-not-allowed hover:from-blue-600 hover:to-purple-600'
                    : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Student...
                  </div>
                ) : (
                  'Add Student'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;