import { useNavigate,useLocation } from 'react-router-dom';

const BackButton = ({ 
  className = '',
  onClick = null 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };
  if (location.pathname === '/') {
    return null;
  }

  return (
    <button 
      onClick={handleClick}
      className={`
        group
        w-12 h-12
        flex items-center justify-center
        bg-white/0
        border-none
        rounded-full
        shadow-lg shadow-black/20
        hover:scale-110
        active:scale-95
        transition-all duration-300 ease-out
        focus:outline-none 
        overflow-hidden
        top-10 left-0
        fixed md:top-4 md:left-4 z-[9999] bg-red-500
        ${className}
      `}
      aria-label="Go back"
    >
      {/* Arrow icon - Tailed Arrow */}
      <svg 
        className="relative z-10 w-5 h-5 text-white drop-shadow-lg transform group-hover:-translate-x-1 transition-transform duration-300"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h22" />
      </svg>
    </button>
  );
};

export default BackButton;