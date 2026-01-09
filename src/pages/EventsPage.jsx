import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../services/eventService';

// Event data mapping
const eventData = {
    'dance': {
        icon: 'auto_awesome_motion',
        title: 'Rhythmic Rituals',
        name: 'Rhythmic',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoYy96XvNIVLBFneD6WH3R-0YkiKxwC-MpSZ53xwxw4f9VE8LNOTpONjE_dHBZtaqbjLnToF4SsX9KSRbAHiSvxuHFDxtXZ8U79K6MA-5iJhFAjlJilyZcA7OcHC_7rz-LDkursluhx2zw-yCX4taUJrRXWahNsjotbZ-SFA05-aH5cyssVxlJIMiT6pGy-3ODJt83T73mbLXH0uDW-jSDUG0-KNWvngQNjj2B5iwrx0CcAjMrdsvktqLdKdg43eljGYGuWMwPq82h',
        description: 'Witness ancient movements and modern interpretations that transcend the ordinary. Our dance events are a mesmerizing fusion of energy and grace, where stories unfold through captivating choreography and visual spectacle. Lose yourself in the rhythm that echoes through the ancient forest.'
    },
    'music': {
        icon: 'music_note',
        title: 'Sonic Incantations',
        name: 'Sonic',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWQTL2c7jLbEnnmnA8G7NTbTelv8Px_HKQ8r5isKs-3UqhDtitZLIWPW7KsIqIDecoDT_cCpvlkciyIo_oXlS4pmw1qgURXzLB0hGJkOJO9gLny0tu8mCnj1uQfoSDa19XcANAFq0AFERGpXJVGQwwrQV6phlnv783sUlePfxv60ULSDdKiVPHmBZpD-Sm7V_vucC62LVkbLPgDocPRGceL-mPfG9DLdD52Z72KdKzRSJFJNF7If0LXtOAc8XcB9nA6pwL_wWjHflb',
        description: 'Experience a symphony of sounds that range from ethereal whispers to thunderous crescendos. Our music events feature artists who weave spellbinding melodies and powerful harmonies, creating an immersive auditory journey that resonates deep within the soul of the woods.'
    },
    'dramatics': {
        icon: 'theater_comedy',
        title: 'Theatrical Visions',
        name: 'Drama',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-CYQdN1tA2fb7ZIxV7PIx1czA-xIb3C3gR94IolZZkhT3HDCZmYyY46h2iraHXEvpdbXiCNEU6Ovrzar9HJEk33Bhj4L6_Q_SHMmo9-JHrzY6ufsL6mYc0n4afuTz_HLT_qwACKUiMG7n6XPUmjDcmDwMoYdwtrE6khzQuf5vjzxzeGj-lzOSR8-MSm35uEhhZ-7D-Jt5VmopgkEqk2jpYTdECsyjx--AwxrBI_lyPzbzIBHW6D2H0JoW4YezsGy2GJxmeTplIsW5',
        description: 'Step into realms of imagination where tales of old and new are brought to life with breathtaking performances. Our dramatic arts showcase compelling narratives, profound emotions, and stunning stagecraft, promising an unforgettable journey through the human experience.'
    },
    'literary': {
        icon: 'history_edu',
        title: 'Ancient Lore',
        name: 'Scrolls',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8s-EY72H4mEJge9q44uRHumLxJYV180RP97CDWFzZkhSHzUyBdHT6rh8WQJZ2tH8_7l_5jLbLyhhCinpZkC1RSJk7B0q11BCchcsvbknv5x6cGghtW1Jybwe6Apd4uscurZjZapTapxMVE8feywijzp0eJtN7EMxfOLFZDNeI9zaQHI9f49-owcK21d6ewhkgdjPSrkl35MLYGfqbUbuJ8-qdKHGfucCa2Ifwi3N5Q-wp1rubCyq3uKZlVZX2GYoxMiWdWWR6b63z',
        description: 'Delve into the sacred texts and forgotten verses where words hold power. Our literary events invite you to explore diverse narratives, engage with profound ideas, and witness the magic of storytelling through readings, discussions, and poetic recitations.'
    },
    'film': {
        icon: 'movie_filter',
        title: 'Cinematic Spells',
        name: 'Glyphs',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTke3DWjuUVNcEqCQ8oPwdgoZav3grPFVMD6TaNIa7FbfvTEIBqwnsHl_yfXR-YC8GEqZi0uXEM3b8Ln_caZOmIq-dyQ2o0iI3ttP9iLrniChVaoueKXutLay1rlM1C1nj97VSt5iisYPOz_Ef1KuBnRtAWwBj-dwgJGGdmSx9FWtjvWgaMiZeGm92ZPcvc_vYl_mE9mDCgsFmDjF1vk43v2k354dYJ1LJnMbWlfN5jmmYV9iFiQn9YDFarEJlIAXaBSGlA4NOIGzB',
        description: 'Gaze upon moving images that transport you to distant lands and fantastical futures. Our film festival presents a curated selection of visionary works, from enchanting shorts to epic features, pushing the boundaries of visual storytelling.'
    },
    'quiz': {
        icon: 'science',
        title: 'Riddles of Knowledge',
        name: 'Potions',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyFE_2VnOQlpayZyIvAXKQHuiYNQd9DHI9a2rh5eA2eaExkOZ14rJlrt25eGslfZtXddi0CDj4nBZDJhY9oW0u-gR3m4OGFmPm8KmiBEJFx-Yj-jrKiVYEDRzK-K02HkTBoxg0KwfqOUslkfA2Ef3tBge8t58xiWopoxIxIGZtPPbfbKPaIZIHAmq07u6JqFhQVkQAFMQ6hwEhXAkt52siW3bYiPH8a3MTJv-9GBD2IPVK5Gaj8IYzU2Te85tkfFEgUiWqKQEgEZ0g',
        description: 'Test your intellect and unravel the mysteries posed by our master riddlers. Our quiz events challenge your wisdom across myriad topics, inviting you to compete, collaborate, and discover the depths of your own sagacity in a thrilling contest of minds.'
    },
    'finearts': {
        icon: 'brush',
        title: 'Alchemy of Art',
        name: 'Alchemy',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnI1a9AyQ8Vu9fThXMsBmNGYkMRMbrL6cT7C9Pp2vAqqbBxAkx4cCmFbOhZdVwS7d8YrFgIWcHiLOq_Tgz9BGVpKvTYlJT1tDe37pptwV-PXITlvxTlO4avrEtdSz0DVlSnFrKXkaYv-qw2WSsZ5TGq31YwYCGQHy4qyO6m68LrwM1RXJGH1hG5SnsgZ44UnJ8agE3U1PDm95WfSpTn_bauOLqylATAvqysxHq-INhEeyDVsOVnAyOYGpmociYpYdRcXSL6ew2LN4C',
        description: 'Behold creations that transmute the ordinary into the extraordinary. Our fine arts exhibitions showcase masterpieces born from the deepest wells of human creativity, exploring forms, colors, and textures that stir the soul and awaken the senses.'
    },
    'humour': {
        icon: 'mood',
        title: 'Festive Revelry',
        name: 'Humour Fest',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv2kBADXOYKsX0s_BXOL_3bhX5x9DKxxXKLdVr4jViD9xbpD4mvEe9sdQhf8nLbZiQ9fKGcabCnYlRyMDKh0XRrQrrHZRBq1iU3KhEUaHWQfI0HZrldga5q_55wl-H8VrNa9Gn2NUQ-D-A8j3eWlCRb5m3D3oqQeYdl24DTP6UvQVFpMoLlkM6ZJULinbN3YBaH_-m_TI__RyI4UoD4tREUAHp6THPLuJJo9KSWJslxkNNIs3aMg2lAbuasJAqTPDDBnXvvqeGArbX',
        description: 'Embrace the lighter side of existence with performances that ignite joyful spirits and hearty laughter. Our humour festival brings together jesters and wits to banish gloom, offering a spectrum of comedic acts designed to delight and entertain.'
    },
    'fashion': {
        icon: 'checkroom',
        title: 'Runway Elegance',
        name: 'Fashion',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        description: 'Style the runway and showcase creativity through fashion and design. Our fashion events celebrate innovation, artistry, and the latest trends in the world of haute couture and contemporary style.'
    },
    'culinaryarts': {
        icon: 'restaurant',
        title: 'Culinary Mastery',
        name: 'Culinary Arts',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        description: 'Master the kitchen and compete in cooking and food presentation. Our culinary arts events bring together passionate chefs and food enthusiasts to celebrate gastronomy, creativity, and culinary excellence.'
    }
};

const EventsPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system dark mode preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }

        // Fetch events from API
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                if (response.code === 0 && response.data) {
                    setEvents(response.data);
                    if (response.data.length > 0) {
                        setSelectedEvent(response.data[0]);
                    }
                } else {
                    setError('Failed to fetch events');
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleThemeToggle = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const handleDiscover = () => {
        if (selectedEvent && selectedEvent.genre) {
            const slug = selectedEvent.genre.toLowerCase().replace(/\s+/g, '-');
            navigate(`/events/${slug}`);
        }
    };

    const getGenreIcon = (genre) => {
        const genreKey = genre.toLowerCase().replace(/\s+/g, '');
        return eventData[genreKey]?.icon || 'category';
    };

    const getEventDisplayData = (event) => {
        const genreKey = event.genre.toLowerCase().replace(/\s+/g, '');
        const genreInfo = eventData[genreKey] || {};
        
        return {
            name: event.name || event.genre,
            title: genreInfo.title || event.name || event.genre,
            image: genreInfo.image || event.image || event.poster || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
            description: genreInfo.description || event.description || `Join us for ${event.name || event.genre}! This is an exciting event you won't want to miss.`,
            icon: genreInfo.icon || 'category',
            genre: event.genre,
            id: event.id
        };
    };

    if (isLoading) {
        return (
            <div className="font-body bg-background-dark text-slate-200 min-h-screen relative overflow-x-hidden flex items-center justify-center">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-forest-gradient"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-deep-amber border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#d2b48c]">Loading events...</p>
                </div>
            </div>
        );
    }

    if (error || events.length === 0) {
        return (
            <div className="font-body bg-background-dark text-slate-200 min-h-screen relative overflow-x-hidden flex items-center justify-center">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-forest-gradient"></div>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-red-400 mb-4">{error || 'No events available'}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-2 bg-deep-amber text-white rounded-lg hover:bg-opacity-80 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const currentEvent = selectedEvent;

    return (
        <div className="font-body bg-background-dark text-slate-200 min-h-screen relative overflow-x-hidden selection:bg-deep-amber selection:text-white transition-colors duration-300 dark:bg-background-dark dark:text-slate-200">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-forest-gradient"></div>
                <div 
                    className="absolute inset-0 opacity-20" 
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")',
                        mixBlendMode: 'overlay'
                    }}
                ></div>
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-moss-green/30 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-deep-amber/20 rounded-full blur-[120px] mix-blend-screen" style={{animation: 'float 6s ease-in-out infinite 1s'}}></div>
                <div className="absolute inset-0 bg-fireflies animate-drift opacity-50"></div>
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-firefly-glow rounded-full blur-[2px] animate-glow" style={{boxShadow: '0 0 10px #dfff00'}}></div>
                <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-firefly-glow rounded-full blur-[3px] animate-glow" style={{boxShadow: '0 0 15px #dfff00', animationDelay: '1.5s'}}></div>
                <div className="absolute bottom-1/4 left-10 w-2 h-2 bg-firefly-glow rounded-full blur-[2px] animate-glow" style={{boxShadow: '0 0 8px #dfff00', animationDelay: '3s'}}></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 pt-16 pb-20 container mx-auto px-4 min-h-screen flex flex-col items-center">
                {/* Header */}
                <header className="text-center mb-32 relative">
                    <h1 className="font-display text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] via-[#deb887] to-[#8b4513] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 tracking-wide">
                        EVENTS
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-deep-amber to-transparent mx-auto rounded-full" style={{boxShadow: '0 0 10px rgba(184,134,11,0.5)'}}></div>
                    <p className="mt-4 text-[#d2b48c] font-light tracking-[0.2em]  uppercase text-sm drop-shadow-md">Discover the Magic Within the Woods</p>
                </header>

                {/* Main Display */}
                <div className="relative w-full flex gap-6 justify-center items-start mt-12 flex-col lg:flex-row max-w-7xl">
                    {/* Codex Container - Left Side (Vertical on Desktop, Horizontal on Mobile) */}
                    <div className="codex-container hidden lg:block">
                        {events.map((event, index) => {
                            const displayData = getEventDisplayData(event);
                            return (
                                <div 
                                    key={event.id || index}
                                    className={`codex-tab ${selectedEvent?.id === event.id ? 'active' : ''}`}
                                    onClick={() => handleEventClick(event)}
                                    style={{cursor: 'pointer'}}
                                    title={displayData.name}
                                >
                                    <div className="codex-tab-inner">
                                        <span className="material-symbols-outlined codex-tab-icon">
                                            {displayData.icon}
                                        </span>
                                        <span className="codex-tab-name">{displayData.name}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Horizontal Scrolling Tabs for Mobile/Tablet */}
                    <div className="lg:hidden w-full mb-6">
                        <div className="codex-container-horizontal">
                            {events.map((event, index) => {
                                const displayData = getEventDisplayData(event);
                                return (
                                    <div 
                                        key={event.id || index}
                                        className={`codex-tab-horizontal ${selectedEvent?.id === event.id ? 'active' : ''}`}
                                        onClick={() => handleEventClick(event)}
                                        style={{cursor: 'pointer'}}
                                        title={displayData.name}
                                    >
                                        <div className="codex-tab-inner">
                                            <span className="material-symbols-outlined codex-tab-icon">
                                                {displayData.icon}
                                            </span>
                                            <span className="codex-tab-name">{displayData.name}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grimoire Display - Right Side */}
                    {currentEvent && (
                        (() => {
                            const displayData = getEventDisplayData(currentEvent);
                            return (
                                <div className="grimoire-display w-full lg:w-auto">
                                    <div className="grimoire-page left">
                                        <div className="grimoire-image-frame">
                                            <img 
                                                alt={displayData.name}
                                                src={displayData.image}
                                            />
                                        </div>
                                    </div>
                                    <div className="grimoire-page right">
                                        <h3 className="grimoire-card-title">{displayData.title}</h3>
                                        <p className="grimoire-description">
                                            {displayData.description}
                                        </p>
                                        <button 
                                            className="discover-button"
                                            onClick={handleDiscover}
                                        >
                                            Discover More 
                                            <span className="material-icons text-base ml-2">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })()
                    )}
                </div>
            </main>

            {/* Theme Toggle */}
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    className="w-12 h-12 rounded-full bg-aged-wood-dark shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-deep-amber/30 text-deep-amber"
                    onClick={handleThemeToggle}
                    style={{boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'}}
                >
                    {isDark ? (
                        <span className="material-icons">dark_mode</span>
                    ) : (
                        <span className="material-icons">light_mode</span>
                    )}
                </button>
            </div>

            {/* Tailwind Config Styles */}
            <style>{`
                :root {
                    --deep-amber: #b8860b;
                    --forest-green: #0d2b16;
                    --moss-green: #556b2f;
                    --firefly-glow: #dfff00;
                    --aged-wood: #5c4033;
                    --aged-wood-dark: #3e2723;
                    --parchment-cream: rgba(253, 245, 230, 0.9);
                    --parchment-border: #d2b48c;
                    --muted-gold: #c5a059;
                    --text-brown: #3e2723;
                }

                .codex-container {
                    width: 100px;
                    height: 480px;
                    overflow-y: auto;
                    margin-top: 4vh;
                    padding-right: 8px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                }

                @media (max-width: 1024px) {
                    .codex-container {
                        height: 480px;
                    }
                }

                @media (max-width: 900px) {
                    .codex-container {
                        height: 500px;
                    }
                }

                .codex-container::-webkit-scrollbar {
                    display: none;
            
                }

                .codex-container-horizontal {
                    width: 100%;
                    height: 120px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding-bottom: 8px;
                    display: flex;
                    gap: 12px;
                    scrollbar-width: thin;
                    scrollbar-color: #b8860b rgba(0, 0, 0, 0.3);
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }

                .codex-container-horizontal::-webkit-scrollbar {
                    height: 6px;
                }

                .codex-container-horizontal::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }

                .codex-container-horizontal::-webkit-scrollbar-thumb {
                    background: #b8860b;
                    border-radius: 3px;
                }

                .codex-tab-horizontal {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    min-width: 100px;
                    background-color: #3e2723;
                    background-image: repeating-linear-gradient(45deg, #3e2723 0, #3e2723 1px, #4e342e 1px, #4e342e 4px);
                    border: 1px solid #8d6e63;
                    border-left: 3px solid #5d4037;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
                    overflow: hidden;
                }

                .codex-tab-horizontal::after {
                    content: "";
                    position: absolute;
                    top: 2px;
                    bottom: 2px;
                    left: 2px;
                    right: 2px;
                    border: 1px solid rgba(184, 134, 11, 0.3);
                    pointer-events: none;
                }

                .codex-tab-horizontal:hover {
                    transform: translateY(-4px);
                    background-color: #4e342e;
                    border-color: #b8860b;
                    box-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
                    z-index: 10;
                }

                .codex-tab-horizontal:hover .codex-tab-icon {
                    color: #dfff00;
                    text-shadow: 0 0 5px rgba(223, 255, 0, 0.5);
                }

                .codex-tab-horizontal.active {
                    transform: translateY(-8px);
                    background: linear-gradient(135deg, #2a1a05, #3e2723);
                    border: 1px solid #ffd700;
                    border-left: 4px solid #b8860b;
                    box-shadow: 0 0 15px rgba(184, 134, 11, 0.4), inset 0 0 20px rgba(184, 134, 11, 0.2);
                    z-index: 20;
                }

                .codex-tab {
                    position: relative;
                    width: 100%;
                    height: 70px;
                    margin-bottom: 12px;
                    background-color: #3e2723;
                    background-image: repeating-linear-gradient(45deg, #3e2723 0, #3e2723 1px, #4e342e 1px, #4e342e 4px);
                    border: 1px solid #8d6e63;
                    border-left: 3px solid #5d4037;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
                    overflow: hidden;
                }

                .codex-tab::after {
                    content: "";
                    position: absolute;
                    top: 2px;
                    bottom: 2px;
                    left: 2px;
                    right: 2px;
                    border: 1px solid rgba(184, 134, 11, 0.3);
                    pointer-events: none;
                }

                .codex-tab:hover {
                    transform: translateX(4px);
                    background-color: #4e342e;
                    border-color: #b8860b;
                    box-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
                    z-index: 10;
                }

                .codex-tab:hover .codex-tab-icon {
                    color: #dfff00;
                    text-shadow: 0 0 5px rgba(223, 255, 0, 0.5);
                }

                .codex-tab.active {
                    transform: translateX(8px);
                    background: linear-gradient(135deg, #2a1a05, #3e2723);
                    border: 1px solid #ffd700;
                    border-left: 4px solid #b8860b;
                    box-shadow: 0 0 15px rgba(184, 134, 11, 0.4), inset 0 0 20px rgba(184, 134, 11, 0.2);
                    z-index: 20;
                }

                .codex-tab-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                    padding: 4px;
                    position: relative;
                    z-index: 1;
                }

                .codex-tab-icon {
                    font-size: 26px;
                    color: #a1887f;
                    transition: all 0.4s ease;
                    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
                    margin-bottom: 2px;
                }

                .codex-tab.active .codex-tab-icon {
                    color: #ffca28;
                    text-shadow: 0 0 8px rgba(255, 202, 40, 0.6);
                    font-size: 28px;
                    transform: translateY(-1px);
                }

                .codex-tab-name {
                    font-family: "Cinzel", serif;
                    font-size: 0.55rem;
                    font-weight: 700;
                    color: #d7ccc8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    text-align: center;
                    transition: all 0.3s ease;
                    line-height: 1.1;
                }

                .codex-tab.active .codex-tab-name {
                    color: #fff8e1;
                    text-shadow: 0 0 5px rgba(184, 134, 11, 0.8);
                }

                .grimoire-display {
                    width: 700px;
                    height: 480px;
                    background-color: transparent;
                    border-radius: 4px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
                    transition: transform 0.4s ease-in-out;
                    overflow: hidden;
                    display: flex;
                    margin-top: 4vh;
                    transform: perspective(2000px) rotateY(-5deg);
                }

                @media (max-width: 1024px) {
                    .grimoire-display {
                        width: 90%;
                        max-width: 750px;
                        height: 480px;
                    }
                }

                @media (max-width: 900px) {
                    .grimoire-display {
                        width: 95%;
                        max-width: 700px;
                        height: 500px;
                    }
                }


                @media (max-width: 768px) {
                    .grimoire-display {
                        width: 100%;
                        height: auto;
                        flex-direction: column;
                        transform: perspective(0) rotateY(0);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    }
                }

                @media (max-width: 480px) {
                    .grimoire-display {
                        width: 100%;
                        height: auto;
                    }
                }

                .grimoire-page {
                    width: 50%;
                    height: 100%;
                    background-color: #fdf5e6;
                    background-image: radial-gradient(circle at 50% 50%, rgba(210, 180, 140, 0.1) 0%, transparent 60%);
                    border: 1px solid #d7ccc8;
                    padding: 24px;
                    box-shadow: inset 0 0 40px rgba(93, 64, 55, 0.1);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    font-family: "Cinzel", serif;
                    color: #3e2723;
                }

                .grimoire-page.left {
                    border-right: 1px solid rgba(62, 39, 35, 0.1);
                    box-shadow: inset -10px 0 20px -10px rgba(0, 0, 0, 0.1);
                }

                @media (max-width: 768px) {
                    .grimoire-page.left {
                        border-right: none;
                        border-bottom: 1px solid rgba(62, 39, 35, 0.1);
                        box-shadow: inset 0 -10px 20px -10px rgba(0, 0, 0, 0.1);
                        width: 100% !important;
                        height: 300px !important;
                    }
                }

                .grimoire-page.right {
                    border-left: none;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;
                    text-align: left;
                    padding-left: 32px;
                    padding-right: 24px;
                    box-shadow: inset 10px 0 20px -10px rgba(0, 0, 0, 0.1);
                }

                @media (max-width: 768px) {
                    .grimoire-page.right {
                        border-left: none;
                        border-top: none;
                        box-shadow: inset 0 10px 20px -10px rgba(0, 0, 0, 0.1);
                        width: 100% !important;
                        padding-left: 24px;
                        padding-right: 24px;
                    }
                }

                .grimoire-page::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    opacity: 0.4;
                    pointer-events: none;
                    z-index: 0;
                }

                .grimoire-image-frame {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border: 4px double #8d6e63;
                    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #fff;
                    padding: 6px;
                }

                .grimoire-image-frame img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.95;
                    filter: sepia(0.2) contrast(1.05);
                    transition: transform 0.5s ease;
                }

                .grimoire-display:hover .grimoire-image-frame img {
                    transform: scale(1.03);
                }

                .grimoire-card-title {
                    font-size: 2.2rem;
                    font-weight: 700;
                    color: #2d1b0e;
                    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.6);
                    margin-bottom: 12px;
                    position: relative;
                    z-index: 1;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(184, 134, 11, 0.4);
                    width: 100%;
                }

                .grimoire-description {
                    font-family: "Lato", sans-serif;
                    font-size: 0.95rem;
                    color: #4a332a;
                    margin-bottom: 24px;
                    flex-grow: 1;
                    text-align: justify;
                    position: relative;
                    z-index: 1;
                    line-height: 1.6;
                    font-weight: 400;
                }

                .discover-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 24px;
                    background: linear-gradient(to bottom, #fdf5e6, #f0e6d2);
                    color: #5c4033;
                    border: 1px solid #b8860b;
                    border-radius: 2px;
                    font-family: "Cinzel", serif;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    letter-spacing: 0.05em;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: all 0.2s ease-in-out;
                    margin-top: auto;
                    z-index: 1;
                    align-self: flex-start;
                }

                .discover-button:hover {
                    background: #b8860b;
                    color: #fff;
                    border-color: #8b6508;
                    box-shadow: 0 4px 8px rgba(184, 134, 11, 0.3);
                    transform: translateY(-1px);
                }

                .dark .grimoire-page {
                    background-color: #1a1612;
                    background-image: radial-gradient(circle at 50% 50%, rgba(184, 134, 11, 0.05) 0%, transparent 60%);
                    border-color: #3e2723;
                    color: #d7ccc8;
                }

                .dark .grimoire-page.left {
                    box-shadow: inset -10px 0 20px -10px rgba(0, 0, 0, 0.5);
                }

                .dark .grimoire-page.right {
                    box-shadow: inset 10px 0 20px -10px rgba(0, 0, 0, 0.5);
                }

                .dark .grimoire-card-title {
                    color: #deb887;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                    border-bottom-color: rgba(184, 134, 11, 0.3);
                }

                .dark .grimoire-description {
                    color: #a1887f;
                }

                .dark .discover-button {
                    background: linear-gradient(to bottom, #2d1b0e, #1a0f08);
                    color: #deb887;
                    border-color: #8d6e63;
                }

                .dark .discover-button:hover {
                    background: #8d6e63;
                    color: #fff;
                }

                .bg-fireflies {
                    background-image: radial-gradient(rgba(223, 255, 0, 0.4) 1px, transparent 2px), radial-gradient(rgba(255, 215, 0, 0.4) 1px, transparent 2px);
                    background-size: 100px 100px, 80px 80px;
                    background-position: 0 0, 40px 40px;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 5px rgba(223, 255, 0, 0.2); }
                    50% { box-shadow: 0 0 15px rgba(223, 255, 0, 0.5); }
                }

                @keyframes drift {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(-50px, -50px); }
                }

                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .animate-glow {
                    animation: glow 2s ease-in-out infinite alternate;
                }

                .animate-drift {
                    animation: drift 20s linear infinite;
                }

                .bg-forest-gradient {
                    background: linear-gradient(to bottom, #0d2b16, #1a120b);
                }
            `}</style>
        </div>
    );
};

export default EventsPage;
