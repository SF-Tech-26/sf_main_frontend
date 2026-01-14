// src/pages/RegisteredEvents.jsx - Ethereal Enigma Theme with Modal Confirmations

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

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 overflow-hidden pt-20">
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <div className="relative w-full max-w-6xl h-[85vh] flex flex-col animate-fadeIn">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-900/50 via-cyan-900/50 to-blue-900/50 backdrop-blur-xl text-white py-4 sm:py-6 px-4 sm:px-8 rounded-t-3xl text-center border-2 border-blue-500/20 shadow-2xl shadow-blue-900/50 animate-glow relative">
          {/* Close Button - Inside Header */}
          <button
            onClick={() => {
              if (showAddMemberModal) {
                setShowAddMemberModal(false);
              } else {
                navigate("/dashboard");
              }
            }}
            className="absolute top-4 right-4 bg-gradient-to-br from-blue-600/80 to-cyan-600/80 text-white rounded-full w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-xl sm:text-2xl hover:from-blue-700/90 hover:to-cyan-700/90 transition shadow-2xl shadow-blue-500/50 font-bold border-2 border-blue-400/30 hover:scale-110 hover:rotate-90 duration-300"
          >
            ✕
          </button>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent animate-pulse">
            Registered Events
          </h1>
          {userInfo && (
            <p className="text-xs sm:text-sm text-cyan-200/80 mt-2 animate-fadeIn">
              Welcome, {userInfo.name} ({userInfo.sfId})
            </p>
          )}
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 bg-gradient-to-br from-blue-950/30 via-black/40 to-blue-950/30 backdrop-blur-xl rounded-b-3xl border-2 border-t-0 border-blue-500/20 overflow-hidden shadow-2xl shadow-blue-900/30">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg sm:text-xl">Loading events...</p>
              </div>
            </div>
          ) : !token ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-white text-center text-lg sm:text-xl">
                Please login to view registered events
              </div>
            </div>
          ) : (soloEvents.length === 0 && groupEvents.length === 0) ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center">
                <div className="text-6xl sm:text-8xl mb-4">🎭</div>
                <div className="text-white text-lg sm:text-xl">
                  You haven't registered for any events yet
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
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
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <AddMemberModal
            onClose={() => setShowAddMemberModal(false)}
            onSubmit={handleAddMember}
          />
        )}
      </div>

      {/* Confirmation Modal Popup */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gradient-to-br from-blue-900/90 via-blue-950/90 to-blue-900/90 rounded-2xl border-2 border-blue-500/40 shadow-[0_0_60px_rgba(59,130,246,0.3)] p-6 sm:p-8 max-w-md w-full animate-[scaleIn_0.2s_ease-out] relative">
            {/* Close Button - Inside Confirmation Modal */}
            <button
              onClick={handleCancelConfirm}
              className="absolute top-4 right-4 bg-gradient-to-br from-gray-700/80 to-gray-800/80 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:from-gray-600/90 hover:to-gray-700/90 transition shadow-lg font-bold border-2 border-gray-500/30 hover:scale-110 hover:rotate-90 duration-300"
            >
              ✕
            </button>

            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="absolute w-2 h-2 bg-white rounded-full top-[20%] left-[25%] animate-[twinkle_2s_infinite]" />
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[70%] left-[75%] animate-[twinkle_2.5s_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
            </div>

            <div className="relative">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>

              {/* Message */}
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]">
                {confirmMessage.title}
              </h2>
              <p className="text-blue-200/80 text-center mb-6 text-sm sm:text-base">
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
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes twinkle { 
          0%, 100% { opacity: 0.3; transform: scale(1); } 
          50% { opacity: 1; transform: scale(1.5); } 
        }
        
        @keyframes scaleIn { 
          from { opacity: 0; transform: scale(0.9); } 
          to { opacity: 1; transform: scale(1); } 
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent);
          border-radius: 50%;
          pointer-events: none;
          animation: float 8s ease-in-out infinite;
        }
        
        .particle-1 { width: 4px; height: 4px; top: 10%; left: 10%; animation-delay: 0s; animation-duration: 10s; }
        .particle-2 { width: 6px; height: 6px; top: 50%; right: 20%; animation-delay: 2s; animation-duration: 12s; }
        .particle-3 { width: 3px; height: 3px; bottom: 20%; left: 30%; animation-delay: 4s; animation-duration: 9s; }
        .particle-4 { width: 5px; height: 5px; top: 70%; right: 40%; animation-delay: 1s; animation-duration: 11s; }
        .particle-5 { width: 4px; height: 4px; bottom: 40%; left: 60%; animation-delay: 3s; animation-duration: 13s; }

        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #06b6d4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #0891b2);
        }
      `}</style>
    </div>
  );
};

export default RegisteredEvents;