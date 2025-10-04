import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // Missing import
import {
  X,
  CalendarDays,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function EventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getImageUrl = (url) =>
    url?.startsWith("http") ? url : `${backendUrl}${url}`;

  const fetchNotice = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/dashboard/get-notice/`
      );
      setEvents(response.data.notices || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  // Map events to dates
  const eventMap = events.reduce((map, ev) => {
    const dateKey = new Date(ev.date).toDateString();
    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push(ev);
    return map;
  }, {});

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);

    const dateKey = clickedDate.toDateString();
    if (eventMap[dateKey]) {
      setSelectedEvents(eventMap[dateKey]);
    }
  };

  const closeModal = () => setSelectedEvents([]);

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const hasEvents = (day) => {
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return eventMap[checkDate.toDateString()];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 w-full"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isSelectedDay = isSelected(day);
      const hasEvent = hasEvents(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-10 w-full md:h-14 rounded-xl font-semibold text-lg transition-all duration-300 relative
            hover:scale-105 hover:shadow-lg active:scale-95
            ${
              isCurrentDay
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
                : isSelectedDay
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                : hasEvent
                ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md hover:shadow-xl"
                : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-100 text-gray-700 border border-gray-200"
            }
          `}
        >
          {day}
          {hasEvent && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="">
      {/* Header */}

      <div className="text-center ">
        <h3 className="mt-4 text-sm md:text-xl font-bold bg-white rounded p-3 mb-4 sm:text-lg text-gray-500 shadow-xl text-center">
          Events Calendar
        </h3>
      </div>

      {/* Calendar Container */}
      <div className="max-w-4xl mx-auto ">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20  hover:shadow-3xl transition-all duration-300 py-4 px-1">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl py-3 px-2 mb-6 text-white ">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center">
                <h2 className="text-base md:text-xl font-bold">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>

              <button
                onClick={() => navigateMonth(1)}
                className="p-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekdays.map((day) => (
              <div
                key={day}
                className="text-center py-4 font-bold text-gray-600 text-xs bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className=" grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
        </div>
      </div>

      {/* Modal */}
      {selectedEvents.length > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 animate-in fade-in duration-300">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/20">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Event Image  */}
            <div className="grid gap-4 sm:grid-cols-2 p-2">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col items-center bg-gray-50 p-2 rounded-xl shadow-md"
                >
                  <img
                    src={getImageUrl(event.posters)}
                    alt={event.event}
                    className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg mb-3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsCalendar;
