// src/pages/Report/PageOthers.jsx
// Inside Report folder, so go up TWO levels to reach api

import React, { useState } from "react";
import { submitComplaint } from "../../api/complaintApi";

const PageOthers = ({ token, goBack, reload }) => {
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!issue.trim()) {
      alert("Please describe your issue");
      return;
    }

    setLoading(true);
    try {
      const response = await submitComplaint(token, "Others", issue);
      
      if (response.code === 0) {
        alert("Complaint submitted successfully");
        setIssue("");
        await reload();
        goBack();
      } else {
        alert("Failed to submit complaint: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm text-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Complaint</h2>

      {/* Issue Where - Fixed to Others */}
      <label className="block text-sm mb-2">Issue Where :</label>
      <select
        className="w-full bg-white/90 text-black p-3 rounded-lg mb-4 focus:outline-none"
        value="others"
        onChange={(e) => {
          if (e.target.value === "") goBack();
        }}
      >
        <option value="">Select Issue</option>
        <option value="registered">Registered Events</option>
        <option value="others">Others</option>
      </select>

      {/* Issue Text Area */}
      <label className="block text-sm mb-2">Issue * :</label>
      <textarea
        className="w-full bg-white/90 text-black p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
        placeholder="Describe your issue in detail..."
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
      />

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-white text-black px-8 py-2 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PageOthers;