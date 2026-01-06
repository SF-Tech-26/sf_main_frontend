import React, { useState } from 'react';

const cards = [
  { id: 1, title: 'DANCE', sub: 'Rhythm of the cosmos', roman: 'I', color: 'from-green-200 to-emerald-900' },
  { id: 2, title: 'DRAMATICS', sub: 'Unveiling ancient tales', roman: 'II', color: 'from-yellow-200 to-amber-900' },
  { id: 3, title: 'HUMOUR', sub: 'Zero-gravity laughs', roman: 'III', color: 'from-orange-300 to-orange-950' },
  { id: 4, title: 'MYSTERY', sub: 'The silent echo', roman: 'IV', color: 'from-gray-400 to-slate-900' },
  { id: 5, title: 'ECHOES', sub: 'Voices from beyond', roman: 'V', color: 'from-blue-300 to-indigo-950' },
  { id: 6, title: 'REVELRY', sub: 'Celestial celebration', roman: 'VI', color: 'from-yellow-400 to-yellow-900' },
  { id: 7, title: 'TRANCE', sub: 'Deep space dreams', roman: 'VII', color: 'from-orange-200 to-orange-800' },
  { id: 8, title: 'VIBES', sub: 'Harmonic resonance', roman: 'VIII', color: 'from-orange-400 to-red-950' },
];

const MusicGallery = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-6 font-serif overflow-hidden">
      {/* Header Section */}
      <header className="text-center mb-12 mt-8">
        <h2 className="text-sm tracking-[0.3em] text-purple-400 uppercase opacity-70">Ethereal Enigma</h2>
        <h1 className="text-6xl md:text-8xl tracking-widest font-light text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          MUSIC
        </h1>
        <p className="mt-4 text-xs tracking-widest uppercase opacity-60">
          {hoveredIndex !== null ? "Harmonies From The Void" : "Select a card to reveal the unknown"}
        </p>
      </header>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto flex justify-center items-center">
        
        {/* MOBILE & TABLET VIEW: Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden w-full max-w-md sm:max-w-2xl">
          {cards.map((card) => (
            <div 
              key={card.id}
              className={`relative aspect-[3/4] rounded-2xl p-6 bg-gradient-to-b ${card.color} shadow-2xl flex flex-col justify-end border border-white/10`}
            >
              <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] tracking-widest border border-white/20">
                REGISTER
              </button>
              <h3 className="text-2xl font-medium tracking-wide">{card.title}</h3>
              <p className="text-xs opacity-80">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: Fan Animation */}
        <div className="hidden lg:flex relative h-[500px] w-full items-center justify-center pt-20">
          {cards.map((card, index) => {
            // Logic for the fan rotation
            const rotation = (index - (cards.length - 1) / 2) * 8;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  absolute w-64 h-96 rounded-2xl p-6 transition-all duration-500 ease-out cursor-pointer
                  bg-gradient-to-b ${card.color} border border-white/20 shadow-2xl
                  ${isHovered ? 'z-50 -translate-y-20 scale-110' : 'z-10'}
                `}
                style={{
                  transform: isHovered 
                    ? `translateY(-80px) scale(1.1)` 
                    : `rotate(${rotation}deg) translateX(${(index - 3.5) * 40}px)`,
                  transformOrigin: 'bottom center',
                  zIndex: isHovered ? 100 : index
                }}
              >
                <span className="absolute top-4 left-4 text-[10px] font-mono opacity-50 bg-black/20 px-2 py-1 rounded">
                  {card.roman}
                </span>
                
                <div className={`mt-auto h-full flex flex-col justify-end transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                   <h3 className="text-2xl font-bold tracking-tighter">{card.title}</h3>
                   <p className="text-[10px] uppercase tracking-widest opacity-80">{card.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="fixed bottom-8 right-8">
        <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center border border-yellow-400/50">
          <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_10px_#facc15]"></div>
        </div>
      </div>
    </div>
  );
};

export default MusicGallery;