import React from "react";
import { User, MapPin, UserX, Sparkles, Ghost } from "lucide-react";

const SoloEventsList = ({ events, onDeregister }) => {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      {/* Section Header - Fixed */}
      <div className="bg-black/80 backdrop-blur-2xl px-4 sm:px-6 py-3 sm:py-4 border-b border-cyan-500/30 sticky top-0 z-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-100 flex items-center gap-2 tracking-wider">
          <Ghost className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          SOLO Events
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-pulse" />
        </h2>
      </div>

      {/* Events List - Scrollable */}
      <div className="max-h-[400px] overflow-y-auto bg-black/40 backdrop-blur-md p-3 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar">
        {events.map((event) => (
          <div
            key={event.eventId}
            className="group bg-gradient-to-r from-blue-900/10 to-black/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-blue-500/20 p-3 sm:p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Event Icon */}
              <div className="bg-gradient-to-br from-blue-900 to-black rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-cyan-500/30 shadow-lg group-hover:scale-105 transition-transform">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-300" />
              </div>

              {/* Event Info */}
              <div className="flex-1">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
                  {event.name}
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className="bg-blue-950/50 text-cyan-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-cyan-500/30">
                    {event.genre}
                  </span>
                  <span className="bg-black/50 text-blue-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 border border-blue-500/30">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {event.eventCity}
                  </span>
                </div>
              </div>
            </div>

            {/* Deregister Button */}
            <button
              onClick={() => onDeregister(event.eventId)}
              className="w-full sm:w-auto bg-gradient-to-r from-red-950/40 to-red-900/40 hover:from-red-600 hover:to-red-700 text-red-200 hover:text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 border border-red-500/30 text-sm sm:text-base shadow-lg"
            >
              <UserX className="w-4 h-4" />
              Deregister
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #1e3a8a, #0891b2);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #1e40af, #06b6d4);
        }
      `}</style>
    </div>
  );
};

export default SoloEventsList;