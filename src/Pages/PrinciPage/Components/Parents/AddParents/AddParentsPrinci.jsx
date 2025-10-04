import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "lucide-react";

function AddParentsPrinci() {
  const [csrfToken, setCsrfToken] = useState("");
  const [parent, setParent] = useState({
    name: "",
    place: "",
    age: "",
    job: "",
    number: "",
    position: "Parent",
  });

  const [members, setMembers] = useState([
    { name: "", job: "", age: "", relation: "", martial_status: "" },
  ]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParent({ ...parent, [name]: value });
  };

  const handleMemberChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMembers = [...members];
    updatedMembers[index][name] = value;
    setMembers(updatedMembers);
  };

  const addMemberField = () => {
    setMembers([...members, { name: "", job: "", age: "", relation: "", martial_status: "" }]);
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/principal/csrf-token/`,
          { withCredentials: true }
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess("");
    setError("");

    const data = { ...parent, members };

    axios
      .post(`${backendUrl}/api/principal/add-parents/`, data, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      })
      .then(() => {
        setSuccess("Parent added successfully!");
        setParent({
          name: "",
          place: "",
          age: "",
          job: "",
          number: "",
          position: "Parent",
        });
        setMembers([{ name: "", job: "", age: "", relation: "", martial_status: "" }]);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Add Parents
                </h1>
                <p className="text-sm text-gray-600">
                  Register a parent with their family members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Parent Name</label>
                <input
                  name="name"
                  value={parent.name}
                  onChange={handleParentChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Place</label>
                <input
                  name="place"
                  value={parent.place}
                  onChange={handleParentChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Age</label>
                <input
                  name="age"
                  value={parent.age}
                  onChange={handleParentChange}
                  type="number"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Job</label>
                <input
                  name="job"
                  value={parent.job}
                  onChange={handleParentChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Contact Number</label>
                <input
                  name="number"
                  value={parent.number}
                  onChange={handleParentChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                Family Members
              </h3>

              {members.map((member, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-4 gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                      name="name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, e)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Job</label>
                    <input
                      name="job"
                      value={member.job}
                      onChange={(e) => handleMemberChange(index, e)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Age</label>
                    <input
                      name="age"
                      value={member.age}
                      onChange={(e) => handleMemberChange(index, e)}
                      type="number"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Marital Status</label>
                    <input
                      name="martial_status"
                      value={member.martial_status}
                      onChange={(e) => handleMemberChange(index, e)}
                      type="text"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Relation</label>
                    <input
                      name="relation"
                      value={member.relation}
                      onChange={(e) => handleMemberChange(index, e)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMemberField}
                className="inline-flex items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg transition hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                + Add Another Member
              </button>
            </div>

            {/* Success and Error Messages */}
            <div className="flex flex-col gap-4">


              

              <div className="flex flex-col md:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold shadow transition focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Parent...
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>

                {success && (
                  <div className="text-green-600 font-medium text-sm md:text-base">
                    ✓ Parent successfully registered!
                  </div>
                )}
                {error &&  (
                  <div className="text-red-600 font-medium text-sm md:text-base">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddParentsPrinci;