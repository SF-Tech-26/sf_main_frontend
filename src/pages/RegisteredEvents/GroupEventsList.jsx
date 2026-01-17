import React from "react";
import { Users, MapPin, Crown, UserPlus, Trash2, UserX, Sparkles, Moon } from "lucide-react";

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
    <div className="rounded-2xl overflow-hidden border border-blue-500/20">
      {/* Section Header */}
      <div className="bg-black/80 backdrop-blur-2xl px-4 sm:px-6 py-3 sm:py-4 border-b border-blue-500/30 sticky top-0 z-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
         
          Group Events
         
        </h2>
      </div>

      {/* Events List */}
      <div className="max-h-[500px] overflow-y-auto bg-black/30 backdrop-blur-lg p-3 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
        {events.map((event) => (
          <div
            key={event.eventId}
            className="bg-gradient-to-b from-blue-900/10 to-black/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-blue-500/20 p-3 sm:p-6 hover:border-cyan-500/40 transition-all shadow-xl"
          >
            {/* Event Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-white/10 gap-3">
              <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="bg-gradient-to-br from-blue-900 to-black rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-blue-500/30">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-1 sm:mb-2 tracking-wider">
                    {event.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                    <span className="bg-blue-950/50 text-cyan-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-cyan-500/30 uppercase font-bold">
                      {event.genre}
                    </span>
                    <span className="bg-black/50 text-blue-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 border border-blue-500/30">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      {event.eventCity}
                    </span>
                    <span className="bg-cyan-950/50 text-cyan-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 border border-cyan-500/30">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      {event.members?.length || 0}/{event.maxMembers}
                    </span>
                  </div>
                  {event.teamName && (
                    <p className="text-blue-300/70 mt-1 sm:mt-2 text-xs sm:text-sm italic font-serif">
                      Coven: <span className="font-bold text-white">{event.teamName}</span>
                    </p>
                  )}
                </div>
              </div>

              {event.isAdmin && (
                <button
                  onClick={() => onDeregisterTeam(event.eventId)}
                  className="w-full sm:w-auto bg-red-950/30 hover:bg-red-600 text-red-200 hover:text-white px-3 sm:px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 border border-red-500/30 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span></span>
                </button>
              )}
            </div>

            {/* Team Members Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h4 className="text-sm sm:text-base font-bold text-cyan-100 flex items-center gap-2 tracking-widest">
                  MEMBERS
                </h4>
                
                {event.isAdmin && event.members?.length < event.maxMembers && (
                  <button
                    onClick={() => onAddMember(event.eventId)}
                    className="bg-blue-900/40 hover:bg-blue-600 text-blue-100 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm border border-blue-500/40 shadow-lg"
                  >
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Add Member
                  </button>
                )}
              </div>

              {/* Members List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {event.members && event.members.length > 0 ? (
                  event.members.map((member, index) => (
                    <div
                      key={member.sfId || index}
                      className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${member.isAdmin ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-blue-900/50 text-blue-300 border border-blue-500/20'}`}>
                          {member.isAdmin ? <Crown className="w-5 h-5" /> : index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm sm:text-base">{member.name}</p>
                          </div>
                          <p className="text-blue-400/50 text-[10px] sm:text-xs tracking-tighter">{member.sfId}</p>
                        </div>
                      </div>

                      {event.isAdmin && !member.isAdmin && (
                        <button
                          onClick={() => onDeregisterMember(event.eventId, member.sfId)}
                          className="text-red-400/60 hover:text-red-400 transition-colors p-1"
                          title="Remove from team"
                        >
                          <UserX className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 text-blue-300/40 italic">
                    No souls found in this gathering...
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.4); }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #1e3a8a, #0891b2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default GroupEventsList;