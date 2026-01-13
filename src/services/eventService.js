// src/services/eventService.js - COMPLETE API SERVICE

import axios from 'axios';

const API_BASE_URL = 'https://masterapi.springfest.in/api';

// ========== GET REGISTERED EVENTS ==========
export const getRegisteredEvents = async (token) => {
  try {
    console.log("📡 API Call: getRegisteredEvents");
    const response = await axios.post(
      `${API_BASE_URL}/user/registered_events`,
      { token },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    console.log("✅ getRegisteredEvents response:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching registered events:', error.response?.data || error);
    throw error;
  }
};

// ========== GET MEMBERS OF A GROUP ==========
export const getMembers = async (token, eventId) => {
  try {
    console.log("📡 API Call: getMembers", { eventId });
    const response = await axios.post(
      `${API_BASE_URL}/event/getMembers`,
      {
        token,
        eventId
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    console.log("✅ getMembers response:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error getting members:', error.response?.data || error);
    throw error;
  }
};

// ========== ADD MEMBER TO GROUP ==========
export const addMember = async (token, eventId, teamMembers) => {
  try {
    console.log("📡 API Call: addMember", { eventId, teamMembers });
    const response = await axios.post(
      `${API_BASE_URL}/event/addMember`,
      {
        token,
        eventId,
        teamMembers // Array of { email, sfId }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    console.log("✅ addMember response:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error adding member:', error.response?.data || error);
    throw error;
  }
};

// ========== DEREGISTER MEMBER(S) ==========
export const deregisterMember = async (token, eventId, memberToDeregister) => {
  try {
    console.log("📡 API Call: deregisterMember", {
      token: token.substring(0, 20) + '...',
      eventId,
      memberToDeregister
    });

    const response = await axios.post(
      `${API_BASE_URL}/event/deregister/member`,
      {
        token,
        eventId,
        memberToDeregister // Array of { email, sfId }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );


    console.log("✅ deregisterMember response:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error deregistering member:', error.response?.data || error);
    throw error;
  }
};

// ========== DEREGISTER ENTIRE TEAM ==========
export const deregisterTeam = async (token, eventId) => {
  try {
    console.log("📡 API Call: deregisterTeam", { eventId });
    const response = await axios.post(
      `${API_BASE_URL}/event/deregister/team`,
      {
        token,
        eventId
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    console.log("✅ deregisterTeam response:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error deregistering team:', error.response?.data || error);
    throw error;
  }
};

// ========== REGISTER FOR EVENT ==========
export const registerEvent = async (token, eventCity, eventId, teamMembers) => {
  try {
    console.log("📡 API Call: registerEvent", { eventCity, eventId, teamMembers });
    const response = await axios.post(
      `${API_BASE_URL}/event/register`,
      {
        token,
        eventCity,
        eventId,
        teamMembers // Array of { email, sfId }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    console.log("✅ registerEvent response:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error registering for event:', error.response?.data || error);
    throw error;
  }
};

// Alias for backward compatibility
export const registerForEvent = registerEvent;

// ========== CACHING LOGIC ==========
let cachedEventsData = null;
let cacheTimestamp = 0;
let fetchPromise = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ========== GET ALL EVENTS ==========
export const getAllEvents = async () => {
  try {
    const now = Date.now();

    // Return cached data if valid
    if (cachedEventsData && (now - cacheTimestamp < CACHE_DURATION)) {
      console.log("💾 Returning cached events data");
      return cachedEventsData;
    }

    // Return existing promise if request is in flight
    if (fetchPromise) {
      console.log("⏳ Returning in-flight fetch promise");
      return fetchPromise;
    }

    console.log("📡 API Call: getAllEvents (Network Request)");

    fetchPromise = (async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/event`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("✅ getAllEvents response:", response.data);

        // Update cache
        cachedEventsData = response.data;
        cacheTimestamp = Date.now();

        return response.data;
      } finally {
        fetchPromise = null;
      }
    })();

    return fetchPromise;
  } catch (error) {
    console.error('❌ Error fetching all events:', error.response?.data || error);
    throw error;
  }
};

// ========== GET EVENTS BY GENRE ==========
export const getEventsByGenre = async (genre) => {
  try {
    console.log("📡 getEventsByGenre called for:", genre);

    // Use cached getAllEvents instead of new API call
    const data = await getAllEvents();

    // Check if we have the expected data structure
    // The structure is { data: [ { genre: "Dance", events: [...] }, ... ] }
    const genreGroups = data?.data || data;

    if (genre && Array.isArray(genreGroups)) {
      // Find the group that matches the requested genre
      const matchingGroup = genreGroups.find(
        group => group.genre?.toLowerCase() === genre.toLowerCase()
      );

      const filteredEvents = matchingGroup ? matchingGroup.events : [];

      console.log(`✅ Filtered events for genre '${genre}':`, filteredEvents);
      return filteredEvents;
    }

    return [];
  } catch (error) {
    console.error('❌ Error fetching events by genre:', error.response?.data || error);
    throw error;
  }
};

// ========== GET EVENT BY ID ==========
export const getEventById = async (eventId) => {
  try {
    console.log("📡 getEventById called for:", eventId);

    // Use cached getAllEvents instead of new API call
    const data = await getAllEvents();

    const genreGroups = data?.data || data;

    if (Array.isArray(genreGroups)) {
      // Flatten all events from all genres to find the specific ID
      // Each group has { genre: "...", events: [...] }
      const allEvents = genreGroups.flatMap(group => group.events || []);
      const event = allEvents.find(e => e.id === Number(eventId)); // Ensure numeric comparison

      console.log("✅ Found event by ID:", event);
      return event;
    }

    return null;
  } catch (error) {
    console.error('❌ Error fetching event by ID:', error.response?.data || error);
    throw error;
  }
};