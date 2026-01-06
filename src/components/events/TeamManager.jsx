import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/authContext';
import { getMembers, addMember, deregisterMember, deregisterTeam } from '../../services/eventService';

const TeamManager = ({ eventId, isAdmin, onUpdate }) => {
    const { token, user } = useAuth();
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMember, setNewMember] = useState({ email: '', sfId: '' });
    const [actionLoading, setActionLoading] = useState(null);

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const response = await getMembers(token, eventId);
            setMembers(response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch team members');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [eventId, token]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!newMember.email || !newMember.sfId) return;

        setActionLoading('add');
        try {
            await addMember(token, eventId, [newMember]);
            setNewMember({ email: '', sfId: '' });
            setShowAddForm(false);
            fetchMembers();
            onUpdate?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add member');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemoveMember = async (member) => {
        if (!isAdmin) return;

        setActionLoading(member.sfId);
        try {
            await deregisterMember(token, eventId, [{ email: member.email, sfId: member.sfId }]);
            fetchMembers();
            onUpdate?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove member');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeregisterTeam = async () => {
        if (!confirm('Are you sure you want to deregister the entire team?')) return;

        setActionLoading('team');
        try {
            await deregisterTeam(token, eventId);
            onUpdate?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to deregister team');
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-purple-400 text-sm">Team Members ({members.length})</h4>
                {isAdmin && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                        <span className="material-icons text-sm">{showAddForm ? 'close' : 'add'}</span>
                        {showAddForm ? 'Cancel' : 'Add'}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.form
                        onSubmit={handleAddMember}
                        className="p-3 bg-black/30 rounded-lg border border-purple-500/30 space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <input
                            type="text"
                            placeholder="SF ID"
                            value={newMember.sfId}
                            onChange={(e) => setNewMember({ ...newMember, sfId: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-black/40 border border-slate-600 text-white text-sm"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-black/40 border border-slate-600 text-white text-sm"
                        />
                        <button
                            type="submit"
                            disabled={actionLoading === 'add'}
                            className="w-full py-2 bg-purple-600 text-white font-bold rounded text-sm hover:bg-purple-500 disabled:opacity-50"
                        >
                            {actionLoading === 'add' ? 'Adding...' : 'Add to Team'}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {error && (
                <div className="p-2 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-xs">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                {members.map((member, index) => (
                    <motion.div
                        key={member.sfId || index}
                        className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div>
                            <p className="font-medium text-white text-sm">{member.name || member.sfId}</p>
                            <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {member.sfId === user?.sfId && (
                                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">You</span>
                            )}
                            {isAdmin && member.sfId !== user?.sfId && (
                                <button
                                    onClick={() => handleRemoveMember(member)}
                                    disabled={actionLoading === member.sfId}
                                    className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
                                >
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {isAdmin && members.length > 0 && (
                <button
                    onClick={handleDeregisterTeam}
                    disabled={actionLoading === 'team'}
                    className="w-full py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs"
                >
                    {actionLoading === 'team' ? 'Deregistering...' : 'Deregister Entire Team'}
                </button>
            )}
        </div>
    );
};

export default TeamManager;
