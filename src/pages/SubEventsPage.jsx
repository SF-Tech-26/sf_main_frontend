import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllEvents, getEventsByGenre } from '../services/eventService';
import { useAuth } from '../context/authContext';
import RegistrationForm from '../components/events/RegistrationForm';
import eventsDesktopBg from '../assets/eventsdesktopbg.jpeg';
import eventsMobileBg from '../assets/eventsmobilebg.jpeg';
import GlassSurface from '../components/GlassSurface';
import PillNav from '../components/PillNav';

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

    // Generate random stars
    const stars = [...Array(100)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Responsive background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${isMobile ? eventsMobileBg : eventsDesktopBg})`,
                }}
            />

            {/* Stars */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Floating ethereal orbs */}
            <motion.div
                className="absolute w-64 h-64 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                    left: '10%',
                    top: '20%',
                    filter: 'blur(40px)',
                }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                className="absolute w-80 h-80 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                    right: '10%',
                    bottom: '20%',
                    filter: 'blur(50px)',
                }}
                animate={{
                    x: [0, -20, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />

            {/* Mystical mist at bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-48"
                style={{
                    background: 'linear-gradient(to top, rgba(139, 92, 246, 0.1) 0%, transparent 100%)'
                }}
            />
        </div>
    );
};

const SubEventsPage = () => {
    const { genre: genreSlug } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDark, setIsDark] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);

    const genreName = slugToGenre[genreSlug] || genreSlug;

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }

        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const response = await getAllEvents();
                if (response.code === 0 && response.data) {
                    // Filter events locally since we already have all events
                    const allEvents = response.data;
                    const genreEvents = allEvents.filter(event =>
                        event.genre?.toLowerCase() === genreName.toLowerCase() ||
                        event.genre?.genre?.toLowerCase() === genreName.toLowerCase()
                    );
                    const activeEvents = genreEvents.filter(e => e.event_status !== false);
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

    const handleThemeToggle = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };



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

    return (
        <div className="font-body bg-background-dark text-slate-200 h-screen relative overflow-hidden selection:bg-deep-amber selection:text-white transition-colors duration-300 dark:bg-background-dark dark:text-slate-200">
            <EtherealBackground />

            {/* Main Content */}
            <main className="relative z-10 pt-16 pb-4 container mx-auto px-4 h-full flex flex-col items-center justify-center">
                {/* Back Button - Fixed in Corner */}
                <button
                    onClick={() => navigate('/events')}
                    className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 hover:text-white hover:bg-white/20 transition-all shadow-lg"
                >
                    <span className="material-icons">arrow_back</span>
                    <span className="hidden sm:inline">Back</span>
                </button>

                {/* Header */}
                <header className="text-center mb-6 relative w-full max-w-7xl">
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-sky-200 via-sky-300 to-sky-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 tracking-wide font-cinzel">
                        {genreName.toUpperCase()}
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-sky-500 to-transparent mx-auto rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                    <p className="mt-4 text-sky-200/80 font-light tracking-[0.2em] uppercase text-sm drop-shadow-md">Discover the Events Within</p>
                </header>

                {/* Main Display */}
                <div className="relative w-full flex gap-6 justify-center items-start flex-col lg:flex-row max-w-7xl px-4 py-4">
                    {/* Event List Container */}
                    <div className="w-full lg:w-1/4 h-[450px] shrink-0 border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm relative z-20 flex justify-center py-4">
                        <PillNav
                            layout="vertical"
                            items={events.map(event => ({
                                label: event.name || event.genre,
                                onClick: () => handleEventClick(event),
                                active: selectedEvent?.id === event.id
                            }))}
                            pillColor="rgba(255, 255, 255, 0.05)"
                            pillTextColor="#bae6fd" // Sky-200
                            hoveredPillTextColor="#f0f9ff" // Sky-50
                            baseColor="#0ea5e9" // Sky-500
                        />
                    </div>

                    {/* Event Details Container */}
                    <div className="w-full lg:w-3/4 h-auto lg:h-[450px]">
                        {currentEvent && (
                            <GlassSurface
                                opacity={0.7}
                                brightness={40}
                                className="rounded-2xl overflow-hidden border border-sky-500/20 shadow-2xl h-full"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(8, 47, 73, 0.4) 0%, rgba(12, 74, 110, 0.5) 100%)',
                                }}
                            >
                                {(() => {
                                    const displayData = getEventDisplayData(currentEvent);
                                    return (
                                        <div className="flex flex-col lg:flex-row h-full">
                                            {/* Image Section */}
                                            <div className="w-full lg:w-2/5 h-[250px] lg:h-full relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 lg:bg-gradient-to-r" />
                                                <img
                                                    alt={displayData.name}
                                                    src={displayData.image}
                                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                                />
                                            </div>

                                            {/* Details Section */}
                                            <div className="w-full lg:w-3/5 p-6 lg:p-8 flex flex-col h-auto lg:h-full overflow-y-auto custom-scrollbar relative z-20">
                                                <div className="flex justify-between items-start gap-4 mb-6">
                                                    <div>
                                                        <h2 className="text-3xl font-bold font-cinzel text-sky-100 mb-2 drop-shadow-lg">
                                                            {currentEvent.name}
                                                        </h2>
                                                        <p className="text-sky-300/80 italic text-sm">
                                                            {currentEvent.tagline}
                                                        </p>
                                                    </div>

                                                    <button
                                                        className="lg:hidden px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-500 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(2,132,199,0.4)]"
                                                        onClick={handleRegisterClick}
                                                    >
                                                        Register
                                                    </button>
                                                </div>

                                                <div className="flex gap-3 mb-6 flex-wrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${currentEvent.is_group ? 'bg-purple-500/10 text-purple-200 border-purple-500/30' : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30'}`}>
                                                        {currentEvent.is_group ? 'Group' : 'Solo'}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-200 border border-amber-500/30">
                                                        {currentEvent.min_participation}-{currentEvent.max_participation} members
                                                    </span>
                                                </div>

                                                <div className="space-y-6 flex-1">
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-widest text-xs mb-3">
                                                            <span className="w-8 h-px bg-sky-500/50"></span>
                                                            About
                                                        </h4>
                                                        <p className="text-sky-100/80 leading-relaxed text-sm">
                                                            {currentEvent.writeup}
                                                        </p>
                                                    </div>

                                                    {currentEvent.rules && currentEvent.rules.length > 0 && (
                                                        <div>
                                                            <h4 className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-widest text-xs mb-3">
                                                                <span className="w-8 h-px bg-sky-500/50"></span>
                                                                Rules
                                                            </h4>
                                                            <ul className="space-y-3">
                                                                {currentEvent.rules.filter(r => r && r.trim()).map((rule, index) => (
                                                                    <li key={index} className="flex gap-3 items-start text-sm group">
                                                                        <span className="font-mono text-sky-500/70 text-xs mt-1">
                                                                            {String(index + 1).padStart(2, '0')}
                                                                        </span>
                                                                        <span className="text-sky-100/70 group-hover:text-sky-100 transition-colors">{rule}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-white/10 hidden lg:block">
                                                    <button
                                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 text-white font-bold uppercase tracking-widest text-sm hover:from-sky-500 hover:to-sky-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] active:scale-95 flex items-center gap-2 transform"
                                                        onClick={handleRegisterClick}
                                                    >
                                                        Register Now
                                                        <span className="material-icons text-lg">arrow_forward</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </GlassSurface>
                        )}
                    </div>
                </div>
            </main>

            {/* Theme Toggle */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-white/20 text-sky-300 hover:text-white"
                    onClick={handleThemeToggle}
                    style={{ boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)' }}
                >
                    {isDark ? (
                        <span className="material-icons">dark_mode</span>
                    ) : (
                        <span className="material-icons">light_mode</span>
                    )}
                </button>
            </div>

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
            `}</style>
        </div>
    );
};

export default SubEventsPage;












