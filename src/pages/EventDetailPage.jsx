import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAllEvents, getEventsByGenre } from '../services/eventService';
import { useAuth } from '../context/authContext';
import RegistrationForm from '../components/events/RegistrationForm';

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

// Ethereal Background Component
const EtherealBackground = () => (
    <div className="fixed inset-0 z-0">
        <div
            className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-screen"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506318137071-a8bcbf67cc77?q=80&w=2940&auto=format&fit=crop')" }}
        />
        <div
            className="absolute inset-0 mix-blend-multiply"
            style={{ background: 'linear-gradient(to bottom, transparent, #050210)', backgroundColor: 'rgba(5, 2, 16, 0.8)' }}
        />
        <div className="absolute top-10 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ boxShadow: '0 0 10px white' }} />
        <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse" style={{ boxShadow: '0 0 15px cyan', animationDelay: '0.7s' }} />
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{ boxShadow: '0 0 20px magenta', animationDelay: '0.3s' }} />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-500/10 rounded-full blur-[150px]" />
    </div>
);

const EventDetailPage = () => {
    const { genre: genreSlug, eventId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRegistration, setShowRegistration] = useState(false);

    const genreName = slugToGenre[genreSlug] || genreSlug;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const response = await getAllEvents();
                if (response.code === 0 && response.data) {
                    const genreEvents = getEventsByGenre(response, genreName);
                    const foundEvent = genreEvents.find(e => e.id === parseInt(eventId));
                    setEvent(foundEvent || null);
                    if (!foundEvent) setError('Event not found');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch event');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [genreName, eventId]);

    const handleRegistrationSuccess = () => {
        setShowRegistration(false);
        toast.success(`Successfully registered for ${event.name}!`, {
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

    const handleRegisterClick = () => {
        setShowRegistration(true);
        // if (isAuthenticated) {
        //     setShowRegistration(true);
        // } else {
        //     toast.error('Please login to register', {
        //         style: {
        //             background: '#1a1a2e',
        //             color: '#fff',
        //             border: '1px solid rgba(239, 68, 68, 0.5)',
        //         },
        //     });
        // }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050210' }}>
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: '#050210' }}>
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Event not found'}</p>
                    <button onClick={() => navigate(`/events/${genreSlug}`)} className="px-4 py-2 bg-purple-600 rounded-lg">
                        Back to {genreName}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-100 overflow-x-hidden relative" style={{ backgroundColor: '#050210', fontFamily: 'Quicksand, sans-serif' }}>
            <EtherealBackground />

            {/* Back Button */}
            <motion.button
                onClick={() => navigate(`/events/${genreSlug}`)}
                className="fixed top-16 left-8 z-50 p-3 rounded-full bg-black/40 border border-white/10 text-white hover:bg-purple-500/80 hover:border-purple-500 transition-all duration-300 backdrop-blur-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="material-icons text-2xl">arrow_back</span>
            </motion.button>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="flex-grow flex items-center justify-center p-20 py-20 md:py-28">
                    <div className="w-full max-w-6xl relative">
                        {/* Decorative corners */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-purple-500/40 rounded-tl-[3rem] hidden md:block opacity-70" />
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-fuchsia-500/40 rounded-br-[3rem] hidden md:block opacity-70" />

                        {/* Glass Modal */}
                        <motion.div
                            className="rounded-2xl overflow-hidden relative"
                            style={{
                                background: 'rgba(10, 5, 30, 0.45)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 0 40px rgba(139, 92, 246, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex flex-col lg:flex-row h-full">
                                {/* Left Section */}
                                <div className="lg:w-2/5 p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col items-center lg:items-start justify-center text-center lg:text-left relative">
                                    <h1
                                        className="text-5xl lg:text-5xl font-bold text-white mb-8 relative z-10"
                                        style={{ fontFamily: 'Cinzel, serif', margin: '1rem', marginTop: 0, textShadow: '0 0 10px rgba(168, 85, 247, 0.8), 0 0 20px rgba(217, 70, 239, 0.5)' }}
                                    >
                                        {event.name.toUpperCase()}
                                    </h1>

                                    <p className="text-fuchsia-300 font-semibold tracking-[0.15em] uppercase text-base md:text-lg mb-10 relative z-10" style={{ fontFamily: 'Cinzel, serif', margin: '1.5rem' }}>
                                        {event.tagline}
                                    </p>

                                    <div className="flex gap-10 mb-12 relative z-10" style={{ marginBottom: '1.5rem', marginLeft: '1.5rem' }}>
                                        <span className={`px-4  group py-1 rounded-full text-base font-medium ${event.is_group ? 'bg-purple-500/60' : 'bg-emerald-500/60'}`} >
                                            {event.is_group ? 'Group Event' : 'Solo Event'}
                                        </span>
                                        <span className="px-4 py-1 mem rounded-full text-base font-medium bg-white/10">
                                            {event.min_participation}-{event.max_participation} members
                                        </span>
                                    </div>

                                    <div className="relative group cursor-pointer z-10 mt-8" style={{ marginBottom: '1.5rem', marginLeft: '1.5rem' }}>
                                        <div className="absolute inset-0 bg-purple-500 rounded-rounded  blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />
                                        <motion.button
                                            onClick={handleRegisterClick}
                                            className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold  p-5 text-sm tracking-wider relative z-10 border border-white/20"
                                            style={{
                                                fontFamily: 'Cinzel, serif',
                                                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(217, 70, 239, 1) 20%, rgba(139, 92, 246, 1) 50%, rgba(76, 29, 149, 1) 100%)',
                                                boxShadow: '0 0 30px rgba(217, 70, 239, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)'
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            REGISTER<br />NOW
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div className="lg:w-3/5 p-10 lg:p-16 bg-black/10">
                                    <div className="hidden lg:flex justify-end mb-6">
                                        <button onClick={() => navigate(`/events/${genreSlug}`)} className="text-slate-400 hover:text-red-400 transition-colors">
                                            <span className="material-icons text-3xl">close</span>
                                        </button>
                                    </div>

                                    <div className="space-y-14 max-h-[60vh] overflow-y-auto pr-4">
                                        <div className="rounded-2xl p-20  hover:bg-black/40 transition-colors duration-300" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)', margin: '1rem' }}>
                                            <h2 className="text-3xl font-bold mb-8 text-fuchsia-200 uppercase flex items-center gap-4" style={{ fontFamily: 'Cinzel, serif' }}>
                                                <span className="w-8 h-px bg-fuchsia-500" />
                                                About
                                            </h2>
                                            <p className="text-slate-300 leading-relaxed text-0.5xl  font-light tracking-wide" style={{ margin: '0.5rem' }}>{event.writeup}</p>
                                        </div>

                                        {event.rules && event.rules.length > 0 && (
                                            <div className="rounded-2xl p-20 hover:bg-black/40 transition-colors duration-300" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)', margin: '1rem' }}>
                                                <h2 className="text-3xl font-bold mb-8 text-indigo-200 uppercase flex items-center gap-3" style={{ fontFamily: 'Cinzel, serif' }}>
                                                    <span className="w-8 h-px bg-indigo-500" />
                                                    Rules
                                                </h2>
                                                <ul className="space-y-6 text-slate-300 text-lg md:text-0.5xl font-light" style={{ margin: '0.5rem' }}>
                                                    {event.rules.filter(r => r && r.trim()).map((rule, index) => (
                                                        <li key={index} className="flex gap-5 items-start">
                                                            <span className="font-bold text-fuchsia-400 text-2xl mt-0.5" style={{ fontFamily: 'Cinzel, serif' }}>
                                                                {String(index + 1).padStart(2, '0')}
                                                            </span>
                                                            <span>{rule}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <footer className="relative z-10 text-center py-6 text-slate-500 text-xs md:text-sm tracking-widest uppercase opacity-60" style={{ fontFamily: 'Cinzel, serif' }}>
                    © 2025 SF Ethereal Enigma. All Rights Reserved.
                </footer>
                {/* Registration Modal Overlay */}
                {showRegistration && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-4xl relative"
                            style={{
                                background: 'transparent',
                                boxShadow: 'none'
                            }}
                        >
                            {/* Modal Body */}
                            <div className="max-h-[85vh] overflow-y-auto">
                                <RegistrationForm
                                    event={event}
                                    onSuccess={handleRegistrationSuccess}
                                    onCancel={() => setShowRegistration(false)}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetailPage;
