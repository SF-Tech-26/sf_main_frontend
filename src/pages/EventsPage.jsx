import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEvents } from '../services/eventService';

// Genre icon mapping
const genreIcons = {
    'Dance': 'music_note',
    'Music': 'headphones',
    'Dramatics': 'theater_comedy',
    'Literary': 'menu_book',
    'Film Fest': 'movie',
    'Quiz': 'quiz',
    'Fine Arts': 'brush',
    'Humor Fest': 'sentiment_satisfied',
    'Fashion': 'checkroom',
    'Culinary Arts': 'restaurant',
    'Game Fest': 'sports_esports',
};

// Genre images
const genreImages = {
    'Dance': 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800',
    'Music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    'Dramatics': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    'Literary': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    'Film Fest': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    'Quiz': 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800',
    'Fine Arts': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    'Humor Fest': 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
    'Fashion': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'Culinary Arts': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    'Game Fest': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
};

const genreDescriptions = {
    'Dance': 'Express yourself through movement. From classical to contemporary, showcase your rhythm and grace.',
    'Music': 'Let the melodies flow. Compete in singing, band performances, and musical showcases.',
    'Dramatics': 'Step into character. Bring stories to life through theatre and dramatic performances.',
    'Literary': 'Words have power. Engage in debates, poetry, and literary competitions.',
    'Film Fest': 'Lights, camera, action! Create and showcase cinematic masterpieces.',
    'Quiz': 'Test your knowledge. Challenge your intellect across diverse topics.',
    'Fine Arts': 'Create beauty. Express your artistic vision through various mediums.',
    'Humor Fest': 'Spread joy. Make audiences laugh with your comedic talents.',
    'Fashion': 'Style the runway. Showcase creativity through fashion and design.',
    'Culinary Arts': 'Master the kitchen. Compete in cooking and food presentation.',
    'Game Fest': 'Level up. Compete in gaming tournaments and esports.',
};

const EventsPage = () => {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                if (response.code === 0 && response.data) {
                    const genreList = response.data.map(g => g.genre);
                    setGenres(genreList);
                    setSelectedGenre(genreList[0] || null);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch events');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleExplore = () => {
        if (selectedGenre) {
            const slug = selectedGenre.toLowerCase().replace(/\s+/g, '-');
            navigate(`/events/${slug}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center">
                <div className="text-center text-white">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-purple-600 rounded-lg">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Header */}
                <motion.header
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        EVENTS
                    </h1>
                    <p className="text-slate-400 text-lg">Explore our exciting event categories</p>
                </motion.header>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Genre Tabs - Left Side */}
                    <motion.div
                        className="lg:w-64 flex-shrink-0"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                            <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-4 px-2">Categories</h2>
                            <div className="space-y-1 max-h-[500px] overflow-y-auto">
                                {genres.map((genre) => (
                                    <motion.button
                                        key={genre}
                                        onClick={() => setSelectedGenre(genre)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${selectedGenre === genre
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                                : 'hover:bg-white/10 text-slate-300'
                                            }`}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="material-icons text-xl">
                                            {genreIcons[genre] || 'category'}
                                        </span>
                                        <span className="font-medium text-sm">{genre}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Selected Genre Display - Right Side */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {selectedGenre && (
                                <motion.div
                                    key={selectedGenre}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-64 md:h-80">
                                        <img
                                            src={genreImages[selectedGenre] || genreImages['Dance']}
                                            alt={selectedGenre}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                                    <span className="material-icons">{genreIcons[selectedGenre] || 'category'}</span>
                                                </span>
                                                <h2 className="text-3xl md:text-4xl font-bold">{selectedGenre}</h2>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6">
                                        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                            {genreDescriptions[selectedGenre] || 'Explore exciting events in this category.'}
                                        </p>

                                        <motion.button
                                            onClick={handleExplore}
                                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-shadow flex items-center gap-2"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Explore Events
                                            <span className="material-icons">arrow_forward</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsPage;
