import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { getAllEvents } from '../services/eventService';
import { useEvents } from '../context/eventContext';
import eventsDesktopBg from '../assets/eventsdesktopbg.jpeg';
import eventsMobileBg from '../assets/eventsmobilebg.jpeg';
import GlassSurface from '../components/GlassSurface';
import danceImg from '../assets/Dance.png';
import musicImg from '../assets/Music.png';
import dramaticsImg from '../assets/Dramatics.png';
import literaryImg from '../assets/Literary.png';
import filmImg from '../assets/Film Fest.png';
import quizImg from '../assets/Quiz.png';
import fineArtsImg from '../assets/Fine Arts.png';
import humorImg from '../assets/Humor.png';
import fashionImg from '../assets/Fashion.png';

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



const TarotCard = ({ genre, index, totalCards, globalIndex, onClick }) => {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        setIsSmallScreen(mediaQuery.matches);

        const handleChange = (e) => setIsSmallScreen(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const centerIndex = (totalCards - 1) / 2;
    const rotation = (index - centerIndex) * 10;
    const translateX = (index - centerIndex) * 200; // Increased spacing for wider cards
    const translateY = Math.abs(index - centerIndex) * 25;

    const icon = genreIcons[genre] || '✨';

    return (
        <motion.div
            className={isSmallScreen ? 'relative cursor-pointer' : 'absolute cursor-pointer'}
            style={isSmallScreen ? {
                width: window.innerWidth < 480 ? '200px' : '220px',
                height: window.innerWidth < 480 ? '300px' : '330px',
            } : {
                width: '260px',
                height: '390px',
                left: '50%',
                marginLeft: '-130px', // Half of width
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
                y: isSmallScreen ? -15 : translateY - 50,
                scale: 1.08,
                zIndex: 50,
                rotate: 0,
                transition: { duration: 0.25 }
            }}
            onClick={onClick}
        >
            <GlassSurface
                width="100%"
                height="100%"
                borderRadius={16}
                displace={20}
                distortionScale={30}
                opacity={0.8}
                brightness={40}
                className="rounded-2xl overflow-hidden border border-teal-500/20 shadow-2xl"
                style={{
                    background: 'linear-gradient(180deg, rgba(26, 61, 61, 0.2) 0%, rgba(19, 42, 45, 0.3) 50%, rgba(10, 28, 31, 0.4) 100%)',
                }}
            >
                <div className="w-full h-full relative">
                    {/* Icon/Image container */}
                    <div className="flex items-center justify-center h-full w-full absolute inset-0">
                        {genreImages[genre] ? (
                            <img
                                src={genreImages[genre]}
                                alt={genre}
                                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-3/5 pt-6">
                                <span
                                    className="text-7xl md:text-8xl transform hover:scale-110 transition-transform duration-300"
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
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                        <h3
                            className="font-bold text-lg md:text-xl tracking-wider uppercase"
                            style={{
                                fontFamily: 'Cinzel, serif',
                                color: '#7dd3fc', // Sky-300
                                textShadow: '0 2px 10px rgba(0,0,0,0.9)'
                            }}
                        >
                            {genre}
                        </h3>
                    </div>
                </div>
            </GlassSurface>
        </motion.div>
    );
};

const EventsPage = () => {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(genres.length / CARDS_PER_PAGE);
    const currentGenres = genres.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setIsLoading(true);
                const response = await getAllEvents();
                if (response.code === 0 && response.data) {
                    // Extract unique genres from events
                    const uniqueGenres = [...new Set(response.data.map(event => event.genre))];
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
        <div className="min-h-screen text-white overflow-hidden relative">
            <EtherealBackground />

            <div className="relative z-10 container mx-auto px-4 py-6">
                {/* Header */}
                <header className="text-center mb-8 pt-4">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-4"
                        style={{
                            fontFamily: '"Cinzel Decorative", serif', // Changed font as requested
                            color: '#c9e4e4',
                            textShadow: '0 0 30px rgba(100, 180, 180, 0.4), 0 4px 20px rgba(0,0,0,0.5)'
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        SPRINGFEST
                    </motion.h1>
                    {/* Description removed as requested */}
                    <motion.h2
                        className="text-2xl md:text-4xl font-bold tracking-wide"
                        style={{
                            fontFamily: 'Cinzel, serif',
                            color: '#e8f4f4',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Event Categories
                    </motion.h2>
                </header>

                {/* Tarot Card Spread */}
                <div className="relative h-auto md:h-[450px] flex items-center justify-center" style={{ marginTop: '0rem' }}>
                    <AnimatePresence mode="wait">
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
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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

                <p
                    className="text-center text-sm mt-4 tracking-wider"
                    style={{ color: 'rgba(180, 200, 200, 0.6)' }}
                >
                    {currentPage * CARDS_PER_PAGE + 1}-{Math.min((currentPage + 1) * CARDS_PER_PAGE, genres.length)} of {genres.length}
                </p>
            </div>
        </div>
    );
};

export default EventsPage;
