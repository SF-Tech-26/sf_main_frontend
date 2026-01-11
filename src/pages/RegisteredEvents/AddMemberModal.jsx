// src/pages/RegisteredEvents/SoloEventsList.jsx

import React from "react";

const SoloEventsList = ({ events, onDeregister }) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-8 mb-6">
      <h2 className="text-white text-3xl font-bold text-center mb-6">
        Solo Events
      </h2>
      <div className="w-full h-0.5 bg-white/30 mb-6"></div>

      {events.length === 0 ? (
        <p className="text-white/80 text-center text-lg">
          No events registered
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {event.name}
                  </h3>
                  {event.members && event.members[0] && (
                    <p className="text-white/70 text-sm">
                      {event.members[0].sfId} - {event.members[0].name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDeregister(event.eventId)}
                  className="bg-red-500/90 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Deregister
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoloEventsList;