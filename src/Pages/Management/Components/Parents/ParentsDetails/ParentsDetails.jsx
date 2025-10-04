import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Briefcase,
  Users,
  Calendar,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ParentsDetails() {
  const [parents, setParents] = useState([]);
  const [expandedParentId, setExpandedParentId] = useState(null);
  const [members, setMembers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/authority/parents/`, { withCredentials: true })
      .then((response) => {
        setParents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching parents:", error);
      });
  }, [backendUrl]);

  const handleRowClick = (parentId) => {
    if (expandedParentId === parentId) {
      setExpandedParentId(null);
      return;
    }

    setExpandedParentId(parentId);

    if (!members[parentId]) {
      axios
        .get(`${backendUrl}/api/authority/get-members/${parentId}`, {
          withCredentials: true,
        })
        .then((response) => {
          setMembers((prev) => ({ ...prev, [parentId]: response.data }));
        })
        .catch((error) => {
          console.error("Error fetching members:", error);
        });
    }
  };

  const filteredParents = parents.filter((parent) =>
    `${parent.name} ${parent.place} ${parent.number}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
                  Parents Directory
                </h1>
                <p className="text-sm text-gray-600">
                  Manage and view parent information and family details
                </p>
              </div>
            </div>

            <button
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded"
              onClick={() => {
                navigate("/add-parents-management");
              }}
            >
              Add New Parent
            </button>
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Search parents by name, place or number..."
              className="border border-gray-300 rounded px-4 py-2 w-full md:w-96"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Parents Grid */}
        <div className="grid gap-2">
          {filteredParents.map((parent, parentIndex) => (
            <div
              key={parent.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleRowClick(parent.id)}
            >
              {/* Parent Card Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                      {parentIndex + 1}
                    </div>
                    <div>
                      <h3 className="text-sm md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {parent.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{parent.place}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{parent.number}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>Total Members: {parent.members_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {expandedParentId === parent.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedParentId === parent.id && (
                <div className="border-t border-gray-100 bg-gray-50">
                  <div className="p-2">
                    {/* Parent Details */}
                    <div className="grid md:grid-cols-3 gap-2 mb-6">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Age
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {parent.age}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <Briefcase className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Job
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {parent.job}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Position
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {parent.position}
                        </p>
                      </div>
                    </div>

                    {/* Family Members */}
                    <div className="bg-white rounded-lg px-4 py-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-4">
                        <Users className="w-5 h-5 text-indigo-500" />
                        <h4 className="text-lg font-semibold text-blue-600">
                          Family Members
                        </h4>
                      </div>

                      {members[parent.id] && members[parent.id].length > 0 ? (
                        <div className="grid gap-3">
                          {members[parent.id].map((member, memberIndex) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center font-bold text-sm">
                                  {memberIndex + 1}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    Name: {member.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Relation: {member.relation}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Martial Status: {member.martial_status}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Age:{" "}
                                    <span className="font-medium">
                                      {member.age}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Job:{" "}
                                    <span className="font-medium">
                                      {member.job}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">
                            No family members found
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredParents.length === 0 && (
            <div className="text-center py-16">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Parents Found
              </h3>
              <p className="text-gray-500">
                There are no parent records matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentsDetails
