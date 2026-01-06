import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';
import { getRegisteredEvents } from '../services/eventService';
import TeamManager from '../components/events/TeamManager';

const MyRegistrations = () => {
    const navigate = useNavigate();
    const { token, isAuthenticated, isLoading: authLoading } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedEvent, setExpandedEvent] = useState(null);

    const fetchRegistrations = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getRegisteredEvents(token);
            setRegistrations(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch registrations');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchRegistrations();
        } else if (!authLoading && !isAuthenticated) {
            setIsLoading(false);
        }
    }, [isAuthenticated, token, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center text-white">
                <div className="text-center">
                    <span className="material-icons text-6xl text-purple-500 mb-4">lock</span>
                    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                    <p className="text-slate-400 mb-6">Please log in to view your registrations</p>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-6 py-3 bg-purple-600 font-bold rounded-lg hover:bg-purple-500"
                    >
                        Browse Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Back Button */}
                <motion.button
                    onClick={() => navigate('/events')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <span className="material-icons">arrow_back</span>
                    Back to Events
                </motion.button>

                {/* Header */}
                <motion.header
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        My Registrations
                    </h1>
                    <p className="text-slate-400 mt-2">{registrations.length} events registered</p>
                </motion.header>

                {error && (
                    <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                        {error}
                    </div>
                )}

                {/* Registrations List */}
                {registrations.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="material-icons text-6xl text-slate-600 mb-4">event_busy</span>
                        <h2 className="text-xl font-bold text-slate-400 mb-2">No Registrations Yet</h2>
                        <p className="text-slate-500 mb-6">You haven't registered for any events</p>
                        <button
                            onClick={() => navigate('/events')}
                            className="px-6 py-3 bg-purple-600 font-bold rounded-lg hover:bg-purple-500"
                        >
                            Explore Events
                        </button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {registrations.map((reg, index) => (
                            <motion.div
                                key={reg.eventId || index}
                                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div
                                    className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                                    onClick={() => setExpandedEvent(expandedEvent === reg.eventId ? null : reg.eventId)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg">{reg.eventName || `Event #${reg.eventId}`}</h3>
                                            <p className="text-sm text-slate-400">{reg.genre || 'Event'}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${reg.isGroup ? 'bg-purple-500' : 'bg-green-500'}`}>
                                                {reg.isGroup ? 'Group' : 'Solo'}
                                            </span>
                                            <span className="material-icons text-slate-400">
                                                {expandedEvent === reg.eventId ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {expandedEvent === reg.eventId && (
                                    <motion.div
                                        className="px-4 pb-4 border-t border-white/10"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                    >
                                        <div className="pt-4">
                                            <TeamManager
                                                eventId={reg.eventId}
                                                isAdmin={reg.isAdmin}
                                                onUpdate={fetchRegistrations}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRegistrations;
