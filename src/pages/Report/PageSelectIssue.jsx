import React from "react";
import ComplaintCard from "../../components/ComplaintCard";

const PageSelectIssue = ({ complaints, setPage, onCancel }) => {
  const currentComplaints = complaints.filter(
    (c) => c.status === "In Progress" || c.status === "Pending" || (!c.status || (c.status !== "Closed" && c.status !== "Cancelled"))
  );
  const closedComplaints = complaints.filter(
    (c) => c.status === "Closed" || c.status === "Cancelled" || c.status === "Resolved"
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-cyan-300 ml-1">Issue Where :</label>
        <select
          className="w-full bg-white/95 text-black font-medium p-3 rounded-xl focus:outline-none shadow-lg"
          onChange={(e) => {
            
            const value = e.target.value;
            if (value === "registered") setPage("registered");
            if (value === "others") setPage("others");
          }}   
          value=""
        >
          <option value="">Select Issue Category</option>
          <option value="registered">Registered Events</option> 
          <option value="others">Others</option>
        </select>
      </div>

      <div className="space-y-6">
        {/* Current Complaints Section */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-cyan-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Current Complaints
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {currentComplaints.length === 0 ? (
              <p className="text-center text-cyan-500/40 italic text-sm py-4 border border-cyan-500/10 rounded-xl">No active complaints</p>
            ) : (
              currentComplaints.map((c) => (
                <div key={c.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20 shadow-lg">
                  <ComplaintCard item={c}>
                    <button
                      onClick={() => onCancel(c.id)}
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-500 rounded-lg text-xs font-bold text-white transition-all transform active:scale-95"
                    >
                      Cancel Complaint
                    </button>
                  </ComplaintCard>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Closed Complaints Section */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-blue-400/60">Closed Complaints</h3>
          <div className="max-h-40 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {closedComplaints.length === 0 ? (
              <p className="text-center text-white/20 italic text-sm py-4 border border-white/5 rounded-xl">No closed records</p>
            ) : (
              closedComplaints.map((c) => (
                <div key={c.id} className="bg-white/5 rounded-xl p-4 border border-white/5 opacity-60">
                  <ComplaintCard item={c} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSelectIssue;