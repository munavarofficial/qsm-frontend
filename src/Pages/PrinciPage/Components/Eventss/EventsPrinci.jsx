import React, { useState } from "react";
import AddNoticePrinci from "./addNotice/AddNoticePrinci";
import AddGalleryPrinci from "./Add Gallery/AddGalleryPrinci";

function EventsPrinci() {
  const [activeForm, setActiveForm] = useState("teacher");
  const [message, setMessage] = useState("");

  return (
    <div className="my-5 p-2">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-4 gap-3">
        <button
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeForm === "teacher"
              ? "bg-blue-600 text-white shadow-md"
              : "border border-blue-600 text-blue-600 hover:bg-blue-50"
          }`}
          onClick={() => setActiveForm("teacher")}
        >
          Add Gallery
        </button>
        <button
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeForm === "principal"
              ? "bg-blue-600 text-white shadow-md"
              : "border border-blue-600 text-blue-600 hover:bg-blue-50"
          }`}
          onClick={() => setActiveForm("principal")}
        >
          Add Notice
        </button>
      </div>

      {/* Render Forms Conditionally */}
      {activeForm === "teacher" && <AddGalleryPrinci setMessage={setMessage} />}
      {activeForm === "principal" && <AddNoticePrinci setMessage={setMessage} />}

      {/* Display Message */}
      {message && (
        <div className="mt-4 p-3 rounded-lg bg-blue-100 text-blue-800 text-sm font-medium border border-blue-300">
          {message}
        </div>
      )}
    </div>
  );
}

export default EventsPrinci;
