// src/pages/RegisteredEvents.jsx (Outside the RegisteredEvents folder)

import React, { useEffect, useState } from "react";
// Import from api folder (one level up)
import {
  getMembers,
  deregisterMember,
  deregisterTeam,
  addMember,
} from "../api/eventApi";
// Import from RegisteredEvents subfolder (one level down)
import SoloEventsList from "./RegisteredEvents/SoloEventsList";
import GroupEventsList from "./RegisteredEvents/GroupEventsList";
import AddMemberModal from "./RegisteredEvents/AddMemberModal";
import { useNavigate } from "react-router-dom";

const RegisteredEvents = ({ onClose, userToken }) => {
  // Use token from props or fallback
  const token = userToken || localStorage.getItem("token") || "";
  // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzZklkIjoiU0YwMDE2NDUiLCJpZCI6MTY0NSwiZW1haWwiOiJwdXNoa2FycmF0aG9yNzdAZ21haWwuY29tIiwibW9iaWxlIjoiNzY2NzMzMDMyNyIsImNvbGxlZ2UiOiJpaXQga2dwIiwiY2l0eSI6IlBhdG5hIiwibmFtZSI6InB1c2thciAiLCJkb2IiOiIyMDA0LTA1LTA4VDE4OjMwOjAwLjAwMFoiLCJ5b3AiOjIwMjgsImFkZHIiOiJub25lIiwic3RhdGUiOiJCaWhhciIsImdlbmRlciI6Ik0iLCJpc19jYSI6MCwic3RhdHVzIjoxLCJwYXltZW50X3N0YXR1cyI6MCwiZXhwIjoxNzY3OTc1OTc2fQ.9lZVrm5s_DR8AYCxZRXt0ywJVbwHc0Bac06cIJlzrGo";

  const navigate = useNavigate();
  

  const [soloEvents, setSoloEvents] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Fetch all registered events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API to get list of registered events with their details
      // This should come from your backend - list of all events the user registered for
      const registeredEvents = [
        { eventId: 1, name: "Solo Dance", minMembers: 1, maxMembers: 1 },
        { eventId: 2, name: "CentriFuge", minMembers: 3, maxMembers: 5 },
        { eventId: 3, name: "Group Music", minMembers: 2, maxMembers: 4 },
      ];

      const solo = [];
      const group = [];

      for (const event of registeredEvents) {
        try {
          const res = await getMembers(token, event.eventId);
          
          console.log(`Event ${event.name} response:`, res.data); // Debug log

          if (res.data && res.data.code === 0) {
            const members = res.data.members || res.data.data?.members || [];
            const isAdmin = res.data.isAdmin || res.data.data?.isAdmin || false;

            // Skip if no members (not actually registered)
            if (members.length === 0) continue;

            const eventData = {
              eventId: event.eventId,
              name: event.name,
              members,
              isAdmin,
              minMembers: event.minMembers || 1,
              maxMembers: event.maxMembers || 1,
            };

            // Solo event: maxMembers = 1
            if (event.maxMembers === 1) {
              solo.push(eventData);
            } else {
              group.push(eventData);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch members for event ${event.eventId}:`, error);
        }
      }

      console.log("Solo Events:", solo); // Debug
      console.log("Group Events:", group); // Debug

      setSoloEvents(solo);
      setGroupEvents(group);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("No authentication token found. Please login.");
      setLoading(false);
      return;
    }
    fetchEvents();
  }, [token]);

  // Deregister from solo event
  const handleDeregisterSolo = async (eventId) => {
    const confirm = window.confirm("Are you sure you want to deregister?");
    if (!confirm) return;

    try {
      const event = soloEvents.find((e) => e.eventId === eventId);
      if (!event || !event.members[0]) return;

      const response = await deregisterMember(token, eventId, [event.members[0].sfId]);
      
      if (response.data.code === 0) {
        alert("Successfully deregistered");
        fetchEvents();
      } else {
        alert(response.data.message || "Failed to deregister");
      }
    } catch (error) {
      console.error("Failed to deregister:", error);
      alert("Failed to deregister: " + (error.response?.data?.message || error.message));
    }
  };

  // Deregister entire team (admin only)
  const handleDeregisterTeam = async (eventId) => {
    const confirm = window.confirm("Are you sure you want to deregister the entire team?");
    if (!confirm) return;

    try {
      const response = await deregisterTeam(token, eventId);
      
      if (response.data.code === 0) {
        alert("Team deregistered successfully");
        fetchEvents();
      } else {
        alert(response.data.message || "Failed to deregister team");
      }
    } catch (error) {
      console.error("Failed to deregister team:", error);
      alert("Failed to deregister team: " + (error.response?.data?.message || error.message));
    }
  };

  // Deregister a single member from group (admin only)
  const handleDeregisterMember = async (eventId, memberSfId) => {
    const confirm = window.confirm(`Are you sure you want to remove ${memberSfId}?`);
    if (!confirm) return;

    try {
      const response = await deregisterMember(token, eventId, [memberSfId]);
      
      if (response.data.code === 0) {
        alert("Member removed successfully");
        fetchEvents();
      } else {
        alert(response.data.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member: " + (error.response?.data?.message || error.message));
    }
  };

  // Open add member modal
  const handleOpenAddMember = (eventId) => {
    setSelectedEventId(eventId);
    setShowAddMemberModal(true);
  };

  // Submit add member
  const handleAddMember = async (memberData) => {
    try {
      const response = await addMember(token, selectedEventId, [memberData]);
      
      if (response.data.code === 0) {
        alert("Member added successfully");
        setShowAddMemberModal(false);
        fetchEvents();
      } else {
        alert(response.data.message || "Failed to add member");
      }
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add member: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            if (showAddMemberModal) {
              setShowAddMemberModal(false);
            } else {
              // onClose();
              navigate("/dashboard");
            }
          }}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full w-12 h-12 flex items-center justify-center text-3xl hover:bg-gray-200 transition z-10 shadow-lg font-bold"
        >
          ✕
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-pink-900 text-white py-6 px-8 rounded-t-3xl text-center border-2 border-white/30 border-b-0 mb-6">
          <h1 className="text-4xl font-bold">Registered Events</h1>
        </div>

        {loading ? (
          <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-12">
            <div className="text-white text-center text-xl">Loading events...</div>
          </div>
        ) : !token ? (
          <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-12">
            <div className="text-white text-center text-xl">Please login to view registered events</div>
          </div>
        ) : (
          <>
            {/* Solo Events */}
            <SoloEventsList events={soloEvents} onDeregister={handleDeregisterSolo} />

            {/* Group Events */}
            <GroupEventsList
              events={groupEvents}
              onDeregisterTeam={handleDeregisterTeam}
              onDeregisterMember={handleDeregisterMember}
              onAddMember={handleOpenAddMember}
            />
          </>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <AddMemberModal
            onClose={() => setShowAddMemberModal(false)}
            onSubmit={handleAddMember}
          />
        )}
      </div>
    </div>
  );
};

export default RegisteredEvents;