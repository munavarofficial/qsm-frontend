import React, { useState, useEffect } from "react";
import axios from "axios";

function AddNormalTchr() {
  const [teacherData, setTeacherData] = useState({
    name: "",
    father_name: "",
    blood_grp: "",
    msr_no: "",
    salary: "",
    joined_date: "",
    islamic_qualification: "",
    academic_qualification: "",
    other_occupation: "",
    phone_no: "",
    email: "",
    address: "",
    place: "",
    reg_no: "",
    password: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState(""); // ✅ Store CSRF token

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Fetch CSRF Token on Mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/authority/csrf-token/`,
          {
            credentials: "include", // ✅ Ensures CSRF cookie is set
          }
        );
        const data = await response.json();
        setCsrfToken(data.csrfToken); // ✅ Store CSRF token in state
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setTeacherData({
      ...teacherData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in teacherData) {
      formData.append(key, teacherData[key]);
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/authority/add-new-teacher/`,
        formData, // ✅ Corrected: Send formData properly
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken, // ✅ Include CSRF token
          },
          withCredentials: true, // ✅ Ensures session authentication
        }
      );

      if (response.status === 201) {
        // ✅ Corrected: Check response status properly
        setMessage("Teacher added successfully!");
        setTeacherData({
          // ✅ Reset form after successful submission
          name: "",
          father_name: "",
          blood_grp: "",
          msr_no: "",
          salary: "",
          joined_date: "",
          islamic_qualification: "",
          academic_qualification: "",
          other_occupation: "",
          phone_no: "",
          email: "",
          address: "",
          place: "",
          reg_no: "",
          image: null,
          password:''
        });
      } else {
        setMessage(
          `Failed to add teacher: ${response.data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      console.error("Error adding teacher:", error);
    }
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 pt-4 p-3 rounded-xl mb-4">
            <h2 className="text-base md:text-2xl font-semibold text-white text-center">Teacher Registration Form</h2>
            <p className="text-sm text-blue-100 mt-1 text-center">Please provide accurate information for all fields</p>
          </div>

        <form
  onSubmit={handleSubmit}
  encType="multipart/form-data"
  className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6"
>
  <h2 className="text-base md:text-2xl font-bold text-gray-800 mb-4 text-center">
    Teacher Registration
  </h2>

  {/* Grid Fields */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column */}
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={teacherData.name}
          onChange={handleChange}
          placeholder="Teacher Name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">
          Place
        </label>
        <input
          type="text"
          id="place"
          name="place"
          value={teacherData.place}
          onChange={handleChange}
          placeholder="Place"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="father_name" className="block text-sm font-medium text-gray-700 mb-1">
          Father's Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="father_name"
          name="father_name"
          value={teacherData.father_name}
          onChange={handleChange}
          placeholder="Father Name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={teacherData.address}
          onChange={handleChange}
          rows="3"
          placeholder="Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="blood_grp" className="block text-sm font-medium text-gray-700 mb-1">
            Blood Group
          </label>
          <input
            type="text"
            id="blood_grp"
            name="blood_grp"
            value={teacherData.blood_grp}
            onChange={handleChange}
            placeholder="Blood Group"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="msr_no" className="block text-sm font-medium text-gray-700 mb-1">
            MSR Number
          </label>
          <input
            type="text"
            id="msr_no"
            name="msr_no"
            value={teacherData.msr_no}
            onChange={handleChange}
            placeholder="MSR Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="other_occupation" className="block text-sm font-medium text-gray-700 mb-1">
          Other Occupation
        </label>
        <input
          type="text"
          id="other_occupation"
          name="other_occupation"
          value={teacherData.other_occupation}
          onChange={handleChange}
          placeholder="Other Occupation"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <div>
        <label htmlFor="joined_date" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Joining
        </label>
        <input
          type="date"
          id="joined_date"
          name="joined_date"
          value={teacherData.joined_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
          Salary
        </label>
        <input
          type="number"
          step="0.01"
          id="salary"
          name="salary"
          value={teacherData.salary}
          onChange={handleChange}
          min="0"
          placeholder="Salary"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="islamic_qualification" className="block text-sm font-medium text-gray-700 mb-1">
          Islamic Qualification
        </label>
        <input
          type="text"
          id="islamic_qualification"
          name="islamic_qualification"
          value={teacherData.islamic_qualification}
          onChange={handleChange}
          placeholder="Islamic Qualification"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="academic_qualification" className="block text-sm font-medium text-gray-700 mb-1">
          Academic Qualification
        </label>
        <input
          type="text"
          id="academic_qualification"
          name="academic_qualification"
          value={teacherData.academic_qualification}
          onChange={handleChange}
          placeholder="Academic Qualification"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="phone_no"
          name="phone_no"
          value={teacherData.phone_no}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={teacherData.email}
          onChange={handleChange}
          placeholder="abc@gmail.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="reg_no" className="block text-sm font-medium text-gray-700 mb-1">
          Admission Number
        </label>
        <input
          type="text"
          id="reg_no"
          name="reg_no"
          value={teacherData.reg_no}
          onChange={handleChange}
          placeholder="Admission Number With QSM"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="text"
          id="password"
          name="password"
          value={teacherData.password}
          onChange={handleChange}
          placeholder="Password With DOB"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>
    </div>
  </div>

  {/* Image Upload */}
  <div>
    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
      Image
    </label>
    <input
      type="file"
      id="image"
      name="image"
      onChange={handleImageChange}
      className="w-full text-sm text-gray-600"
    />
    {teacherData.image && (
      <img
        src={URL.createObjectURL(teacherData.image)}
        alt="Preview"
        className="mt-3 w-36 h-36 rounded-xl object-cover border border-gray-200 shadow-sm"
      />
    )}
  </div>

  {/* Message */}
  {message && (
    <div className="mt-4 p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 text-blue-800 flex items-center space-x-2">
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
        />
      </svg>
      <span className="text-sm sm:text-base">{message}</span>
    </div>
  )}

  {/* Submit Button */}
  <div className="text-center">
    <button
      type="submit"
      className="mt-4 text-white bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all font-semibold rounded-xl px-16 py-3 shadow-md"
    >
      Submit
    </button>
  </div>
</form>


        </div>
      </div>
    </div>
  );
}

export default AddNormalTchr;
