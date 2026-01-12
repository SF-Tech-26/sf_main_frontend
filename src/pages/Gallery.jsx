import { useState } from "react";

/* Background */
import bgImage from "../assets/gallery_bg.webp";

/* Images */
import p1 from "../assets/p1.Webp";
import p2 from "../assets/p2.Webp";
import p3 from "../assets/p3.Webp";
import p4 from "../assets/p4.Webp";
import p5 from "../assets/p5.Webp";
import p6 from "../assets/p6.Webp";

import e1 from "../assets/e1.Webp";
import e2 from "../assets/e2.Webp";
import e3 from "../assets/e3.Webp";
import e4 from "../assets/e4.Webp";
import e5 from "../assets/e5.Webp";
import e6 from "../assets/e6.Webp";

import a1 from "../assets/a1.Webp";
import a2 from "../assets/a2.Webp";
import a3 from "../assets/a3.Webp";
import a4 from "../assets/a4.Webp";
import a5 from "../assets/a5.Webp";
import a6 from "../assets/a6.Webp";

import s1 from "../assets/s1.Webp";
import s2 from "../assets/s2.Webp";
import s3 from "../assets/s3.Webp";
import s4 from "../assets/s4.Webp";
import s5 from "../assets/s5.Webp";
import s6 from "../assets/s6.Webp";

const allImages = [
  p1, p2, p3, p4, p5, p6,
  s1, s2, s3, s4, s5, s6,
  a1, a2, a3, a4, a5, a6,
  e1, e2, e3, e4, e5, e6,
];

const ImageCard = ({ img, onClick }) => (
  <div
    className="group relative flex-shrink-0
      w-[260px] h-[200px]
      sm:w-[220px] sm:h-[165px]
      md:w-[280px] md:h-[215px]
      lg:w-[300px] lg:h-[230px]
      xl:w-[320px] xl:h-[240px]
      overflow-hidden skew-x-[-12deg]"
    onClick={onClick}
  >
    <img
      src={img}
      alt=""
      className="w-full h-full object-cover cursor-pointer
                 transition-transform duration-500
                 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
  </div>
);

const Gallery = () => {
  const [paused, setPaused] = useState(false);

  /* ROWS */
  const mobileRows = [
    allImages.slice(0, 8),
    allImages.slice(8, 16),
    allImages.slice(16, 24),
  ];

  const tabletRows = mobileRows;

  const desktopRows = [
    allImages.slice(0, 12),
    allImages.slice(12, 24),
  ];

  /* Toggle animation */
  const togglePause = () => setPaused((p) => !p);

  /* Animation style */
  const animStyle = {
    animationPlayState: paused ? "paused" : "running",
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#070112] overflow-hidden flex flex-col"
      onClick={togglePause}
    >
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-700/30 blur-[200px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-indigo-600/30 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-25vh] left-[30vw] w-[40vw] h-[40vh] bg-pink-500/20 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">

        {/* TITLE */}
        <div className="pt-10 pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-[0.3em] text-white text-center font-light">
            KINETIC MEMORIES
          </h1>
        </div>

        {/* GALLERY */}
        <div className="flex-1 flex flex-col justify-center">

          {/* MOBILE */}
          <div className="flex flex-col gap-y-4 sm:hidden">
            {mobileRows.map((row, index) => (
              <div className="overflow-hidden" key={index}>
                <div
                  style={animStyle}
                  className={`flex gap-3 w-max ${
                    index % 2 === 0
                      ? "animate-left-mobile"
                      : "animate-right-mobile"
                  }`}
                >
                  {[...row, ...row, ...row].map((img, i) => (
                    <ImageCard key={i} img={img} onClick={togglePause} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* TABLET */}
          <div className="hidden sm:flex lg:hidden flex-col gap-y-5">
            {tabletRows.map((row, index) => (
              <div className="overflow-hidden" key={index}>
                <div
                  style={animStyle}
                  className={`flex gap-4 w-max ${
                    index % 2 === 0
                      ? "animate-left-tablet"
                      : "animate-right-tablet"
                  }`}
                >
                  {[...row, ...row, ...row].map((img, i) => (
                    <ImageCard key={i} img={img} onClick={togglePause} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP */}
          <div className="hidden lg:flex flex-col gap-y-8">
            {desktopRows.map((row, index) => (
              <div className="overflow-hidden" key={index}>
                <div
                  style={animStyle}
                  className={`flex gap-5 w-max ${
                    index % 2 === 0
                      ? "animate-left-desktop"
                      : "animate-right-desktop"
                  }`}
                >
                  {[...row, ...row, ...row].map((img, i) => (
                    <ImageCard key={i} img={img} onClick={togglePause} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="pb-8">
          <p className="text-center text-xs sm:text-sm text-white/50 tracking-widest uppercase">
            Tap anywhere to {paused ? "resume" : "pause"}
          </p>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes left {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes right {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }

        .animate-left-mobile { animation: left 35s linear infinite; }
        .animate-right-mobile { animation: right 35s linear infinite; }

        .animate-left-tablet { animation: left 45s linear infinite; }
        .animate-right-tablet { animation: right 45s linear infinite; }

        .animate-left-desktop { animation: left 55s linear infinite; }
        .animate-right-desktop { animation: right 55s linear infinite; }
      `}</style>
    </div>
  );
};

export default Gallery;