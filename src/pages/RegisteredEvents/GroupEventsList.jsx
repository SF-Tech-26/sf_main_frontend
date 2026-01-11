// src/pages/RegisteredEvents/GroupEventsList.jsx

import React from "react";

const GroupEventsList = ({ events, onDeregisterTeam, onDeregisterMember, onAddMember }) => {
  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-8">
          <h2 className="text-white text-3xl font-bold text-center mb-6">
            Group Events
          </h2>
          <div className="w-full h-0.5 bg-white/30 mb-6"></div>
          <p className="text-white/80 text-center text-lg">
            No events registered
          </p>
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.eventId}
            className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-8"
          >
            {/* Event Name and Deregister Team Button */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-3xl font-bold">{event.name}</h3>
              {event.isAdmin && (
                <button
                  onClick={() => onDeregisterTeam(event.eventId)}
                  className="bg-white/90 hover:bg-white text-black px-6 py-2 rounded-xl font-semibold transition"
                >
                  Deregister Team
                </button>
              )}
            </div>

            {/* Members List */}
            <div className="space-y-3 mb-6">
              {event.members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white text-lg font-semibold">
                      {member.sfId}-{member.name}
                    </span>
                    {member.isAdmin && (
                      <span className="text-yellow-400 text-2xl">👑</span>
                    )}
                  </div>

                  {/* Deregister Member Button - Only if admin and member count > minMembers */}
                  {event.isAdmin && !member.isAdmin && event.members.length > event.minMembers && (
                    <button
                      onClick={() => onDeregisterMember(event.eventId, member.sfId)}
                      className="bg-white/90 hover:bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm transition"
                    >
                      Deregister Member
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Member Button - Only for admin */}
            {event.isAdmin && (
              <div className="flex justify-center">
                <button
                  onClick={() => onAddMember(event.eventId)}
                  className="bg-white/90 hover:bg-white text-black px-8 py-3 rounded-xl font-bold text-lg transition shadow-lg"
                >
                  Add member
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GroupEventsList;