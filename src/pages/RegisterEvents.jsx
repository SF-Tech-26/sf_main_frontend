// src/pages/RegisteredEvents.jsx (FINAL FIXED VERSION)

import React, { useEffect, useState } from "react";
import {
  getMembers,
  deregisterMember,
  deregisterTeam,
  addMember,
  getRegisteredEvents
} from "../services/eventService";
import SoloEventsList from "./RegisteredEvents/SoloEventsList";
import GroupEventsList from "./RegisteredEvents/GroupEventsList";
import AddMemberModal from "./RegisteredEvents/AddMemberModal";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Install: npm install jwt-decode

const RegisteredEvents = ({ onClose, userToken }) => {
  const token = userToken || localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const [soloEvents, setSoloEvents] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Decode token to get user info
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({
          email: decoded.email,
          sfId: decoded.sfId,
          name: decoded.name
        });
        console.log("Decoded user info:", decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, [token]);

  // Fetch all registered events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getRegisteredEvents(token);
      console.log("API Response:", response);

      if (response && response.code === 0) {
        // Map Solo Events with user info from decoded token
        const solo = (response.soloEventData || []).map(item => ({
          eventId: item.event?.id,
          name: item.event?.name,
          genre: item.event?.genre?.genre,
          eventCity: item.event_city,
          members: userInfo ? [{
            sfId: userInfo.sfId,
            email: userInfo.email,
            name: userInfo.name,
            isAdmin: true
          }] : []
        }));

        // Map Group Events
        const group = (response.groupEventData || []).map(item => ({
          eventId: item.event?.id,
          name: item.event?.name,
          genre: item.event?.genre?.genre,
          eventCity: item.event_city,
          teamName: item.team_name,
          isAdmin: item.is_admin,
          members: (item.members || []).map(m => ({
            sfId: m.sf_id || m.sfId || m.id,
            email: m.email || m.user_email || '',
            name: m.name || m.user_name || 'Member',
            isAdmin: m.is_admin || false
          })),
          minMembers: item.event?.min_members || 1,
          maxMembers: item.event?.max_members || 1
        }));

        console.log("Mapped Solo:", solo);
        console.log("Mapped Group:", group);

        setSoloEvents(solo);
        setGroupEvents(group);
      } else {
        console.error("Failed to fetch registered events:", response?.message);
        alert(response?.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      alert("Failed to fetch events: " + error.message);
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
    // Wait for userInfo to be set before fetching events
    if (userInfo) {
      fetchEvents();
    }
  }, [token, userInfo]);

  // Deregister from solo event
  const handleDeregisterSolo = async (eventId) => {
    const confirm = window.confirm("Are you sure you want to deregister?");
    if (!confirm) return;

    try {
      const event = soloEvents.find((e) => e.eventId === eventId);
      
      if (!event) {
        alert("Event not found");
        return;
      }

      if (!event.members || !event.members[0]) {
        alert("Unable to deregister: Member information not found");
        return;
      }

      const member = event.members[0];
      
      if (!member.sfId || !member.email) {
        alert("Unable to deregister: Invalid member data");
        console.error("Member data:", member);
        return;
      }

      console.log("Deregistering with:", {
        eventId,
        memberToDeregister: [{
          sfId: member.sfId,
          email: member.email
        }]
      });

      // API expects memberToDeregister array with email and sfId objects
      const response = await deregisterMember(token, eventId, [{
        email: member.email,
        sfId: member.sfId
      }]);

      console.log("Deregister response:", response);

      if (response.data.code === 0) {
        alert("Successfully deregistered");
        fetchEvents();
      } else {
        alert(response.data.message || "Failed to deregister");
      }
    } catch (error) {
      console.error("Failed to deregister:", error);
      console.error("Error details:", error.response?.data);
      alert("Failed to deregister: " + (error.response?.data?.message || error.message));
    }
  };

  // Deregister entire team (admin only)
  const handleDeregisterTeam = async (eventId) => {
    const event = groupEvents.find(e => e.eventId === eventId);
    
    if (!event) {
      alert("Event not found");
      return;
    }

    if (!event.isAdmin) {
      alert("Only team admin can deregister the entire team");
      return;
    }

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
    try {
      const event = groupEvents.find(e => e.eventId === eventId);
      
      if (!event) {
        alert("Event not found");
        return;
      }

      // Check if user is admin
      if (!event.isAdmin) {
        alert("Only team admin can remove members");
        return;
      }

      // Check if there are enough members (must be > minMembers after removal)
      if (event.members.length <= event.minMembers) {
        alert(`Cannot remove member. Team must have at least ${event.minMembers} members. Current members: ${event.members.length}`);
        return;
      }

      // Find the member to deregister
      const memberToRemove = event.members.find(m => m.sfId === memberSfId);
      
      if (!memberToRemove) {
        alert("Member not found");
        return;
      }

      if (!memberToRemove.email) {
        alert("Member email not found. Cannot deregister.");
        return;
      }

      const confirm = window.confirm(`Are you sure you want to remove ${memberToRemove.name || memberSfId}?`);
      if (!confirm) return;

      console.log("Deregistering member:", {
        eventId,
        memberToDeregister: [{
          email: memberToRemove.email,
          sfId: memberToRemove.sfId
        }]
      });

      // API expects memberToDeregister array with email and sfId objects
      const response = await deregisterMember(token, eventId, [{
        email: memberToRemove.email,
        sfId: memberToRemove.sfId
      }]);

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

  // Open add member modal (admin only)
  const handleOpenAddMember = (eventId) => {
    const event = groupEvents.find(e => e.eventId === eventId);
    
    if (!event) {
      alert("Event not found");
      return;
    }

    // Check if user is admin
    if (!event.isAdmin) {
      alert("Only team admin can add members");
      return;
    }

    // Check if team is already full
    if (event.members.length >= event.maxMembers) {
      alert(`Team is full. Maximum members: ${event.maxMembers}`);
      return;
    }

    setSelectedEventId(eventId);
    setShowAddMemberModal(true);
  };

  // Submit add member (admin only)
  const handleAddMember = async (memberData) => {
    try {
      const event = groupEvents.find(e => e.eventId === selectedEventId);
      
      if (!event) {
        alert("Event not found");
        return;
      }

      // Check if user is admin
      if (!event.isAdmin) {
        alert("Only team admin can add members");
        return;
      }

      // Check if team is already full
      if (event.members.length >= event.maxMembers) {
        alert(`Team is full. Maximum members: ${event.maxMembers}`);
        return;
      }

      console.log("Adding member:", memberData);

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