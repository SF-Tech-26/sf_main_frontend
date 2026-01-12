import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllEvents as fetchAllEvents } from '../services/eventService';

export const EventContext = createContext(null);

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [eventError, setEventError] = useState(null);
    const [lastFetchTime, setLastFetchTime] = useState(null);

    const fetchEvents = useCallback(async (force = false) => {
        // Check if we have cached data that's still valid
        if (!force && lastFetchTime && events.length > 0) {
            const timeSinceLastFetch = Date.now() - lastFetchTime;
            if (timeSinceLastFetch < CACHE_DURATION) {
                // Cache is still valid, don't refetch
                return;
            }
        }

        try {
            setIsLoadingEvents(true);
            setEventError(null);
            const response = await fetchAllEvents();
            if (response.code === 0 && response.data) {
                setEvents(response.data);
                setLastFetchTime(Date.now());
            } else {
                setEventError('Failed to fetch events');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setEventError(err.message || 'Failed to load events');
        } finally {
            setIsLoadingEvents(false);
        }
    }, [lastFetchTime, events.length]);

    // Fetch events on mount
    useEffect(() => {
        fetchEvents();
    }, []);

    // Force refresh function for manual refresh
    const refreshEvents = useCallback(() => {
        return fetchEvents(true);
    }, [fetchEvents]);

    // Helper function to get events by genre
    const getEventsByGenre = useCallback((genre) => {
        const genreData = events.find(g => g.genre === genre);
        return genreData?.events || [];
    }, [events]);

    // Get a single event by genre and id
    const getEventById = useCallback((genre, eventId) => {
        const genreEvents = getEventsByGenre(genre);
        return genreEvents.find(e => e.id === parseInt(eventId)) || null;
    }, [getEventsByGenre]);

    return (
        <EventContext.Provider value={{
            events,
            isLoadingEvents,
            eventError,
            refreshEvents,
            getEventsByGenre,
            getEventById,
        }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};
