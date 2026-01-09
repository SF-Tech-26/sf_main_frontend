// src/api/eventApi.js

import axios from "axios";

const BASE = "https://masterapi.springfest.in/api/event";

// Axios instance
const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   EVENT APIs
============================ */

// Get all events (optional, backend provided)
export const getAllEvents = () => api.get("/");

// Get members of a group (admin or member)
export const getMembers = async (token, eventId) => {
  try {
    const response = await api.post("/getMembers", {
      token,
      eventId,
    });
    return response;
  } catch (error) {
    console.error("getMembers API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Deregister a member (for solo events or group member removal)
export const deregisterMember = async (token, eventId, memberToDeregister) => {
  try {
    const response = await api.post("/deregister/member", {
      token,
      eventId,
      memberToDeregister,
    });
    return response;
  } catch (error) {
    console.error("deregisterMember API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Deregister entire team (ADMIN ONLY)
export const deregisterTeam = async (token, eventId) => {
  try {
    const response = await api.post("/deregister/team", {
      token,
      eventId,
    });
    return response;
  } catch (error) {
    console.error("deregisterTeam API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Add member to an existing group
export const addMember = async (token, eventId, teamMembers) => {
  try {
    const response = await api.post("/addMember", {
      token,
      eventId,
      teamMembers,
    });
    return response;
  } catch (error) {
    console.error("addMember API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Register for an event (for initial registration)
export const registerForEvent = (token, eventId, teamMembers = []) =>
  api.post("/register", {
    token,
    eventId,
    teamMembers,
  });