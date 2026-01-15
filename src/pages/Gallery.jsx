import { useState, useEffect } from "react";
import DomeGallery from "../components/DomeGallery";

/* Background */
import bgImage from "../assets/gallerybg.webp";

const allImagesMapped = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,Webp}', { eager: true, import: 'default' });
const allImages = Object.entries(allImagesMapped)
    .filter(([path]) => {
        const filename = path.split('/').pop();
        // Match files like a1.Webp, p2.png, etc.
        return /^[aeps]\d\./i.test(filename);
    })
    .map(([, module]) => module);

const domeImages = allImages.map(img => ({ src: img, alt: "Spring Fest Memory" }));

const Gallery = () => {
    const [winSize, setWinSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 1200
    });

    useEffect(() => {
        const handleResize = () => setWinSize({ width: window.innerWidth });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = winSize.width < 640;
    const isTablet = winSize.width >= 640 && winSize.width < 1024;

    const galleryConfig = {
        minRadius: isMobile ? 380 : isTablet ? 580 : 750,
        segments: isMobile ? 32 : isTablet ? 40 : 50,
        fit: 1.0,
        autoRotateSpeed: 0.12
    };

    return (
        <div className="relative h-screen w-full bg-[#070112] overflow-hidden flex flex-col">

            {/* STATIC BACKGROUND IMAGE */}
            <div
                className="absolute inset-0 bg-center bg-cover opacity-25"
                style={{ backgroundImage: `url(${bgImage})` }}
            />

            <div className="relative z-10 h-full flex flex-col">

                {/* HEADER */}
                <div className="px-4 sm:px-6 md:px-8 pt-20 md:pt-[110px] pb-0 animate-gallery-float">
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-[0.3em] text-white text-center font-bold uppercase animate-spherical-shimmer"
                        style={{ fontFamily: "'Cinzel Decorative', cursive" }}
                    >
                        KINETIC MEMORIES
                    </h1>
                </div>

                {/* GALLERY */}
                <div className="flex-1 relative min-h-0">
                    <DomeGallery
                        images={domeImages}
                        segments={galleryConfig.segments}
                        minRadius={galleryConfig.minRadius}
                        fit={galleryConfig.fit}
                        autoRotateSpeed={galleryConfig.autoRotateSpeed}
                        grayscale={false}
                        imageBorderRadius="8px"
                        openedImageBorderRadius="20px"
                    />
                </div>
            </div>
            <style>{`
                @keyframes galleryFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-gallery-float {
                    animation: galleryFloat 6s ease-in-out infinite;
                }

                @keyframes sphericalShimmer {
                    0% {
                        background-position: -200% center;
                        text-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
                    }
                    50% {
                        text-shadow: 0 0 30px rgba(56, 189, 248, 0.6), 0 0 50px rgba(56, 189, 248, 0.4);
                    }
                    100% {
                        background-position: 200% center;
                        text-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
                    }
                }
                .animate-spherical-shimmer {
                    background: radial-gradient(circle at center, #fff 20%, #7dd3fc 40%, #0ea5e9 60%, transparent 80%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: sphericalShimmer 4s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Gallery;