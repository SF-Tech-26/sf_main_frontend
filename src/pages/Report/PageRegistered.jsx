// src/pages/Report/PageRegistered.jsx
// Inside Report folder, so go up TWO levels to reach api

import React, { useState, useEffect } from "react";
import { submitComplaint } from "../../api/complaintApi";
import { useEvents } from "../../context/eventContext";


const PageRegistered = ({ token, goBack, reload }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [issueType, setIssueType] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const { events: contextEvents, isLoadingEvents } = useEvents();


  // Load registered events (placeholder - replace with actual API)
  // useEffect(() => {
  //   const loadEvents = async () => {
  //     // TODO: Replace with actual registered events API call
  //     // For now, using mock data
  //     const mockEvents = [
  //       { eventId: 1, name: "Solo Dance Competition" },
  //       { eventId: 2, name: "Group Music Performance" },
  //       { eventId: 3, name: "Drama Workshop" },
  //     ];
  //     setEvents(mockEvents);
  //   };

  //   loadEvents();
  // }, []);
  useEffect(() => {
    if (!isLoadingEvents && contextEvents.length > 0) {
      const allEvents = contextEvents.flatMap((genre) =>
        genre.events.map((ev) => ({
          eventId: ev.id,
          name: ev.name,
        }))
      );

      setEvents(allEvents);
    }
  }, [contextEvents, isLoadingEvents]);


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
    <div className="relative text-white p-6 w-full">
      {/* Animated Cosmic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        {/* Twinkling Stars */}
        <div className="absolute w-2 h-2 bg-white rounded-full top-[8%] left-[12%] animate-[twinkle_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[20%] left-[85%] animate-[twinkle_3s_ease-in-out_infinite] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[35%] left-[45%] animate-[twinkle_2.5s_ease-in-out_infinite]" />
        <div className="absolute w-2 h-2 bg-white rounded-full top-[50%] left-[75%] animate-[twinkle_2.8s_ease-in-out_infinite] shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[65%] left-[20%] animate-[twinkle_3.5s_ease-in-out_infinite]" />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[80%] left-[60%] animate-[twinkle_2.3s_ease-in-out_infinite] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[15%] left-[55%] animate-[twinkle_4s_ease-in-out_infinite]" />
        <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[42%] left-[25%] animate-[twinkle_3.8s_ease-in-out_infinite]" />
        <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[72%] left-[88%] animate-[twinkle_3.3s_ease-in-out_infinite]" />
        <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[92%] left-[35%] animate-[twinkle_4.2s_ease-in-out_infinite]" />

        {/* Floating Orbs */}
        <div className="absolute w-20 h-20 bg-purple-500/20 rounded-full top-[10%] left-[5%] blur-xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute w-24 h-24 bg-pink-500/20 rounded-full top-[60%] right-[8%] blur-xl animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }} />
        <div className="absolute w-16 h-16 bg-blue-500/20 rounded-full bottom-[15%] left-[15%] blur-xl animate-[float_7s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />

        {/* Nebula Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 animate-[nebula_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-500/5 to-transparent animate-[nebula_18s_ease-in-out_infinite]" style={{ animationDelay: '-6s' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
          Submit Complaint
        </h2>

        {/* Issue Where - Fixed to Registered Events */}
        <label className="block text-sm mb-2 font-semibold text-purple-200">Issue Where :</label>
        <select
          className="w-full bg-white/95 text-purple-900 font-medium p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg backdrop-blur-sm border border-purple-300/30"
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
        <label className="block text-sm mb-2 font-semibold text-purple-200">Event Type :</label>
        <select
          className="w-full bg-white/95 text-purple-900 font-medium p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg backdrop-blur-sm border border-purple-300/30"
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
        <label className="block text-sm mb-2 font-semibold text-purple-200">Issue Type :</label>
        <select
          className="w-full bg-white/95 text-purple-900 font-medium p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg backdrop-blur-sm border border-purple-300/30"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
        >
          <option value="">Select Issue</option>
          <option value="Registration Issue">Registration Issue</option>
          <option value="De-registration">De-registration</option>
          <option value="Other Issue">Other Issue</option>
        </select>

        {/* Issue Text Area */}
        <label className="block text-sm mb-2 font-semibold text-purple-200">Issue * :</label>
        <textarea
          className="w-full bg-white/95 text-purple-900 font-medium p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[100px] shadow-lg backdrop-blur-sm border border-purple-300/30"
          placeholder="Describe your issue in detail..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.5)] disabled:shadow-none"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
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
      `}</style>
    </div>
  );
};

export default PageRegistered;