import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function VerticalPillNav({
    items = [],
    baseColor = "rgba(10, 10, 15, 0.4)",
    pillColor = "rgba(56, 189, 248, 0.2)",
    pillTextColor = "#38bdf8",
    hoveredPillColor = "rgba(56, 189, 248, 0.1)",
}) {
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const containerRef = useRef(null);

    // Find active index based on current path
    const activeIndex = items.findIndex((item) => item.link === location.pathname);

    return (
        <nav
            ref={containerRef}
            className="fixed left-1 top-1 z-[10000] flex flex-col gap-10 p-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl"
            style={{ backgroundColor: baseColor }}
        >
            {items.map((item, index) => {
                const isActive = index === activeIndex;
                const isHovered = index === hoveredIndex;

                return (
                    <Link
                        key={item.label}
                        to={item.link}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="relative px-4 py-3 rounded-xl transition-colors duration-300 no-underline group"
                        style={{
                            color: isActive ? pillTextColor : "rgba(255, 255, 255, 0.6)",
                        }}
                    >
                        {/* Background Pill - Active */}
                        {isActive && (
                            <motion.div
                                layoutId="pill"
                                className="absolute inset-0 rounded-xl z-0"
                                style={{ backgroundColor: pillColor }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        {/* Background Pill - Hover */}
                        {isHovered && !isActive && (
                            <motion.div
                                layoutId="hover-pill"
                                className="absolute inset-0 rounded-xl z-0"
                                style={{ backgroundColor: hoveredPillColor }}
                                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                            />
                        )}

                        <span className="relative z-10 text-xs font-medium tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {item.label}
                        </span>

                        {/* Glow for Active */}
                        {isActive && (
                            <div className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)] pointer-events-none" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}