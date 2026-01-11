// src/pages/Report/PageSelectIssue.jsx
// Inside Report folder, so go up TWO levels to reach components

import React from "react";
import ComplaintCard from "../../components/ComplaintCard";

const PageSelectIssue = ({ complaints, setPage, onCancel }) => {
  // Filter complaints based on status
  const currentComplaints = complaints.filter(
    (c) => c.status === "In Progress" || c.status === "Pending" || (!c.status || (c.status !== "Closed" && c.status !== "Cancelled"))
  );
  const closedComplaints = complaints.filter(
    (c) => c.status === "Closed" || c.status === "Cancelled" || c.status === "Resolved"
  );

  console.log("All Complaints:", complaints);
  console.log("Current Complaints:", currentComplaints);
  console.log("Closed Complaints:", closedComplaints);

  return (
    <div className="relative text-white p-6 w-full">
      {/* Animated Cosmic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        {/* Twinkling Stars */}
        <div className="absolute w-2 h-2 bg-white rounded-full top-[5%] left-[10%] animate-[twinkle_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[15%] left-[85%] animate-[twinkle_3s_ease-in-out_infinite] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[30%] left-[50%] animate-[twinkle_2.5s_ease-in-out_infinite]" />
        <div className="absolute w-2 h-2 bg-white rounded-full top-[45%] left-[75%] animate-[twinkle_2.8s_ease-in-out_infinite] shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[60%] left-[20%] animate-[twinkle_3.5s_ease-in-out_infinite]" />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[75%] left-[65%] animate-[twinkle_2.3s_ease-in-out_infinite] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[22%] left-[40%] animate-[twinkle_4s_ease-in-out_infinite]" />
        <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[52%] left-[92%] animate-[twinkle_3.8s_ease-in-out_infinite]" />
        <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[82%] left-[35%] animate-[twinkle_3.3s_ease-in-out_infinite]" />
        <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[95%] left-[78%] animate-[twinkle_4.2s_ease-in-out_infinite]" />
        
        {/* Floating Orbs */}
        <div className="absolute w-24 h-24 bg-purple-500/20 rounded-full top-[8%] left-[3%] blur-xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute w-28 h-28 bg-pink-500/20 rounded-full top-[55%] right-[5%] blur-xl animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }} />
        <div className="absolute w-20 h-20 bg-blue-500/20 rounded-full bottom-[12%] left-[12%] blur-xl animate-[float_7s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        
        {/* Shooting Stars */}
        <div className="absolute w-1 h-1 bg-white rounded-full top-[18%] left-[85%] animate-[shootingStar_3s_ease-out_infinite]" />
        <div className="absolute w-0.5 h-0.5 bg-white/80 rounded-full top-[68%] left-[90%] animate-[shootingStar_4s_ease-out_infinite]" style={{ animationDelay: '-2s' }} />
        
        {/* Nebula Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 animate-[nebula_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-500/5 to-transparent animate-[nebula_18s_ease-in-out_infinite]" style={{ animationDelay: '-6s' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
          Submit Complaint
        </h2>

        {/* Issue Where Dropdown */}
        <label className="block text-sm mb-2 font-semibold text-purple-200">Issue Where :</label>
        <select
          className="w-full bg-white/95 text-purple-900 font-medium p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg backdrop-blur-sm border border-purple-300/30"
          onChange={(e) => {
            const value = e.target.value;
            console.log("Selected value:", value); // Debug log
            if (value === "registered") {
              console.log("Navigating to registered page"); // Debug log
              setPage("registered");
            }
            if (value === "others") {
              console.log("Navigating to others page"); // Debug log
              setPage("others");
            }
          }}
          value=""
        >
          <option value="">Select Issue</option>
          <option value="registered">Registered Events</option>
          <option value="others">Others</option>
        </select>

        {/* Divider with Glow */}
        <div className="relative my-6">
          <div className="border-t border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
        </div>

        {/* Current Complaints Section */}
        <h3 className="text-xl font-semibold mb-3 text-center text-purple-200 drop-shadow-[0_2px_6px_rgba(255,255,255,0.2)]">
          Current Complaints
        </h3>

        {currentComplaints.length === 0 ? (
          <p className="text-center text-purple-300/80 mb-6 italic">No current Complaints</p>
        ) : (
          <div className="mb-6 max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {currentComplaints.map((c) => (
              <div key={c.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 hover:border-purple-400/60 transition-all shadow-lg">
                <ComplaintCard item={c}>
                  <button
                    onClick={() => {
                      console.log("Cancelling complaint:", c);
                      onCancel(c.id);
                    }}
                    className="mt-3 px-5 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  >
                    Cancel
                  </button>
                </ComplaintCard>
              </div>
            ))}
          </div>
        )}

        {/* Divider with Glow */}
        <div className="relative my-6">
          <div className="border-t border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
        </div>

        {/* Closed Complaints Section */}
        <h3 className="text-xl font-semibold mb-3 text-center text-purple-200 drop-shadow-[0_2px_6px_rgba(255,255,255,0.2)]">
          Closed Complaints
        </h3>

        {closedComplaints.length === 0 ? (
          <p className="text-center text-purple-300/80 italic">No Closed Complaints</p>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {closedComplaints.map((c) => (
              <div key={c.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30 hover:border-purple-400/60 transition-all shadow-lg">
                <ComplaintCard item={c} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keyframes for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }
        
        @keyframes nebula {
          0%, 100% {
            opacity: 0.2;
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          50% {
            opacity: 0.4;
            transform: translateX(30px) translateY(-30px) rotate(5deg);
          }
        }
        
        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(-150px) translateY(150px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PageSelectIssue;