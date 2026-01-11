

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
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzZklkIjoiU0YwMDE2NDUiLCJpZCI6MTY0NSwiZW1haWwiOiJwdXNoa2FycmF0aG9yNzdAZ21haWwuY29tIiwibW9iaWxlIjoiNzY2NzMzMDMyNyIsImNvbGxlZ2UiOiJpaXQga2dwIiwiY2l0eSI6IlBhdG5hIiwibmFtZSI6InB1c2thciAiLCJkb2IiOiIyMDA0LTA1LTA4VDE4OjMwOjAwLjAwMFoiLCJ5b3AiOjIwMjgsImFkZHIiOiJub25lIiwic3RhdGUiOiJCaWhhciIsImdlbmRlciI6Ik0iLCJpc19jYSI6MCwic3RhdHVzIjoxLCJwYXltZW50X3N0YXR1cyI6MCwiZXhwIjoxNzY3OTc1OTc2fQ.9lZVrm5s_DR8AYCxZRXt0ywJVbwHc0Bac06cIJlzrGo";
  // const token = userToken || localStorage.getItem("token") || "";
  const navigate = useNavigate();


  const [page, setPage] = useState("select");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetchComplaints(token);
      
      console.log("Fetch Complaints Response:", res); // Debug log
      
      // Handle different response structures from API
      let complaintData = [];
      
      if (res.code === 0 && res.data) {
        // API returns { code: 0, message: "...", data: [...] }
        complaintData = Array.isArray(res.data) ? res.data : [];
      } else if (Array.isArray(res.data?.data)) {
        // Nested structure
        complaintData = res.data.data;
      } else if (Array.isArray(res.data?.complaints)) {
        // Alternative structure
        complaintData = res.data.complaints;
      }
      
      console.log("Processed Complaints:", complaintData); // Debug log
      setComplaints(complaintData);
    } catch (error) {
      console.error("Failed to load complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this complaint?"
    );
    
    if (!confirmCancel) return;

    try {
      console.log("Cancelling complaint with ID:", id); // Debug
      const response = await cancelComplaint(token, id);
      console.log("Cancel response:", response); // Debug
      
      alert("Complaint cancelled successfully");
      await loadComplaints();
    } catch (error) {
      console.error("Failed to cancel complaint:", error);
      alert("Failed to cancel complaint: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="relative w-full max-w-2xl">
        {/* Close Button - Goes back to previous page or closes modal */}
        <button
          onClick={() => {
            if (page !== "select") {
              setPage("select"); // Go back to select page
            } else {
              navigate("/dashboard") // Close the modal if on select page
            }
          }}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-200 transition z-10 shadow-lg"
        >
          ✕
        </button>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-pink-900 text-white py-4 px-6 rounded-t-2xl text-center border border-white/20 border-b-0">
          <h1 className="text-3xl font-bold">Report Issue</h1>
        </div>

        {/* Content Area */}
        <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-b-2xl border border-white/20 border-t-0">
          {/* Loading State */}
          {loading && page === "select" ? (
            <div className="text-white p-12 text-center">
              <p>Loading complaints...</p>
            </div>
          ) : (
            <>
              {/* Page Select Issue (Default Page) */}
              {page === "select" && (
                <PageSelectIssue
                  complaints={complaints}
                  setPage={setPage}
                  onCancel={handleCancel}
                />
              )}

              {/* Page Registered Events */}
              {page === "registered" && (
                <PageRegistered
                  token={token}
                  goBack={() => setPage("select")}
                  reload={loadComplaints}
                />
              )}

              {/* Page Others */}
              {page === "others" && (
                <PageOthers
                  token={token}
                  goBack={() => setPage("select")}
                  reload={loadComplaints}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
