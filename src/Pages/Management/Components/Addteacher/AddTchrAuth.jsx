import React, { useState } from "react";
import { Users, UserCheck, BookOpen } from "lucide-react";
import AddPrincipal from "./AddPrincipal";
import AddNormalTchr from "./AddNormalTchr";

const AddTchrAuth = () => {
  const [activeForm, setActiveForm] = useState("teacher"); // Tracks which form is active
  const [message, setMessage] = useState("");

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1 md:p-6">
      <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-2xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Staff Management
                </h1>

                <p className="text-sm text-gray-600 mt-1 ms-2">
                  Add Teachers and Principal
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Toggle Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-base md:text-xl font-semibold text-blue-600 mb-6 text-center">
            Select Staff Type
          </h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center ">
            <div className=" rounded-xl p-1 inline-flex gap-2">
              <button
                className={`
                  flex items-center p-3 rounded-lg font-medium transition-all shadow-md duration-200 transform
                  ${activeForm === "teacher"
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
                  }
                `}
                onClick={() => setActiveForm("teacher")}
              >
                <Users className="w-6 h-6 mr-2" />
            <span className="text-xs">Add New Teacher</span>
              </button>
              <button
                className={`
                  flex items-center shadow-md  p-3 rounded-lg font-medium transition-all duration-200 transform
                  ${activeForm === "principal"
                    ? "bg-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-purple-600 hover:bg-white hover:shadow-sm"
                  }
                `}
                onClick={() => setActiveForm("principal")}
              >
                <UserCheck className="w-6 h-6 mr-1" />
                <span className="text-xs">Add New Principal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Render Forms Conditionally */}
        <div className="transform transition-all duration-300 ease-in-out">
          {activeForm === "teacher" && (
            <div className="animate-fadeIn">
              <AddNormalTchr setMessage={setMessage} />
            </div>
          )}
          {activeForm === "principal" && (
            <div className="animate-fadeIn">
              <AddPrincipal setMessage={setMessage} />
            </div>
          )}
        </div>

        {/* Display Message */}
        {message && (
          <div className="mt-6 transform transition-all duration-300 ease-in-out animate-slideDown">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-green-800 font-medium">{message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
    </div>
  );
};

export default AddTchrAuth;