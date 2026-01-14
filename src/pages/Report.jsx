import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageSelectIssue from "./Report/PageSelectIssue";
import PageRegistered from "./Report/PageRegistered";
import PageOthers from "./Report/PageOthers";
import { fetchComplaints, cancelComplaint } from "../api/complaintApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Report = ({ onClose }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [page, setPage] = useState("select");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetchComplaints(token);
      console.log("Fetch Complaints Response:", res);
      
      let complaintData = [];
      if (res.code === 0 && res.data) {
        complaintData = Array.isArray(res.data) ? res.data : [];
      } else if (Array.isArray(res.data?.data)) {
        complaintData = res.data.data;
      } else if (Array.isArray(res.data?.complaints)) {
        complaintData = res.data.complaints;
      }
      
      console.log("Processed Complaints:", complaintData);
      setComplaints(complaintData);
    } catch (error) {
      console.error("Failed to load complaints:", error);
      toast.error("Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!token){
      navigate("/signin");
      return;
    }
    loadComplaints();
  }, [token]);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this complaint?");
    if (!confirmCancel) return;

    try {
      console.log("Cancelling complaint with ID:", id);
      const response = await cancelComplaint(token, id);
      console.log("Cancel response:", response);
      toast.success("Complaint cancelled successfully");
      await loadComplaints();
    } catch (error) {
      console.error("Failed to cancel complaint:", error);
      toast.error("Failed to cancel: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-2 sm:p-4">
      <ToastContainer theme="dark" position="top-center" />
      <div className="relative w-full max-w-lg lg:max-w-xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Cosmic Background */}
        <div className="relative flex-1 flex flex-col bg-gradient-to-br from-[#0a0f1e] via-[#050b14] to-[#0a0f1e] rounded-[2rem] border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
          
          {/* Original Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-2 h-2 bg-white rounded-full top-[10%] left-[15%] animate-[twinkle_2s_infinite] shadow-[0_0_8px_white]" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[60%] left-[20%] animate-[twinkle_2.5s_infinite]" />
            <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[35%] left-[50%] animate-[twinkle_3.5s_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 animate-[nebula_10s_infinite]" />
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              if (page !== "select") setPage("select");
              else navigate("/dashboard");
            }}
            className="absolute top-4 right-4 bg-white/10 text-cyan-400 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold hover:bg-white/20 transition z-50 border border-cyan-500/30"
          >
            ✕
          </button>

          {/* Content Container - Scrollable */}
          <div className="relative z-10 p-4 sm:p-8 flex flex-col overflow-y-auto custom-scrollbar">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 tracking-wide drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]">
              Report Issue
            </h1>

            {loading && page === "select" ? (
              <div className="text-cyan-400 text-center py-12 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg tracking-widest animate-pulse">SYNCHRONIZING...</p>
              </div>
            ) : (
              <div className="flex-1">
                {page === "select" && (
                  <PageSelectIssue complaints={complaints} setPage={setPage} onCancel={handleCancel} />
                )}
                {page === "registered" && (
                  <PageRegistered token={token} goBack={() => setPage("select")} reload={loadComplaints} />
                )}
                {page === "others" && (
                  <PageOthers token={token} goBack={() => setPage("select")} reload={loadComplaints} />
                )}
              </div>
            )}

            <div className="mt-8 text-center border-t border-cyan-500/10 pt-4">
              <p className="text-cyan-500/40 text-[10px] tracking-[0.4em] font-bold uppercase">
                Arcane Portal Secure
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes nebula { 0%, 100% { opacity: 0.2; transform: translate(0,0); } 50% { opacity: 0.4; transform: translate(20px, -20px); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0891b2; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Report;