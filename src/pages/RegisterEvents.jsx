// src/pages/RegisteredEvents.jsx - Cosmic Theme matching Report.jsx

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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisteredEvents = ({ onClose, userToken }) => {
  const token = userToken || localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const [soloEvents, setSoloEvents] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState({ title: "", description: "" });

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
      const response = await getRegisteredEvents(token);

      if (response && response.code === 0) {
        // Map solo events
        const solo = (response.soloEventData || []).map(item => ({
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
        }));

        // Map group events
        const groupPromises = (response.groupEventData || []).map(async (item) => {
          let detailedMembers = [];

          if (item.GroupMembers && item.GroupMembers.length > 0) {
            detailedMembers = item.GroupMembers.map(gm => {
              const user = gm.user || gm;
              const isLeader = user.id === item.leader_id;

              return {
                sfId: user.sfId || user.sf_id || user.SF_ID,
                email: user.email || user.EMAIL || userInfo.email,
                name: user.name || user.NAME || 'Member',
                isAdmin: isLeader,
                userId: user.id
              };
            });
          } else {
            try {
              const membersResponse = await getMembers(token, item.event?.id);

              if (membersResponse?.code === 0 && membersResponse?.data) {
                const membersData = membersResponse.data;

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

          if (detailedMembers.length === 0) {
            detailedMembers = [{
              sfId: userInfo.sfId,
              email: userInfo.email,
              name: userInfo.name,
              isAdmin: true,
              userId: userInfo.id
            }];
          }

          const currentUserIsAdmin = userInfo.id === item.leader_id ||
            detailedMembers.some(m => m.userId === userInfo.id && m.isAdmin);

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

        setSoloEvents(solo);
        setGroupEvents(group);
      } else {
        toast.error(response?.message || "Failed to fetch events");
      }
    } catch (error) {
      toast.error("Failed to fetch events: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.warn("No authentication token found. Please login.");
      setLoading(false);
      return;
    }
    if (userInfo) {
      fetchEvents();
    }
  }, [token, userInfo]);

  // Show confirmation modal
  const showConfirmation = (title, description, action) => {
    setConfirmMessage({ title, description });
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  // Handle confirmation
  const handleConfirm = async () => {
    setShowConfirmModal(false);
    if (confirmAction) {
      await confirmAction();
    }
    setConfirmAction(null);
  };

  // Handle cancel
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleDeregisterSolo = async (eventId) => {
    const event = soloEvents.find((e) => e.eventId === eventId);
    if (!event || !event.members[0]) {
      toast.error("Unable to deregister: Event information not found");
      return;
    }

    const member = event.members[0];

    showConfirmation(
      "Deregister from Event?",
      "Are you sure you want to deregister from this event? This action cannot be undone.",
      async () => {
        try {
          if (!member.sfId || !member.email) {
            toast.error("Unable to deregister: Missing member information");
            return;
          }

          const response = await deregisterMember(token, eventId, [{
            email: member.email,
            sfId: member.sfId
          }]);

          if (response?.code === 0) {
            toast.success("Successfully deregistered from the event!");
            fetchEvents();
          } else {
            toast.error(response?.message || "Failed to deregister");
          }
        } catch (error) {
          toast.error("Failed to deregister: " + (error.response?.data?.message || error.message));
        }
      }
    );
  };

  const handleDeregisterTeam = async (eventId) => {
    const event = groupEvents.find(e => e.eventId === eventId);
    if (!event) {
      toast.error("Event not found");
      return;
    }

    if (!event.isAdmin) {
      toast.warn("Only the team leader can deregister the entire team");
      return;
    }

    showConfirmation(
      "Deregister Entire Team?",
      `This will remove all ${event.members.length} member(s) from "${event.name}" and cannot be undone.`,
      async () => {
        try {
          const response = await deregisterTeam(token, eventId);

          if (response?.code === 0) {
            toast.success("Team deregistered successfully!");
            fetchEvents();
          } else {
            toast.error(response?.message || "Failed to deregister team");
          }
        } catch (error) {
          toast.error("Failed to deregister team: " + (error.response?.data?.message || error.message));
        }
      }
    );
  };

  const handleDeregisterMember = async (eventId, memberSfId) => {
    try {
      const event = groupEvents.find(e => e.eventId === eventId);
      if (!event) {
        toast.error("Event not found");
        return;
      }

      if (!event.isAdmin) {
        toast.warn("Only the team leader can remove members");
        return;
      }

      if (event.members.length <= event.minMembers) {
        toast.error(`Cannot remove member. Team must have at least ${event.minMembers} members.`);
        return;
      }

      const memberToRemove = event.members.find(m => m.sfId === memberSfId);
      if (!memberToRemove) {
        toast.error("Member not found in team");
        return;
      }

      if (memberToRemove.isAdmin) {
        toast.warn("Cannot remove the team leader.");
        return;
      }

      if (!memberToRemove.email) {
        toast.error("Cannot remove member: Email information missing");
        return;
      }

      showConfirmation(
        "Remove Team Member?",
        `Remove ${memberToRemove.name} (${memberToRemove.sfId}) from the team?`,
        async () => {
          try {
            const response = await deregisterMember(token, eventId, [{
              email: memberToRemove.email,
              sfId: memberToRemove.sfId
            }]);

            if (response?.code === 0) {
              toast.success("Member removed successfully!");
              fetchEvents();
            } else {
              toast.error(response?.message || "Failed to remove member");
            }
          } catch (error) {
            toast.error("Failed to remove member: " + (error.response?.data?.message || error.message));
          }
        }
      );
    } catch (error) {
      toast.error("Failed to process request: " + error.message);
    }
  };

  const handleOpenAddMember = (eventId) => {
    const event = groupEvents.find(e => e.eventId === eventId);
    if (!event) {
      toast.error("Event not found");
      return;
    }

    if (!event.isAdmin) {
      toast.warn("Only the team leader can add members");
      return;
    }

    if (event.members.length >= event.maxMembers) {
      toast.warn(`Team is full. Max members: ${event.maxMembers}`);
      return;
    }

    setSelectedEventId(eventId);
    setShowAddMemberModal(true);
  };

  const handleAddMember = async (memberData) => {
    try {
      const event = groupEvents.find(e => e.eventId === selectedEventId);
      if (!event) {
        toast.error("Event not found");
        return;
      }

      if (!event.isAdmin) {
        toast.warn("Only the team leader can add members");
        return;
      }

      const memberExists = event.members.some(m =>
        m.sfId.toUpperCase() === memberData.sfId.toUpperCase() ||
        m.email.toLowerCase() === memberData.email.toLowerCase()
      );

      if (memberExists) {
        toast.warn("This member is already in the team");
        return;
      }

      const response = await addMember(token, selectedEventId, [memberData]);

      if (response?.code === 0) {
        toast.success("Member added successfully!");
        setShowAddMemberModal(false);
        fetchEvents();
      } else {
        toast.error(response?.message || "Failed to add member");
      }
    } catch (error) {
      toast.error("Failed to add member: " + (error.response?.data?.message || error.message));
    }
  };

  const handleClose = () => {
    if (showAddMemberModal) {
      setShowAddMemberModal(false);
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
        className="relative w-full max-w-6xl max-h-[60vh] sm:max-h-[95vh] overflow-hidden flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cosmic Modal Container */}
        <div className="relative flex-1 flex flex-col bg-gradient-to-br from-[#0a0f1e] via-[#050b14] to-[#0a0f1e] rounded-[2rem] border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-2 h-2 bg-white rounded-full top-[10%] left-[15%] animate-[twinkle_2s_infinite] shadow-[0_0_8px_white]" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[60%] left-[20%] animate-[twinkle_2.5s_infinite]" />
            <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[35%] left-[50%] animate-[twinkle_3.5s_infinite]" />
            <div className="absolute w-2 h-2 bg-white rounded-full top-[80%] right-[15%] animate-[twinkle_2.8s_infinite]" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[25%] right-[30%] animate-[twinkle_3s_infinite]" />
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
              Registered Events
            </h1>

            {userInfo && (
              <p className="text-cyan-400/80 text-center text-sm mb-6 tracking-wider">
                Welcome, {userInfo.name} ({userInfo.sfId})
              </p>
            )}

            {loading ? (
              <div className="text-cyan-400 text-center py-12 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg tracking-widest animate-pulse">SYNCHRONIZING...</p>
              </div>
            ) : !token ? (
              <div className="text-cyan-400 text-center py-12 text-lg tracking-wider">
                Please login to view registered events
              </div>
            ) : (soloEvents.length === 0 && groupEvents.length === 0) ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <div className="text-cyan-400/80 text-lg tracking-wide">
                  You haven't registered for any events yet
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-6">
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
              </div>
            )}

            <div className="mt-8 text-center border-t border-cyan-500/10 pt-4">
              <p className="text-cyan-500/40 text-[10px] tracking-[0.4em] font-bold uppercase">
                
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onSubmit={handleAddMember}
        />
      )}

      {/* Confirmation Modal Popup */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gradient-to-br from-[#0a0f1e] via-[#050b14] to-[#0a0f1e] rounded-2xl border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.3)] p-6 sm:p-8 max-w-md w-full animate-[scaleIn_0.2s_ease-out] relative">
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
                {confirmMessage.title}
              </h2>
              <p className="text-cyan-200/80 text-center mb-6 text-sm sm:text-base">
                {confirmMessage.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                >
                  Yes, Confirm
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-600/30"
                >
                  Cancel
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

export default RegisteredEvents;