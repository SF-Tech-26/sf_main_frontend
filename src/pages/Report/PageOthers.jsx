import React, { useState } from "react";
import { submitComplaint } from "../../api/complaintApi";
import { toast } from "react-toastify";

const PageOthers = ({ token, goBack, reload }) => {
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!issue.trim()) {
      toast.warn("Please describe your issue");
      return;
    }

    setLoading(true);
    try {
      const response = await submitComplaint(token, "Others", issue);
      if (response.code === 0) {
        toast.success("Complaint submitted successfully");
        setIssue("");
        await reload();
        goBack();
      } else {
        toast.error("Failed: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={goBack} className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
        ← Back
      </button>

      <div className="p-4 bg-blue-900/20 border border-cyan-500/20 rounded-xl mb-4">
         <p className="text-cyan-300 text-sm font-bold uppercase tracking-tighter">Category: General Issues</p>
      </div>

      <textarea
        className="w-full bg-white/95 text-black p-4 rounded-xl min-h-[200px] outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner"
        placeholder="Describe your issue in detail..."
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black py-4 rounded-xl shadow-xl uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? "Transmitting..." : "Transmit Complaint"}
      </button>
    </div>
  );
};

export default PageOthers;