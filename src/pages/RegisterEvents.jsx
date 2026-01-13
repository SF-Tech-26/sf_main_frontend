// src/pages/RegisteredEvents.jsx - FINAL WORKING VERSION

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
import { jwtDecode } from "jwt-decode";

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
          name: decoded.name,
          id: decoded.id
        });
        console.log("✅ Decoded user info:", decoded);
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
      }
    }
  }, [token]);

  // Fetch all registered events
  const fetchEvents = async () => {
    if (!userInfo) return;

    setLoading(true);
    try {
      console.log("📡 Fetching registered events...");
      const response = await getRegisteredEvents(token);
      console.log("📥 Full API Response:", response);

      if (response && response.code === 0) {
        // ========== MAP SOLO EVENTS ==========
        const solo = (response.soloEventData || []).map(item => {
          console.log("👤 Solo event raw:", item);
          return {
            eventId: item.event?.id,
            name: item.event?.name,
            genre: item.event?.genre?.genre || item.event?.genre,
            eventCity: item.event_city,
            members: [{
              sfId: userInfo.sfId,
              email: userInfo.email,
              name: userInfo.name,
              isAdmin: true
            }]
          };
        });

        // ========== MAP GROUP EVENTS ==========
        const groupPromises = (response.groupEventData || []).map(async (item) => {
          console.log("👥 Group event raw:", item);

          // Extract members from GroupMembers array (NEW STRUCTURE!)
          let detailedMembers = [];

          if (item.GroupMembers && item.GroupMembers.length > 0) {
            console.log("✅ Found GroupMembers in response:", item.GroupMembers);
            detailedMembers = item.GroupMembers.map(gm => {
              const user = gm.user || gm;
              const isLeader = user.id === item.leader_id;
              console.log("🔍 Processing GroupMember:", user, "Is Leader:", isLeader);

              return {
                sfId: user.sfId || user.sf_id || user.SF_ID,
                email: user.email || user.EMAIL || userInfo.email,
                name: user.name || user.NAME || 'Member',
                isAdmin: isLeader,
                userId: user.id
              };
            });
          } else {
            // Fallback: Try to fetch using getMembers API
            try {
              console.log(`🔍 No GroupMembers, fetching via API for event ${item.event?.id}...`);
              const membersResponse = await getMembers(token, item.event?.id);
              console.log("📥 getMembers API response:", membersResponse);

              if (membersResponse?.code === 0 && membersResponse?.data) {
                const membersData = membersResponse.data;
                console.log("✅ Members from API:", membersData);

                detailedMembers = membersData.map(m => {
                  const user = m.user || m;
                  const isLeader = user.id === item.leader_id;

                  return {
                    sfId: user.sfId || user.sf_id || user.SF_ID,
                    email: user.email || user.EMAIL || userInfo.email,
                    name: user.name || user.NAME || 'Member',
                    isAdmin: isLeader,
                    userId: user.id
                  };
                });
              }
            } catch (err) {
              console.error("❌ Failed to fetch members via API:", err);
            }
          }

          // If still no members, create default entry
          if (detailedMembers.length === 0) {
            console.log("⚠️ No members found, creating default entry");
            detailedMembers = [{
              sfId: userInfo.sfId,
              email: userInfo.email,
              name: userInfo.name,
              isAdmin: true,
              userId: userInfo.id
            }];
          }

          // Check if current user is admin
          const currentUserIsAdmin = userInfo.id === item.leader_id ||
            detailedMembers.some(m => m.userId === userInfo.id && m.isAdmin);

          console.log("✅ Final processed members:", detailedMembers);
          console.log("🔑 Current user is admin:", currentUserIsAdmin);

          return {
            eventId: item.event?.id,
            name: item.event?.name,
            genre: item.event?.genre?.genre || item.event?.genre,
            eventCity: item.event_city,
            teamName: item.team_name,
            isAdmin: currentUserIsAdmin,
            members: detailedMembers,
            minMembers: item.event?.min_participation || item.event?.min_members || 1,
            maxMembers: item.event?.max_participation || item.event?.max_members || 10,
            leaderId: item.leader_id
          };
        });

        const group = await Promise.all(groupPromises);

        console.log("✅ Final Mapped Solo Events:", solo);
        console.log("✅ Final Mapped Group Events:", group);

        setSoloEvents(solo);
        setGroupEvents(group);
      } else {
        console.error("❌ API returned error:", response?.message);
        alert(response?.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("❌ Failed to fetch events:", error);
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
    if (userInfo) {
      fetchEvents();
    }
  }, [token, userInfo]);

  // ========== DEREGISTER SOLO EVENT ==========
  const handleDeregisterSolo = async (eventId) => {
    const confirm = window.confirm("Are you sure you want to deregister from this event?");
    if (!confirm) return;

    try {
      const event = soloEvents.find((e) => e.eventId === eventId);

      if (!event || !event.members[0]) {
        alert("Unable to deregister: Event information not found");
        return;
      }

      const member = event.members[0];

      if (!member.sfId || !member.email) {
        alert("Unable to deregister: Missing member information");
        return;
      }

      console.log("🗑️ Deregistering solo event:", {
        eventId,
        memberToDeregister: [{
          email: member.email,
          sfId: member.sfId
        }]
      });

      const response = await deregisterMember(token, eventId, [{
        email: member.email,
        sfId: member.sfId
      }]);

      console.log("✅ Deregister response:", response);

      if (response?.code === 0) {
        alert("Successfully deregistered from the event!");
        fetchEvents();
      } else {
        alert(response?.message || "Failed to deregister");
      }
    } catch (error) {
      console.error("❌ Failed to deregister:", error);
      alert("Failed to deregister: " + (error.response?.data?.message || error.message));
    }
  };

  // ========== DEREGISTER ENTIRE TEAM ==========
  const handleDeregisterTeam = async (eventId) => {
    const event = groupEvents.find(e => e.eventId === eventId);

    if (!event) {
      alert("Event not found");
      return;
    }

    if (!event.isAdmin) {
      alert("Only the team leader can deregister the entire team");
      return;
    }

    const confirm = window.confirm(`Are you sure you want to deregister the entire team from "${event.name}"?\n\nThis will remove all ${event.members.length} member(s) and cannot be undone.`);
    if (!confirm) return;

    try {
      console.log("🗑️ Deregistering entire team for event:", eventId);

      const response = await deregisterTeam(token, eventId);
      console.log("✅ Deregister team response:", response);

      if (response?.code === 0) {
        alert("Team deregistered successfully!");
        fetchEvents();
      } else {
        alert(response?.message || "Failed to deregister team");
      }
    } catch (error) {
      console.error("❌ Failed to deregister team:", error);
      alert("Failed to deregister team: " + (error.response?.data?.message || error.message));
    }
  };

  // ========== DEREGISTER SINGLE MEMBER ==========
  const handleDeregisterMember = async (eventId, memberSfId) => {
    try {
      const event = groupEvents.find(e => e.eventId === eventId);

      if (!event) {
        alert("Event not found");
        return;
      }

      if (!event.isAdmin) {
        alert("Only the team leader can remove members");
        return;
      }

      // Check minimum member requirement
      if (event.members.length <= event.minMembers) {
        alert(`Cannot remove member.\n\nTeam must have at least ${event.minMembers} member(s).\nCurrent members: ${event.members.length}\n\nTo remove this member, use "Deregister Team" to remove the entire team.`);
        return;
      }

      const memberToRemove = event.members.find(m => m.sfId === memberSfId);

      if (!memberToRemove) {
        alert("Member not found in team");
        return;
      }

      // Prevent removing leader
      if (memberToRemove.isAdmin) {
        alert("Cannot remove the team leader.\n\nUse 'Deregister Team' to remove the entire team instead.");
        return;
      }

      if (!memberToRemove.email) {
        alert("Cannot remove member: Email information missing");
        return;
      }

      const confirm = window.confirm(`Remove ${memberToRemove.name} (${memberToRemove.sfId}) from the team?`);
      if (!confirm) return;

      console.log("🗑️ Removing member:", {
        eventId,
        memberToDeregister: [{
          email: memberToRemove.email,
          sfId: memberToRemove.sfId
        }]
      });

      const response = await deregisterMember(token, eventId, [{
        email: memberToRemove.email,
        sfId: memberToRemove.sfId
      }]);

      console.log("✅ Remove member response:", response);

      if (response?.code === 0) {
        alert("Member removed successfully!");
        fetchEvents();
      } else {
        alert(response?.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("❌ Failed to remove member:", error);
      alert("Failed to remove member: " + (error.response?.data?.message || error.message));
    }
  };

  // ========== OPEN ADD MEMBER MODAL ==========
  const handleOpenAddMember = (eventId) => {
    const event = groupEvents.find(e => e.eventId === eventId);

    if (!event) {
      alert("Event not found");
      return;
    }

    if (!event.isAdmin) {
      alert("Only the team leader can add members");
      return;
    }

    if (event.members.length >= event.maxMembers) {
      alert(`Team is full.\n\nMaximum members: ${event.maxMembers}\nCurrent members: ${event.members.length}`);
      return;
    }

    setSelectedEventId(eventId);
    setShowAddMemberModal(true);
  };

  // ========== ADD MEMBER ==========
  const handleAddMember = async (memberData) => {
    try {
      const event = groupEvents.find(e => e.eventId === selectedEventId);

      if (!event) {
        alert("Event not found");
        return;
      }

      if (!event.isAdmin) {
        alert("Only the team leader can add members");
        return;
      }

      if (event.members.length >= event.maxMembers) {
        alert(`Team is full. Maximum members: ${event.maxMembers}`);
        return;
      }

      // Check if member already exists
      const memberExists = event.members.some(m =>
        m.sfId.toUpperCase() === memberData.sfId.toUpperCase() ||
        m.email.toLowerCase() === memberData.email.toLowerCase()
      );

      if (memberExists) {
        alert("This member is already in the team");
        return;
      }

      console.log("➕ Adding member:", {
        eventId: selectedEventId,
        teamMembers: [memberData]
      });

      const response = await addMember(token, selectedEventId, [memberData]);
      console.log("✅ Add member response:", response);

      if (response?.code === 0) {
        alert("Member added successfully!");
        setShowAddMemberModal(false);
        fetchEvents();
      } else {
        alert(response?.message || "Failed to add member");
      }
    } catch (error) {
      console.error("❌ Failed to add member:", error);
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
          {userInfo && (
            <p className="text-sm text-gray-300 mt-2">
              Welcome, {userInfo.name} ({userInfo.sfId})
            </p>
          )}
        </div>

        {loading ? (
          <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-12">
            <div className="text-white text-center text-xl">Loading events...</div>
          </div>
        ) : !token ? (
          <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-12">
            <div className="text-white text-center text-xl">Please login to view registered events</div>
          </div>
        ) : (soloEvents.length === 0 && groupEvents.length === 0) ? (
          <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-12">
            <div className="text-white text-center text-xl">You haven't registered for any events yet</div>
          </div>
        ) : (
          <>
            {/* Solo Events */}
            {soloEvents.length > 0 && (
              <SoloEventsList events={soloEvents} onDeregister={handleDeregisterSolo} />
            )}

            {/* Group Events */}
            {groupEvents.length > 0 && (
              <GroupEventsList
                events={groupEvents}
                onDeregisterTeam={handleDeregisterTeam}
                onDeregisterMember={handleDeregisterMember}
                onAddMember={handleOpenAddMember}
              />
            )}
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