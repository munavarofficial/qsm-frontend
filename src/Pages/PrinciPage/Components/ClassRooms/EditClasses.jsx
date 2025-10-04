import React, { useState, useEffect } from "react";
import { Upload, Users, Calendar, BookOpen, Check, Loader2, Edit3,GraduationCap } from "lucide-react";

function EditClasses() {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    std: "",
    class_teacher: "",
    time_table: null,
    exam_time_table: null,
  });
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/principal/csrf-token/`,
          {
            credentials: 'include',
            method: 'GET'
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

  // Fetch all classes
  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/dashboard/get-all-classes/`
        );
        if (!response.ok) throw new Error("Failed to fetch classes");
        const data = await response.json();
        setAllClasses(data.classes || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchAllClasses();
  }, [backendUrl]);

  // Fetch all teachers
  useEffect(() => {
    const fetchAllTeachers = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/principal/all-teacher/`,
          {
            credentials: 'include',
            method: 'GET'
          }
        );
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchAllTeachers();
  }, [backendUrl]);

  // Handle class selection
  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setFormData({
      std: classData.std,
      class_teacher: classData.class_teacher || "",
      time_table: null,
      exam_time_table: null,
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission with CSRF + credentials
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData); // Debugging

    if (!selectedClass) return alert("Please select a class to edit!");

    try {
      setLoading(true);
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("std", formData.std);
      formDataToSubmit.append("class_teacher", formData.class_teacher);
      if (formData.time_table)
        formDataToSubmit.append("time_table", formData.time_table);
      if (formData.exam_time_table)
        formDataToSubmit.append("exam_time_table", formData.exam_time_table);

      await fetch(
        `${backendUrl}/api/principal/edit-standard/${selectedClass.id}/`,
        {
          method: 'PUT',
          headers: {
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          body: formDataToSubmit,
        }
      );

      setLoading(false);
      alert("Class updated successfully!");
      setSelectedClass(null);
      setFormData({
        std: "",
        class_teacher: "",
        time_table: null,
        exam_time_table: null,
      });
    } catch (error) {
      setLoading(false);
      console.error("Error updating class:", error);
      alert("Failed to update class");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 md:p-6">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-6">
      <div className="p-5 flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
          <Edit3 className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-base md:text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Edit Class Information
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Select a class and update its information, assign teachers
          </p>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Class Selection */}
            <div className="max-w-6xl mx-auto p-2 mb-8">
              <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-blue-600">
                    Select Your Class
                  </h2>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                  {allClasses.map((classData, index) => (
                    <button
                      key={index}
                      onClick={() => handleClassSelect(classData)}
                      className={`group relative overflow-hidden rounded-xl p-2 md:p-4 font-medium transition-all duration-300 ${
                        selectedClass === classData
                          ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105"
                          : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="text-xs md:text-sm opacity-80 ">Class</div>
                        <div className="text-xs md:text-sm font-bold">
                          {classData.std}
                        </div>
                      </div>
                      {selectedClass !== classData && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

      {/* Edit Form Panel */}
      <div className="lg:col-span-2">
        {!selectedClass ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Select a Class to Edit
              </h3>
              <p className="text-gray-500">
                Choose a class from the left panel to start editing its
                information
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
              <h2 className="text-xl font-semibold text-white">
                Editing Class {selectedClass.std}
              </h2>
              <p className="text-green-100 mt-1">
                Update class information below
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Class Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Class Name
                  </label>
                  <input
                    type="text"
                    name="std"
                    value={formData.std}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    placeholder="Enter class name"
                  />
                </div>

                {/* Class Teacher */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Class Teacher
                  </label>
                  <select
                    name="class_teacher"
                    value={formData.class_teacher}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Regular Timetable Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Regular Timetable
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="time_table"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          time_table: e.target.files[0],
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <Upload className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Exam Timetable Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Exam Timetable
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="exam_time_table"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exam_time_table: e.target.files[0],
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    <Upload className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Update Class
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

  );
}

export default EditClasses;