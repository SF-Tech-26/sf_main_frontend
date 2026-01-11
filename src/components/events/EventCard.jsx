import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, index, totalCards, genreSlug }) => {
    const navigate = useNavigate();

    // Calculate card positioning for fanned effect
    const centerIndex = (totalCards - 1) / 2;
    const rotation = (index - centerIndex) * 8;
    const offsetX = (index - centerIndex) * 80;
    const offsetY = Math.abs(index - centerIndex) * 15;

    const handleClick = () => {
        navigate(`/events/${genreSlug}/${event.id}`);
    };

    // Get a default image based on genre or use a placeholder
    const getEventImage = () => {
        const images = [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDU6iKlSqViTYYu5g5qYpkS9XqV6k9X5AUVhhGCx1WMSq7Z8BaQP9ql4hKpAQ-N46Qn8sV_jAup2hxLcA7YLktuei7liDy8FPnQI0flEK9wYSSoyPwOOC4NJBwA1n6AGQW1r5PGj3a0cFxc1VmvSlMayXZaBY9gA5g_EKRFqhJLtgSF18O-SEc9Nb6ENlpRxplqjU16yZHq21YAA8PuC-Y9P6tqzutPqe0FyaGK18oFzEkQ6f6zwTzsiWTNaplS4ZWkyTiCdL5tXfVa',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCWQTL2c7jLbEnnmnA8G7NTbTelv8Px_HKQ8r5isKs-3UqhDtitZLIWPW7KsIqIDecoDT_cCpvlkciyIo_oXlS4pmw1qgURXzLB0hGJkOJO9gLny0tu8mCnj1uQfoSDa19XcANAFq0AFERGpXJVGQwwrQV6phlnv783sUlePfxv60ULSDdKiVPHmBZpD-Sm7V_vucC62LVkbLPgDocPRGceL-mPfG9DLdD52Z72KdKzRSJFJNF7If0LXtOAc8XcB9nA6pwL_wWjHflb',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuA-CYQdN1tA2fb7ZIxV7PIx1czA-xIb3C3gR94IolZZkhT3HDCZmYyY46h2iraHXEvpdbXiCNEU6Ovrzar9HJEk33Bhj4L6_Q_SHMmo9-JHrzY6ufsL6mYc0n4afuTz_HLT_qwACKUiMG7n6XPUmjDcmDwMoYdwtrE6khzQuf5vjzxzeGj-lzOSR8-MSm35uEhhZ-7D-Jt5VmopgkEqk2jpYTdECsyjx--AwxrBI_lyPzbzIBHW6D2H0JoW4YezsGy2GJxmeTplIsW5',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC8s-EY72H4mEJge9q44uRHumLxJYV180RP97CDWFzZkhSHzUyBdHT6rh8WQJZ2tH8_7l_5jLbLyhhCinpZkC1RSJk7B0q11BCchcsvbknv5x6cGghtW1Jybwe6Apd4uscurZjZapTapxMVE8feywijzp0eJtN7EMxfOLFZDNeI9zaQHI9f49-owcK21d6ewhkgdjPSrkl35MLYGfqbUbuJ8-qdKHGfucCa2Ifwi3N5Q-wp1rubCyq3uKZlVZX2GYoxMiWdWWR6b63z',
        ];
        return images[index % images.length];
    };

    return (
        <motion.div
            className="tarot-card"
            style={{
                backgroundImage: `url('${getEventImage()}')`,
                position: 'absolute',
                left: `calc(50% + ${offsetX}px - 125px)`,
                top: `${80 + offsetY}px`,
                zIndex: 10 + index,
            }}
            initial={{
                opacity: 0,
                rotate: rotation - 20,
                y: 100
            }}
            animate={{
                opacity: 1,
                rotate: rotation,
                y: 0,
                transition: { delay: index * 0.1 }
            }}
            whileHover={{
                y: -30,
                scale: 1.08,
                zIndex: 50,
                boxShadow: '0 20px 40px rgba(168, 85, 247, 0.7), 0 0 0 2px rgba(255, 255, 255, 0.3)'
            }}
            onClick={handleClick}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold text-white drop-shadow-lg">{event.name}</h3>
                <p className="text-slate-200 text-sm mt-1 drop-shadow-md">{event.tagline}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${event.is_group ? 'bg-purple-500/80' : 'bg-green-500/80'}`}>
                        {event.is_group ? 'Group' : 'Solo'}
                    </span>
                    <span className="text-xs text-slate-300">
                        {event.min_participation === event.max_participation
                            ? `${event.min_participation} members`
                            : `${event.min_participation}-${event.max_participation} members`}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
