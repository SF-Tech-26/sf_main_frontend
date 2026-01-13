// src/pages/RegisteredEvents/GroupEventsList.jsx

import React from "react";
import { Users, MapPin, Crown, UserPlus, Trash2, UserX } from "lucide-react";

const GroupEventsList = ({
  events,
  onDeregisterTeam,
  onDeregisterMember,
  onAddMember,
}) => {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-pink-900/80 via-purple-900/80 to-blue-900/80 backdrop-blur-sm rounded-t-3xl border-2 border-white/30 border-b-0 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6" />
          GROUP EVENTS
        </h2>
      </div>

      {/* Events List */}
      <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-b-3xl border-2 border-white/30 border-t-0 p-6 space-y-6">
        {events.map((event) => (
          <div
            key={event.eventId}
            className="bg-black/40 backdrop-blur-sm rounded-2xl border-2 border-pink-500/30 p-6 hover:border-pink-500/60 transition-all"
          >
            {/* Event Header */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl p-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
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
                    <span className="bg-pink-900/50 text-pink-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.members?.length || 0}/{event.maxMembers}
                    </span>
                  </div>
                  {event.teamName && (
                    <p className="text-gray-300 mt-2 text-sm">
                      Team: <span className="font-semibold text-white">{event.teamName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Admin Actions - Deregister Team Button */}
              {event.isAdmin && (
                <button
                  onClick={() => onDeregisterTeam(event.eventId)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-red-500/50"
                >
                  <Trash2 className="w-4 h-4" />
                  Deregister Team
                </button>
              )}
            </div>

            {/* Team Members Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-400" />
                  TEAM MEMBERS
                </h4>
                
                {/* Add Member Button - Only for Admin */}
                {event.isAdmin && event.members?.length < event.maxMembers && (
                  <button
                    onClick={() => onAddMember(event.eventId)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm shadow-lg hover:shadow-green-500/50"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Member
                  </button>
                )}
              </div>

              {/* Members List */}
              {event.members && event.members.length > 0 ? (
                <div className="space-y-2">
                  {event.members.map((member, index) => (
                    <div
                      key={member.sfId || index}
                      className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-pink-500/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {/* Member Avatar */}
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        
                        {/* Member Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-semibold">
                              {member.name}
                            </p>
                            {member.isAdmin && (
                              <span className="bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                Leader
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {member.sfId}
                          </p>
                        </div>
                      </div>

                      {/* Remove Member Button - Always show for non-leaders if user is admin */}
                      {event.isAdmin && !member.isAdmin && (
                        <button
                          onClick={() => onDeregisterMember(event.eventId, member.sfId)}
                          className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm"
                        >
                          <UserX className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No members found</p>
                </div>
              )}

              {/* Team Info Footer */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="text-gray-400">
                    <span className="text-white font-semibold">
                      {event.members?.length || 0}
                    </span>
                    {" "}of{" "}
                    <span className="text-white font-semibold">
                      {event.maxMembers}
                    </span>
                    {" "}members
                    {event.minMembers > 1 && (
                      <span className="ml-2">
                        (Min: {event.minMembers})
                      </span>
                    )}
                  </div>
                  
                  {event.isAdmin && (
                    <div className="text-yellow-400 flex items-center gap-1 text-xs">
                      <Crown className="w-4 h-4" />
                      You are the team leader
                    </div>
                  )}
                </div>
                
                {/* Debug Info - Remove this in production */}
                <div className="text-xs text-gray-500 mt-2">
                  Debug: isAdmin={event.isAdmin ? 'true' : 'false'}, 
                  members={event.members?.length || 0}, 
                  min={event.minMembers}, 
                  max={event.maxMembers}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupEventsList;