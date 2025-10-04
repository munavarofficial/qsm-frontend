import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {User} from "lucide-react";
function EditStudentInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.selectedStudent || null;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    name: "",
    gender: "M",
    parent_name: "",
    parent_occupation: "",
    address: "",
    std: "",
    former_school: "",
    admission_no: "",
    admission_date: "",
    phone_no: "",
    place: "",
    reg_no: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/principal/csrf-token/`, {
          credentials: "include",
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  // ✅ Load existing student data
  useEffect(() => {
    if (student) {
      const fetchStudentData = async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/principal/edit-student-profile/${student.id}/`,
            { credentials: "include" }
          );
          if (response.ok) {
            const data = await response.json();
            setFormData(data);
            if (data.image) {
              setImagePreview(
                data.image.startsWith("http") ? data.image : `${backendUrl}${data.image}`
              );
            }
          } else {
            console.error("Failed to fetch student data:", response.status);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };
      fetchStudentData();
    }
  }, [student, backendUrl]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] && (key !== "image" || selectedImage)) {
        formDataToSend.append(key, formData[key]);
      }
    }
    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }

    try {
      const { status } = await axios.put(
        `${backendUrl}/api/principal/edit-student-profile/${student.id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (status === 200) {
        alert("Student info updated successfully!");
        navigate("/check-std-Info-princi"); // redirect after update
      } else {
        alert("Unexpected server response.");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
           <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Students Info
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  View Details of students
                </p>
              </div>
            </div>
          </div>
        </div>
<div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-3">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <label className="block font-semibold">Student Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Gender */}
        <label className="block font-semibold">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>

        {/* Parent Name */}
        <label className="block font-semibold">Parent Name</label>
        <input
          type="text"
          name="parent_name"
          value={formData.parent_name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Parent Occupation */}
        <label className="block font-semibold">Parent Occupation</label>
        <input
          type="text"
          name="parent_occupation"
          value={formData.parent_occupation}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Phone */}
        <label className="block font-semibold">Phone Number</label>
        <input
          type="text"
          name="phone_no"
          value={formData.phone_no}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Address */}
        <label className="block font-semibold">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Former School */}
        <label className="block font-semibold">Former School</label>
        <input
          type="text"
          name="former_school"
          value={formData.former_school}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Admission No */}
        <label className="block font-semibold">Admission No</label>
        <input
          type="text"
          name="admission_no"
          value={formData.admission_no}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Admission Date */}
        <label className="block font-semibold">Admission Date</label>
        <input
          type="text"
          name="admission_date"
          value={formData.admission_date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Place */}
        <label className="block font-semibold">Place</label>
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Reg No */}
        <label className="block font-semibold">Registration No</label>
<input
  type="text"
  name="reg_no"
  value={formData.reg_no || ""}
  onChange={handleChange}
  className="w-full border px-3 py-2 rounded-md"
/>


        {/* Password */}
        <label className="block font-semibold">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Image Upload */}
        <label className="block font-semibold">Profile Image</label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            className="w-24 h-24 object-cover rounded-full mb-2"
          />
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Update Student"}
        </button>
      </form>
      </div>
    </div>
    </div>
  );
}

export default EditStudentInfo;
