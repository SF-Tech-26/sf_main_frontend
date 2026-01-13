import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';
import iitkgpLogo from "../assets/images/iitkgp.webp";
import springFestLogo from "../assets/images/new1.webp";
import sfHandLogo from "../assets/images/sf.webp";
import springFestTextLogo from "../assets/images/ILU1.webp";

const HomePage = ({ backgroundImage }) => {
  const { isAuthenticated, user } = useAuth();
  
  // This would ideally come from your user context/API
  const isPaid = user?.isPaid || false;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  return (
    <div
      className="h-screen w-screen bg-center bg-cover relative overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Top Navigation Logos */}
      <nav className="absolute top-6 left-0 right-0 px-6 flex justify-between items-start z-20 w-full">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="scale-110 md:scale-150 origin-top-left"
        >
          <img src={sfHandLogo} alt="SF Icon" className="h-12 w-12 md:h-16 md:w-16 drop-shadow-lg" />
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 md:gap-6"
        >
          <a href="https://www.iitkgp.ac.in/" target="_blank" rel="noreferrer">
            <img src={iitkgpLogo} alt="IIT Kharagpur" className="h-12 w-12 md:h-16 md:w-16 object-contain hover:scale-105 transition-transform" />
          </a>
          <img src={springFestLogo} alt="Spring Fest 75" className="h-12 w-12 md:h-16 md:w-16 object-contain" />
        </motion.div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Central Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mb-12"
        >
          <img
            src={springFestTextLogo}
            alt="Spring Fest"
            className="w-[280px] md:w-[500px] h-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4 items-center"
        >
          {isAuthenticated ? (
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-white text-2xl font-light tracking-widest uppercase">
                Welcome back, <span className="font-bold text-[#e8dcc4]">{user?.name || 'Explorer'}</span>
              </h2>
              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/signin" className="btn-primary">
                LOG IN
              </Link>
              
              {isPaid ? (
                <button disabled className="btn-paid">
                  PAID
                </button>
              ) : (
                <Link to="/payment" className="btn-payment">
                  PAY NOW
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Internal CSS for repeated button styles */}
      <style jsx>{`
        .btn-primary {
          @apply inline-flex items-center justify-center w-[180px] h-[52px] 
                 text-[16px] font-semibold tracking-[0.18em] uppercase text-[#e8dcc4]
                 bg-gradient-to-b from-[#3b3a35] to-[#1a1916] border border-[#6e6a5f] 
                 rounded-[10px] shadow-xl hover:from-[#4a483f] hover:to-[#23211c] 
                 active:scale-[0.97] transition-all duration-300 no-underline;
        }
        .btn-payment {
          @apply inline-flex items-center justify-center w-[180px] h-[52px]
                 text-[14px] font-semibold tracking-[0.22em] uppercase text-[#eafff2]
                 bg-gradient-to-b from-[#1f7a4a] to-[#0e3f28] border border-[#2fbf7a]
                 rounded-[10px] shadow-xl hover:from-[#2a8f5b] hover:to-[#145a3a]
                 active:scale-[0.97] transition-all duration-300 no-underline;
        }
        .btn-paid {
          @apply inline-flex items-center justify-center w-[180px] h-[52px]
                 text-[14px] font-semibold tracking-[0.22em] uppercase text-[#9fe0b6]
                 bg-[#0f2a1d] border border-[#2f6f4f] rounded-[10px]
                 opacity-80 cursor-not-allowed select-none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;