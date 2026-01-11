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

  console.log("All Complaints:", complaints); // Debug
  console.log("Current Complaints:", currentComplaints); // Debug
  console.log("Closed Complaints:", closedComplaints); // Debug

  return (
    <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm text-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Complaint</h2>

      {/* Issue Where Dropdown */}
      <label className="block text-sm mb-2">Issue Where :</label>
      <select
        className="w-full bg-white/90 text-black p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={(e) => {
          if (e.target.value === "registered") setPage("registered");
          if (e.target.value === "others") setPage("others");
        }}
        defaultValue=""
      >
        <option value="">Select Issue</option>
        <option value="registered">Registered Events</option>
        <option value="others">Others</option>
      </select>

      {/* Divider */}
      <div className="border-t border-white/30 my-6"></div>

      {/* Current Complaints Section */}
      <h3 className="text-xl font-semibold mb-3 text-center">Current Complaints</h3>

      {currentComplaints.length === 0 ? (
        <p className="text-center text-gray-300 mb-6">No current Complaints</p>
      ) : (
        <div className="mb-6 max-h-48 overflow-y-auto">
          {currentComplaints.map((c) => (
            <ComplaintCard key={c.id} item={c}>
              <button
                onClick={() => {
                  console.log("Cancelling complaint:", c); // Debug: see full complaint object
                  onCancel(c.id);
                }}
                className="mt-2 px-4 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
              >
                Cancel
              </button>
            </ComplaintCard>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/30 my-6"></div>

      {/* Closed Complaints Section */}
      <h3 className="text-xl font-semibold mb-3 text-center">Closed Complaints</h3>

      {closedComplaints.length === 0 ? (
        <p className="text-center text-gray-300">No Closed Complaints</p>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {closedComplaints.map((c) => (
            <ComplaintCard key={c.id} item={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageSelectIssue;