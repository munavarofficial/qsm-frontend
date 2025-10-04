import React, { useEffect, useState, useCallback } from "react";
import { Crown, MapPin, Phone, Users, Award, Sparkles } from "lucide-react";
import axios from "axios";

function Committee() {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchCommittee = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/committee/`
      );
      setCommittee(response.data);
    } catch (error) {
      console.error("Committee API error:", error);
      setError("Failed to fetch committee details");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchCommittee();
  }, [fetchCommittee]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-300 text-lg animate-pulse">
          Loading committee members...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-2 py-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating Icon */}
          <div className="relative mb-2">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-full mb-6 shadow-2xl shadow-yellow-500/50 animate-pulse">
              <Crown className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-2xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Our Leaders
          </h1>

          <div className="relative">
            <h2 className="text-sm md:text-3xl font-bold text-gray-300 tracking-wide">
              Visionary Leaders Guiding Excellence
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Committee Grid */}
      <div className="relative z-10 px-2 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {committee.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-400 text-sm  animate-pulse">
                Committee list will be updated soon...
              </p>
            </div>
          ) : (
            <div className="p-6 md:p-1 flex overflow-x-auto space-x-2 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-1 scrollbar-hide">
              {committee.map((member, index) => (
                <div
                  key={index}
                  className="group relative flex-shrink-0 w-72 snap-center md:w-auto"
                >
                  {/* Glow Border */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-3xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>

                  {/* Main Card */}
                  <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 group-hover:border-yellow-500/50 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-1 overflow-hidden">
                    {/* Image */}
                    <div className="relative p-4 pb-0">
                      <div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-yellow-500/30 group-hover:ring-yellow-500/60 transition-all duration-500">
                        <img
                          src={getImageUrl(member.image)}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 pt-2">
                      <h5 className="text-lg font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                        {member.name}
                      </h5>
                      <p className="text-center text-gray-300 text-sm font-medium mb-3">
                        {member.position}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-start space-x-2 bg-gray-800/40 rounded-lg p-2">
                          <MapPin className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                          <p className="text-xs text-white truncate">
                            {member.place}
                          </p>
                        </div>

                        <div className="flex items-start space-x-2 bg-gray-800/40 rounded-lg p-2">
                          <Phone className="w-4 h-4 text-blue-400" aria-hidden="true" />
                          <p className="text-xs text-white truncate">
                            {member.number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 p-2 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-5">
            <h2 className="text-xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Excellence in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-6 items-stretch">
            {/* Total Leaders */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative h-full bg-gray-900/70 backdrop-blur-xl rounded-2xl p-3 md:p-6 border border-gray-800 group-hover:border-purple-500/50 transition-all duration-500 transform group-hover:scale-105">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 md:mb-6 shadow-lg">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-base md:text-3xl font-bold text-white mb-1 md:mb-2">
                    {committee.length}
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-400">
                    Leaders
                  </p>
                </div>
              </div>
            </div>

            {/* Visionary Impact */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative h-full bg-gray-900/70 backdrop-blur-xl rounded-2xl p-3 md:p-6 border border-gray-800 group-hover:border-blue-500/50 transition-all duration-500 transform group-hover:scale-105">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 md:mb-6 shadow-lg">
                    <Award className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-base md:text-3xl font-bold text-white mb-1 md:mb-2">
                    ∞
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-400">
                    Visionary Impact
                  </p>
                </div>
              </div>
            </div>

            {/* Lasting Legacy */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative h-full bg-gray-900/70 backdrop-blur-xl rounded-2xl p-3 md:p-6 border border-gray-800 group-hover:border-pink-500/50 transition-all duration-500 transform group-hover:scale-105">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-pink-600 to-yellow-600 rounded-full mb-4 md:mb-6 shadow-lg">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-base md:text-3xl font-bold text-white mb-1 md:mb-2">
                    ∞
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-400">
                    Lasting Legacy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Glow */}
      <div className="relative z-10 h-20">
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-yellow-900/50 to-transparent"></div>
      </div>
    </div>
  );
}

export default Committee;
