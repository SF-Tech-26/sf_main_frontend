import React, { useState, useEffect } from 'react';
import axios from 'axios';

const genreAssets = {
  "Dance": {
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800",
    accent: "from-[#cfd4a2]/40"
  },
  "Music": {
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800",
    accent: "from-[#f3b27c]/40"
  },
  "Dramatics": {
    image: "https://images.unsplash.com/photo-1503073321235-ef4a1b320d37?auto=format&fit=crop&w=800",
    accent: "from-[#f0d38d]/40"
  },
  "Literary": {
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800",
    accent: "from-[#cfc9a6]/40"
  }
};

export default function SpringFestPortal() {
  const [genres, setGenres] = useState([]);
  const [activeGenreName, setActiveGenreName] = useState("Dance");
  const [eventIndex, setEventIndex] = useState(0); // Track which event in the genre is shown
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://masterapi.springfest.in/api/event');
        setGenres(response.data.data); //
      } catch (err) {
        console.error("API Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Logic to get data for the current view
  const activeGenreData = genres.find(g => g.genre === activeGenreName); //
  const eventsInGenre = activeGenreData?.events || []; //
  const displayEvent = eventsInGenre[eventIndex]; //
  const currentAsset = genreAssets[activeGenreName] || genreAssets["Dance"];

  // Reset event index when changing genre
  const handleGenreChange = (name) => {
    setActiveGenreName(name);
    setEventIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#1a1614] flex flex-col items-center justify-center p-6 font-serif text-[#d4af37]">
      
      {/* Header replaced with Dynamic Genre Name */}
      <header className="text-center mb-12">
        <h1 className="text-6xl tracking-[0.2em] font-light text-[#f0d38d] drop-shadow-[0_0_15px_rgba(240,211,141,0.3)] uppercase">
          {activeGenreName} {/* */}
        </h1>
        <p className="text-[10px] tracking-[0.4em] text-gray-500 mt-2 uppercase italic">
          Unveil the Arcane Gatherings
        </p>
      </header>

      <div className="flex w-full max-w-6xl gap-8">
        {/* Sidebar */}
        <nav className="flex flex-col gap-4">
          {genres.map((g) => (
            <button
              key={g.genre}
              onClick={() => handleGenreChange(g.genre)}
              className={`w-20 h-20 flex flex-col items-center justify-center border transition-all duration-500
                ${activeGenreName === g.genre 
                  ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                  : 'border-white/5 bg-transparent opacity-40 hover:opacity-100'}`}
            >
              <span className="text-[9px] tracking-[2px] font-bold uppercase">{g.genre.slice(0, 5)}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Card */}
        <div className="flex-1 bg-[#241f1d] border border-white/5 p-10 flex gap-12 relative overflow-hidden shadow-2xl min-h-[520px]">
          
          {loading ? (
            <div className="w-full flex items-center justify-center italic animate-pulse">Consulting the Archives...</div>
          ) : (
            <>
              {/* IMAGE SECTION */}
              <div className="w-[40%] h-[450px] relative z-10 border border-[#d4af37]/20 overflow-hidden">
                <img 
                  key={displayEvent?.id} // Forces re-animation on event change
                  src={currentAsset.image} 
                  className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 animate-in fade-in"
                  alt={activeGenreName}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${currentAsset.accent} to-transparent`}></div>
              </div>

              {/* TEXT SECTION */}
              <div className="w-[60%] flex flex-col justify-center z-10">
                <h2 className="text-4xl text-[#f0d38d] mb-2 tracking-tight leading-tight uppercase animate-in slide-in-from-top-2">
                  {displayEvent?.name} {/* */}
                </h2>
                <h4 className="text-[#d4af37] text-xs tracking-[4px] mb-6 opacity-80 italic">
                  {displayEvent?.tagline} {/* */}
                </h4>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-8 italic first-letter:text-5xl first-letter:text-[#d4af37] first-letter:float-left first-letter:mr-3 first-letter:font-bold">
                  {displayEvent?.writeup} {/* */}
                </p>
                
                {/* Registration & Info */}
                <div className="flex items-center gap-6 mt-auto">
                  <button className="border border-[#d4af37] px-8 py-3 text-[10px] tracking-[4px] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a1614] transition-all font-bold uppercase">
                    Register +
                  </button>
                  
                  {/* Event Index Dots (if multiple events exist) */}
                  <div className="flex gap-2">
                    {eventsInGenre.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setEventIndex(idx)}
                        className={`h-1.5 transition-all duration-300 ${eventIndex === idx ? 'w-8 bg-[#d4af37]' : 'w-2 bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}