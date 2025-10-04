import React, { useEffect, useState } from 'react';
import { User, MapPin, Phone, Briefcase, Calendar, GraduationCap, Hash } from 'lucide-react';

function StudentsProfile() {
  const [student, setStudent] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedStudent = localStorage.getItem('student')
    setStudent(JSON.parse(storedStudent))
  }, [])

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600 font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-2">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {student.image ? (
                  <img
                    src={getImageUrl(student.image)}
                    alt={`${student.name}'s profile`}
                    className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border-4 border-white shadow-md">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Student Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{student.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-blue-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{student.place}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">Class {student.std}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">{student.admission_no}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-200">
              Personal Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                  Parent Name
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{student.parent_name}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                  Parent Occupation
                </label>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{student.parent_occupation}</p>
                </div>
              </div>


            </div>
          </div>

          {/* Academic & Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-200">
              Academic & Contact
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                  Class
                </label>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">Class {student.std}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                  Admission Number
                </label>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{student.admission_no}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{student.phone_no}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <Calendar className="w-4 h-4" />
            <span>Last updated on {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentsProfile;