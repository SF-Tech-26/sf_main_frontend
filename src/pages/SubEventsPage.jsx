import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllEvents, getEventsByGenre } from '../services/eventService';
import { useAuth } from '../context/authContext';
import RegistrationForm from '../components/events/RegistrationForm';
import eventsDesktopBg from '../assets/eventsdesktopbg.jpeg';
import eventsMobileBg from '../assets/eventsmobilebg.jpeg';
import centrifugeBg from '../assets/centrifugebg.jpeg';
import GlassSurface from '../components/GlassSurface';
import PillNav from '../components/PillNav';
import logo from '../assets/logo.png';

import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '../context/eventContext';

const slugToGenre = {
    'dance': 'Dance',
    'music': 'Music',
    'dramatics': 'Dramatics',
    'literary': 'Literary',
    'film-fest': 'Film Fest',
    'quiz': 'Quiz',
    'fine-arts': 'Fine Arts',
    'humor-fest': 'Humor Fest',
    'fashion': 'Fashion',
    'culinary-arts': 'Culinary Arts',
    'game-fest': 'Game Fest',
};

// Event data mapping for grimoire display
const eventData = {
    'dance': {
        icon: 'auto_awesome_motion',
        title: 'Rhythmic Rituals',
        name: 'Rhythmic',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoYy96XvNIVLBFneD6WH3R-0YkiKxwC-MpSZ53xwxw4f9VE8LNOTpONjE_dHBZtaqbjLnToF4SsX9KSRbAHiSvxuHFDxtXZ8U79K6MA-5iJhFAjlJilyZcA7OcHC_7rz-LDkursluhx2zw-yCX4taUJrRXWahNsjotbZ-SFA05-aH5cyssVxlJIMiT6pGy-3ODJt83T73mbLXH0uDW-jSDUG0-KNWvngQNjj2B5iwrx0CcAjMrdsvktqLdKdg43eljGYGuWMwPq82h',
        description: 'Witness ancient movements and modern interpretations that transcend the ordinary.'
    },
    'music': {
        icon: 'music_note',
        title: 'Sonic Incantations',
        name: 'Sonic',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWQTL2c7jLbEnnmnA8G7NTbTelv8Px_HKQ8r5isKs-3UqhDtitZLIWPW7KsIqIDecoDT_cCpvlkciyIo_oXlS4pmw1qgURXzLB0hGJkOJO9gLny0tu8mCnj1uQfoSDa19XcANAFq0AFERGpXJVGQwwrQV6phlnv783sUlePfxv60ULSDdKiVPHmBZpD-Sm7V_vucC62LVkbLPgDocPRGceL-mPfG9DLdD52Z72KdKzRSJFJNF7If0LXtOAc8XcB9nA6pwL_wWjHflb',
        description: 'Experience a symphony of sounds that range from ethereal whispers to thunderous crescendos.'
    },
    'dramatics': {
        icon: 'theater_comedy',
        title: 'Theatrical Visions',
        name: 'Drama',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-CYQdN1tA2fb7ZIxV7PIx1czA-xIb3C3gR94IolZZkhT3HDCZmYyY46h2iraHXEvpdbXiCNEU6Ovrzar9HJEk33Bhj4L6_Q_SHMmo9-JHrzY6ufsL6mYc0n4afuTz_HLT_qwACKUiMG7n6XPUmjDcmDwMoYdwtrE6khzQuf5vjzxzeGj-lzOSR8-MSm35uEhhZ-7D-Jt5VmopgkEqk2jpYTdECsyjx--AwxrBI_lyPzbzIBHW6D2H0JoW4YezsGy2GJxmeTplIsW5',
        description: 'Step into realms of imagination where tales of old and new are brought to life.'
    },
    'literary': {
        icon: 'history_edu',
        title: 'Ancient Lore',
        name: 'Scrolls',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8s-EY72H4mEJge9q44uRHumLxJYV180RP97CDWFzZkhSHzUyBdHT6rh8WQJZ2tH8_7l_5jLbLyhhCinpZkC1RSJk7B0q11BCchcsvbknv5x6cGghtW1Jybwe6Apd4uscurZjZapTapxMVE8feywijzp0eJtN7EMxfOLFZDNeI9zaQHI9f49-owcK21d6ewhkgdjPSrkl35MLYGfqbUbuJ8-qdKHGfucCa2Ifwi3N5Q-wp1rubCyq3uKZlVZX2GYoxMiWdWWR6b63z',
        description: 'Delve into the sacred texts and forgotten verses where words hold power.'
    },
    'film': {
        icon: 'movie_filter',
        title: 'Cinematic Spells',
        name: 'Glyphs',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTke3DWjuUVNcEqCQ8oPwdgoZav3grPFVMD6TaNIa7FbfvTEIBqwnsHl_yfXR-YC8GEqZi0uXEM3b8Ln_caZOmIq-dyQ2o0iI3ttP9iLrniChVaoueKXutLay1rlM1C1nj97VSt5iisYPOz_Ef1KuBnRtAWwBj-dwgJGGdmSx9FWtjvWgaMiZeGm92ZPcvc_vYl_mE9mDCgsFmDjF1vk43v2k354dYJ1LJnMbWlfN5jmmYV9iFiQn9YDFarEJlIAXaBSGlA4NOIGzB',
        description: 'Gaze upon moving images that transport you to distant lands and fantastical futures.'
    },
    'quiz': {
        icon: 'science',
        title: 'Riddles of Knowledge',
        name: 'Potions',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyFE_2VnOQlpayZyIvAXKQHuiYNQd9DHI9a2rh5eA2eaExkOZ14rJlrt25eGslfZtXddi0CDj4nBZDJhY9oW0u-gR3m4OGFmPm8KmiBEJFx-Yj-jrKiVYEDRzK-K02HkTBoxg0KwfqOUslkfA2Ef3tBge8t58xiWopoxIxIGZtPPbfbKPaIZIHAmq07u6JqFhQVkQAFMQ6hwEhXAkt52siW3bYiPH8a3MTJv-9GBD2IPVK5Gaj8IYzU2Te85tkfFEgUiWqKQEgEZ0g',
        description: 'Test your intellect and unravel the mysteries posed by our master riddlers.'
    },
    'finearts': {
        icon: 'brush',
        title: 'Alchemy of Art',
        name: 'Alchemy',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnI1a9AyQ8Vu9fThXMsBmNGYkMRMbrL6cT7C9Pp2vAqqbBxAkx4cCmFbOhZdVwS7d8YrFgIWcHiLOq_Tgz9BGVpKvTYlJT1tDe37pptwV-PXITlvxTlO4avrEtdSz0DVlSnFrKXkaYv-qw2WSsZ5TGq31YwYCGQHy4qyO6m68LrwM1RXJGH1hG5SnsgZ44UnJ8agE3U1PDm95WfSpTn_bauOLqylATAvqysxHq-INhEeyDVsOVnAyOYGpmociYpYdRcXSL6ew2LN4C',
        description: 'Behold creations that transmute the ordinary into the extraordinary.'
    },
    'humour': {
        icon: 'mood',
        title: 'Festive Revelry',
        name: 'Humour Fest',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv2kBADXOYKsX0s_BXOL_3bhX5x9DKxxXKLdVr4jViD9xbpD4mvEe9sdQhf8nLbZiQ9fKGcabCnYlRyMDKh0XRrQrrHZRBq1iU3KhEUaHWQfI0HZrldga5q_55wl-H8VrNa9Gn2NUQ-D-A8j3eWlCRb5m3D3oqQeYdl24DTP6UvQVFpMoLlkM6ZJULinbN3YBaH_-m_TI__RyI4UoD4tREUAHp6THPLuJJo9KSWJslxkNNIs3aMg2lAbuasJAqTPDDBnXvvqeGArbX',
        description: 'Embrace the lighter side of existence with performances that ignite joyful spirits.'
    },
    'fashion': {
        icon: 'checkroom',
        title: 'Runway Elegance',
        name: 'Fashion',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        description: 'Style the runway and showcase creativity through fashion and design.'
    },
    'culinaryarts': {
        icon: 'restaurant',
        title: 'Culinary Mastery',
        name: 'Culinary Arts',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        description: 'Master the kitchen and compete in cooking and food presentation.'
    }
};

// Ethereal Background Component with responsive images
const EtherealBackground = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Responsive background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${isMobile ? eventsMobileBg : eventsDesktopBg})`,
                }}
            />
            {/* ... */}
        </div>
    );
};
// ...
// Inside SubEventsPage component:
// ...


const SubEventsPage = () => {
    const { genre: genreSlug } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showRegistration, setShowRegistration] = useState(false);

    const genreName = slugToGenre[genreSlug] || genreSlug;

    useEffect(() => {


        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                // Use getEventsByGenre directly as it now handles the API response correctly
                const genreEvents = await getEventsByGenre(genreName);

                if (Array.isArray(genreEvents)) {
                    const activeEvents = genreEvents.filter(e => e.event_status !== false);
                    setEvents(activeEvents);
                    if (activeEvents.length > 0) {
                        setSelectedEvent(activeEvents[0]);
                    }
                } else if (genreEvents?.code === 0 && Array.isArray(genreEvents.data)) {
                    // Fallback in case it returns wrapped object
                    const activeEvents = genreEvents.data.filter(e => e.event_status !== false);
                    setEvents(activeEvents);
                    if (activeEvents.length > 0) {
                        setSelectedEvent(activeEvents[0]);
                    }
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch events');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [genreName]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    // Navigation items for PillNav - dynamically from events
    const eventNavItems = events.map((event) => ({
        label: event.name,
        active: selectedEvent?.id === event.id,
        onClick: () => handleEventClick(event)
    }));





    const handleRegisterClick = () => {
        setShowRegistration(true);
    };

    const handleRegistrationSuccess = () => {
        setShowRegistration(false);
        toast.success(`Successfully registered for ${selectedEvent.name}!`, {
            duration: 4000,
            style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid rgba(168, 85, 247, 0.5)',
            },
            iconTheme: {
                primary: '#a855f7',
                secondary: '#fff',
            },
        });
    };

    const getEventDisplayData = (event) => {
        const genreKey = event.genre.toLowerCase().replace(/\s+/g, '');
        const genreInfo = eventData[genreKey] || {};

        return {
            name: event.name || event.genre,
            title: genreInfo.title || event.name || event.genre,
            image: genreInfo.image || event.image || event.poster || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
            description: event.writeup || genreInfo.description || event.description || `Join us for ${event.name || event.genre}!`,
            icon: genreInfo.icon || 'category',
            genre: event.genre,
            id: event.id
        };
    };

    const getGenreIcon = (genre) => {
        const genreKey = genre.toLowerCase().replace(/\s+/g, '');
        return eventData[genreKey]?.icon || 'category';
    };

    if (isLoading) {
        return (
            <div className="font-body bg-background-dark text-slate-200 min-h-screen relative overflow-x-hidden flex items-center justify-center" style={{ backgroundColor: '#050210' }}>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-deep-amber border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#d2b48c]">Loading events...</p>
                </div>
            </div>
        );
    }

    if (error || events.length === 0) {
        return (
            <div className="font-body bg-background-dark text-slate-200 min-h-screen relative overflow-x-hidden flex items-center justify-center" style={{ backgroundColor: '#050210' }}>
                <div className="relative z-10 text-center">
                    <p className="text-red-400 mb-4">{error || 'No events available'}</p>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-6 py-2 bg-deep-amber text-white rounded-lg hover:bg-opacity-80 transition"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const currentEvent = selectedEvent;
    const isCentrifuge = currentEvent?.name?.toLowerCase().includes('centrifuge');

    return (
        <div className="font-body bg-background-dark text-slate-200 min-h-screen lg:h-screen relative overflow-y-auto lg:overflow-hidden selection:bg-deep-amber selection:text-white transition-colors duration-300 dark:bg-background-dark dark:text-slate-200">
            <EtherealBackground />

            {/* Main Content */}
            <main className="relative z-10 pt-8 pb-8 container mx-auto px-4 min-h-full lg:h-full flex flex-col items-center lg:justify-center">

                {/* Header */}
                <header className="text-center mb-8 pt-4 relative w-full max-w-7xl z-10">
                    <h1
                        className="text-4xl md:text-6xl font-bold mb-4 tracking-wider"
                        style={{
                            fontFamily: '"Cinzel Decorative", serif',
                            color: '#c9e4e4',
                            textShadow: '0 0 30px rgba(100, 180, 180, 0.4), 0 4px 20px rgba(0,0,0,0.5)'
                        }}
                    >
                        {genreName.toUpperCase()}
                    </h1>
                </header>

                {/* PillNav for Subevent Navigation */}
                {events.length > 1 && (
                    <div className="mb-4 md:mb-6 w-full flex justify-center relative z-40">
                        <PillNav
                            logo={logo}
                            logoAlt="Back to Events"
                            items={eventNavItems}
                            className="subevent-nav"
                            ease="power2.easeOut"
                            baseColor="#000000"
                            pillColor="#ffffff"
                            hoveredPillTextColor="#ffffff"
                            pillTextColor="#000000"
                            onItemClick={(item) => item.onClick?.()}
                        />
                    </div>
                )}

                {/* Main Display - Reference Design */}
                <div className="relative w-full flex justify-center items-center max-w-5xl px-4">

                    {/* Main Card with Shiny Border */}
                    <div
                        className="relative w-full rounded-xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(180, 200, 220, 0.6) 0%, rgba(100, 130, 160, 0.4) 50%, rgba(180, 200, 220, 0.5) 100%)',
                            padding: '2px',
                            boxShadow: '0 0 30px rgba(150, 180, 210, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {/* Inner Card */}
                        <div
                            className="rounded-xl overflow-hidden backdrop-blur-md"
                            style={{
                                background: 'linear-gradient(180deg, rgba(20, 35, 55, 0.85) 0%, rgba(15, 30, 50, 0.9) 100%)',
                            }}
                        >
                            {currentEvent && (
                                <div className="flex flex-col lg:flex-row">

                                    {/* Left Section - Image */}
                                    <div className="flex flex-row lg:flex-row">

                                        {/* Image with Shiny Border */}
                                        <div
                                            className="relative overflow-hidden flex-shrink-0 event-image-container"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(180, 200, 220, 0.5) 0%, rgba(120, 150, 180, 0.3) 50%, rgba(180, 200, 220, 0.4) 100%)',
                                                boxShadow: '0 0 20px rgba(150, 180, 210, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)'
                                            }}
                                        >
                                            <img
                                                alt={currentEvent.name}
                                                src={isCentrifuge ? centrifugeBg : getEventDisplayData(currentEvent).image}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Section - Event Details */}
                                    <div
                                        className="w-full lg:flex-1 p-4 lg:p-6 flex flex-col max-h-[400px] lg:max-h-[450px] overflow-y-auto custom-scrollbar relative"
                                        style={{
                                            borderLeft: '1px solid rgba(150, 180, 210, 0.15)'
                                        }}
                                    >
                                        {/* Header with Title and Mobile Register Button */}
                                        <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-4 mb-4">
                                            <div>
                                                <h2
                                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight"
                                                    style={{
                                                        fontFamily: '"Cinzel", serif',
                                                        color: '#e8e8e8',
                                                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                                                    }}
                                                >
                                                    {currentEvent.name.toUpperCase()}
                                                </h2>
                                                <p
                                                    className="text-sm italic"
                                                    style={{
                                                        fontFamily: '"Cormorant Garamond", serif',
                                                        color: 'rgba(180, 200, 220, 0.8)'
                                                    }}
                                                >
                                                    {currentEvent.tagline}
                                                </p>
                                            </div>

                                            {/* Register Button - visible on all screens */}
                                            {/* Register Button - visible on all screens */}
                                            <div className="mt-4 mb-4">
                                                <GlassSurface
                                                    borderWidth={1}
                                                    brightness={120}
                                                    opacity={0.2}
                                                    mixBlendMode="normal"
                                                    displace={20}
                                                    distortionScale={-140}
                                                    redOffset={2}
                                                    greenOffset={5}
                                                    blueOffset={10}
                                                    className="cursor-pointer font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-white group relative overflow-hidden"
                                                    onClick={handleRegisterClick}
                                                    style={{
                                                        padding: '10px 32px', // Reduced size as requested
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        boxShadow: '0 0 20px rgba(100, 200, 255, 0.2)'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2 text-xs md:text-sm z-10 relative">
                                                        REGISTER
                                                        <span className="material-icons text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                                    </div>
                                                    {/* Gradient overlay for better visibility */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 opacity-50"></div>
                                                </GlassSurface>
                                            </div>

                                            {/* Event Type Badges */}
                                            <div className="flex gap-3 mb-4 flex-wrap">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                                    style={{
                                                        background: currentEvent.is_group ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                        color: currentEvent.is_group ? '#c4b5fd' : '#6ee7b7',
                                                        border: `1px solid ${currentEvent.is_group ? 'rgba(139, 92, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                                                    }}
                                                >
                                                    {currentEvent.is_group ? 'Group' : 'Solo'}
                                                </span>
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                                    style={{
                                                        background: 'rgba(245, 158, 11, 0.15)',
                                                        color: '#fcd34d',
                                                        border: '1px solid rgba(245, 158, 11, 0.3)'
                                                    }}
                                                >
                                                    {currentEvent.min_participation}-{currentEvent.max_participation} members
                                                </span>
                                            </div>

                                            {/* About Section */}
                                            <div className="mb-4">
                                                <h4
                                                    className="font-bold uppercase tracking-widest text-xs mb-3"
                                                    style={{ color: 'rgba(150, 180, 210, 0.8)' }}
                                                >
                                                    About
                                                </h4>
                                                <p
                                                    className="leading-relaxed text-sm"
                                                    style={{
                                                        fontFamily: '"Cormorant Garamond", serif',
                                                        color: 'rgba(200, 210, 220, 0.85)',
                                                        lineHeight: '1.7'
                                                    }}
                                                >
                                                    {currentEvent.writeup}
                                                </p>
                                            </div>

                                            {/* Rules Section */}
                                            {currentEvent.rules && currentEvent.rules.length > 0 && (
                                                <div className="mb-4">
                                                    <h4
                                                        className="font-bold uppercase tracking-widest text-xs mb-3"
                                                        style={{ color: 'rgba(150, 180, 210, 0.8)' }}
                                                    >
                                                        Rules
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {currentEvent.rules.filter(r => r && r.trim()).map((rule, index) => (
                                                            <li key={index} className="flex gap-3 items-start text-sm group">
                                                                <span
                                                                    className="font-mono text-xs mt-1"
                                                                    style={{ color: 'rgba(150, 180, 210, 0.5)' }}
                                                                >
                                                                    {String(index + 1).padStart(2, '0')}
                                                                </span>
                                                                <span
                                                                    className="group-hover:text-white transition-colors text-lg tracking-wide"
                                                                    style={{
                                                                        color: 'rgba(200, 210, 220, 0.9)',
                                                                        fontFamily: '"Cormorant Garamond", serif',
                                                                        lineHeight: '1.4'
                                                                    }}
                                                                >
                                                                    {rule.replace(/^\d+[\.\)]\s*/, '')}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Dots */}
                {events.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={() => {
                                const currentIndex = events.indexOf(currentEvent);
                                const prevIndex = currentIndex > 0 ? currentIndex - 1 : events.length - 1;
                                setSelectedEvent(events[prevIndex]);
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                            style={{
                                background: 'rgba(50, 70, 100, 0.5)',
                                border: '1px solid rgba(150, 180, 210, 0.3)'
                            }}
                        >
                            <span className="material-icons text-gray-400 text-sm">chevron_left</span>
                        </button>

                        <div className="flex items-center gap-2">
                            {events.map((event, index) => (
                                <button
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    className={`transition-all duration-300 rounded-full ${selectedEvent?.id === event.id
                                        ? 'w-3 h-3 scale-110'
                                        : 'w-2 h-2 hover:scale-125'
                                        }`}
                                    style={{
                                        background: selectedEvent?.id === event.id
                                            ? 'linear-gradient(135deg, rgba(200, 220, 240, 0.9) 0%, rgba(150, 180, 210, 0.7) 100%)'
                                            : 'rgba(100, 130, 160, 0.5)',
                                        boxShadow: selectedEvent?.id === event.id
                                            ? '0 0 10px rgba(150, 180, 210, 0.5)'
                                            : 'none'
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                const currentIndex = events.indexOf(currentEvent);
                                const nextIndex = currentIndex < events.length - 1 ? currentIndex + 1 : 0;
                                setSelectedEvent(events[nextIndex]);
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                            style={{
                                background: 'rgba(50, 70, 100, 0.5)',
                                border: '1px solid rgba(150, 180, 210, 0.3)'
                            }}
                        >
                            <span className="material-icons text-gray-400 text-sm">chevron_right</span>
                        </button>
                    </div>
                )}

                {/* Event Number Display */}
                <p
                    className="text-center mt-4 text-xs tracking-[0.3em]"
                    style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        color: 'rgba(150, 180, 210, 0.5)'
                    }}
                >
                    {events.indexOf(currentEvent) + 1} of {events.length}
                </p>
            </main>



            {/* Registration Modal Overlay */}
            <AnimatePresence>
                {showRegistration && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-4xl relative"
                        >
                            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar rounded-2xl">
                                <RegistrationForm
                                    event={currentEvent}
                                    onSuccess={handleRegistrationSuccess}
                                    onCancel={() => setShowRegistration(false)}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(56, 189, 248, 0.5); /* Sky-400 equivalent */
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(14, 165, 233, 0.8); /* Sky-500 equivalent */
                }

                /* Mobile/Horizontal scrollbar */
                .codex-container-horizontal::-webkit-scrollbar {
                    height: 4px;
                }
                .codex-container-horizontal::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .codex-container-horizontal::-webkit-scrollbar-thumb {
                    background: rgba(56, 189, 248, 0.5);
                    border-radius: 2px;
                }

                /* Responsive Event Image Container */
                .event-image-container {
                    width: 100%;
                    margin: 0;
                }
                .event-image-container img {
                    height: auto !important; /* Force auto height on mobile to respect aspect ratio */
                }

                @media (min-width: 1024px) {
                    .event-image-container {
                        width: clamp(200px, 35vw, 320px);
                        aspect-ratio: 3/4;
                        max-height: none;
                        margin: 1rem;
                    }
                    .event-image-container img {
                        height: 100% !important; /* Restore full height for desktop aspect ratio box */
                        object-fit: cover;
                    }
                }
            `}</style>
        </div>
    );
};

export default SubEventsPage;












