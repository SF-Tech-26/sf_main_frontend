import { useEffect, useState } from "react";
import logo from "../assets/logo.webp";

export default function AftermoviePage() {
    const [showTitle, setShowTitle] = useState(false);
    const [activeYear, setActiveYear] = useState("2025");

    const videoLinks = {
        "2023": "https://www.youtube.com/embed/QfM0xUC0Xng",
        "2025": "https://www.youtube.com/embed/zQKl8S2yNoM"
    };

    // re-trigger type animation every mount
    useEffect(() => {
        setShowTitle(false);
        const t = setTimeout(() => setShowTitle(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="relative min-h-screen w-full bg-black text-white overflow-hidden">

            {/* ================= MOBILE FLOATING BADGE ================= */}

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

                    <div className="flex gap-2 mb-3">
                        <button
                            onClick={() => setActiveYear("2023")}
                            className={`px-4 py-1.5 text-sm tracking-wider transition-all duration-300 ${
                                activeYear === "2023"
                                    ? "bg-white text-black"
                                    : "bg-transparent text-gray-400 border border-gray-600 hover:border-gray-400"
                            }`}
                            style={{ fontFamily: "'Space Grotesk'" }}
                        >
                            2023
                        </button>
                        <button
                            onClick={() => setActiveYear("2025")}
                            className={`px-4 py-1.5 text-sm tracking-wider transition-all duration-300 ${
                                activeYear === "2025"
                                    ? "bg-white text-black"
                                    : "bg-transparent text-gray-400 border border-gray-600 hover:border-gray-400"
                            }`}
                            style={{ fontFamily: "'Space Grotesk'" }}
                        >
                            2025
                        </button>
                    </div>

                    <div
                        className="flex items-center gap-6 mb-3 animate-fade-up"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <img src={logo} className="w-24 h-28 object-contain" />
                        <span
                            className="text-[28px] tracking-[0.22em] text-gray-200"
                            style={{ fontFamily: "'Microsoft Yi Baiti'", fontWeight: 500 }}
                        >
                            66TH EDITION
                        </span>
                    </div>

                    <h1
                        className="text-[60px] tracking-[0.1em] leading-[1.05] mb-8"
                        style={{ fontFamily: "Impact" }}
                    >
                        <span
                            className={`inline-block overflow-hidden whitespace-nowrap
                          ${showTitle ? "animate-type-reveal" : "opacity-0"}`}
                        >
                            SPRING FEST <br /> 2025
                        </span>
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

                </div>

                {/* RIGHT VIDEO */}
                <div className="relative flex-1 overflow-hidden h-full">
                    <iframe
                        key={activeYear}
                        className="w-full h-full object-cover"
                        src={`${videoLinks[activeYear]}?autoplay=1&mute=1&loop=1&playlist=${videoLinks[activeYear].split('/').pop()}&controls=0&showinfo=0&rel=0`}
                        title="Aftermovie"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>

                    {/* Gradient Overlay - Desktop (Left Fade) */}
                    <div
                        className="absolute top-0 left-0 w-[40%] h-full pointer-events-none"
                        style={{ background: 'linear-gradient(to right, #000000 0%, transparent 100%)' }}
                    />
                </div>
            </div>

            {/* ================= MOBILE LAYOUT ================= */}
            <div className="md:hidden flex flex-col min-h-screen">

                {/* VIDEO TOP */}
                <div className="relative h-[60vh] overflow-hidden">
                    <iframe
                        key={activeYear}
                        className="w-full h-full object-cover"
                        src={`${videoLinks[activeYear]}?autoplay=1&mute=1&loop=1&playlist=${videoLinks[activeYear].split('/').pop()}&controls=0&showinfo=0&rel=0`}
                        title="Aftermovie"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>

                    {/* Gradient Overlay - Mobile (Bottom Fade) */}
                    <div
                        className="absolute bottom-0 left-0 w-full h-[40%] pointer-events-none"
                        style={{ background: 'linear-gradient(to top, #000000 10%, rgba(0,0,0,0.8) 50%, transparent 100%)' }}
                    />
                </div>

                <div className="flex gap-2 px-3 py-2 bg-black/90 md:hidden">
                    <button
                        onClick={() => setActiveYear("2023")}
                        className={`px-3 py-1 text-[10px] tracking-wider transition-all duration-300 ${
                            activeYear === "2023"
                                ? "bg-white text-black"
                                : "bg-transparent text-gray-400 border border-gray-600"
                        }`}
                        style={{ fontFamily: "'Space Grotesk'" }}
                    >
                        2023
                    </button>
                    <button
                        onClick={() => setActiveYear("2025")}
                        className={`px-3 py-1 text-[10px] tracking-wider transition-all duration-300 ${
                            activeYear === "2025"
                                ? "bg-white text-black"
                                : "bg-transparent text-gray-400 border border-gray-600"
                        }`}
                        style={{ fontFamily: "'Space Grotesk'" }}
                    >
                        2025
                    </button>
                </div>

                <div
                className="z-30
                   flex items-center gap-3
                   bg-black/90 px-3 py-2
                   animate-fade-up
                   md:hidden mb-[10px]"
            >
                <img src={logo} className="w-9 h-9" />
                <span
                    className="text-xs tracking-[0.28em]"
                    style={{ fontFamily: "'Microsoft Yi Baiti'", fontWeight: 500 }}
                >
                    66TH EDITION
                </span>
            </div>

                {/* TEXT BELOW IMAGE */}
                <div className="px-6 pb-10 bg-black flex-1">

                    <p
                        className="text-[12px] tracking-[1.4em] text-gray-300 mb-4 animate-fade-up"
                        style={{ fontFamily: "'Space Grotesk'" }}
                    >
                        AFTERMOVIE
                    </p>

                    <h1
                        className="text-[44px] tracking-[0.08em] leading-[1.05] mb-4"
                        style={{ fontFamily: "Impact" }}
                    >
                        <span
                            className={`inline-block overflow-hidden whitespace-nowrap
                          ${showTitle ? "animate-type-reveal" : "opacity-0"}`}
                        >
                            SPRING FEST <br /> 2025
                        </span>
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

                </div>
            </div>
        </section>
    );
}