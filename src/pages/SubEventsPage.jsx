import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getEventsByGenre } from '../services/eventService';
import RegistrationForm from '../components/events/RegistrationForm';
import eventsDesktopBg from '../assets/eventsdesktopbg.webp';
import eventsMobileBg from '../assets/eventsmobilebg.webp';
import PillNav from '../components/PillNav';
import logo from '../assets/sf_logo.webp';

// Import mobile event images (used for both desktop and mobile views)
// Dance events
import nrityakalaMobile from '../assets/EventImg/dance/Nrityakala.webp';
import centrifugeMobile from '../assets/EventImg/dance/Centrifuge.webp';
import shakeALegMobile from '../assets/EventImg/dance/ShakeALeg.webp';
import shuffleSoloMobile from '../assets/EventImg/dance/Shuffle Solo.webp';
import shuffleTeamMobile from '../assets/EventImg/dance/Shuffle team.webp';
import twoForTangoMobile from '../assets/EventImg/dance/TwoForATango (1).webp';

// Music events
import sfIdolMobile from '../assets/EventImg/music/SFidol.webp';
import canYouDuetMobile from '../assets/EventImg/music/can you duet.webp';
import retrowaveMobile from '../assets/EventImg/music/Retrowave.webp';
import beatItMobile from '../assets/EventImg/music/BeatIT.webp';
import rapmaniaMobile from '../assets/EventImg/music/Rapmania.webp';
import wildfireMobile from '../assets/EventImg/music/Wildfire.webp';
import lakesideMobile from '../assets/EventImg/music/LakesideDreamsGroup.webp';
import sargamMobile from '../assets/EventImg/music/Sargam (1).webp';

// Dramatics events
import rangmanchMobile from '../assets/EventImg/dramatics/Rangmanch.webp';
import iMeMyselfMobile from '../assets/EventImg/dramatics/iMeMyself.webp';
import dumbstruckMobile from '../assets/EventImg/dramatics/Dumbstruck.webp';
import nukkadMobile from '../assets/EventImg/dramatics/Nukkad.webp';

// Literary events
import banterBoutMobile from '../assets/EventImg/humor-fest/BanterBout.webp';
import poetrySlamMobile from '../assets/EventImg/literary/EnglishPoetrySlam (1).webp';
import nationalDebateMobile from '../assets/EventImg/literary/NationalLevelDebate.webp';
import spentMobile from '../assets/EventImg/Quiz/SpEnt.webp';
import penMobile from '../assets/EventImg/literary/AMightyPen.webp';
import jumbleMobile from '../assets/EventImg/literary/JumbleTheGoodWord.webp';
import dumbCMobile from '../assets/EventImg/literary/DumbC.webp';
import impromptuMobile from '../assets/EventImg/literary/Impromptu.webp';
import indiaCallingMobile from '../assets/EventImg/literary/IndiaCalling.webp';
import tellATaleMobile from '../assets/EventImg/literary/TellaTale.webp';

// Film Fest events
import pictureTaleMobile from '../assets/EventImg/film-fest/APictureTale.webp';
import lightsCameraMobile from '../assets/EventImg/film-fest/LightsCameraSF.webp';
import motionTalesMobile from '../assets/EventImg/film-fest/MotionTales.webp';
import sfmMobile from '../assets/EventImg/film-fest/SFM.webp';

// Fine Arts events
import brainDMobile from '../assets/EventImg/fine-arts/Bran-D.webp';
import faceCanvasMobile from '../assets/EventImg/fine-arts/FaceCanvas.webp';
import paintItMobile from '../assets/EventImg/fine-arts/PaintIt.webp';
import sketchItMobile from '../assets/EventImg/fine-arts/SketchIt.webp';
import fingerdabMobile from '../assets/EventImg/fine-arts/FingerDab.webp';
import rangoliMobile from '../assets/EventImg/fine-arts/Rangoli.webp';
import frenzyFabricMobile from '../assets/EventImg/fine-arts/frenzy fabric.webp';
import junkArtMobile from '../assets/EventImg/fine-arts/JunkArt.webp';
import soapaholicMobile from '../assets/EventImg/fine-arts/Soapaholic.webp';

// Humor Fest events
import hilarityEnsuesMobile from '../assets/EventImg/humor-fest/HilarityEnsues.webp';

// Fashion events
import mrandmsMobile from '../assets/EventImg/fashion/MrandMsSPRINGFEST.webp';
import navyataMobile from '../assets/EventImg/fashion/Navyata.webp';
import panacheMobile from '../assets/EventImg/fashion/Panache.webp';
import peekawhoMobile from '../assets/EventImg/fashion/PeekAWho.webp';

// Quiz events
import biztechMobile from '../assets/EventImg/Quiz/BIZTECH.webp';
import cinemaniaMobile from '../assets/EventImg/Quiz/Cinemania.webp';
import mbtMobile from '../assets/EventImg/Quiz/MaryBucknelTrophy(MBT).webp';
import otkaunMobile from '../assets/EventImg/Quiz/otkaun quiz.webp';

// Culinary Arts events
import chefMobile from '../assets/EventImg/culinary-arts/ChefsCorner.webp';

import { motion, AnimatePresence } from 'framer-motion';

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

// Event metadata mapping for genre display
const eventData = {
    'dance': {
        icon: 'auto_awesome_motion',
        title: 'Rhythmic Rituals',
        description: 'Witness ancient movements and modern interpretations that transcend the ordinary.'
    },
    'music': {
        icon: 'music_note',
        title: 'Sonic Incantations',
        description: 'Experience a symphony of sounds that range from ethereal whispers to thunderous crescendos.'
    },
    'dramatics': {
        icon: 'theater_comedy',
        title: 'Theatrical Visions',
        description: 'Step into realms of imagination where tales of old and new are brought to life.'
    },
    'literary': {
        icon: 'history_edu',
        title: 'Ancient Lore',
        description: 'Delve into the sacred texts and forgotten verses where words hold power.'
    },
    'filmfest': {
        icon: 'movie_filter',
        title: 'Cinematic Spells',
        description: 'Gaze upon moving images that transport you to distant lands and fantastical futures.'
    },
    'quiz': {
        icon: 'science',
        title: 'Riddles of Knowledge',
        description: 'Test your intellect and unravel the mysteries posed by our master riddlers.'
    },
    'finearts': {
        icon: 'brush',
        title: 'Alchemy of Art',
        description: 'Behold creations that transmute the ordinary into the extraordinary.'
    },
    'humorfest': {
        icon: 'mood',
        title: 'Festive Revelry',
        description: 'Embrace the lighter side of existence with performances that ignite joyful spirits.'
    },
    'fashion': {
        icon: 'checkroom',
        title: 'Runway Elegance',
        description: 'Style the runway and showcase creativity through fashion and design.'
    },
    'culinaryarts': {
        icon: 'restaurant',
        title: 'Culinary Mastery',
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

const SubEventsPage = () => {
    const { genre: genreSlug } = useParams();
    const navigate = useNavigate();

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
                const genreEvents = await getEventsByGenre(genreName);

                if (Array.isArray(genreEvents)) {
                    setEvents(genreEvents);
                    if (genreEvents.length > 0) {
                        setSelectedEvent(genreEvents[0]);
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

    // Event name to image mapping (using mobile images for all views)
    const eventImageMap = {
        // Dance events
        'nrityakala': nrityakalaMobile,
        'shakealeg': shakeALegMobile,
        'twoforatango': twoForTangoMobile,
        'shufflesolo': shuffleSoloMobile,
        'shuffle - team': shuffleTeamMobile,
        'suffle-solo': shuffleSoloMobile,
        'suffle-team': shuffleTeamMobile,
        'centrifuge': centrifugeMobile,

        // Music events
        'sfidol': sfIdolMobile,
        'canyouduet': canYouDuetMobile,
        'retrowave': retrowaveMobile,
        'beatit': beatItMobile,
        'beatdrop': beatItMobile,
        'rapmania': rapmaniaMobile,
        'wildfire': wildfireMobile,
        'lakesidedreams': lakesideMobile,
        'sargam': sargamMobile,

        // Dramatics events
        'rangmanch': rangmanchMobile,
        'imemyself': iMeMyselfMobile,
        'dumbstruck': dumbstruckMobile,
        'nukkad': nukkadMobile,

        // Literary events
        'banterbout': banterBoutMobile,
        'poetryslam': poetrySlamMobile,
        'nationalleveldebate': nationalDebateMobile,
        'spent': spentMobile,
        'amightypen': penMobile,
        'jumblethegoodword': jumbleMobile,
        'dumbc': dumbCMobile,

        // Film Fest events
        'apicturetale': pictureTaleMobile,
        'lightscamerasf': lightsCameraMobile,
        'motiontales': motionTalesMobile,
        'sfm': sfmMobile,

        // Fine Arts events
        'brand': brainDMobile,
        'facecanvas': faceCanvasMobile,
        'paintit': paintItMobile,
        'sketchit': sketchItMobile,
        'fingerdab': fingerdabMobile,
        'rangoli': rangoliMobile,
        'frenzyfabric': frenzyFabricMobile,

        // Humor Fest events
        'hilarityensues': hilarityEnsuesMobile,


        // Literary events (more)
        'impromptu': impromptuMobile,
        'indiacalling': indiaCallingMobile,
        'tellatale': tellATaleMobile,

        // Fine Arts events (more)
        'junkart': junkArtMobile,
        'soapaholic': soapaholicMobile,

        // Fashion events (more)
        'mrandmsspringfest': mrandmsMobile,
        'navyata': navyataMobile,
        'panache': panacheMobile,
        'peekawho': peekawhoMobile,

        // Quiz events (more)
        'biztech': biztechMobile,
        'cinemania': cinemaniaMobile,
        'marybuckneltrophymbt': mbtMobile,
        'mbt': mbtMobile,
        'otakonquest': otkaunMobile,

        // Culinary Arts
        'chefscorner': chefMobile,
    };

    // Fallback images for events without specific mapping
    const fallbackImages = [
        nrityakalaMobile, rangmanchMobile, shakeALegMobile,
        centrifugeMobile, lakesideMobile, pictureTaleMobile, brainDMobile
    ];

    const getEventDisplayData = (event) => {
        const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';

        const genreKey = normalize(event.genre);
        const genreInfo = eventData[genreKey] || {};

        // Get event-specific image from eventImageMap
        const eventKey = normalize(event.name);
        let finalImage = eventImageMap[eventKey] || null;

        // Use fallback from event poster if no specific match
        if (!finalImage && event.poster) {
            finalImage = event.poster;
        }
        if (!finalImage) {
            // Use hash to consistently pick a fallback image
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

    if (isLoading) {
        return (
            <div className="font-body bg-background-dark text-slate-200 min-h-screen relative overflow-x-hidden flex items-center justify-center" style={{ backgroundColor: '#050210', }}>
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
                    <div className="mb-4 md:mb-6 w-full relative">

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
                                    <div className={`w-full lg:w-[320px] xl:w-[380px] flex-shrink-0 ${isMobile ? '' : 'bg-black/10'} flex items-center justify-center h-[180px] sm:h-[280px] lg:h-[450px]`}>
                                        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                <motion.img
                                                    key={currentEvent.id}
                                                    alt={currentEvent.name}
                                                    src={getEventDisplayData(currentEvent).image}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: isMobile ? 0.75 : 1 }}
                                                    exit={{ opacity: 0, scale: 1.1 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="max-w-full max-h-full object-contain rounded-lg drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-500 hover:scale-105"
                                                />
                                            </AnimatePresence>
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
                                                    className="px-6 py-2 rounded-lg bg-gray-400/90 hover:bg-gray-400 text-black font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
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
                                                    {(currentEvent.max_participation !== 1) ? `${currentEvent.min_participation}-${currentEvent.max_participation}members` : `${currentEvent.max_participation} member`}
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
                                                                    {typeof rule === 'string' ? rule.replace(/^\d+[\.\)]\s*/, '') : rule}
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
                    background: rgba(14, 165, 233, 0.8);
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
