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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState(null);

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
      toast.warn("Please login to continue");
      navigate("/signin");
      return;
    }
    loadComplaints();
  }, [token]);

  const handleCancel = async (id) => {
    setPendingCancelId(id);
    setShowConfirmModal(true);
  };

  const confirmCancel = async () => {
    try {
      console.log("Cancelling complaint with ID:", pendingCancelId);
      const response = await cancelComplaint(token, pendingCancelId);
      console.log("Cancel response:", response);
      
      if (response && response.code === 0) {
        toast.success("Complaint cancelled successfully");
        await loadComplaints();
      } else {
        toast.error(response?.message || "Failed to cancel complaint");
      }
    } catch (error) {
      console.error("Failed to cancel complaint:", error);
      toast.error("Failed to cancel: " + (error.response?.data?.message || error.message));
    } finally {
      setShowConfirmModal(false);
      setPendingCancelId(null);
    }
  };

  const cancelCancel = () => {
    setShowConfirmModal(false);
    setPendingCancelId(null);
  };

  const handleClose = () => {
    if (showConfirmModal) {
      setShowConfirmModal(false);
    } else if (page !== "select") {
      setPage("select");
    } else {
      navigate("/dashboard");
    }
  };

  return (  
    <div 
      className="fixed inset-0 flex justify-center items-center z-50 p-2 sm:p-4"
      onClick={handleClose}
    >
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e]/80 via-[#06182d]/85 to-[#0a1628]/80 backdrop-blur-2xl"></div>

      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
      
      <div 
        className="relative w-full max-w-lg lg:max-w-xl max-h-[95vh] overflow-hidden flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cosmic Background */}
        <div className="relative flex-1 flex flex-col bg-gradient-to-br from-[#0a0f1e] via-[#050b14] to-[#0a0f1e] rounded-[2rem] border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
          
          {/* Original Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-2 h-2 bg-white rounded-full top-[10%] left-[15%] animate-[twinkle_2s_infinite] shadow-[0_0_8px_white]" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[60%] left-[20%] animate-[twinkle_2.5s_infinite]" />
            <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[35%] left-[50%] animate-[twinkle_3.5s_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 animate-[nebula_10s_infinite]" />
          </div>

          {/* Close Button - No Circle Background */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-cyan-400 text-2xl font-bold hover:text-cyan-300 hover:scale-110 transition-all z-50"
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
                
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Popup */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={cancelCancel}
        >
          <div 
            className="bg-gradient-to-br from-[#0a0f1e] via-[#050b14] to-[#0a0f1e] rounded-2xl border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.3)] p-6 sm:p-8 max-w-md w-full animate-[scaleIn_0.2s_ease-out] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="absolute w-2 h-2 bg-white rounded-full top-[20%] left-[25%] animate-[twinkle_2s_infinite]" />
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[70%] left-[75%] animate-[twinkle_2.5s_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
            </div>

            <div className="relative">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>

              {/* Message */}
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]">
                Cancel Complaint?
              </h2>
              <p className="text-cyan-200/80 text-center mb-6 text-sm sm:text-base">
                Are you sure you want to cancel this complaint? This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={confirmCancel}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={cancelCancel}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-600/30"
                >
                  No, Keep It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes nebula { 0%, 100% { opacity: 0.2; transform: translate(0,0); } 50% { opacity: 0.4; transform: translate(20px, -20px); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Report;