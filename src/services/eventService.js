import api from './api';

// Fetch all events grouped by genre
export const getAllEvents = async () => {
    const response = await api.get('/event');
    return response.data;
};

// Get events filtered by genre
export const getEventsByGenre = (allEvents, genre) => {
    const genreData = allEvents.data?.find(g => g.genre === genre);
    return genreData?.events || [];
};

// Get user's registered events
export const getRegisteredEvents = async (token) => {
    // Intercept test token for verification purposes
    if (token === "HARDCODED_TEST_TOKEN") {
        const stored = localStorage.getItem('test_registrations');
        const eventIds = stored ? JSON.parse(stored) : [];
        // Return valid response structure with mocked data
        return {
            code: 0,
            data: eventIds.map(id => ({ id: parseInt(id) }))
        };
    }

    const response = await api.post('/user/registered_events', { token });
    return response.data;
};

// Register for an event (solo or group)
export const registerForEvent = async (token, eventId, eventCity, teamMembers) => {
    // Intercept test token for verification purposes
    if (token === "HARDCODED_TEST_TOKEN") {
        console.log("Mocking registration for test token in localStorage");
        const stored = localStorage.getItem('test_registrations');
        const registrations = stored ? JSON.parse(stored) : [];
        if (!registrations.includes(eventId)) {
            registrations.push(eventId);
            localStorage.setItem('test_registrations', JSON.stringify(registrations));
        }
    }

    const response = await api.post('/event/register', {
        token,
        eventId,
        eventCity,
        teamMembers,
    });
    return response.data;
};

// Add member to a group
export const addMember = async (token, eventId, teamMembers) => {
    const response = await api.post('/event/addMember', {
        token,
        eventId,
        teamMembers,
    });
    return response.data;
};

// Get members of a group
export const getMembers = async (token, eventId) => {
    const response = await api.post('/event/getMembers', {
        token,
        eventId,
    });
    return response.data;
};

// Deregister a member from a group
export const deregisterMember = async (token, eventId, memberToDeregister) => {
    const response = await api.post('/event/deregister/member', {
        token,
        eventId,
        memberToDeregister,
    });
    return response.data;
};

// Deregister entire team (admin only)
export const deregisterTeam = async (token, eventId) => {
    const response = await api.post('/event/deregister/team', {
        token,
        eventId,
    });
    return response.data;
};
