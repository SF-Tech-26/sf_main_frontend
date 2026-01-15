import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { getAllEvents } from '../services/eventService';
import { useEvents } from '../context/eventContext';
import eventsDesktopBg from '../assets/eventsdesktopbg.jpeg';
import eventsMobileBg from '../assets/eventsmobilebg.jpeg';
import danceImg from '../assets/Dance.png';
import musicImg from '../assets/Music.png';
import dramaticsImg from '../assets/Dramatics.png';
import literaryImg from '../assets/Literary.png';
import filmImg from '../assets/Film Fest.png';
import quizImg from '../assets/Quiz.png';
import fineArtsImg from '../assets/Fine Arts.png';
import humorImg from '../assets/Humor.png';
import fashionImg from '../assets/Fashion.png';
import culinaryImg from '../assets/culinaryarts.png';

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

const genreToSlug = {
    'Dance': 'dance',
    'Music': 'music',
    'Dramatics': 'dramatics',
    'Literary': 'literary',
    'Film Fest': 'film-fest',
    'Quiz': 'quiz',
    'Fine Arts': 'fine-arts',
    'Humor Fest': 'humor-fest',
    'Fashion': 'fashion',
    'Culinary Arts': 'culinary-arts',
    'Game Fest': 'game-fest',
};

// Genre images for Tarot cards
const genreImages = {
    'Dance': danceImg,
    'Music': musicImg,
    'Dramatics': dramaticsImg,
    'Literary': literaryImg,
    'Film Fest': filmImg,
    'Quiz': quizImg,
    'Fine Arts': fineArtsImg,
    'Humor Fest': humorImg,
    'Fashion': fashionImg,
    'Culinary Arts': culinaryImg,
};

// Fallback genre icons/emojis
const genreIcons = {
    'Dance': '🩰',
    'Music': '🎸',
    'Dramatics': '🎭',
    'Literary': '📖',
    'Film Fest': '🎬',
    'Quiz': '🧠',
    'Fine Arts': '🎨',
    'Humor Fest': '😂',
    'Fashion': '👗',
    'Culinary Arts': '🍳',
    'Game Fest': '🎮',
};

const CARDS_PER_PAGE = 5;

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
                className="absolute inset-0  bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${isMobile ? eventsMobileBg : eventsDesktopBg})`,
                }}
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



const TarotCard = ({ genre, index, totalCards, globalIndex, onClick, isMobileView }) => {
    // If isMobileView is passed, use it. Otherwise default to internal check (or false)
    // We kept the internal check in the original code, but now we can rely on the parent's state if we want consistent grid behavior.

    // Calculate position for Desktop Tarot stack
    const centerIndex = (totalCards - 1) / 2;
    const rotation = (index - centerIndex) * 10;
    const translateX = (index - centerIndex) * 200;

    const translateY = Math.abs(index - centerIndex) * 25;

    const icon = genreIcons[genre] || '✨';

    // Desktop Styles
    const desktopStyle = {
        width: '260px',
        height: '390px',
        left: '50%',
        marginLeft: '-130px',
        transformOrigin: 'bottom center',
    };

    // Mobile Grid Styles (Simple fluid width)
    const mobileStyle = {
        width: '100%',
        height: '240px', // Slightly shorter for grid
        position: 'relative'
    };

    return (
        <motion.div
            className={isMobileView ? 'cursor-pointer w-full' : 'absolute cursor-pointer'}
            style={isMobileView ? mobileStyle : desktopStyle}
            initial={isMobileView ? { opacity: 0, y: 20 } : { opacity: 0, y: 80, rotate: rotation, x: translateX }}
            animate={isMobileView ? {
                opacity: 1,
                y: 0,
                rotate: 0,
                x: 0,
                zIndex: 1
            } : {
                opacity: 1,
                y: translateY,
                rotate: rotation,
                x: translateX,
                zIndex: 10 + index
            }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
            whileHover={isMobileView ? { scale: 1.05 } : {
                y: translateY - 50,
                scale: 1.08,
                zIndex: 50,
                rotate: 0,
                transition: { duration: 0.25 }
            }}
            onClick={onClick}
        >
            {/* Lightweight CSS Glass Effect - No heavy rendering */}
            <div
                className="w-full h-full rounded-2xl overflow-hidden border border-teal-500/20 shadow-2xl relative"
                style={{
                    background: 'linear-gradient(180deg, rgba(26, 61, 61, 0.2) 0%, rgba(19, 42, 45, 0.3) 50%, rgba(10, 28, 31, 0.4) 100%)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                }}
            >
                <div className="w-full h-full relative">
                    {/* Icon/Image container */}
                    <div className="flex items-center justify-center h-full w-full absolute inset-0">
                        {genreImages[genre] ? (
                            <img
                                src={genreImages[genre]}
                                alt={genre}
                                className={`object-cover rounded-xl opacity-90 shadow-lg ${genre === 'Music' ? 'w-[75%] h-[70%]' : 'w-[90%] h-[85%]'}`}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-3/5 pt-6">
                                <span
                                    className="text-xl md:text-8xl"
                                    style={{
                                        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))'
                                    }}
                                >
                                    {icon}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Category name */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-center bg-black/30 backdrop-blur-sm">
                        <h3
                            className="font-bold text-sm md:text-xl tracking-wider uppercase"
                            style={{
                                fontFamily: 'Cinzel, serif',
                                color: '#7dd3fc',
                                textShadow: '0 2px 10px rgba(0,0,0,0.9)'
                            }}
                        >
                            {genre}
                        </h3>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const EventsPage = () => {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(genres.length / CARDS_PER_PAGE);
    // On mobile, show ALL genres. On desktop, simplify to current page slice.
    const currentGenres = isMobile ? genres : genres.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setIsLoading(true);
                const response = await getAllEvents();
                if (response.code === 0 && response.data) {
                    const genresWithActiveEvents = response.data.filter(genreGroup => {
                        const activeEvents = genreGroup.events?.filter(e => e.event_status === true) || [];
                        return activeEvents.length > 0;
                    });
                    const uniqueGenres = genresWithActiveEvents.map(genreGroup => genreGroup.genre);
                    setGenres(uniqueGenres);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch genres');
            } finally {
                setIsLoading(false);
            }
        };
        fetchGenres();
    }, []);

    const goToPage = (page) => {
        if (page >= 0 && page < totalPages) setCurrentPage(page);
    };

    const handleGenreClick = (genre) => {
        const slug = genreToSlug[genre] || genre.toLowerCase().replace(/\s+/g, '-');
        navigate(`/events/${slug}`);
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
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-purple-600 rounded-lg">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white overflow-x-hidden relative">
            <EtherealBackground />

            <div className="relative z-10 container mx-auto px-4 py-6 pb-20">
                {/* Header */}
                <header className="text-center mb-8 pt-4">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-4"
                        style={{
                            fontFamily: '"Cinzel Decorative", serif',
                            color: '#c9e4e4',
                            textShadow: '0 0 30px rgba(100, 180, 180, 0.4), 0 4px 20px rgba(0,0,0,0.5)'
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        EVENTS
                    </motion.h1>
                </header>

                {/* Cards Container */}
                <div
                    className={isMobile
                        ? "grid grid-cols-2 gap-4 place-items-center w-full max-w-lg mx-auto"
                        : "relative h-auto md:h-[450px] flex items-center justify-center mt-0"
                    }
                >
                    <AnimatePresence mode="wait">
                        {isMobile ? (
                            // Render ALL items in Grid for Mobile
                            <>
                                {currentGenres.map((genre, index) => (
                                    <TarotCard
                                        key={genre}
                                        genre={genre}
                                        index={index}
                                        totalCards={currentGenres.length}
                                        globalIndex={index}
                                        onClick={() => handleGenreClick(genre)}
                                        isMobileView={true}
                                    />
                                ))}
                            </>
                        ) : (
                            // Use Wrapper for Paginated Tarot Stack on Desktop
                            <motion.div
                                key={currentPage}
                                className="relative w-full max-w-2xl h-full flex flex-wrap justify-center items-center gap-4 px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {currentGenres.map((genre, index) => (
                                    <TarotCard
                                        key={genre}
                                        genre={genre}
                                        index={index}
                                        totalCards={currentGenres.length}
                                        globalIndex={currentPage * CARDS_PER_PAGE + index}
                                        onClick={() => handleGenreClick(genre)}
                                        isMobileView={false}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Pagination (Hide on Mobile) */}
                {!isMobile && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-5 mt-8">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30 transition-all duration-300 hover:scale-110"
                            style={{
                                background: 'linear-gradient(135deg, rgba(100, 180, 180, 0.3) 0%, rgba(60, 140, 140, 0.4) 100%)',
                                border: '1px solid rgba(100, 180, 180, 0.4)',
                                boxShadow: '0 4px 15px rgba(0, 100, 100, 0.3)'
                            }}
                        >
                            <span className="material-icons text-cyan-300">chevron_left</span>
                        </button>

                        <div className="flex gap-3 items-center">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i)}
                                    className="w-3 h-3 rounded-full transition-all duration-300"
                                    style={{
                                        background: i === currentPage
                                            ? 'linear-gradient(135deg, #db7093 0%, #c06080 100%)'
                                            : 'rgba(180, 200, 200, 0.3)',
                                        transform: i === currentPage ? 'scale(1.3)' : 'scale(1)',
                                        boxShadow: i === currentPage ? '0 0 12px rgba(219, 112, 147, 0.6)' : 'none'
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30 transition-all duration-300 hover:scale-110"
                            style={{
                                background: 'linear-gradient(135deg, rgba(100, 180, 180, 0.3) 0%, rgba(60, 140, 140, 0.4) 100%)',
                                border: '1px solid rgba(100, 180, 180, 0.4)',
                                boxShadow: '0 4px 15px rgba(0, 100, 100, 0.3)'
                            }}
                        >
                            <span className="material-icons text-cyan-300">chevron_right</span>
                        </button>
                    </div>
                )}

                {!isMobile && (
                    <p
                        className="text-center text-sm mt-4 tracking-wider"
                        style={{ color: 'rgba(180, 200, 200, 0.6)' }}
                    >
                        {currentPage * CARDS_PER_PAGE + 1}-{Math.min((currentPage + 1) * CARDS_PER_PAGE, genres.length)} of {genres.length}
                    </p>
                )}
            </div>

            {/* Critical Performance Optimizations */}
            <style>{`
                /* Force GPU acceleration for smooth animations */
                .cursor-pointer {
                    will-change: transform, opacity;
                    transform: translateZ(0) translate3d(0, 0, 0);
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }

                /* Optimize rendering */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* Reduce repaints during animations */
                .absolute, .relative {
                    will-change: transform;
                    transform: translateZ(0);
                }

                /* Optimize images */
                img {
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: crisp-edges;
                }

                /* Disable expensive effects during animation */
                @media (prefers-reduced-motion: no-preference) {
                    * {
                        animation-timing-function: ease-out !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default EventsPage;
