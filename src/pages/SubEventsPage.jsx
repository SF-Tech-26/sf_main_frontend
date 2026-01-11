import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEvents, getEventsByGenre } from '../services/eventService';

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

const cardImages = [
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400',
    'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=400',
];

const CARDS_PER_PAGE = 5;

// Ethereal Background Component
const EtherealBackground = () => {
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
            {/* Deep space gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0d0015 50%, #000000 100%)'
                }}
            />

            {/* Nebula clouds */}
            <div
                className="absolute top-0 left-0 w-full h-full opacity-30"
                style={{
                    background: 'radial-gradient(ellipse at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)'
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

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />
        </div>
    );
};

const TarotCard = ({ event, index, totalCards, genreSlug, globalIndex }) => {
    const navigate = useNavigate();

    const centerIndex = (totalCards - 1) / 2;
    const rotation = (index - centerIndex) * 8;
    const translateX = (index - centerIndex) * 100;
    const translateY = Math.abs(index - centerIndex) * 10;

    const isSmallScreen = window.innerWidth < 768;

    return (
        <motion.div
            className={isSmallScreen ? 'relative cursor-pointer' : 'absolute cursor-pointer'}
            style={isSmallScreen ? {
                width: '160px',
                height: '240px',
            } : {
                width: '220px',
                height: '330px',
                left: '50%',
                marginLeft: '-110px',
                transformOrigin: 'bottom center',
            }}
            initial={{ opacity: 0, y: 80, rotate: isSmallScreen ? 0 : rotation, x: isSmallScreen ? 0 : translateX }}
            animate={{
                opacity: 1,
                y: isSmallScreen ? 0 : translateY,
                rotate: isSmallScreen ? 0 : rotation,
                x: isSmallScreen ? 0 : translateX,
                zIndex: isSmallScreen ? 10 + index : 10 + index
            }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
            whileHover={{
                y: isSmallScreen ? -8 : translateY - 40,
                scale: 1.08,
                zIndex: 50,
                rotate: 0,
                transition: { duration: 0.2 }
            }}
            onClick={() => navigate(`/events/${genreSlug}/${event.id}`)}
        >
            <div
                className="w-full h-full rounded-xl overflow-hidden"
                style={{
                    backgroundImage: `url('${cardImages[globalIndex % cardImages.length]}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.3), 0 15px 35px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Ethereal glow on hover */}
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{
                        boxShadow: 'inset 0 0 30px rgba(139, 92, 246, 0.4)'
                    }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${event.is_group ? 'bg-purple-500/80' : 'bg-emerald-500/80'
                        }`}>
                        {event.is_group ? 'Group' : 'Solo'}
                    </span>

                    <h3 className="font-bold text-xl mt-3 leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                        {event.name}
                    </h3>
                </div>

                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-purple-500/50 backdrop-blur-sm flex items-center justify-center text-xs font-bold border border-purple-400/30">
                    {globalIndex + 1}
                </div>
            </div>
        </motion.div>
    );
};

const SubEventsPage = () => {
    const { genre: genreSlug } = useParams();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const genreName = slugToGenre[genreSlug] || genreSlug;
    const totalPages = Math.ceil(events.length / CARDS_PER_PAGE);
    const currentEvents = events.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const response = await getAllEvents();
                if (response.code === 0 && response.data) {
                    const genreEvents = getEventsByGenre(response, genreName);
                    setEvents(genreEvents.filter(e => e.event_status !== false));
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch events');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [genreName]);

    const goToPage = (page) => {
        if (page >= 0 && page < totalPages) setCurrentPage(page);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0015' }}>
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white" style={{ background: '#0d0015' }}>
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={() => navigate('/events')} className="px-4 py-2 bg-purple-600 rounded-lg">Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white overflow-hidden relative">
            <EtherealBackground />

            <div className="relative z-10 container mx-auto px-4 py-6">
                {/* Back */}
                <button
                    onClick={() => navigate('/events')}
                    className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-4"
                >
                    <span className="material-icons">arrow_back</span>
                    Back
                </button>

                {/* Header */}
                <header className="text-center mb-8">
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold mb-4"
                        style={{
                            fontFamily: 'Cinzel, serif',
                            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 60px rgba(168, 85, 247, 0.5)'
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {genreName}
                    </motion.h1>
                    <p className="text-purple-300 text-sm tracking-widest uppercase">
                        {events.length} Ethereal Experiences
                    </p>
                </header>

                {/* Tarot Card Spread */}
                <div className="relative h-auto md:h-[450px] flex items-center justify-center" style={{marginTop:'3rem'}}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            className="relative w-full max-w-2xl h-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 px-4 md:px-0"
                            style={{ flexWrap: 'wrap' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {currentEvents.map((event, index) => (
                                <TarotCard
                                    key={event.id}
                                    className="tarot-card "
                                    event={event}
                                    index={index}
                                    totalCards={currentEvents.length}
                                    genreSlug={genreSlug}
                                    globalIndex={currentPage * CARDS_PER_PAGE + index}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 disabled:opacity-30 transition-colors border border-purple-500/30"
                        >
                            <span className="material-icons">chevron_left</span>
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentPage
                                            ? 'bg-purple-400 scale-125 shadow-lg shadow-purple-500/50'
                                            : 'bg-purple-500/30 hover:bg-purple-500/50'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 disabled:opacity-30 transition-colors border border-purple-500/30"
                        >
                            <span className="material-icons">chevron_right</span>
                        </button>
                    </div>
                )}

                <p className="text-center text-purple-400/60 text-xs mt-4">
                    {currentPage * CARDS_PER_PAGE + 1}-{Math.min((currentPage + 1) * CARDS_PER_PAGE, events.length)} of {events.length}
                </p>
            </div>
        </div>
    );
};

export default SubEventsPage;
