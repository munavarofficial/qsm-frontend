import React, { useCallback, useEffect, useState } from "react";
import {
  GraduationCap,
  MapPin,
  Users,
  BookOpen,
  Sparkles,
  Star,
  Award,
  Calendar,
  Globe,
  ArrowRight,
  Zap,
  Layers,
  Triangle,
} from "lucide-react";

function SchoolDetails() {
  const [SchoolDetails, setSchoolDetails] = useState("");
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchSchoolDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/dashboard/school-details/`
      );
      const data = await response.json();
      setSchoolDetails(data[0]);
    } catch (error) {
      console.error("Error fetching school details:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchSchoolDetails();
  }, [fetchSchoolDetails]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleHistory = () => setShowFullHistory(!showFullHistory);

  const historyText = SchoolDetails.history || "";
  const truncatedHistory =
    historyText.length > 300 ? historyText.slice(0, 300) + "..." : historyText;
  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Static Background */}
      <div className="fixed inset-0 z-0">


        {/* Grid pattern */}

      </div>

      {/* Glassmorphism Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {SchoolDetails.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Ultra-Modern Hero */}
      <section className="mt-4 relative min-h-screen flex items-center justify-center pt-10">


        <div className="relative z-10 max-w-7xl mx-auto px-3 text-center">
          {/* Floating UI Elements */}
          <div className="mt-5 absolute -top-20 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 opacity-60">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-violet-400 to-cyan-400"></div>
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-400"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
            </div>
          </div>

          {/* Main Logo */}
          <div className="mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 rounded-3xl blur-2xl opacity-0"></div>
            <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/25 transform hover:rotate-6 transition-transform duration-300">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Glitch-style title */}
          <div className="mb-5 relative">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black leading-none mb-2">
              <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {SchoolDetails.name}
              </span>
            </h1>

            {/* Subtitle with typewriter effect */}
            <div className="relative">
              <h2 className="text-base md:text-3xl font-bold text-gray-300 mb-2 opacity-80">
                {SchoolDetails.sub_name}
              </h2>
              <div className="absolute right-0 top-0 w-0.5 h-8 bg-cyan-400 animate-pulse"></div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-12 hover:bg-white/10 transition-colors">
            <Zap className="w-5 h-5 text-yellow-400 mr-3" />
            <span className="text-white text-sm font-medium">{SchoolDetails.educational_board}</span>
          </div>

          {/* Call to action */}
          <p className="text-xm md:text-4xl text-gray-300 mb-16 leading-relaxed font-light">
            Where{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent font-bold">
                Innovation
              </span>
            </span>{" "}
            meets{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold">
                Excellence
              </span>
            </span>
          </p>

          <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-2xl font-bold text-white shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 transform hover:scale-105 transition-all duration-300">
            <span className="relative z-10">Explore Universe</span>
            <ArrowRight className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>

      {/* Neon Stats Grid */}


      {/* Floating Cards Image Section */}
      <div className="relative z-10 px-4 py-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Our Legacy
            </h2>
            <p className="text-sm md:text-xl text-gray-400 max-w-2xl mx-auto">
              Step into a world where sacred knowledge transcends generations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image 1 */}
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 group-hover:border-purple-500/50 transition-all duration-700 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={getImageUrl(SchoolDetails.image_1)}
                    alt="School Building"
                    className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-500/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xs md:text-xl font-bold text-white">
                          Main Building
                        </h3>
                        <p className="text-xs text-gray-300">Where excellence begins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image 2 */}
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 group-hover:border-blue-500/50 transition-all duration-700 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={getImageUrl(SchoolDetails.image_2)}
                    alt="School Campus"
                    className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-xl font-bold text-white">Campus</h3>
                        <p className="text-xs text-gray-300">Where memories are made</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


          {/* History Section */}
      <div className="relative z-10 px-1 py-5 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-8 shadow-2xl shadow-purple-500/50">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Our Story
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20"></div>

            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4 md:p-12 border border-gray-800 shadow-2xl">
              <div className="absolute top-4 left-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-4 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-700"></div>

              <div className="relative z-10 text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                <p className="first-letter:text-8xl first-letter:font-bold first-letter:text-transparent first-letter:bg-gradient-to-r first-letter:from-purple-400 first-letter:to-pink-400 first-letter:bg-clip-text first-letter:float-left first-letter:mr-4 first-letter:mt-2">
                  {isMobile
                    ? showFullHistory
                      ? historyText
                      : truncatedHistory
                    : historyText}
                </p>

                {isMobile && historyText.length > 300 && (
                  <button
                    onClick={toggleHistory}
                    className="mt-4 mb-3 text-purple-400 hover:text-pink-400 font-semibold"
                  >
                    {showFullHistory ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default SchoolDetails;