import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/authContext';
import { registerForEvent, getRegisteredEvents } from '../../services/eventService';
import toast from 'react-hot-toast';

const RegistrationForm = ({ event, onSuccess, onCancel }) => {
    const auth = useAuth();

    // Use real auth if available, otherwise fallback to test credentials
    const token = auth.token || "HARDCODED_TEST_TOKEN";
    const user = auth.user || {
        email: "sanjayahari1704@gmail.com",
        sfId: "SF_TEST_ID"
    };

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
        <div className="relative bg-[#050210] p-12 rounded-2xl w-full max-w-3xl mx-auto border border-white/10 shadow-2xl my-8">
            {/* Close Button */}
            <button
                onClick={onCancel}
                className="absolute top-6 right-6 text-cyan-400 hover:text-white transition-colors"
            >
                <span className="material-icons text-xl">close</span>
            </button>

            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-2 tracking-widest text-shadow-glow" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 20px rgba(255, 255, 255, 0.5)', marginTop: '4rem' }}>
                    {event?.name || 'EVENT NAME'}
                </h2>
                <p className="text-cyan-400 text-xs tracking-[0.3em] font-light " style={{ marginBottom: '3rem' }}>
                    {event?.tagline || 'RESONANCE IN THE VOID'}
                </p>
            </div>

            {/* Member Selection */}
            {!isSolo && (
                <div className="mb-10 flex flex-col items-center" style={{ margin: '4rem' }}>
                    <label className="text-gray-400 text-xs tracking-widest uppercase mb-2 " style={{ margin: '1rem' }}>Select No. of Members</label>
                    <select
                        value={teamMembers.length}
                        onChange={handleMemberCountChange}
                        className="bg-[#0f0a20] text-white px-4 py-2 w-64 rounded border border-white/20 focus:border-purple-500 outline-none text-center appearance-none"
                    >
                        {Array.from({ length: event.max_participation - event.min_participation + 1 }, (_, i) => event.min_participation + i).map(num => (
                            <option key={num} value={num}>{num} Members</option>
                        ))}
                    </select>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Team Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 " style={{ paddingRight: '2rem' }}>
                    {teamMembers.map((member, index) => (
                        <div key={index} className="contents">
                            {/* SF ID Input */}
                            <div className="flex flex-col space-y-2" style={{ paddingLeft: '2rem' }}>
                                <label className="text-gray-400 text-xs uppercase tracking-widest pl-1" >
                                    {index === 0 ? 'Your SF-ID' : `Member ${index + 1} SF-ID`}
                                </label>
                                <input
                                    type="text"
                                    value={member.sfId}
                                    onChange={(e) => handleMemberChange(index, 'sfId', e.target.value)}
                                    placeholder={index === 0 ? "SFXXXXXX" : "SFXXXXXX"}
                                    className="w-full bg-white text-black px-4 py-3 rounded font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-shadow" style={{ padding: '0.5rem' }}
                                    disabled={index === 0}
                                />
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-col space-y-2" >
                                <label className="text-gray-400 text-xs uppercase tracking-widest pl-1" >
                                    {index === 0 ? 'Your Mail-ID' : `Member ${index + 1} Mail-ID`}
                                </label>
                                <input
                                    type="email"
                                    value={member.email}
                                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                    placeholder="abc@gmail.com"
                                    className="w-full bg-white text-black px-4 py-3 rounded-md font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-shadow" style={{ padding: '0.5rem' }}
                                    disabled={index === 0}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-16 mb-8">
                    <button
                        type="submit"
                        disabled={isLoading || isRegistered}
                        className={`
                             px-12 py-3  rounded-lg text-white font-bold tracking-widest uppercase transition-all duration-300
                             ${isLoading || isRegistered
                                ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transform hover:scale-105'}
                         `} style={{ marginTop: '1rem', marginBottom: '4rem' }}
                    >
                        {isLoading ? 'Registering...' : (isRegistered ? 'Registered' : 'Register')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
