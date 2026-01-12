import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAllEvents, getEventsByGenre } from '../services/eventService';
import { useAuth } from '../context/authContext';
import RegistrationForm from '../components/events/RegistrationForm';
import woodsBackground from '../assets/images/woods ghost.avif';

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

// Ethereal Background Component
const EtherealBackground = () => {
    const stars = [...Array(100)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0d0015 50%, #000000 100%)'
                }}
            />
            <div
                className="absolute top-0 left-0 w-full h-full opacity-30"
                style={{
                    background: 'radial-gradient(ellipse at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)'
                }}
            />
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
            <motion.div
                className="absolute w-96 h-96 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                    top: '-10%',
                    right: '20%',
                    filter: 'blur(60px)',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                    bottom: '-20%',
                    left: '-10%',
                    filter: 'blur(80px)',
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
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
                    const genreEvents = getEventsByGenre(response, genreName);
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
        <div className="font-body bg-background-dark text-slate-200 min-h-screen relative overflow-x-hidden selection:bg-deep-amber selection:text-white transition-colors duration-300 dark:bg-background-dark dark:text-slate-200">
            <EtherealBackground />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Woods Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${woodsBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.7
                    }}
                ></div>

                <div className="absolute inset-0 bg-forest-gradient" style={{ opacity: 0.3 }}></div>
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")',
                        mixBlendMode: 'overlay'
                    }}
                ></div>
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-moss-green/30 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-deep-amber/20 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'float 6s ease-in-out infinite 1s' }}></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 pt-16 pb-20 container mx-auto px-4 min-h-screen flex flex-col items-center">
                {/* Back Button - Fixed in Corner */}
                <button
                    onClick={() => navigate('/events')}
                    className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-aged-wood-dark/80 backdrop-blur-sm border border-deep-amber/30 text-[#d2b48c] hover:text-[#ffd700] hover:bg-aged-wood-dark transition-all shadow-lg"
                    style={{ boxShadow: '0 0 20px rgba(184, 134, 11, 0.2)' }}
                >
                    <span className="material-icons">arrow_back</span>
                    <span className="hidden sm:inline">Back</span>
                </button>

                {/* Header */}
                <header className="text-center mb-16 relative w-full max-w-7xl">
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] via-[#deb887] to-[#8b4513] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 tracking-wide">
                        {genreName.toUpperCase()}
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-deep-amber to-transparent mx-auto rounded-full" style={{ boxShadow: '0 0 10px rgba(184,134,11,0.5)' }}></div>
                    <p className="mt-4 text-[#d2b48c] font-light tracking-[0.2em] uppercase text-sm drop-shadow-md">Discover the Events Within</p>
                </header>

                {/* Main Display */}
                <div className="relative w-full flex gap-6 justify-center items-start flex-col lg:flex-row max-w-7xl px-4 py-8 lg:py-12">
                    {/* Codex Container - Left Side (Vertical on Desktop, Horizontal on Mobile) */}
                    <div className="hidden lg:block relative h-[520px]">
                        <div className={`w-[100px] h-[520px] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#b8860b_rgba(0,0,0,0.3)] ${events.length <= 6 ? 'flex flex-col justify-center overflow-y-visible' : ''}`}>
                            {events.map((event, index) => {
                                const displayData = getEventDisplayData(event);
                                return (
                                    <div
                                        key={event.id || index}
                                        className={`codex-tab ${selectedEvent?.id === event.id ? 'active' : ''}`}
                                        onClick={() => handleEventClick(event)}
                                        style={{ cursor: 'pointer' }}
                                        title={displayData.name}
                                    >
                                        <div className="codex-tab-inner">
                                            <span className="material-symbols-outlined codex-tab-icon">
                                                {getGenreIcon(event.genre)}
                                            </span>
                                            <span className="codex-tab-name">{displayData.name}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Scroll Indicators - Overlaid on scrollbar */}
                        {events.length > 6 && (
                            <>
                                <div className="scroll-indicator-overlay top">
                                    <span className="material-icons">keyboard_arrow_up</span>
                                </div>
                                <div className="scroll-indicator-overlay bottom">
                                    <span className="material-icons">keyboard_arrow_down</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Horizontal Scrolling Tabs for Mobile/Tablet */}
                    <div className={`lg:hidden w-full mb-6 ${events.length <= 3 ? 'horizontal-codex-wrapper-centered' : ''}`} style={{ position: 'relative' }}>
                        <div className={`codex-container-horizontal ${events.length <= 3 ? 'centered' : ''}`}>
                            {events.map((event, index) => {
                                const displayData = getEventDisplayData(event);
                                return (
                                    <div
                                        key={event.id || index}
                                        className={`codex-tab-horizontal ${selectedEvent?.id === event.id ? 'active' : ''}`}
                                        onClick={() => handleEventClick(event)}
                                        style={{ cursor: 'pointer' }}
                                        title={displayData.name}
                                    >
                                        <div className="codex-tab-inner">
                                            <span className="material-symbols-outlined codex-tab-icon">
                                                {getGenreIcon(event.genre)}
                                            </span>
                                            <span className="codex-tab-name">{displayData.name}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Horizontal Scroll Indicators */}
                        {events.length > 3 && (
                            <>
                                <div className="scroll-indicator-horizontal left">
                                    <span className="material-icons">keyboard_arrow_left</span>
                                </div>
                                <div className="scroll-indicator-horizontal right">
                                    <span className="material-icons">keyboard_arrow_right</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Grimoire Display - Right Side */}
                    {currentEvent && (
                        (() => {
                            const displayData = getEventDisplayData(currentEvent);
                            return (
                                <div className="grimoire-display relative w-full lg:w-[700px] h-auto lg:h-[520px] flex flex-col lg:flex-row bg-transparent rounded-[4px] shadow-[0_20px_40px_rgba(0,0,0,0.7)] transition-transform duration-400 ease-in-out overflow-hidden lg:[transform:perspective(2000px)_rotateY(-5deg)]">
                                    {/* Left Page (Image) */}
                                    <div className="w-full lg:w-1/2 h-[250px] lg:h-full border-b-2 lg:border-b-0 lg:border-r-2 border-[rgba(184,134,11,0.4)] bg-gradient-to-br from-[rgba(45,35,25,0.95)] to-[rgba(35,25,20,0.98)] backdrop-blur-[10px] p-6 shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] relative flex flex-col justify-center items-center">
                                        <div className="grimoire-image-frame w-full h-full border-[4px] border-double border-[#8d6e63] shadow-[2px_4px_10px_rgba(0,0,0,0.2)] overflow-hidden flex justify-center items-center bg-white p-[6px]">
                                            <img
                                                alt={displayData.name}
                                                src={displayData.image}
                                                className="w-full h-full object-cover opacity-95 [filter:sepia(0.2)_contrast(1.05)] transition-transform duration-500 hover:scale-[1.03]"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Page (Details) */}
                                    <div className="w-full lg:w-1/2 h-auto lg:h-full bg-gradient-to-br from-[rgba(45,35,25,0.95)] to-[rgba(35,25,20,0.98)] backdrop-blur-[10px] p-5 lg:p-7 shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] relative flex flex-col justify-between text-left font-display">


                                        <div className="flex flex-col h-full">
                                            <div className="mb-4">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-xl lg:text-2xl font-bold text-[#deb887] [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] font-display border-b border-[rgba(184,134,11,0.4)] pb-2 flex-1 pr-8">
                                                        {currentEvent.name}
                                                    </h3>
                                                    {/* Register Button - Mobile/Tablet (next to title) */}
                                                    <button
                                                        className="lg:hidden px-4 py-2 rounded-lg bg-deep-amber text-white text-xs font-bold uppercase tracking-wider hover:bg-opacity-80 transition-all flex items-center gap-2 whitespace-nowrap mr-8 shadow-lg"
                                                        onClick={handleRegisterClick}
                                                    >
                                                        Register
                                                        <span className="material-icons text-sm">how_to_reg</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#b8860b_rgba(0,0,0,0.1)] custom-scrollbar">
                                                {/* Event Info */}
                                                <div className="mb-4">
                                                    <p className="text-sm text-[#a1887f] mb-3 italic">
                                                        {currentEvent.tagline}
                                                    </p>
                                                    <div className="flex gap-2 mb-4 flex-wrap">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${currentEvent.is_group ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                                                            {currentEvent.is_group ? 'Group' : 'Solo'}
                                                        </span>
                                                        <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                            {currentEvent.min_participation}-{currentEvent.max_participation} members
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* About Section */}
                                                <div className="mb-6">
                                                    <h4 className="text-base font-bold mb-2 text-[#deb887] flex items-center gap-2 font-display">
                                                        <span className="w-6 h-px bg-deep-amber"></span>
                                                        About
                                                    </h4>
                                                    <p className="text-sm text-[#a1887f] leading-relaxed text-justify">
                                                        {currentEvent.writeup}
                                                    </p>
                                                </div>

                                                {/* Rules Section */}
                                                {currentEvent.rules && currentEvent.rules.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-base font-bold mb-3 text-[#deb887] flex items-center gap-2 font-display">
                                                            <span className="w-6 h-px bg-deep-amber"></span>
                                                            Rules
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {currentEvent.rules.filter(r => r && r.trim()).map((rule, index) => (
                                                                <li key={index} className="flex gap-3 items-start text-sm">
                                                                    <span className="font-bold text-deep-amber text-base font-display">
                                                                        {String(index + 1).padStart(2, '0')}
                                                                    </span>
                                                                    <span className="text-[#a1887f]">{rule}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Register Button - Desktop (at bottom) */}
                                            <button
                                                className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 mt-4 bg-gradient-to-b from-[#fdf5e6] to-[#f0e6d2] text-[#5c4033] border border-[#b8860b] rounded-sm font-display font-bold uppercase text-xs tracking-widest shadow-md hover:bg-[#b8860b] hover:text-white hover:border-[#8b6508] transition-all duration-200 active:translate-y-[1px] self-start"
                                                onClick={handleRegisterClick}
                                            >
                                                Register Now
                                                <span className="material-icons text-base ml-2">how_to_reg</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    )}
                </div>
            </main>

            {/* Theme Toggle */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    className="w-12 h-12 rounded-full bg-aged-wood-dark shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-deep-amber/30 text-deep-amber"
                    onClick={handleThemeToggle}
                    style={{ boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)' }}
                >
                    {isDark ? (
                        <span className="material-icons">dark_mode</span>
                    ) : (
                        <span className="material-icons">light_mode</span>
                    )}
                </button>
            </div>

            {/* Registration Modal Overlay */}
            {showRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-4xl relative"
                    >
                        <div className="max-h-[85vh] overflow-y-auto">
                            <RegistrationForm
                                event={currentEvent}
                                onSuccess={handleRegistrationSuccess}
                                onCancel={() => setShowRegistration(false)}
                            />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Styles */}
            <style>{`
                :root {
                    --deep-amber: #b8860b;
                    --forest-green: #0d2b16;
                    --moss-green: #556b2f;
                    --firefly-glow: #dfff00;
                    --aged-wood: #5c4033;
                    --aged-wood-dark: #3e2723;
                    --parchment-cream: rgba(253, 245, 230, 0.9);
                    --parchment-border: #d2b48c;
                    --muted-gold: #c5a059;
                    --text-brown: #3e2723;
                }

                .bg-background-dark {
                    background-color: #050210;
                }

                .bg-forest-gradient {
                    background: radial-gradient(ellipse at top, #0d2b16 0%, #050210 50%, #000000 100%);
                }

                .codex-wrapper {
                    position: relative;
                    height: 520px;
                }

                .scroll-indicator-overlay {
                    position: absolute;
                    right: 0;
                    width: 20px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(184, 134, 11, 0.15);
                    color: #b8860b;
                    z-index: 10;
                    pointer-events: none;
                    animation: pulse-glow 2s ease-in-out infinite;
                    border-radius: 4px;
                }

                .scroll-indicator-overlay.top {
                    top: 0;
                }

                .scroll-indicator-overlay.bottom {
                    bottom: 0;
                }

                .scroll-indicator-overlay .material-icons {
                    font-size: 18px;
                    animation: bounce-vertical 1.5s ease-in-out infinite;
                }

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }

                @keyframes bounce-vertical {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-2px); }
                }

                @keyframes bounce-horizontal {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-2px); }
                }

                .scroll-indicator-horizontal {
                    position: absolute;
                    bottom: 0;
                    width: 40px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(184, 134, 11, 0.15);
                    color: #b8860b;
                    z-index: 10;
                    pointer-events: none;
                    animation: pulse-glow 2s ease-in-out infinite;
                    border-radius: 4px;
                }

                .scroll-indicator-horizontal.left {
                    left: 0;
                }

                .scroll-indicator-horizontal.right {
                    right: 0;
                }

                .scroll-indicator-horizontal .material-icons {
                    font-size: 18px;
                    animation: bounce-horizontal 1.5s ease-in-out infinite;
                }

                .codex-container {
                    width: 100px;
                    height: 520px;
                    overflow-y: auto;
                    margin-top: 0;
                    padding-right: 8px;
                    scrollbar-width: thin;
                    scrollbar-color: #b8860b rgba(0, 0, 0, 0.3);
                }

                .codex-container.centered {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    overflow-y: visible;
                }

                .codex-container::-webkit-scrollbar {
                    width: 6px;
                }

                .codex-container::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .codex-container::-webkit-scrollbar-thumb {
                    background: #b8860b;
                    border-radius: 3px;
                }

                .codex-container::-webkit-scrollbar-thumb:hover {
                    background: #ffd700;
                }

                .codex-container-horizontal {
                    width: 100%;
                    height: 120px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding-bottom: 1rem ;
                    
                    display: flex;
                    gap: 12px;
                    scrollbar-width: thin;
                    scrollbar-color: #b8860b rgba(0, 0, 0, 0.3);
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }

                .codex-container-horizontal.centered {
                    justify-content: center;
                    overflow-x: visible;
                }

                .horizontal-codex-wrapper-centered {
                    display: flex;
                    align-items: center;
                    min-height: 200px;
                }

                @media (min-width: 1024px) {
                    .horizontal-codex-wrapper-centered {
                        min-height: 520px;
                    }
                }

                .codex-container-horizontal::-webkit-scrollbar {
                    height: 6px;
                }

                .codex-container-horizontal::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }

                .codex-container-horizontal::-webkit-scrollbar-thumb {
                    background: #b8860b;
                    border-radius: 3px;
                }

                .codex-tab-horizontal {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    min-width: 100px;
                    background-color: #3e2723;
                    background-image: repeating-linear-gradient(45deg, #3e2723 0, #3e2723 1px, #4e342e 1px, #4e342e 4px);
                    border: 1px solid #8d6e63;
                    border-left: 3px solid #5d4037;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
                    overflow: hidden;
                }

                .codex-tab-horizontal::after {
                    content: "";
                    position: absolute;
                    top: 2px;
                    bottom: 2px;
                    left: 2px;
                    right: 2px;
                    border: 1px solid rgba(184, 134, 11, 0.3);
                    pointer-events: none;
                }

                .codex-tab-horizontal:hover {
                    transform: translateY(-4px);
                    background-color: #4e342e;
                    border-color: #b8860b;
                    box-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
                    z-index: 10;
                }

                .codex-tab-horizontal:hover .codex-tab-icon {
                    color: #dfff00;
                    text-shadow: 0 0 5px rgba(223, 255, 0, 0.5);
                }

                .codex-tab-horizontal.active {
                    transform: translateY(-8px);
                    background: linear-gradient(135deg, #2a1a05, #3e2723);
                    border: 1px solid #ffd700;
                    border-left: 4px solid #b8860b;
                    box-shadow: 0 0 15px rgba(184, 134, 11, 0.4), inset 0 0 20px rgba(184, 134, 11, 0.2);
                    z-index: 20;
                }

                .codex-tab {
                    position: relative;
                    width: 100%;
                    height: 70px;
                    margin-bottom: 12px;
                    background-color: #3e2723;
                    background-image: repeating-linear-gradient(45deg, #3e2723 0, #3e2723 1px, #4e342e 1px, #4e342e 4px);
                    border: 1px solid #8d6e63;
                    border-left: 3px solid #5d4037;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
                    overflow: hidden;
                }

                .codex-tab::after {
                    content: "";
                    position: absolute;
                    top: 2px;
                    bottom: 2px;
                    left: 2px;
                    right: 2px;
                    border: 1px solid rgba(184, 134, 11, 0.3);
                    pointer-events: none;
                }

                .codex-tab:hover {
                    transform: translateX(4px);
                    background-color: #4e342e;
                    border-color: #b8860b;
                    box-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
                    z-index: 10;
                }

                .codex-tab:hover .codex-tab-icon {
                    color: #dfff00;
                    text-shadow: 0 0 5px rgba(223, 255, 0, 0.5);
                }

                .codex-tab.active {
                    transform: translateX(8px);
                    background: linear-gradient(135deg, #2a1a05, #3e2723);
                    border: 1px solid #ffd700;
                    border-left: 4px solid #b8860b;
                    box-shadow: 0 0 15px rgba(184, 134, 11, 0.4), inset 0 0 20px rgba(184, 134, 11, 0.2);
                    z-index: 20;
                }

                .codex-tab-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                    padding: 4px;
                    position: relative;
                    z-index: 1;
                }

                .codex-tab-icon {
                    font-size: 26px;
                    color: #a1887f;
                    transition: all 0.4s ease;
                    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
                    margin-bottom: 2px;
                }

                .codex-tab.active .codex-tab-icon {
                    color: #ffca28;
                    text-shadow: 0 0 8px rgba(255, 202, 40, 0.6);
                    font-size: 28px;
                    transform: translateY(-1px);
                }

                .codex-tab-name {
                    font-family: "Cinzel", serif;
                    font-size: 0.55rem;
                    font-weight: 700;
                    color: #deb887;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    text-align: center;
                    transition: all 0.3s ease;
                    line-height: 1.1;
                }

                .codex-tab.active .codex-tab-name {
                    color: #fff8e1;
                    text-shadow: 0 0 5px rgba(184, 134, 11, 0.8);
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #b8860b;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ffd700;
                }

                .dark .grimoire-scrollable-content::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #b8860b;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ffd700;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default SubEventsPage;












