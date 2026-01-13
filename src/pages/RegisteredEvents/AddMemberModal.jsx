import React, { useState } from "react";

const AddMemberModal = ({ onClose, onSubmit }) => {
  const [sfId, setSfId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sfId.trim()) {
      onSubmit(sfId.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/20 p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition"
        >
          <span className="material-icons">close</span>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Add Team Member</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spring Fest ID
            </label>
            <input
              type="text"
              value={sfId}
              onChange={(e) => setSfId(e.target.value)}
              placeholder="SF ID (e.g. SF012345)"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!sfId.trim()}
              className="flex-1 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;