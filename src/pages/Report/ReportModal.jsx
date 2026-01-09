import React, { useEffect, useState } from "react";
import PageSelectIssue from "./PageSelectIssue";
import PageRegistered from "./PageRegistered";
import PageOthers from "./PageOthers";
import { fetchComplaints, cancelComplaint } from "../../api/complaintApi";

const token = "YOUR_TOKEN_HERE";

const ReportModal = () => {

  const [page, setPage] = useState("select");
  const [complaints, setComplaints] = useState([]);

  const loadComplaints = async () => {
    const res = await fetchComplaints(token);
    setComplaints(res.data.data || []);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCancel = async (id) => {
    await cancelComplaint(token, id);
    loadComplaints();
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-black/50">
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
    </div>
  );
};

export default ReportModal;
