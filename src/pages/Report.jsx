import React, { useEffect, useState } from "react";
// Import from Report subfolder (one level down)
import PageSelectIssue from "./Report/PageSelectIssue";
import PageRegistered from "./Report/PageRegistered";
import PageOthers from "./Report/PageOthers";
// Import from api folder (one level up)
import { fetchComplaints, cancelComplaint } from "../api/complaintApi";
import { useNavigate } from "react-router-dom";

const Report = ({ onClose }) => {
  // TODO: Replace with actual token from context/auth
  // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzZklkIjoiU0YwMDE2NDUiLCJpZCI6MTY0NSwiZW1haWwiOiJwdXNoa2FycmF0aG9yNzdAZ21haWwuY29tIiwibW9iaWxlIjoiNzY2NzMzMDMyNyIsImNvbGxlZ2UiOiJpaXQga2dwIiwiY2l0eSI6IlBhdG5hIiwibmFtZSI6InB1c2thciAiLCJkb2IiOiIyMDA0LTA1LTA4VDE4OjMwOjAwLjAwMFoiLCJ5b3AiOjIwMjgsImFkZHIiOiJub25lIiwic3RhdGUiOiJCaWhhciIsImdlbmRlciI6Ik0iLCJpc19jYSI6MCwic3RhdHVzIjoxLCJwYXltZW50X3N0YXR1cyI6MCwiZXhwIjoxNzY3OTc1OTc2fQ.9lZVrm5s_DR8AYCxZRXt0ywJVbwHc0Bac06cIJlzrGo";
  //  const token = userToken || localStorage.getItem("token") || "";
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
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this complaint?"
    );
    
    if (!confirmCancel) return;

    try {
      console.log("Cancelling complaint with ID:", id);
      const response = await cancelComplaint(token, id);
      console.log("Cancel response:", response);
      
      alert("Complaint cancelled successfully");
      await loadComplaints();
    } catch (error) {
      console.error("Failed to cancel complaint:", error);
      alert("Failed to cancel complaint: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="relative w-full max-w-lg">
        {/* Cosmic Background Container with Glowing Border */}
        <div className="relative bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-purple-800/80 rounded-3xl border-2 border-purple-400/60 shadow-[0_0_60px_rgba(168,85,247,0.4)] overflow-hidden backdrop-blur-md">
          
          {/* Animated Stars Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large bright stars */}
            <div className="absolute w-2 h-2 bg-white rounded-full top-[10%] left-[15%] animate-[twinkle_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <div className="absolute w-2 h-2 bg-white rounded-full top-[25%] left-[80%] animate-[twinkle_3s_ease-in-out_infinite] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[60%] left-[20%] animate-[twinkle_2.5s_ease-in-out_infinite] shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
            <div className="absolute w-2 h-2 bg-white rounded-full top-[85%] left-[70%] animate-[twinkle_2.8s_ease-in-out_infinite] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            
            {/* Medium stars */}
            <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[35%] left-[50%] animate-[twinkle_3.5s_ease-in-out_infinite]" />
            <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[50%] left-[90%] animate-[twinkle_2.3s_ease-in-out_infinite]" />
            <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[75%] left-[40%] animate-[twinkle_3.2s_ease-in-out_infinite]" />
            
            {/* Small distant stars */}
            <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[15%] left-[60%] animate-[twinkle_4s_ease-in-out_infinite]" />
            <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[40%] left-[30%] animate-[twinkle_3.8s_ease-in-out_infinite]" />
            <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[70%] left-[85%] animate-[twinkle_3.3s_ease-in-out_infinite]" />
            <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-[90%] left-[25%] animate-[twinkle_4.2s_ease-in-out_infinite]" />
            
            {/* Nebula clouds - reduced opacity */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-transparent to-pink-400/5 animate-[nebula_10s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-400/3 to-transparent animate-[nebula_15s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              if (page !== "select") {
                setPage("select");
              } else {
                navigate("/dashboard");
              }
            }}
            className="absolute top-4 right-4 bg-white text-purple-900 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold hover:bg-purple-100 transition z-20 shadow-lg border-2 border-purple-400"
          >
            ✕
          </button>

          {/* Content Container */}
          <div className="relative z-10 p-8">
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-center text-white mb-8 tracking-wide drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
              Report Issue
            </h1>

            {/* Main Content Area */}
            {loading && page === "select" ? (
              <div className="text-white text-center py-12">
                <p className="text-lg">Loading complaints...</p>
              </div>
            ) : (
              <>
                {page === "select" && (
                  <PageSelectIssue
                    complaints={complaints}
                    setPage={setPage}
                    onCancel={handleCancel}
                  />
                )}

                {page === "registered" && (
                  <PageRegistered
                    token={token}
                    goBack={() => setPage("select")}
                    reload={loadComplaints}
                  />
                )}

                {page === "others" && (
                  <PageOthers
                    token={token}
                    goBack={() => setPage("select")}
                    reload={loadComplaints}
                  />
                )}
              </>
            )}

            {/* Bottom Decorative Text */}
            <div className="mt-8 text-center">
              <p className="text-purple-200/80 text-sm tracking-widest font-semibold">
                Arcane Portal Accordion
              </p>
            </div>
          </div>
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
        
        @keyframes nebula {
          0%, 100% {
            opacity: 0.2;
            transform: translateX(0) translateY(0);
          }
          50% {
            opacity: 0.4;
            transform: translateX(20px) translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Report;