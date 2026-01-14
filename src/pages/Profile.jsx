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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
      
      {/* Top Navigation Bar Area */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        {/* Close Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="text-white hover:text-gray-300 transition-colors text-2xl sm:text-3xl font-light w-10 h-10 flex items-center justify-center"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-300 text-sm whitespace-nowrap"
        >
          Logout
        </button>
      </div>

      {/* Profile Form Container */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="bg-black/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto border border-white/10 shadow-2xl">
          {/* Title */}
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white text-center mb-6 sm:mb-8"
            style={{ 
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            YOUR PROFILE
          </h1>

          {/* Profile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                Name
              </label>
              <p className="text-white text-base sm:text-lg font-bold break-words">
                {userData?.name || 'N/A'}
              </p>
            </div>

            {/* Email */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                Email
              </label>
              <p className="text-white text-base sm:text-lg font-bold break-words">
                {userData?.email || 'N/A'}
              </p>
            </div>

            {/* Mobile */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                Mobile
              </label>
              <p className="text-white text-base sm:text-lg font-bold">
                {userData?.mobile || 'N/A'}
              </p>
            </div>

            {/* SF ID */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                SF ID
              </label>
              <p className="text-white text-base sm:text-lg font-bold">
                {userData?.sfId || 'N/A'}
              </p>
            </div>

            {/* College */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                College
              </label>
              <p className="text-white text-base sm:text-lg font-bold break-words">
                {userData?.college || 'N/A'}
              </p>
            </div>

            {/* City */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                City
              </label>
              <p className="text-white text-base sm:text-lg font-bold">
                {userData?.city || 'N/A'}
              </p>
            </div>

            {/* Hall Alloted */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                Hall Alloted
              </label>
              <p className="text-white text-base sm:text-lg font-bold">
                {userData?.hall_alloted || 'No Hall Alloted'}
              </p>
            </div>

            {/* Gender */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                Gender
              </label>
              <p className="text-white text-base sm:text-lg font-bold">
                {userData?.gender === 'M' ? 'Male' : userData?.gender === 'F' ? 'Female' : userData?.gender === 'O' ? 'Other' : 'N/A'}
              </p>
            </div>

            {/* Payment Status */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                Payment Status
              </label>
              <p className={`text-base sm:text-lg font-bold ${
                userData?.payment_status === 1 ? 'text-green-400' :
                userData?.payment_status === 0 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {userData?.payment_status === 1 ? 'Completed' : userData?.payment_status === 0 ? 'Pending' : 'N/A'}
              </p>
            </div>

            {/* Campus Ambassador */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                Campus Ambassador
              </label>
              <p className={`text-base sm:text-lg font-bold ${
                userData?.is_ca === 1 ? 'text-green-400' : 'text-gray-400'
              }`}>
                {userData?.is_ca === 1 ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;