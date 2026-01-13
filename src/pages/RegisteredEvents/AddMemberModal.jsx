// src/pages/RegisteredEvents/AddMemberModal.jsx

import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";

const AddMemberModal = ({ onClose, onSubmit }) => {
  const [memberData, setMemberData] = useState({
    email: "",
    sfId: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!memberData.email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!memberData.sfId.trim()) {
      setError("SF ID is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // SF ID format validation (should start with SF)
    if (!memberData.sfId.toUpperCase().startsWith("SF")) {
      setError("SF ID should start with 'SF' (e.g., SF000001)");
      return;
    }

    onSubmit(memberData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 rounded-3xl border-2 border-white/30 p-8 max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Add Team Member</h2>
          <p className="text-gray-300 text-sm">
            Enter the member's details to add them to your team
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={memberData.email}
              onChange={handleInputChange}
              placeholder="member@example.com"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-all"
              required
            />
          </div>

          {/* SF ID Input */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">
              SF ID
            </label>
            <input
              type="text"
              name="sfId"
              value={memberData.sfId}
              onChange={handleInputChange}
              placeholder="SF000001"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-all uppercase"
              required
            />
            <p className="text-gray-400 text-xs mt-1">
              Format: SF followed by numbers (e.g., SF000001)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;