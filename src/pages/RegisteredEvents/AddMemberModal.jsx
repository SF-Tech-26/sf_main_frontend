import React, { useState } from "react";
import { UserPlus, X, Sparkles, Wand2 } from "lucide-react";

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
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!memberData.email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!memberData.sfId.trim()) {
      setError("SF ID is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!memberData.sfId.toUpperCase().startsWith("SF")) {
      setError("SF ID should start with 'SF' (e.g., SF000001)");
      return;
    }

    onSubmit(memberData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[70] p-4">
      <div className="bg-[#050b14] border-2 border-blue-500/40 rounded-3xl p-6 sm:p-10 max-w-md w-full relative shadow-[0_0_60px_rgba(30,58,138,0.4)] overflow-hidden">
        {/* Glow Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[80px]"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-300/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-blue-900/30 border border-blue-500/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Wand2 className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase flex items-center justify-center gap-2">
            Add Member 
            <Sparkles className="w-5 h-5 text-blue-400" />
          </h2>
          <p className="text-blue-300/60 text-sm mt-2">
            
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={memberData.email}
              onChange={handleInputChange}
              placeholder="member@example.com"
              className="w-full px-4 py-3 bg-black/50 border border-blue-900 focus:border-cyan-500 rounded-xl text-white outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 ml-1">
              SF ID
            </label>
            <input
              type="text"
              name="sfId"
              value={memberData.sfId}
              onChange={handleInputChange}
              placeholder="SF000001"
              className="w-full px-4 py-3 bg-black/50 border border-blue-900 focus:border-cyan-500 rounded-xl text-white outline-none transition-all uppercase"
              required
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-3 text-red-200 text-xs text-center font-bold animate-pulse">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-black shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
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