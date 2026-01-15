import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getUser } from '../services/eventService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No authentication token found');
        navigate('/signin');
        return;
      }

      const response = await getUser(token);

      if (response && response.code === 0 && response.data) {
        setUserData(response.data);
        console.log('User data set:', response.data);
      } else {
        toast.error(response?.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleBackdropClick = (e) => {
    // Only navigate if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0f1e]/95 via-[#050b14]/95 to-[#0a0f1e]/95 backdrop-blur-xl flex justify-center items-center z-50 p-2 sm:p-4" onClick={handleBackdropClick}>
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />

      {/* Logout Button - Outside Modal, Top Right */}
      <button
        onClick={handleLogout}
        className="fixed top-3 right-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-1 px-4 sm:px-6 rounded-lg transition-all duration-300 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] text-sm z-[60]"
      >
        Logout
      </button>

      <div className="relative w-full max-w-6xl max-h-[60vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
        {/* Cosmic Background */}
        <div className="relative flex-1 flex flex-col bg-gradient-to-br from-[#0a0f1e] via-[#050b14] to-[#0a0f1e] rounded-[2rem] border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-2 h-2 bg-white rounded-full top-[10%] left-[15%] animate-[twinkle_2s_infinite] shadow-[0_0_8px_white]" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[60%] left-[20%] animate-[twinkle_2.5s_infinite]" />
            <div className="absolute w-1 h-1 bg-white/90 rounded-full top-[35%] left-[50%] animate-[twinkle_3.5s_infinite]" />
            <div className="absolute w-2 h-2 bg-white rounded-full top-[80%] right-[15%] animate-[twinkle_2.8s_infinite]" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[25%] right-[30%] animate-[twinkle_3s_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 animate-[nebula_10s_infinite]" />
          </div>

          {/* Top Bar with Close Button */}
          <div className="relative z-10 flex items-center justify-end p-4 border-b border-cyan-500/20">
            {/* Close Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="text-cyan-400 text-2xl font-bold hover:text-cyan-300 transition"
            >
              ✕
            </button>
          </div>

          {/* Content Container - Scrollable */}
          <div className="relative z-10 p-4 sm:p-8 flex flex-col overflow-y-auto custom-scrollbar flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 tracking-wide drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]">
              YOUR PROFILE
            </h1>

            {loading ? (
              <div className="text-cyan-400 text-center py-12 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg tracking-widest animate-pulse">LOADING...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Name */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    Name
                  </label>
                  <p className="text-white text-base sm:text-lg font-bold break-words">
                    {userData?.name || 'N/A'}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    Email
                  </label>
                  <p className="text-white text-base sm:text-lg font-bold break-words">
                    {userData?.email || 'N/A'}
                  </p>
                </div>

                {/* Mobile */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    Mobile
                  </label>
                  <p className="text-white text-base sm:text-lg font-bold">
                    {userData?.mobile || 'N/A'}
                  </p>
                </div>

                {/* SF ID */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    SF ID
                  </label>
                  <p className="text-white text-base sm:text-lg font-bold">
                    {userData?.sfId || 'N/A'}
                  </p>
                </div>

                {/* College */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    College
                  </label>
                  <p className="text-white text-base sm:text-lg font-bold break-words">
                    {userData?.college || 'N/A'}
                  </p>
                </div>

                {/* City */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    City
                  </label>
                  <p className="text-white text-base sm:text-lg font-bold">
                    {userData?.city || 'N/A'}
                  </p>
                </div>

                {/* Hall Alloted */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    Hall Alloted
                  </label>
                  <p className="text-white text-base sm:text-lg font-bold">
                    {userData?.hall_alloted || 'No Hall Alloted'}
                  </p>
                </div>

                {/* Gender */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    Gender
                  </label>
                  <p className="text-white text-base sm:text-lg font-bold">
                    {userData?.gender === 'M' ? 'Male' : userData?.gender === 'F' ? 'Female' : userData?.gender === 'O' ? 'Other' : 'N/A'}
                  </p>
                </div>

                {/* Payment Status */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    Payment Status
                  </label>
                  <p className={`text-base sm:text-lg font-bold ${userData?.payment_status === 1 ? 'text-green-400' :
                      userData?.payment_status === 0 ? 'text-yellow-400' :
                        'text-red-400'
                    }`}>
                    {userData?.payment_status === 1 ? 'Completed' : userData?.payment_status === 0 ? 'Pending' : 'N/A'}
                  </p>
                </div>

                {/* Campus Ambassador */}
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                  <label className="block text-cyan-400/70 text-xs uppercase tracking-wider mb-2 font-semibold">
                    Campus Ambassador
                  </label>
                  <p className={`text-base sm:text-lg font-bold ${userData?.is_ca === 1 ? 'text-green-400' : 'text-gray-400'
                    }`}>
                    {userData?.is_ca === 1 ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 text-center border-t border-cyan-500/10 pt-4">
              <p className="text-cyan-500/40 text-[10px] tracking-[0.4em] font-bold uppercase">
                
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes nebula { 0%, 100% { opacity: 0.2; transform: translate(0,0); } 50% { opacity: 0.4; transform: translate(20px, -20px); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0891b2; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Profile;