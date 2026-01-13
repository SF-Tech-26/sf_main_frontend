// src/pages/RegisteredEvents/SoloEventsList.jsx

import React from "react";
import { User, MapPin, UserX } from "lucide-react";

const SoloEventsList = ({ events, onDeregister }) => {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-blue-900/80 backdrop-blur-sm rounded-t-3xl border-2 border-white/30 border-b-0 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6" />
          SOLO EVENTS
        </h2>
      </div>

      {/* Events List */}
      <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-b-3xl border-2 border-white/30 border-t-0 p-6 space-y-4">
        {events.map((event) => (
          <div
            key={event.eventId}
            className="bg-black/40 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-6 hover:border-purple-500/60 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {/* Event Icon */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4">
                <User className="w-8 h-8 text-white" />
              </div>

              {/* Event Info */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {event.name}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-purple-900/50 text-purple-200 px-3 py-1 rounded-full">
                    {event.genre}
                  </span>
                  <span className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.eventCity}
                  </span>
                </div>
              </div>
            </div>

            {/* Deregister Button */}
            <button
              onClick={() => onDeregister(event.eventId)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-red-500/50"
            >
              <UserX className="w-4 h-4" />
              Deregister
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoloEventsList;