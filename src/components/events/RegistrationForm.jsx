import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/authContext';
import { registerForEvent, getRegisteredEvents } from '../../services/eventService';
import toast from 'react-hot-toast';

const RegistrationForm = ({ event, onSuccess, onCancel }) => {
    const auth = useAuth();

    // Use real auth
    const { token, user } = auth;

    const [teamMembers, setTeamMembers] = useState(() => {
        const initialMembers = [{ email: user?.email || '', sfId: user?.sfId || '' }];
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
        setIsLoading(true);
        setError(null);

        try {
            const invalidMembers = teamMembers.filter(m => !m.email || !m.sfId);
            if (invalidMembers.length > 0) {
                throw new Error('All team members must have valid email and SF ID');
            }

            if (teamMembers.length < event.min_participation) {
                throw new Error(`Minimum ${event.min_participation} members required`);
            }

            await registerForEvent(token, event.id, 'KGP', teamMembers);
            onSuccess?.();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
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
            className="relative p-12 rounded-3xl w-full max-w-2xl mx-auto border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] my-8 overflow-hidden"
            style={{
                background: 'rgba(20, 20, 30, 0.95)',
                backdropFilter: 'blur(20px)'
            }}
        >
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-black/10 z-0" />

            {/* Content Container - Ensure it is above the overlay */}
            <div className="relative z-10">



                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-2 right-2 z-30 p-2 text-[#b8860b] hover:text-white transition-all hover:scale-110 active:scale-90"
                    title="Close form"
                >
                    <span className="material-icons text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">close</span>
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <h2
                        className="text-4xl md:text-5xl font-medium text-white mb-4 tracking-[0.2em] uppercase text-shadow-glow"
                        style={{ fontFamily: 'Inter, sans-serif', marginTop: '4rem' }}
                    >
                        {event?.name || 'SPRING FLORA'}
                    </h2>
                    <div className="flex items-center justify-center gap-4 opacity-70" style={{ marginBottom: '3rem' }}>
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
                        className="mb-8 flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
                        style={{ margin: '4rem' }}
                    >
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-xs uppercase tracking-widest font-medium">Team Members</span>
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
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all"
                                    title="Remove last member"
                                >
                                    <span className="material-icons text-base">remove</span>
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
                                    className="px-4 py-2 flex items-center gap-2 rounded-lg bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all text-xs uppercase tracking-wider font-bold"
                                >
                                    <span className="material-icons text-sm">add</span>
                                    Add Member
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Team Members Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" style={{ paddingRight: '2rem' }}>
                        {teamMembers.map((member, index) => (
                            <div key={index} className="contents">
                                {/* SF ID Input */}
                                <div className="flex flex-col space-y-2" style={{ paddingLeft: '2rem' }}>
                                    <label className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-medium pl-1">
                                        {index === 0 ? 'Primary SF-ID' : `Member ${index + 1} SF-ID`}
                                    </label>
                                    <input
                                        type="text"
                                        value={member.sfId}
                                        onChange={(e) => handleMemberChange(index, 'sfId', e.target.value)}
                                        placeholder={index === 0 ? "SF001679" : "SF-XXXXXX"}
                                        className="w-full bg-white/5 text-white px-4 py-3 rounded-lg text-sm border border-transparent focus:border-white/10 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/5 transition-all placeholder-gray-600 font-light" style={{ padding: '0.5rem' }}
                                        disabled={index === 0}
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
                                        placeholder={index === 0 ? "sanjayahari1704@gmail.com" : "invite@domain.com"}
                                        className="w-full bg-white/5 text-white px-4 py-3 rounded-lg text-sm border border-transparent focus:border-white/10 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/5 transition-all placeholder-gray-600 font-light" style={{ padding: '0.5rem' }}
                                        disabled={index === 0}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-12 mb-4">
                        <button
                            type="submit"
                            disabled={isLoading || isRegistered}
                            className={`
                             px-16 py-4 rounded-lg text-white text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300
                             ${isLoading || isRegistered
                                    ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:scale-105 active:scale-95'}
                         `}
                            style={{
                                marginTop: '1rem',
                                marginBottom: '4rem'
                            }}
                        >
                            {isLoading ? 'Registering...' : (isRegistered ? 'Registered' : 'Register Now')}
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;


