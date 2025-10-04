import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, X } from "lucide-react";

function Events() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchNotice = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/get-notice/`
      );
      setEvents(response.data.notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  return (
    <>
      <div className="">
        {/* Heading */}
        <h3 className="mt-4 text-sm md:text-xl font-bold bg-white rounded p-3 mb-4 sm:text-lg text-gray-500 shadow-xl text-center">
          Upcoming Events
        </h3>
        <div className="border p-2 rounded-2xl">
          <p className="mt-3 font-bold bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-1 py-3 mb-4 text-xs text-white shadow-xl text-center md:text-lg">
            Stay updated with all upcoming events and notices
          </p>
          {events.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-2 pt-2 scrollbar-hide">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="min-w-[99%] md:min-w-[50%] bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer"
                  onClick={() => handleViewDetails(event)}
                >
                  <img
                    src={getImageUrl(event.posters)}
                    alt={event.event}
                    className="w-full h-48 md:h-56 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-lg font-semibold text-gray-800 truncate">
                      {event.event}
                    </h4>
                    <div className="flex items-center text-gray-600 text-sm mt-2 gap-2">
                      <Calendar className="w-4 h-4" />: <span>{event.date}</span>{" "}
                      , <Clock className="w-4 h-4" />: <span>{event.time}</span>
                    </div>
                  </div>
                  <div className="px-4 pb-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(event);
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No upcoming events.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 animate-in fade-in duration-300">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/20">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Event Details */}
            <div className="p-4">
              <img
                src={getImageUrl(selectedEvent.posters)}
                alt={selectedEvent.event}
                className="w-full max-h-[70vh] object-contain rounded-lg shadow-lg mb-3"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedEvent.event}
              </h3>
              <p className="text-gray-600">{selectedEvent.description}</p>
              <div className="flex items-center text-gray-600 text-sm mt-4 gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {selectedEvent.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {selectedEvent.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Events;
