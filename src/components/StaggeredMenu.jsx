import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import NavVideo from '../assets/NavVideo.mp4';
import BackToPageImg from '../assets/backtopage.Webp';

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
    const videoRef = useRef(null);

    const toggleMenu = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState && onMenuOpen) onMenuOpen();
        if (!newState && onMenuClose) onMenuClose();
    };

    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, [isOpen]);

    const menuVariants = {
        closed: {
            clipPath: "circle(0px at 48px 48px)",
            opacity: 0,
            transition: {
                duration: 0.6,
                ease: "easeInOut"
            }
        },
        open: {
            clipPath: "circle(150% at 48px 48px)",
            opacity: 1,
            transition: {
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const containerVariants = {
        closed: {
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            transition: {
                delayChildren: 0.4, // Wait for the mouth to start opening earlier
                staggerChildren: 0.1,
                staggerDirection: 1
            }
        }
    };

    const itemVariants = {
        closed: {
            opacity: 0,
            scale: 1.2,
            y: 0
        },
        open: {
            opacity: 1,
            scale: 1,
            y: [0, -5, 0], // Floating loop
            transition: {
                opacity: { duration: 0.8, ease: "easeOut" },
                scale: { duration: 1.2, ease: "easeOut" },
                y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4 // Start floating after reveal
                }
            }
        }
    };

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <>
            <div
                style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '100%', pointerEvents: isOpen ? 'all' : 'none', zIndex: 9999 }}
                onClick={() => setIsOpen(false)}
            >
                <motion.div
                    className="absolute top-0 left-0 bottom-0 w-full h-full bg-[#0a0a0f] overflow-hidden"
                    variants={menuVariants}
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                >
                    {/* Background Video */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
                        <video
                            ref={videoRef}
                            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-100 transition-opacity duration-700 scale-[1.1] brightness-[0.7]"
                            muted
                            playsInline
                            src={NavVideo}
                        />
                    </div>

                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

                    <div className="absolute top-8 right-8">
                        {logoUrl && <img src={logoUrl} alt="Logo" className="h-10 w-auto" />}
                    </div>

                    {/* Menu Items Container */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-[35vh] pointer-events-none">
                        <motion.div
                            className="pointer-events-auto w-[90%] max-w-[600px] flex flex-col items-center justify-center px-8"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.ul
                                variants={containerVariants}
                                className="flex flex-col items-center justify-center gap-4 md:gap-6 list-none p-0 m-0 w-full"
                                style={{ marginTop: '1.5px' }}
                            >
                                {items.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.1, filter: "brightness(1.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative"
                                        animate={isOpen ? {
                                            y: [0, -4, 0],
                                            transition: {
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: i * 0.1 + 0.4 // Start floating after reveal
                                            }
                                        } : { y: 0 }}
                                    >
                                        <Link
                                            to={item.link}
                                            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-300 via-white to-blue-300
                                                       bg-clip-text text-transparent no-underline flex items-center justify-center gap-3 transition-all duration-300
                                                       hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
                                            style={{ fontFamily: "'Cinzel Decorative', cursive", letterSpacing: '2.5px', textTransform: 'uppercase' }}
                                            onClick={() => setIsOpen(false)}
                                            aria-label={item.ariaLabel}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </motion.ul>

                            {/* Back to Page Button with Image Below Links */}
                            <motion.button
                                onClick={() => setIsOpen(false)}
                                initial={{ opacity: 0, scale: 1.2, y: 0 }}
                                animate={isOpen ? {
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -8, 0] // Float animation
                                } : { opacity: 0, scale: 1.2, y: 0 }}
                                transition={{
                                    opacity: { delay: 0.4 + (items.length * 0.1) + 0.3, duration: 1.0 },
                                    scale: { delay: 0.4 + (items.length * 0.1) + 0.3, duration: 1.0 },
                                    y: {
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1.6 + (items.length * 0.1) + 0.3 // Start floating after reveal
                                    }
                                }}
                                className="-mt-4 p-0 border-none bg-transparent transition-transform hover:scale-110 active:scale-95"
                                aria-label="Back to Page"
                            >
                                <img
                                    src={BackToPageImg}
                                    alt="Back to Page"
                                    className="h-8 w-auto md:h-9 opacity-80 hover:opacity-100 transition-opacity"
                                />
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Social Handles - Restored to Absolute Bottom */}
                    {displaySocials && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-row gap-5 z-20 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {socialItems.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-100/70 hover:text-white transition-all hover:scale-110 p-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg hover:border-sky-400/40"
                                    title={social.label}
                                >
                                    <div className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center">
                                        {social.icon ? social.icon : social.label}
                                    </div>
                                </a>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Toggle Button - ONLY VISIBLE WHEN CLOSED */}
            {!isOpen && (
                <button
                    onClick={toggleMenu}
                    className="fixed top-1 left-1 z-[10000] w-12 h-12 flex items-center justify-center focus:outline-none transition-all duration-300 group"
                    aria-label="Toggle Menu"
                >
                    <div className="relative w-6 h-6 flex flex-col justify-center items-center gap-[6px]">
                        <span className="w-full h-[2px] bg-white block rounded-full" />
                        <span className="w-full h-[2px] bg-white block rounded-full" />
                        <span className="w-full h-[2px] bg-white block rounded-full" />
                    </div>
                </button>
            )}
        </>
    );
};

export default StaggeredMenu;