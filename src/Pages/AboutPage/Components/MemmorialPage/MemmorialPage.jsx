import React, { useEffect, useState } from "react";

function MemmorialPage() {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/dashboard/memorial/`)
      .then((response) => response.json())
      .then((data) => {
        setMemorials(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching memorials:", err);
        setLoading(false);
      });
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">സ്മരണകൾ ലോഡിംഗ്...</p>
        </div>
      </div>
    );
  }
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-pink-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            നമ്മിൽ നിന്നും മറഞ്ഞുപോയവർ
          </h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            നാടിൻ്റെ വിളക്കുമാടങ്ങളായി നമുക്കു മുന്നേ നടന്നവർ
          </p>
        </div>
      </div>

      {/* Memorial Grid */}
      <div className="relative px-2 py-8">
        <div className="max-w-7xl mx-auto">
          {memorials.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-slate-800">
                Not found
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-rows-2 grid-flow-col gap-2 sm:gap-3">
                {memorials.map((memorial, index) => (
                  <div
                    key={memorial.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer border border-white/60 w-36 sm:w-44 flex-shrink-0"
                    onClick={() => setSelected(memorial)}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={getImageUrl(memorial.image)}
                        alt={memorial.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-1.5">
                      <h3 className="text-xs font-semibold text-slate-800 text-center truncate">
                        {memorial.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 truncate text-center">
                        {memorial.place}
                      </p>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal (enlarged view) */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white border-2 border-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(selected.image)}
              alt={selected.name}
              className="w-full max-h-[80vh] object-contain bg-black"
            />
            <div className="p-2 text-center">
              <h3 className="text-sm font-semibold text-slate-800">
                {selected.name}
              </h3>
              <p className="text-sm text-slate-500">{selected.place}</p>
              <p className="text-sm text-slate-500">{selected.date_of_death}</p>
            </div>
          </div>
        </div>
      )}
      {/* Bottom decorative section */}
      <div className="relative mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 py-12">
        <div className="text-center">
          <p className="text-slate-600 italic max-w-2xl mx-auto">
            "അല്ലാഹു അവർക്കു പൊറുത്തു കൊടുക്കുകയും എല്ലാവരെയും സ്വർഗ്ഗത്തിൽ
            ഒരുമിപ്പിക്കുകയും ചെയ്യട്ടെ. 🤲 ആമീൻ."
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default MemmorialPage;
