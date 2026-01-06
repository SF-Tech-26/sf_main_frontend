import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/authContext';
import { registerForEvent } from '../../services/eventService';

const RegistrationForm = ({ event, onSuccess, onCancel }) => {
    const { token, user } = useAuth();
    const [teamMembers, setTeamMembers] = useState([
        { email: user?.email || '', sfId: user?.sfId || '' }
    ]);
    const [eventCity, setEventCity] = useState('KGP');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isSolo = event.min_participation === 1 && event.max_participation === 1;
    const canAddMore = teamMembers.length < event.max_participation;
    const canRemove = teamMembers.length > event.min_participation;

    const handleAddMember = () => {
        if (canAddMore) {
            setTeamMembers([...teamMembers, { email: '', sfId: '' }]);
        }
    };

    const handleRemoveMember = (index) => {
        if (canRemove && index !== 0) {
            setTeamMembers(teamMembers.filter((_, i) => i !== index));
        }
    };

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

            await registerForEvent(token, event.id, eventCity, teamMembers);
            onSuccess?.();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Event City</label>
                <select
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-purple-500/50 text-white focus:outline-none focus:border-purple-400"
                >
                    <option value="KGP">IIT Kharagpur</option>
                </select>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">
                        Team Members ({teamMembers.length}/{event.max_participation})
                    </label>
                    {!isSolo && canAddMore && (
                        <button
                            type="button"
                            onClick={handleAddMember}
                            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                            <span className="material-icons text-sm">add</span>
                            Add
                        </button>
                    )}
                </div>

                {teamMembers.map((member, index) => (
                    <motion.div
                        key={index}
                        className="flex gap-2 items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="SF ID (e.g., SF0001)"
                                value={member.sfId}
                                onChange={(e) => handleMemberChange(index, 'sfId', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-sm"
                                disabled={index === 0}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={member.email}
                                onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-sm"
                                disabled={index === 0}
                            />
                        </div>
                        {!isSolo && canRemove && index !== 0 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveMember(index)}
                                className="p-2 text-red-400 hover:text-red-300"
                            >
                                <span className="material-icons text-sm">close</span>
                            </button>
                        )}
                        {index === 0 && (
                            <span className="p-2 text-purple-400 text-xs">(You)</span>
                        )}
                    </motion.div>
                ))}
            </div>

            {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 px-4 rounded-lg border border-slate-600 text-slate-300 hover:bg-white/5 transition-colors text-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors disabled:opacity-50 text-sm"
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </div>
        </motion.form>
    );
};

export default RegistrationForm;
