import { useNavigate } from 'react-router-dom';

const BackButton = ({ 
  className = '',
  onClick = null 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`
        group
        w-12 h-12
        flex items-center justify-center
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        rounded-full
        shadow-lg shadow-black/20
        hover:shadow-xl hover:shadow-purple-500/30
        hover:bg-white/20
        hover:border-white/30
        hover:scale-110
        active:scale-95
        transition-all duration-300 ease-out
        focus:outline-none 
        focus:ring-4 focus:ring-purple-500/30
        overflow-hidden
        before:absolute before:inset-0
        before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent
        before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-300
        top-8 right-4
        fixed md:top-4 md:left-4 z-[9999] bg-red-500
      `}
      aria-label="Go back"
    >
      {/* Glass refraction effect */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-purple-500/10" />
      
      {/* Animated shimmer */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
      
      {/* Arrow icon */}
      <svg 
        className="relative z-10 w-5 h-5 text-white drop-shadow-lg transform group-hover:-translate-x-1 transition-transform duration-300"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      
      {/* Outer glow on hover */}
      
    </button>
  );
};

export default BackButton;