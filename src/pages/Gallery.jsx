 import { useState } from "react";

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


// Mock images - replace with your actual imports

  const allImages = [
    p1, p2, p3, p4, p5, p6, s1, s2, s3, s4, s5, s6, a1, a2, a3, a4, a5, a6, e1, e2, e3, e4, e5, e6
  ];

const ImageCard = ({ img, onClick }) => (
  <div className="group relative flex-shrink-0 w-[250px] h-[200px] sm:w-[220px] sm:h-[165px] md:w-[280px] md:h-[215px] lg:w-[300px] lg:h-[230px] xl:w-[320px] xl:h-[240px] overflow-hidden skew-x-[-12deg]">
    <img
      src={img}
      alt=""
      onClick={() => onClick(img)}
      className="w-full h-full object-cover bg-black cursor-pointer transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
  </div>
);

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Mobile: 4 rows (6 images each) - fills screen better
  const mobileRows = [
    allImages.slice(0, 6),
    allImages.slice(6, 12),
    allImages.slice(12, 18),
    allImages.slice(18, 24),
  ];

  // Tablet: 3 rows (8 images each)
  const tabletRows = [
    allImages.slice(0, 8),
    allImages.slice(8, 16),
    allImages.slice(16, 24),
  ];

  // Desktop: 2 rows (12 images each)
  const desktopRows = [
    allImages.slice(0, 12),
    allImages.slice(12, 24),
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#070112] overflow-hidden flex flex-col">
      {/* Background glows */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20vh] left-[-20vw] w-[60vw] h-[60vh] bg-purple-700/30 blur-[200px] animate-pulse"></div>
        <div className="absolute top-[50vh] right-[-25vw] w-[50vw] h-[50vh] bg-indigo-600/30 blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-25vh] left-[30vw] w-[40vw] h-[40vh] bg-pink-500/20 blur-[150px] animate-pulse"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-6 md:pb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.3em] text-white text-center font-light">
            KINETIC MEMORIES
          </h1>
        </div>

        {/* Gallery Container - fills remaining space */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Mobile: 4 rows */}
          <div className="flex flex-col gap-y-4 sm:hidden">
            {mobileRows.map((row, index) => (
              <div className="overflow-hidden" key={`mobile-row-${index}`}>
                <div
                  className={`flex gap-3 w-max ${
                    index % 2 === 0 ? "animate-marquee-left-mobile" : "animate-marquee-right-mobile"
                  }`}
                >
                  {[...row, ...row, ...row, ...row].map((img, i) => (
                    <ImageCard key={`m-${index}-${i}`} img={img} onClick={setSelectedImage} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tablet: 3 rows */}
          <div className="hidden sm:flex lg:hidden flex-col gap-y-5">
            {tabletRows.map((row, index) => (
              <div className="overflow-hidden" key={`tablet-row-${index}`}>
                <div
                  className={`flex gap-4 w-max ${
                    index % 2 === 0 ? "animate-marquee-left-tablet" : "animate-marquee-right-tablet"
                  }`}
                >
                  {[...row, ...row, ...row].map((img, i) => (
                    <ImageCard key={`t-${index}-${i}`} img={img} onClick={setSelectedImage} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: 2 rows */}
          <div className="hidden lg:flex flex-col gap-y-6 lg:gap-y-8">
            {desktopRows.map((row, index) => (
              <div className="overflow-hidden" key={`desktop-row-${index}`}>
                <div
                  className={`flex gap-4 lg:gap-5 w-max ${
                    index % 2 === 0 ? "animate-marquee-left-desktop" : "animate-marquee-right-desktop"
                  }`}
                >
                  {[...row, ...row, ...row].map((img, i) => (
                    <ImageCard key={`d-${index}-${i}`} img={img} onClick={setSelectedImage} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer text */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-10">
          <p className="text-center text-xs sm:text-sm text-white/50 tracking-widest uppercase">
            Relive the unforgettable fest moments
          </p>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white text-5xl font-light hover:text-gray-400 transition-colors" 
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img 
              src={selectedImage} 
              alt="" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes marqueeLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          @keyframes marqueeRight {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }
          
          /* Mobile - 4 rows with 6 images, faster speed */
          .animate-marquee-left-mobile {
            animation: marqueeLeft 35s linear infinite;
          }
          .animate-marquee-right-mobile {
            animation: marqueeRight 35s linear infinite;
          }
          
          /* Tablet - 3 rows with 8 images */
          .animate-marquee-left-tablet {
            animation: marqueeLeft 45s linear infinite;
          }
          .animate-marquee-right-tablet {
            animation: marqueeRight 45s linear infinite;
          }
          
          /* Desktop - 2 rows with 12 images, slower for smoothness */
          .animate-marquee-left-desktop {
            animation: marqueeLeft 55s linear infinite;
          }
          .animate-marquee-right-desktop {
            animation: marqueeRight 55s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Gallery;