// src/api/complaintApi.js

const BASE_URL = "https://masterapi.springfest.in/api/user/complaints";

export const submitComplaint = async (token, type, issue) => {
  const response = await fetch(`${BASE_URL}/submitComplaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, type, issue }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit complaint");
  }

  return response.json();
};

export const fetchComplaints = async (token) => {
  const response = await fetch(`${BASE_URL}/fetchComplaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return response.json();
};

export const cancelComplaint = async (token, id) => {
  try {
    // Ensure id is a number
    const complaintId = Number(id);
    
    const requestBody = { 
      complaint_id: complaintId,
      token: token 
    };
    
    console.log("Sending cancel request with:", requestBody); // Debug
    
    const response = await fetch(`${BASE_URL}/cancelComplaints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    // Log the FULL response including error details
    console.log("Cancel Complaint Full Response:", JSON.stringify(data, null, 2));
    
    if (data.error && data.error.length > 0) {
      console.log("API Error Details:", data.error);
      // Show what fields are missing
      data.error.forEach(err => {
        console.log("Missing field:", err.path || err.field || err);
      });
    }

    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || "Failed to cancel complaint");
    }

    return data;
  } catch (error) {
    console.error("Cancel Complaint Error:", error);
    throw error;
  }
};