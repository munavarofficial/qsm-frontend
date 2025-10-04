import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

const SupportPage = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [phoneNumbers, setPhoneNumbers] = useState({
    principal_phone_no: "+91 0000000",
    school_phone_no: "+91 0000000",
  });

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        // Using fetch instead of axios for compatibility
        const response = await fetch(`${backendUrl}/api/dashboard/numbers/`);
        const data = await response.json();
        if (data) {
          setPhoneNumbers({
            principal_phone_no: data.principal_phone_no || "+91 0000000",
            school_phone_no: data.school_phone_no || "+91 0000000",
          });
        }
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
        // Optionally keep default numbers or show an error message
      }
    };

    fetchNumbers();
  }, [backendUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const userType = formData.get('userType');
    const classOrPosition = formData.get('classOrPosition');
    const issueType = formData.get('issueType');
    const description = formData.get('description');

    // Compose your WhatsApp message text (URL encoded)
    const message = encodeURIComponent(
      `Assalamu Alaikum,\n\n` +
        `Name: ${name}\n` +
        `Role: ${userType}\n` +
        `Class/Position: ${classOrPosition}\n` +
        `Issue Type: ${issueType}\n` +
        `Description: ${description}\n\n` +
        `Please assist. Thank you!`
    );

    // Principal phone number with country code, no '+' or spaces
    // Remove non-digit characters
    const phone = phoneNumbers.principal_phone_no.replace(/\D/g, "");

    // WhatsApp API URL
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    // Open WhatsApp Web or App with message in new tab/window
    window.open(whatsappUrl, "_blank");
  };

  return (
        <div className="min-h-screen   bg-gradient-to-br from-slate-50 to-blue-50 p-2 md:p-6">
      <div className="max-w-7xl mx-auto rounded-xl">
      {/* Header Section */}
    {/* Header */}
<div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-3">
  <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="flex items-center space-x-3">
      {/* Icon */}
      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
        <User className="h-8 w-8 text-white" />
      </div>

      {/* Title + Subtitle */}
      <div>
        <h1 className="text-xl md:text-3xl ms-2 font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Support Center
        </h1>

        <p className="text-gray-600 mt-1 ms-2 text-sm md:text-base">
          Get help, and find quick solutions
        </p>
      </div>
    </div>
  </div>
</div>


      <div className="">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-600">Contact Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Location</p>
                      <p className="text-slate-600">Urulikkunuu, Koduavlly, Calicut</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Sadar Usthad</p>
                      <p className="text-slate-600 font-mono">{phoneNumbers.principal_phone_no}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Madrasa Phone</p>
                      <p className="text-slate-600 font-mono">{phoneNumbers.school_phone_no}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Working Hours</p>
                      <p className="text-slate-600">SAT - THU | 6:00 AM - 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-600">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "I forgot my password. What should I do?",
                    a: "Contact Sadar Usthad .",
                  },
                  {
                    q: "How can I view my timetable?",
                    a: "Login and go to the 'Timetable' section from the menu.",
                  },
                  {
                    q: "How can I update my Routine?",
                    a: "Go to your Students Page, click on Mark My Routine, and Submit.",
                  },
                  {
                    q: "Teachers: How do I mark attendance?",
                    a: "Navigate to 'Classes', choose the class, and click on 'Mark Attendance'.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-xs font-semibold text-blue-600">Q</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 mb-2">{item.q}</p>
                        <p className="text-slate-600">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Raise a Ticket</h2>
              </div>

              <div
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                  alert("Ticket submitted! We'll get back to you soon.");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <input
                    type="text"
                    name="userType"
                    placeholder="Student/Teacher"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Class/Position</label>
                  <input
                    type="text"
                    name="classOrPosition"
                    placeholder="Your class or position"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Issue Type</label>
                  <select
                    name="issueType"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select issue type</option>
                    <option value="login">Login Issue</option>
                    <option value="attendance">Issue in Mark attendance</option>
                    <option value="Routine">Issue in Mark Routine</option>
                    <option value="Date of Birth">Forgot Password</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe your issue in detail"
                    required
                    rows="4"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    const formElement = e.target.closest('div');
                    const formData = {
                      name: formElement.querySelector('input[name="name"]').value,
                      userType: formElement.querySelector('input[name="userType"]').value,
                      classOrPosition: formElement.querySelector('input[name="classOrPosition"]').value,
                      issueType: formElement.querySelector('select[name="issueType"]').value,
                      description: formElement.querySelector('textarea[name="description"]').value,
                    };

                    // Validate required fields
                    if (!formData.name || !formData.userType || !formData.classOrPosition || !formData.issueType || !formData.description) {
                      alert("Please fill in all required fields.");
                      return;
                    }

                    // Compose WhatsApp message
                    const message = encodeURIComponent(
                      `Assalamu Alaikum,\n\n` +
                        `Name: ${formData.name}\n` +
                        `Role: ${formData.userType}\n` +
                        `Class/Position: ${formData.classOrPosition}\n` +
                        `Issue Type: ${formData.issueType}\n` +
                        `Description: ${formData.description}\n\n` +
                        `Please assist. Thank you!`
                    );

                    // Get phone number and open WhatsApp
                    const phone = phoneNumbers.principal_phone_no.replace(/\D/g, "");
                    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
                    window.open(whatsappUrl, "_blank");

                    alert("Ticket submitted! We'll get back to you soon.");

                    // Reset form
                    formElement.querySelector('input[name="name"]').value = '';
                    formElement.querySelector('input[name="userType"]').value = '';
                    formElement.querySelector('input[name="classOrPosition"]').value = '';
                    formElement.querySelector('select[name="issueType"]').value = '';
                    formElement.querySelector('textarea[name="description"]').value = '';
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  Submit Ticket
                </button>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-green-800">Quick Response</p>
                </div>
                <p className="text-sm text-green-700">We typically respond within 24 hours during working days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SupportPage;