import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const PillNav = ({
    items = [],
    logo,
    logoAlt = "Logo",
    baseColor = "#000000",
    pillColor = "#ffffff",
    hoveredPillTextColor = "#ffffff",
    pillTextColor = "#000000",
    className = ""
}) => {
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    // Update active index based on route
    useEffect(() => {
        const index = items.findIndex(item => item.href === location.pathname);
        if (index !== -1) {
            setActiveIndex(index);
        } else {
            setActiveIndex(null);
        }
    }, [location.pathname, items]);

    return (
        <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
            <div
                className="flex items-center gap-1 rounded-full px-2 py-2 shadow-xl backdrop-blur-md border border-white/10"
                style={{ backgroundColor: 'rgba(20, 10, 40, 0.8)' }}
            >
                {logo && (
                    <div className="mr-4 ml-2">
                        <img src={logo} alt={logoAlt} className="h-8 w-auto" />
                    </div>
                )}

                <div className="flex relative">
                    {items.map((item, index) => {
                        const isHovered = hoveredIndex === index;
                        const isActive = activeIndex === index;

                        return (
                            <Link
                                key={index}
                                to={item.href}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10"
                                style={{
                                    color: (isHovered || isActive) ? hoveredPillTextColor : '#a1a1aa'
                                }}
                            >
                                {/* Hover Pill */}
                                {isHovered && !isActive && (
                                    <motion.div
                                        layoutId="nav-pill-hover"
                                        className="absolute inset-0 rounded-full"
                                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Active Pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill-active"
                                        className="absolute inset-0 rounded-full"
                                        style={{ backgroundColor: pillColor }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <span className="relative z-10" style={{
                                    color: isActive ? pillTextColor : ((isHovered) ? '#fff' : '#a1a1aa')
                                }}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    );
};

export default PillNav;
