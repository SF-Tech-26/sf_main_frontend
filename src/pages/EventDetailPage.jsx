import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEvents } from '../context/eventContext';
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
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
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

const EventDetailPage = () => {
    const { genre: genreSlug, eventId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { events: allEvents, isLoadingEvents, eventError, getEventById } = useEvents();

    const [event, setEvent] = useState(null);
    const [showRegistration, setShowRegistration] = useState(false);

    const genreName = slugToGenre[genreSlug] || genreSlug;

    useEffect(() => {
        if (allEvents.length > 0) {
            const foundEvent = getEventById(genreName, eventId);
            setEvent(foundEvent);
        }
    }, [allEvents, genreName, eventId, getEventById]);

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
        if (isAuthenticated) {
            setShowRegistration(true);
        } else {
            toast.error('Please login to register', {
                style: {
                    background: '#1a1a2e',
                    color: '#fff',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                },
            });
        }
    };

    if (isLoadingEvents) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050210' }}>
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (eventError || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: '#050210' }}>
                <div className="text-center">
                    <p className="text-red-400 mb-4">{eventError || 'Event not found'}</p>
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

                                    {!showRegistration && (
                                        <div className="relative group cursor-pointer z-10 mt-8 " style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
                                            <div className="absolute inset-0 bg-purple-500 rounded-rounded  blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />
                                            <motion.button
                                                onClick={handleRegisterClick}
                                                className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold  p-5 text-sm tracking-wider relative z-10 border border-white/20"
                                                style={{
                                                    width: '8rem',
                                                    height: '2rem',
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
                                    )}

                                    {showRegistration && (
                                        <motion.div
                                            className="w-full mt-4 relative z-10"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <RegistrationForm
                                                event={event}
                                                onSuccess={handleRegistrationSuccess}
                                                onCancel={() => setShowRegistration(false)}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Right Section */}
                                <div className="lg:w-3/5 p-10 lg:p-16 bg-black/10">
                                    <div className="hidden lg:flex justify-end mb-6">
                                        <button onClick={() => navigate(`/events/${genreSlug}`)} className="text-slate-400 hover:text-red-400 transition-colors">
                                            <span className="material-icons text-3xl">close</span>
                                        </button>
                                    </div>

                                    <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4">
                                        <div className="rounded-2xl p-6 hover:bg-black/40 transition-colors duration-300" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                            <h2 className="text-3xl font-bold mb-8 text-fuchsia-200 uppercase flex items-center gap-4" style={{ fontFamily: 'Cinzel, serif' }}>
                                                <span className="w-8 h-px bg-fuchsia-500" />
                                                About
                                            </h2>
                                            <p className="text-slate-300 leading-relaxed text-base font-light tracking-wide">{event.writeup}</p>
                                        </div>

                                        {event.rules && event.rules.length > 0 && (
                                            <div className="rounded-2xl p-6 hover:bg-black/40 transition-colors duration-300" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                <h2 className="text-3xl font-bold mb-8 text-indigo-200 uppercase flex items-center gap-3" style={{ fontFamily: 'Cinzel, serif' }}>
                                                    <span className="w-8 h-px bg-indigo-500" />
                                                    Rules
                                                </h2>
                                                <ul className="space-y-4 text-slate-300 text-base font-light">
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
            </div>
        </div>
    );
};

export default EventDetailPage;
