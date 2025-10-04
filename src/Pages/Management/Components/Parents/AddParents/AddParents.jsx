import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "lucide-react";

function AddParents() {
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

  const [loading, setLoading] = useState(false); // loading state for button
  const [successMessage, setSuccessMessage] = useState(""); // success message

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/authority/csrf-token/`,
          { withCredentials: true }
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  // Parent input change
  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParent({ ...parent, [name]: value });
  };

  // Family member input change
  const handleMemberChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMembers = [...members];
    updatedMembers[index][name] = value;
    setMembers(updatedMembers);
  };

  // Add new member
  const addMemberField = () => {
    setMembers([
      ...members,
      { name: "", job: "", age: "", relation: "", martial_status: "" },
    ]);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(""); // clear old message

    const data = { ...parent, members };

    axios
      .post(`${backendUrl}/api/authority/add-parents/`, data, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      })
      .then(() => {
        // reset form after success
        setParent({
          name: "",
          place: "",
          age: "",
          job: "",
          number: "",
          position: "Parent",
        });
        setMembers([
          { name: "", job: "", age: "", relation: "", martial_status: "" },
        ]);
        setSuccessMessage("Parent added successfully! ✅");

        // auto hide message after 3s
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
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

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parent inputs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Parent Name</label>
                <input
                  name="name"
                  value={parent.name}
                  onChange={handleParentChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Place</label>
                <input
                  name="place"
                  value={parent.place}
                  onChange={handleParentChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
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
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Job</label>
                <input
                  name="job"
                  value={parent.job}
                  onChange={handleParentChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  name="number"
                  value={parent.number}
                  onChange={handleParentChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {/* Family Members */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                Family Members
              </h3>

              {members.map((member, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-5 gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                      name="name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, e)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Job</label>
                    <input
                      name="job"
                      value={member.job}
                      onChange={(e) => handleMemberChange(index, e)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Age</label>
                    <input
                      name="age"
                      value={member.age}
                      onChange={(e) => handleMemberChange(index, e)}
                      type="number"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Martial Status
                    </label>
                    <input
                      name="martial_status"
                      value={member.martial_status}
                      onChange={(e) => handleMemberChange(index, e)}
                      type="text"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Relation</label>
                    <input
                      name="relation"
                      value={member.relation}
                      onChange={(e) => handleMemberChange(index, e)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMemberField}
                className="inline-flex items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg transition"
              >
                + Add Another Member
              </button>
            </div>
            {successMessage && (
              <span className="text-green-600 font-medium">
                {successMessage}
              </span>
            )}
            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto inline-flex items-center justify-center ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-6 py-2 rounded-lg font-semibold shadow transition`}
              >
                {loading ? "Adding..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddParents;
