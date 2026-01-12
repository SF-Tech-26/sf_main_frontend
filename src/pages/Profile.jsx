import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-black/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-4xl border border-white/10 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-white hover:text-gray-300 transition-colors text-2xl sm:text-3xl font-light w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center z-10"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-6 sm:mb-8 md:mb-12 tracking-wider pr-8 sm:pr-0"
          style={{ 
            fontFamily: 'Impact, Arial Black, sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          YOUR PROFILE
        </h1>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Name */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              Name
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold break-words">
              {user?.name || 'N/A'}
            </p>
          </div>

          {/* Email */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              Email
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold break-words">
              {user?.email || 'N/A'}
            </p>
          </div>

          {/* Mobile */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              Mobile
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold">
              {user?.mobile || 'N/A'}
            </p>
          </div>

          {/* Date of Birth */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              Date of Birth
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold">
              {user?.dob || 'N/A'}
            </p>
          </div>

          {/* College */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              College
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold break-words">
              {user?.college || 'N/A'}
            </p>
          </div>

          {/* City */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              City
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold">
              {user?.city || 'N/A'}
            </p>
          </div>

          {/* State */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              State
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold">
              {user?.state || 'N/A'}
            </p>
          </div>

          {/* Gender */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              Gender
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold">
              {user?.gender === 'M' ? 'Male' : user?.gender === 'F' ? 'Female' : user?.gender === 'O' ? 'Other' : 'N/A'}
            </p>
          </div>

          {/* Year of Passing */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              Year of Passing
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold">
              {user?.yop || 'N/A'}
            </p>
          </div>

          {/* Address - Spans full width on mobile, 2 columns on larger screens */}
          <div className="bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5 sm:col-span-2">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1 sm:mb-2 font-semibold">
              Address
            </label>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold break-words">
              {user?.addr || 'N/A'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;