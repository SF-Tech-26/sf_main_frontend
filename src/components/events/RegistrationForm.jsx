import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/authContext';
import { registerForEvent, getRegisteredEvents } from '../../services/eventService';
import toast from 'react-hot-toast';

const RegistrationForm = ({ event, onSuccess, onCancel }) => {
    const auth = useAuth();
    const formRef = useRef(null);

    // Use real auth
    const { token, user } = auth;

    const [teamMembers, setTeamMembers] = useState(() => {
        // Handle both sf_id and sfId field names
        const userSfId = user?.sfId || user?.sf_id || '';
        const userEmail = user?.email || '';

        const initialMembers = [{ email: userEmail, sfId: userSfId }];
        if (event?.min_participation > 1) {
            const extraNeeded = event.min_participation - 1;
            for (let i = 0; i < extraNeeded; i++) {
                initialMembers.push({ email: '', sfId: '' });
            }
        }
        return initialMembers;
    });
    // const [eventCity, setEventCity] = useState('KGP');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                onCancel?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onCancel]);

    useEffect(() => {
        const checkRegistrationStatus = async () => {
            if (token && event?.id) {
                try {
                    const response = await getRegisteredEvents(token);

                    if (response.code === 0 && response.data) {
                        const registeredEventIds = response.data.map(e => e.id);

                        // Check both string and number for safe comparison
                        if (registeredEventIds.some(id => String(id) === String(event.id))) {
                            setIsRegistered(true);
                            toast.error("You are already registered for this event", {
                                id: 'already-registered',
                                style: {
                                    background: '#1a1a2e',
                                    color: '#fff',
                                    border: '1px solid rgba(239, 68, 68, 0.5)',
                                },
                            });
                        }
                    } else {
                        console.warn("Unexpected response format:", response);
                    }
                } catch (err) {
                    console.error("Failed to check registration status:", err);
                }
            }
        };

        checkRegistrationStatus();
    }, [token, event]);

    const isSolo = event.min_participation === 1 && event.max_participation === 1;

    // const handleAddMember = () => { ... } - REMOVED
    // const handleRemoveMember = () => { ... } - REMOVED

    const handleMemberChange = (index, field, value) => {
        const updated = [...teamMembers];
        updated[index][field] = value;
        setTeamMembers(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if already registered
        if (isRegistered) {
            toast.error("You are already registered for this event", {
                id: 'already-registered-submit',
                style: {
                    background: '#1a1a2e',
                    color: '#fff',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                },
            });
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Debug: Log the team members data
            console.log('Team Members Data:', teamMembers);
            console.log('User from Auth:', user);

            // Check for invalid members with better error messages
            const invalidMembers = teamMembers.filter(m => !m.email || !m.sfId);
            if (invalidMembers.length > 0) {
                const missingFields = [];
                teamMembers.forEach((m, idx) => {
                    if (!m.email) missingFields.push(`Member ${idx + 1}: Email`);
                    if (!m.sfId) missingFields.push(`Member ${idx + 1}: SF ID`);
                });
                console.error('Missing fields:', missingFields);
                throw new Error(`Please fill all required fields:\n${missingFields.join('\n')}`);
            }

            if (teamMembers.length < event.min_participation) {
                throw new Error(`Minimum ${event.min_participation} members required`);
            }

            const response = await registerForEvent(token, 'KGP', event.id, teamMembers);

            // Check if registration was successful
            if (response.code === 0) {
                setIsRegistered(true);
                // Don't show toast here - let parent component handle it
                onSuccess?.();
            } else if (response.code === 1) {
                // Already registered
                setIsRegistered(true);
                toast.error(response.message || "You are already registered for this event", {
                    id: 'already-registered-api',
                    style: {
                        background: '#1a1a2e',
                        color: '#fff',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                    },
                });
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
            setError(errorMessage);
            toast.error(errorMessage, {
                id: 'registration-error',
                style: {
                    background: '#1a1a2e',
                    color: '#fff',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMemberCountChange = (e) => {
        const count = parseInt(e.target.value);
        const currentCount = teamMembers.length;

        if (count > currentCount) {
            const newMembers = Array(count - currentCount).fill().map(() => ({ email: '', sfId: '' }));
            setTeamMembers([...teamMembers, ...newMembers]);
        } else if (count < currentCount) {
            setTeamMembers(teamMembers.slice(0, count));
        }
    };

    return (
        <div
            ref={formRef}
            className="relative p-4 sm:p-8 md:p-12 rounded-3xl w-full max-w-2xl mx-auto border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] my-4 sm:my-8 overflow-hidden"
            style={{
                background: 'rgba(10, 10, 20, 0.85)',
                backdropFilter: 'blur(20px)'
            }}
        >

            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-[1]" />

            {/* Content Container - Ensure it is above the overlay */}
            <div className="relative z-10">



                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 md:top-2 md:right-2 z-30 p-2 bg-black/30 md:bg-transparent rounded-full text-white md:text-[#b8860b] hover:text-white transition-all hover:scale-110 active:scale-90 backdrop-blur-sm"
                    title="Close form"
                >
                    <span className="material-icons text-2xl md:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">close</span>
                </button>

                {/* Header */}
                <div className="text-center mb-6 sm:mb-12">
                    <h2
                        className="text-2xl sm:text-4xl md:text-5xl font-medium text-white mb-4 tracking-[0.1em] sm:tracking-[0.2em] uppercase text-shadow-glow"
                        style={{ fontFamily: 'Inter, sans-serif', marginTop: '2rem' }}
                    >
                        {event?.name || 'SPRING FLORA'}
                    </h2>
                    <div className="flex items-center justify-center gap-2 sm:gap-4 opacity-70" style={{ marginBottom: '1.5rem' }}>
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-400" />
                        <p className="text-gray-300 text-[10px] md:text-xs tracking-[0.3em] uppercase font-light">
                            {event?.tagline || 'ETHEREAL ENIGMA EDITION'}
                        </p>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-400" />
                    </div>
                </div>

                {/* Member Management */}
                {!isSolo && (
                    <div
                        className="mb-6 sm:mb-8 bg-white/5 p-4 sm:p-5 rounded-xl border border-white/10"
                        style={{ margin: '1rem 0' }}
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-gray-300 text-sm uppercase tracking-widest font-semibold">Team Members</span>
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-icons text-purple-400" style={{ fontSize: '16px' }}>group</span>
                                        <span className="text-purple-400 font-bold">{teamMembers.length}</span>
                                        <span className="text-gray-500">/</span>
                                        <span className="text-gray-400">{event.max_participation}</span>
                                    </div>
                                    <div className="h-3 w-px bg-gray-600"></div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-500">Min:</span>
                                        <span className={`font-semibold ${teamMembers.length >= event.min_participation ? 'text-green-400' : 'text-orange-400'}`}>
                                            {event.min_participation}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-500">Max:</span>
                                        <span className="text-gray-400 font-semibold">{event.max_participation}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {teamMembers.length > event.min_participation && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (teamMembers.length > event.min_participation) {
                                                setTeamMembers(teamMembers.slice(0, -1));
                                            }
                                        }}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all hover:scale-105 active:scale-95"
                                        title="Remove last member"
                                    >
                                        <span className="material-icons text-lg">remove</span>
                                    </button>
                                )}

                                {teamMembers.length < event.max_participation && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (teamMembers.length < event.max_participation) {
                                                setTeamMembers([...teamMembers, { email: '', sfId: '' }]);
                                            }
                                        }}
                                        className="px-4 py-2 flex items-center gap-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/40 transition-all text-xs uppercase tracking-wider font-bold hover:scale-105 active:scale-95"
                                    >
                                        <span className="material-icons text-base">add</span>
                                        Add Member
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Scrollable Team Members Container */}
                    <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-white/5">
                        {/* Team Members Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="contents">
                                    {/* SF ID Input */}
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-medium pl-1">
                                            {index === 0 ? 'Primary SF-ID' : `Member ${index + 1} SF-ID`}
                                        </label>
                                        <input
                                            type="text"
                                            value={member.sfId}
                                            onChange={(e) => handleMemberChange(index, 'sfId', e.target.value)}
                                            placeholder={index === 0 ? "Your SF-ID" : "SF-XXXXXX"}
                                            className="w-full bg-white/5 text-white px-4 py-3 rounded-lg text-sm border border-transparent focus:border-white/10 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/5 transition-all placeholder-gray-600 font-light" style={{ padding: '0.5rem' }}
                                            disabled={index === 0 && user?.sfId}
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-medium pl-1">
                                            {index === 0 ? 'Contact Mail-ID' : `Member ${index + 1} Mail-ID`}
                                        </label>
                                        <input
                                            type="email"
                                            value={member.email}
                                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                            placeholder={index === 0 ? "your.email@domain.com" : "invite@domain.com"}
                                            className="w-full bg-white/5 text-white px-4 py-3 rounded-lg text-sm border border-transparent focus:border-white/10 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/5 transition-all placeholder-gray-600 font-light" style={{ padding: '0.5rem' }}
                                            disabled={index === 0 && user?.email}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8 sm:mt-12 mb-4">
                        <button
                            type="submit"
                            disabled={isLoading || isRegistered}
                            className={`
                             px-12 sm:px-16 py-3 sm:py-4 rounded-xl text-white text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300
                             ${isLoading || isRegistered
                                    ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(139,92,246,0.5)]'}
                         `}
                            style={{
                                marginTop: '0.5rem',
                                marginBottom: '2rem'
                            }}
                        >
                            {isLoading ? 'Registering...' : (isRegistered ? 'Registered' : 'Register Now')}
                        </button>
                    </div>


                </form>
            </div >
        </div >
    );
};

export default RegistrationForm;


