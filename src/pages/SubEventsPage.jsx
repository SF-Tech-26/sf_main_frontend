import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllEvents, getEventsByGenre } from '../services/eventService';
import { useAuth } from '../context/authContext';
import RegistrationForm from '../components/events/RegistrationForm';
import eventsDesktopBg from '../assets/eventsdesktopbg.webp';
import eventsMobileBg from '../assets/eventsmobilebg.webp';
import centrifugeBg from '../assets/centrifugebg.webp';
import GlassSurface from '../components/GlassSurface';
import PillNav from '../components/PillNav';
import logo from '../assets/sf_logo.webp';

// Import individual event images from eventImages folder
import nrityakalaImg from '../assets/eventImages/Nrityakala.webp';
import nrityakalaMobile from '../assets/EventImg/dance/Nrityakala.webp';
import pictureTaleImg from '../assets/eventImages/a picture tale.webp';
import pictureTaleMobile from '../assets/EventImg/film fest/APictureTale.webp';
import banterBoutImg from '../assets/eventImages/banter bout.webp';
import banterBoutMobile from '../assets/EventImg/humor fest/BanterBout.webp';
import brainDImg from '../assets/eventImages/brain d.webp';
import brainDMobile from '../assets/EventImg/fine arts/Bran-D.webp';
import centrifugeImg from '../assets/eventImages/centrifuge.webp';
import centrifugeMobile from '../assets/EventImg/dance/Centrifuge.webp';
import dumbCImg from '../assets/eventImages/dumb c.webp';
import dumbCMobile from '../assets/EventImg/literary/DumbC.webp';
import dumbstuckImg from '../assets/eventImages/dumbstuck.webp';
import faceCanvasImg from '../assets/eventImages/face canvas.webp';
import faceCanvasMobile from '../assets/EventImg/fine arts/FaceCanvas.webp';
import frenzyFabricImg from '../assets/eventImages/frenzy fabric.webp';
import frenzyFabricMobile from '../assets/EventImg/fine arts/frenzy fabric.webp';
import hilarityEnsuesImg from '../assets/eventImages/hilarity esues.webp';
import hilarityEnsuesMobile from '../assets/EventImg/humor fest/HilarityEnsues.webp';
import iMeMyselfImg from '../assets/eventImages/i me myself.webp';
import lightsCameraImg from '../assets/eventImages/lights camera sf.webp';
import lightsCameraMobile from '../assets/EventImg/film fest/LightsCameraSF.webp';
import motionTalesImg from '../assets/eventImages/motion tales.webp';
import motionTalesMobile from '../assets/EventImg/film fest/MotionTales.webp';
import nationalDebateImg from '../assets/eventImages/national level debate.webp';
import nationalDebateMobile from '../assets/EventImg/literary/NationalLevelDebate.webp';
import paintItImg from '../assets/eventImages/paint it.webp';
import paintItMobile from '../assets/EventImg/fine arts/PaintIt.webp';
import poetrySlamImg from '../assets/eventImages/poetry slam.webp';
import quizEventImg from '../assets/eventImages/quiz.webp';
import rampmaniaImg from '../assets/eventImages/rampmania.webp';
import rangmanchImg from '../assets/eventImages/rangmanch.webp';
import rangoliImg from '../assets/eventImages/rangoli.webp';
import rangoliMobile from '../assets/EventImg/fine arts/Rangoli.webp';
import shakeALegImg from '../assets/eventImages/shake a leg.webp';
import shakeALegMobile from '../assets/EventImg/dance/ShakeALeg.webp';
import shopaholicImg from '../assets/eventImages/shopaholic.webp';
import sketchItImg from '../assets/eventImages/sketch it.webp';
import spentImg from '../assets/eventImages/spent.webp';
import spentMobile from '../assets/EventImg/Quiz/SpEnt.webp';
import shuffleSoloImg from '../assets/eventImages/shuffle solo.webp?url';
import shuffleSoloMobile from '../assets/EventImg/dance/Shuffle Solo.webp';
import shuffleTeamImg from '../assets/eventImages/shuffle team.webp?url';
import shuffleTeamMobile from '../assets/EventImg/dance/Shuffle team.webp';
import twoForTangoImg from '../assets/eventImages/two for tango.webp';
import pen from '../assets/eventImages/A Mighty Pen.webp';
import penMobile from '../assets/EventImg/literary/AMightyPen.webp';
import jumble from '../assets/eventImages/jumble the good word.webp';
import jumbleMobile from '../assets/EventImg/literary/JumbleTheGoodWord.webp';
import chef from '../assets/eventImages/chef.webp';
import chefMobile from '../assets/EventImg/culinary arts/Chef\'sCorner.webp';
import beatItLogo from '../assets/EventImg/music/BeatIT.webp';
import lakesideLogo from '../assets/EventImg/music/LakesideDreamsGroup.webp';
import rapmaniaLogo from '../assets/EventImg/music/Rapmania.webp';
import retrowaveLogo from '../assets/EventImg/music/Retrowave.webp';
import sfIdolLogo from '../assets/EventImg/music/SFidol.webp';
import wildfireLogo from '../assets/EventImg/music/Wildfire.webp';
import canYouDuetLogo from '../assets/EventImg/music/can you duet.webp';

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
// Event data mapping - removed image references, only metadata
const eventData = {
    'dance': {
        icon: 'auto_awesome_motion',
        title: 'Rhythmic Rituals',
        name: 'Rhythmic',
        description: 'Witness ancient movements and modern interpretations that transcend the ordinary.'
    },
    'music': {
        icon: 'music_note',
        title: 'Sonic Incantations',
        name: 'Sonic',
        description: 'Experience a symphony of sounds that range from ethereal whispers to thunderous crescendos.'
    },
    'dramatics': {
        icon: 'theater_comedy',
        title: 'Theatrical Visions',
        name: 'Drama',
        description: 'Step into realms of imagination where tales of old and new are brought to life.'
    },
    'literary': {
        icon: 'history_edu',
        title: 'Ancient Lore',
        name: 'Scrolls',
        description: 'Delve into the sacred texts and forgotten verses where words hold power.'
    },
    'filmfest': {
        icon: 'movie_filter',
        title: 'Cinematic Spells',
        name: 'Glyphs',
        description: 'Gaze upon moving images that transport you to distant lands and fantastical futures.'
    },
    'film-fest': {
        icon: 'movie_filter',
        title: 'Cinematic Spells',
        name: 'Glyphs',
        description: 'Gaze upon moving images that transport you to distant lands and fantastical futures.'
    },
    'quiz': {
        icon: 'science',
        title: 'Riddles of Knowledge',
        name: 'Potions',
        description: 'Test your intellect and unravel the mysteries posed by our master riddlers.'
    },
    'finearts': {
        icon: 'brush',
        title: 'Alchemy of Art',
        name: 'Alchemy',
        description: 'Behold creations that transmute the ordinary into the extraordinary.'
    },
    'fine-arts': {
        icon: 'brush',
        title: 'Alchemy of Art',
        name: 'Alchemy',
        description: 'Behold creations that transmute the ordinary into the extraordinary.'
    },
    'humour': {
        icon: 'mood',
        title: 'Festive Revelry',
        name: 'Humour Fest',
        description: 'Embrace the lighter side of existence with performances that ignite joyful spirits.'
    },
    'humor-fest': {
        icon: 'mood',
        title: 'Festive Revelry',
        name: 'Humour Fest',
        description: 'Embrace the lighter side of existence with performances that ignite joyful spirits.'
    },
    'humorfest': {
        icon: 'mood',
        title: 'Festive Revelry',
        name: 'Humour Fest',
        description: 'Embrace the lighter side of existence with performances that ignite joyful spirits.'
    },
    'fashion': {
        icon: 'checkroom',
        title: 'Runway Elegance',
        name: 'Fashion',
        description: 'Style the runway and showcase creativity through fashion and design.'
    },
    'culinaryarts': {
        icon: 'restaurant',
        title: 'Culinary Mastery',
        name: 'Culinary Arts',
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const genreName = slugToGenre[genreSlug] || genreSlug;

    // Track mobile screen size
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {


        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                // Use getEventsByGenre directly as it now handles the API response correctly
                const genreEvents = await getEventsByGenre(genreName);

                if (Array.isArray(genreEvents)) {
                    setEvents(genreEvents);
                    if (genreEvents.length > 0) {
                        setSelectedEvent(genreEvents[0]);
                    }
                } else if (genreEvents?.code === 0 && Array.isArray(genreEvents.data)) {
                    // Fallback in case it returns wrapped object
                    // filtering is now done in service, but if we get raw data structure here:
                    const activeEvents = genreEvents.data.filter(e => e.event_status === true);
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

    // Memoize the event click handler to prevent re-creating on every render
    const handleEventClick = useCallback((event) => {
        setSelectedEvent(event);
    }, []);

    // Memoize navigation items to prevent PillNav re-renders
    const eventNavItems = useMemo(() =>
        events.map((event) => ({
            label: event.name,
            active: selectedEvent?.id === event.id,
            onClick: () => handleEventClick(event)
        })),
        [events, selectedEvent?.id, handleEventClick]
    );





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

    // Event name to image mapping with variations
    const eventImageMap = {
        // Dance events
        'nrityakala': { desktop: nrityakalaImg, mobile: nrityakalaMobile },
        'shake a leg': { desktop: shakeALegImg, mobile: shakeALegMobile },
        'shake-a-leg': { desktop: shakeALegImg, mobile: shakeALegMobile },
        'two for tango': twoForTangoImg,
        'two-for-tango': twoForTangoImg,

        'Shuffle - Solo': { desktop: shuffleSoloImg, mobile: shuffleSoloMobile },
        'Shuffle - Team ': { desktop: shuffleTeamImg, mobile: shuffleTeamMobile },

        // Music events
        'sf idol': sfIdolLogo,
        'sf-idol': sfIdolLogo,
        'can you duet': canYouDuetLogo,
        'can-you-duet': canYouDuetLogo,
        'retrowave': retrowaveLogo,
        'beat it': beatItLogo,
        'beat-it': beatItLogo,
        'rapmania': rapmaniaLogo,
        'wildfire': wildfireLogo,
        'lakeside dreams': lakesideLogo,
        'lakeside-dreams': lakesideLogo,
        'Shuffle-Solo': shuffleSoloImg,

        // Dramatics events
        'rangmanch': rangmanchImg,
        'i me myself': iMeMyselfImg,
        'i-me-myself': iMeMyselfImg,

        // Literary events
        'banter bout': { desktop: banterBoutImg, mobile: banterBoutMobile },
        'banter-bout': { desktop: banterBoutImg, mobile: banterBoutMobile },
        'poetry slam': poetrySlamImg,
        'poetry-slam': poetrySlamImg,
        'national level debate': { desktop: nationalDebateImg, mobile: nationalDebateMobile },
        'national-level-debate': { desktop: nationalDebateImg, mobile: nationalDebateMobile },
        'spent': { desktop: spentImg, mobile: spentMobile },
        'a mighty pen': { desktop: pen, mobile: penMobile },
        'jumble the good word': { desktop: jumble, mobile: jumbleMobile },

        // Film Fest events
        'a picture tale': { desktop: pictureTaleImg, mobile: pictureTaleMobile },
        'a-picture-tale': { desktop: pictureTaleImg, mobile: pictureTaleMobile },
        'lights camera sf': { desktop: lightsCameraImg, mobile: lightsCameraMobile },
        'lights-camera-sf': { desktop: lightsCameraImg, mobile: lightsCameraMobile },
        'motion tales': { desktop: motionTalesImg, mobile: motionTalesMobile },
        'motion-tales': { desktop: motionTalesImg, mobile: motionTalesMobile },

        // Quiz events
        'brain drain': brainDImg,
        'brain-drain': brainDImg,
        'quiz': quizEventImg,

        'Centrifuge': { desktop: centrifugeImg, mobile: centrifugeMobile },

        // Fine Arts events
        'face canvas': { desktop: faceCanvasImg, mobile: faceCanvasMobile },
        'face-canvas': { desktop: faceCanvasImg, mobile: faceCanvasMobile },
        'paint it': { desktop: paintItImg, mobile: paintItMobile },
        'paint-it': { desktop: paintItImg, mobile: paintItMobile },
        'sketch it': sketchItImg,
        'sketch-it': sketchItImg,
        'rangoli': { desktop: rangoliImg, mobile: rangoliMobile },

        // Humor Fest events
        'dumb charades': { desktop: dumbCImg, mobile: dumbCMobile },
        'dumb-charades': { desktop: dumbCImg, mobile: dumbCMobile },
        'dumbstruck': dumbstuckImg,
        'hilarity ensues': { desktop: hilarityEnsuesImg, mobile: hilarityEnsuesMobile },
        'hilarity-ensues': { desktop: hilarityEnsuesImg, mobile: hilarityEnsuesMobile },

        // Fashion events
        'rampmania': rampmaniaImg,
        'frenzy fabric': { desktop: frenzyFabricImg, mobile: frenzyFabricMobile },
        'frenzy-fabric': { desktop: frenzyFabricImg, mobile: frenzyFabricMobile },
        'shopaholic': shopaholicImg,
        'peek a who': quizEventImg,

        // Game Fest / Other events - handle both shuffle and suffle spelling

        'sufflesolo': shuffleSoloImg,
        'shuffle team': shuffleTeamImg,
        'Shuffle - Team': shuffleTeamImg,
        'shuffleteam': shuffleTeamImg,

        // Other events
        'top it to win it': spentImg,
        "chef's corner": { desktop: chef, mobile: chefMobile },
    };

    // Fallback images - only from eventImages folder
    const fallbackImages = [
        nrityakalaImg, rangmanchImg, shakeALegImg,
        retrowaveLogo, lakesideLogo, quizEventImg, shuffleTeamImg
    ];

    const getEventDisplayData = (event) => {
        const genreKey = event.genre.toLowerCase().replace(/\s+/g, '');
        const genreInfo = eventData[genreKey] || {};

        // Get event-specific image from eventImageMap
        const eventKey = event.name.toLowerCase();
        const eventImageData = eventImageMap[eventKey];

        // Pick between desktop and mobile image
        let finalImage = null;
        if (eventImageData) {
            if (typeof eventImageData === 'object' && eventImageData.desktop) {
                finalImage = isMobile ? (eventImageData.mobile || eventImageData.desktop) : eventImageData.desktop;
            } else {
                finalImage = eventImageData;
            }
        }

        // Use fallback from eventImages if no specific match
        if (!finalImage && event.poster) {
            finalImage = event.poster;
        }
        if (!finalImage) {
            // Use hash to consistently pick a fallback from eventImages
            const hash = event.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            finalImage = fallbackImages[hash % fallbackImages.length];
        }

        return {
            name: event.name || event.genre,
            title: genreInfo.title || event.name || event.genre,
            image: finalImage,
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

            {/* Back Button */}
            <motion.button
                onClick={() => navigate('/events')}
                className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/40 border border-white/10 text-white hover:bg-purple-500/80 hover:border-purple-500 transition-all duration-300 backdrop-blur-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <span className="material-icons text-2xl">arrow_back</span>
            </motion.button>

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

                {/* PillNav for Subevent Navigation with Scroll Indicators */}
                {events.length > 1 && (
                    <div className="mb-4 md:mb-6 w-full relative">
                        {/* Left Scroll Indicator - Only on small screens when scrolling is needed */}
                        {/* {events.length > 3 && isMobile && (
                            <span
                                className="material-icons text-cyan-300 absolute -left-4 sm:left-2 top-1/2 -translate-y-1/2 z-[100] pointer-events-none"
                                style={{
                                    fontSize: '36px',
                                    animation: 'slideLeft 2s ease-in-out infinite'
                                }}
                            >
                                chevron_left
                            </span>
                        )} */}

                        {/* Right Scroll Indicator - Only on small screens when scrolling is needed */}
                        {events.length > 3 && isMobile && (
                            <span
                                className="material-icons text-black absolute right-4 sm:right-2 top-1/2 -translate-y-1/2 z-[100] pointer-events-none"
                                style={{
                                    fontSize: '36px',
                                    animation: 'slideRight 2s ease-in-out infinite'

                                }}
                            >
                                chevron_right
                            </span>
                        )}

                        <div className="flex justify-center relative z-40">
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
                                    <div className="w-full lg:w-auto lg:flex-shrink-0">
                                        {/* Image with Shiny Border */}
                                        <div
                                            className="relative overflow-hidden event-image-container"
                                            style={{
                                                padding: '0px'
                                            }}
                                        >
                                            <img
                                                alt={currentEvent.name}
                                                src={getEventDisplayData(currentEvent).image}
                                                className="w-full h-full object-contain rounded-lg p-12 lg:p-4"
                                                style={{
                                                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))',
                                                    mixBlendMode: 'screen'
                                                }}
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
                                        <div className="flex flex-col items-start gap-4 mb-4">
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


                                            {/* Register Button - simple and small */}
                                            <div className="mt-2" style={{ fontFamily: "Roboto" }}>
                                                <button
                                                    onClick={handleRegisterClick}
                                                    className="px-6 py-2 rounded-lg bg-gray-400/100 hover:bg-grey text-black  font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
                                                >
                                                    Register
                                                    <span className="material-icons text-base">arrow_forward</span>
                                                </button>
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
                                                    className="leading-relaxed text-m"
                                                    style={{
                                                        fontFamily: '"Ojuju","Cormorant Garamond" , serif',
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
                        width: clamp(200px, 30vw, 300px);
                        margin: 1.5rem;
                    }
                    .event-image-container img {
                        height: 100% !important;
                        object-fit: contain;
                    }
                }

                /* Scroll Indicator Animations */
                @keyframes slideLeft {
                    0%, 100% {
                        transform: translateX(0);
                        opacity: 0.6;
                    }
                    50% {
                        transform: translateX(-5px);
                        opacity: 1;
                    }
                }

                @keyframes slideRight {
                    0%, 100% {
                        transform: translateX(0);
                        opacity: 0.6;
                    }
                    50% {
                        transform: translateX(5px);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default SubEventsPage;












