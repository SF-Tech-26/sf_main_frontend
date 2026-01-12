import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const StaggeredMenu = ({
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    menuButtonColor = '#fff',
    openMenuButtonColor = '#fff',
    changeMenuColorOnOpen = true,
    colors = ['#18181b', '#042f2e'],
    logoUrl,
    accentColor = '#10b981',
    onMenuOpen,
    onMenuClose
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState && onMenuOpen) onMenuOpen();
        if (!newState && onMenuClose) onMenuClose();
    };

    const menuVariants = {
        closed: {
            clipPath: "circle(30px at 40px 40px)",
            transition: {
                delay: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            clipPath: "circle(150% at 40px 40px)",
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 30
            }
        }
    };

    const containerVariants = {
        closed: {
            transition: {
                staggerChildren: 0.03,
                staggerDirection: -1
            }
        },
        open: {
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.04,
                staggerDirection: 1
            }
        }
    };

    const itemVariants = {
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                y: { stiffness: 1000 }
            }
        },
        open: {
            y: 0,
            opacity: 1,
            transition: {
                y: { stiffness: 1000, velocity: -100 }
            }
        }
    };

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <>
            <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '100%', pointerEvents: isOpen ? 'all' : 'none', zIndex: 9999 }}>
                <motion.div
                    className="absolute top-0 left-0 bottom-0 w-full h-full bg-[#1a1a1a]"
                    variants={menuVariants}
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                >
                    <div className="absolute top-8 right-8">
                        {logoUrl && <img src={logoUrl} alt="Logo" className="h-10 w-auto" />}
                    </div>

                    <motion.ul
                        variants={containerVariants}
                        className="flex flex-col items-center justify-center h-full gap-6 list-none p-0 m-0"
                    >
                        {items.map((item, i) => (
                            <motion.li
                                key={i}
                                variants={itemVariants}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <Link
                                    to={item.link}
                                    className="text-4xl md:text-6xl font-bold text-white no-underline flex items-center gap-4"
                                    onClick={() => setIsOpen(false)}
                                    aria-label={item.ariaLabel}
                                >
                                    {displayItemNumbering && (
                                        <span className="text-xl md:text-2xl opacity-50 font-light" style={{ color: accentColor }}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    )}
                                    {item.label}
                                </Link>
                            </motion.li>
                        ))}

                        {displaySocials && (
                            <motion.div
                                variants={itemVariants}
                                className="flex justify-center items-center gap-2 mt-12"
                            >
                                {socialItems.map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/70 hover:text-white transition-all hover:scale-110 -ml-4 first:ml-0 p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-lg hover:bg-white/10 hover:shadow-xl hover:z-10"
                                        title={social.label}
                                    >
                                        {social.icon ? social.icon : social.label}
                                    </a>
                                ))}
                            </motion.div>
                        )}
                    </motion.ul>
                </motion.div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleMenu}
                className="fixed top-6 left-6 z-[10000] w-12 h-12 flex items-center justify-center focus:outline-none transition-all duration-300 group" // Removed bg/border/shadow, added group for hover effects if needed
                aria-label="Toggle Menu"
            >
                <div className="relative w-6 h-6 flex flex-col justify-center items-center gap-[6px]">
                    <motion.span
                        animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                        className="w-full h-[2px] bg-white block rounded-full"
                    />
                    <motion.span
                        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-full h-[2px] bg-white block rounded-full"
                    />
                    <motion.span
                        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                        className="w-full h-[2px] bg-white block rounded-full"
                    />
                </div>
            </button>
        </>
    );
};

export default StaggeredMenu;
