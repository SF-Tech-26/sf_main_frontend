import React, { useState, useEffect } from "react";
import { submitComplaint } from "../../api/complaintApi";
import { useEvents } from "../../context/EventContext";
import { toast } from "react-toastify";

const PageRegistered = ({ token, goBack, reload }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [issueType, setIssueType] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const { events: contextEvents, isLoadingEvents } = useEvents();

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
      toast.warn("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const eventName = events.find((e) => e.eventId == selectedEvent)?.name;
      const type = `Event: ${eventName} - ${issueType}`;

      const response = await submitComplaint(token, type, issue);

      if (response.code === 0) {
        toast.success("Complaint submitted successfully");
        setSelectedEvent("");
        setIssueType("");
        setIssue("");
        await reload();
        goBack();
      } else {
        toast.error("Failed: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-white/95 text-black p-3 rounded-xl mb-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all";

  return (
    <div className="space-y-4">
      <button onClick={goBack} className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
        ← Back
      </button>
      
      <h2 className="text-xl font-bold text-white mb-4">Event Grievance</h2>
      
      <label className="block text-xs font-bold text-cyan-300 uppercase mb-1">Select Ritual :</label>
      <select className={inputStyles} value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
        <option value="">Select event</option>
        {events.map((ev) => (
          <option key={ev.eventId} value={ev.eventId}>{ev.name}</option>
        ))}
      </select>

      <label className="block text-xs font-bold text-cyan-300 uppercase mb-1">Issue Type :</label>
      <select className={inputStyles} value={issueType} onChange={(e) => setIssueType(e.target.value)}>
        <option value="">Select Issue</option>
        <option value="Registration Issue">Registration Issue</option>
        <option value="De-registration">De-registration</option>
        <option value="Other Issue">Other Issue</option>
      </select>

      <label className="block text-xs font-bold text-cyan-300 uppercase mb-1">Details * :</label>
      <textarea
        className={`${inputStyles} min-h-[100px] resize-none`}
        placeholder="Describe the disturbance..."
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Complaint"}
      </button>
    </div>
  );
};

export default PageRegistered;