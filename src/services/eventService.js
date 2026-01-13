// src/services/eventService.js - FIXED VERSION

import axios from 'axios';

const API_BASE_URL = 'https://masterapi.springfest.in/api';

// Get all registered events
export const getRegisteredEvents = async (token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/registered_events`,
      { token },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching registered events:', error);
    throw error;
  }
};

// Get members of a group
export const getMembers = async (token, eventId) => {
  try {
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
    return response;
  } catch (error) {
    console.error('Error getting members:', error);
    throw error;
  }
};

// Add member to a group (Admin only)
export const addMember = async (token, eventId, teamMembers) => {
  try {
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
    return response;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

// Deregister member(s) from event
// For solo: send current user's { email, sfId }
// For group: send member's { email, sfId } (Admin only can remove others)
export const deregisterMember = async (token, eventId, memberToDeregister) => {
  try {
    console.log('Deregister API call:', {
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
    
    console.log('Deregister API response:', response.data);
    return response;
  } catch (error) {
    console.error('Error deregistering member:', error.response?.data || error);
    throw error;
  }
};

// Deregister entire team (Admin only)
export const deregisterTeam = async (token, eventId) => {
  try {
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
    return response;
  } catch (error) {
    console.error('Error deregistering team:', error);
    throw error;
  }
};

// Register for event (Solo or Group)
export const registerEvent = async (token, eventCity, eventId, teamMembers) => {
  try {
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
    return response;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

// Alias for backward compatibility
export const registerForEvent = registerEvent;

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/event`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

// Get events by genre
export const getEventsByGenre = async (genre) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/event`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Filter events by genre if genre is provided
    if (genre && response.data) {
      const filteredEvents = response.data.filter(
        event => event.genre?.genre?.toLowerCase() === genre.toLowerCase()
      );
      return filteredEvents;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching events by genre:', error);
    throw error;
  }
};

// Get event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/event`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Find specific event by ID
    if (response.data) {
      const event = response.data.find(e => e.id === eventId);
      return event;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};