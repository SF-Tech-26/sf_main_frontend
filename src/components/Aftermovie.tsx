import { useEffect, useState } from "react";
import hero from "../assets/pic.png";
import logo from "../assets/logo.png";
import playBtn from "../assets/play.png";
import VideoModal from "./VideoModal";

export default function Aftermovie() {
  const [showTitle, setShowTitle] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // re-trigger type animation every mount
  useEffect(() => {
    setShowTitle(false);
    const t = setTimeout(() => setShowTitle(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-black text-white overflow-hidden">

      {/* ================= MOBILE FLOATING BADGE ================= */}
      <div
        className="absolute top-0 left-0 z-30
                   flex items-center gap-3
                   bg-black/90 px-3 py-2
                   animate-fade-up
                   md:hidden"
      >
        <img src={logo} className="w-9 h-9" />
        <span
          className="text-xs tracking-[0.28em]"
          style={{ fontFamily: "'Microsoft Yi Baiti'", fontWeight: 500 }}
        >
          66TH EDITION
        </span>
      </div>

      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="hidden md:flex h-screen">

        {/* LEFT TEXT */}
        <div className="w-[36%] pl-[140px] pt-[90px] flex flex-col z-10 bg-black">

          <p
            className="text-[14px] tracking-[1.6em] text-gray-300 mb-6 animate-fade-up"
            style={{ fontFamily: "'Space Grotesk'" }}
          >
            AFTERMOVIE
          </p>

          <div
            className="flex items-center gap-5 mb-3 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <img src={logo} className="w-18 h-20" />
            <span
              className="text-[22px] tracking-[0.22em] text-gray-200"
              style={{ fontFamily: "'Microsoft Yi Baiti'", fontWeight: 500 }}
            >
              66TH EDITION
            </span>
          </div>

          <h1
            className={`text-[60px] tracking-[0.1em] leading-[1.05] mb-8
                        origin-left
                        ${showTitle ? "animate-type-reveal" : "opacity-0"}`}
            style={{ fontFamily: "Impact" }}
          >
            SPRING FEST <br /> 2025
          </h1>

          <p
            className="text-[20px] tracking-[0.05em] text-gray-200 mb-6 animate-fade-up"
            style={{ fontFamily: "'Microsoft Yi Baiti'", fontWeight: 550 }}
          >
            #1 FEST IN ASIA
          </p>

          <p
            className="text-[20px] text-gray-300 max-w-[420px] leading-[1.8] mb-6 animate-fade-up"
            style={{ fontFamily: "'MV Boli'", animationDelay: "0.4s" }}
          >
            When the lights came alive, three nights turned into a world of sound,
            color, and moments that refused to fade.
          </p>

          <button
            onClick={() => setVideoOpen(true)}
            className="relative z-20
                      w-fit animate-fade-up
                      transition-transform duration-300
                      hover:scale-110 active:scale-95"
          >
            <img src={playBtn} className="h-[42px]" />
          </button>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex-1 overflow-hidden">
          <img
            src={hero}
            className="absolute inset-0 w-full h-full
                       object-cover object-[58%_50%]
                       scale-[1.05]
                       animate-image-reveal"
          />

          <div className="absolute inset-0 bg-black/25" />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0) 65%)",
            }}
          />
        </div>
      </div>

      {/* ================= MOBILE LAYOUT ================= */}
      <div className="md:hidden flex flex-col min-h-screen">

        {/* IMAGE TOP */}
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={hero}
            className="absolute inset-0 w-full h-full
                      object-cover object-[58%_50%]
                      scale-[1.05]
                      animate-image-reveal"
          />



          <div className="absolute inset-0 bg-black/25 pointer-events-none" />

          {/* BOTTOM FADE INTO TEXT */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 100%)",
            }}
          />


        </div>

        {/* TEXT BELOW IMAGE */}
        <div className="px-6 pb-10 bg-black">

          <p
            className="text-[12px] tracking-[1.4em] text-gray-300 mb-4 animate-fade-up"
            style={{ fontFamily: "'Space Grotesk'" }}
          >
            AFTERMOVIE
          </p>

          <h1
            className={`text-[44px] tracking-[0.08em] leading-[1.05] mb-4
                        ${showTitle ? "animate-type-reveal" : "opacity-0"}`}
            style={{ fontFamily: "Impact" }}
          >
            SPRING FEST <br /> 2025
          </h1>

          <p
            className="text-[16px] tracking-[0.05em] text-gray-200 mb-4 animate-fade-up"
            style={{ fontFamily: "'Microsoft Yi Baiti'", fontWeight: 550 }}
          >
            #1 FEST IN ASIA
          </p>

          <p
            className="text-[16px] text-gray-300 leading-[1.7] mb-6 animate-fade-up"
            style={{ fontFamily: "'MV Boli'" }}
          >
            When the lights came alive, three nights turned into a world of sound,
            color, and moments that refused to fade.
          </p>

          <button
            onClick={() => setVideoOpen(true)}
            className="relative z-20
                      w-fit animate-fade-up
                      transition-transform duration-300
                      hover:scale-110 active:scale-95"
          >
            <img src={playBtn} className="h-[42px]" />
          </button>

        </div>
      </div>

      {/* ================= VIDEO MODAL ================= */}
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  );
}
