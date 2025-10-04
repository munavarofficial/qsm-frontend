import React, { useState } from "react";
import AddGallery from './AddGallery/AddGallery'
import AddNoticeAuth from './AddNotice/AddNoticeAuth'

function CreateEventsAuth() {
    const [activeForm, setActiveForm] = useState("gallery"); // Tracks which form is active
    const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ">
      <div className="max-w-7xl mx-auto p-1  ">


        {/* Modern Toggle Buttons */}
        <div className="flex justify-center mb-3">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200 inline-flex">
            <button
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform ${
                activeForm === "gallery"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveForm("gallery")}
            >
              <span className="text-xs flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Add Gallery
              </span>
            </button>
            <button
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform ${
                activeForm === "notice"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setActiveForm("notice")}
            >
              <span className="text-xs flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Add Notice
              </span>
            </button>
          </div>
        </div>

        {/* Form Container with Animation */}
        <div className="relative">
          <div className={`transition-all duration-500 ease-in-out transform ${
            activeForm === "gallery" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
          }`}>
            {activeForm === "gallery" && <AddGallery setMessage={setMessage} />}
          </div>

          <div className={`transition-all duration-500 ease-in-out transform ${
            activeForm === "notice" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
          }`}>
            {activeForm === "notice" && <AddNoticeAuth setMessage={setMessage} />}
          </div>
        </div>

        {/* Enhanced Message Display */}
        {message && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-green-900 font-semibold mb-1">Success!</h4>
                  <p className="text-green-800">{message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default CreateEventsAuth