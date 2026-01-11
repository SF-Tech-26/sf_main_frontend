// src/pages/Report/PageRegistered.jsx
// Inside Report folder, so go up TWO levels to reach api

import React, { useState, useEffect } from "react";
import { submitComplaint } from "../../api/complaintApi";

const PageRegistered = ({ token, goBack, reload }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [issueType, setIssueType] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  // Load registered events (placeholder - replace with actual API)
  useEffect(() => {
    const loadEvents = async () => {
      // TODO: Replace with actual registered events API call
      // For now, using mock data
      const mockEvents = [
        { eventId: 1, name: "Solo Dance Competition" },
        { eventId: 2, name: "Group Music Performance" },
        { eventId: 3, name: "Drama Workshop" },
      ];
      setEvents(mockEvents);
    };

    loadEvents();
  }, []);

  const handleSubmit = async () => {
    if (!selectedEvent || !issueType || !issue.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const eventName = events.find((e) => e.eventId == selectedEvent)?.name;
      const type = `Event: ${eventName} - ${issueType}`;
      
      const response = await submitComplaint(token, type, issue);
      
      if (response.code === 0) {
        alert("Complaint submitted successfully");
        
        // Reset form
        setSelectedEvent("");
        setIssueType("");
        setIssue("");
        
        // Reload complaints and go back
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

      {/* Issue Where - Fixed to Registered Events */}
      <label className="block text-sm mb-2">Issue Where :</label>
      <select
        className="w-full bg-white/90 text-black p-3 rounded-lg mb-4 focus:outline-none"
        value="registered"
        onChange={(e) => {
          if (e.target.value === "") goBack();
        }}
      >
        <option value="">Select Issue</option>
        <option value="registered">Registered Events</option>
        <option value="others">Others</option>
      </select>

      {/* Event Type Dropdown */}
      <label className="block text-sm mb-2">Event Type :</label>
      <select
        className="w-full bg-white/90 text-black p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">Select event</option>
        {events.map((ev) => (
          <option key={ev.eventId} value={ev.eventId}>
            {ev.name}
          </option>
        ))}
      </select>

      {/* Issue Type Dropdown */}
      <label className="block text-sm mb-2">Issue Type :</label>
      <select
        className="w-full bg-white/90 text-black p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={issueType}
        onChange={(e) => setIssueType(e.target.value)}
      >
        <option value="">Select Issue</option>
        <option value="Registration Issue">Registration Issue</option>
        <option value="De-registration">De-registration</option>
        <option value="Other Issue">Other Issue</option>
      </select>

      {/* Issue Text Area */}
      <label className="block text-sm mb-2">Issue * :</label>
      <textarea
        className="w-full bg-white/90 text-black p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
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

export default PageRegistered;