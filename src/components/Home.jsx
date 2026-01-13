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
  className="
    scale-110 md:scale-150
    origin-top-left
    ml-10 md:ml-14
  "
>
  <img
    src={sfHandLogo}
    alt="SF Icon"
    className="h-12 w-12 md:h-16 md:w-16 drop-shadow-lg"
  />
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


        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[16px] translate-y-[120px]">


      {/* LOGIN BUTTON */}
      
<div className="min-h-screen w-full flex items-center justify-center">
      {!isAuthenticated ? (
        /* ===== BEFORE LOGIN ===== */
        <Link
          to="/signin"
          className="
            inline-flex items-center justify-center
            w-[160px] h-[48px]

            text-[16px]
            font-semibold
            tracking-[0.18em]
            uppercase
            text-[#e8dcc4]

            bg-gradient-to-b
            from-[#3b3a35]
            to-[#1a1916]

            border border-[#6e6a5f]
            rounded-[10px]

            shadow-[0_10px_30px_rgba(0,0,0,0.6)]

            hover:from-[#4a483f]
            hover:to-[#23211c]
            hover:shadow-[0_14px_40px_rgba(0,0,0,0.8)]

            active:scale-[0.97]
            transition-all duration-300 ease-out

            no-underline
            outline-none
            focus:outline-none
            focus:ring-0
            select-none
          "
        >
          LOG IN
        </Link>
      ) : (
        /* ===== AFTER LOGIN ===== */
        <div className="flex gap-6">
          {/* Dashboard Button */}
          <Link
            to="/dashboard"
            className="
              inline-flex items-center justify-center
              w-[180px] h-[50px]
              text-[15px] font-semibold tracking-[0.18em]
              uppercase text-[#e8dcc4]

              bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a]
              border border-[#6e6a5f]
              rounded-[10px]

              shadow-[0_10px_30px_rgba(0,0,0,0.6)]
              hover:shadow-[0_14px_40px_rgba(0,0,0,0.8)]
              transition-all duration-300
              no-underline
            "
          >
            DASHBOARD
          </Link>

          {/* Pay Now Button */}
          <Link
            to="/payment"
            className="
              inline-flex items-center justify-center
              w-[180px] h-[50px]
              text-[15px] font-semibold tracking-[0.18em]
              uppercase text-[#1a1916]

              bg-gradient-to-b from-[#e8dcc4] to-[#b9ad94]
              border border-[#b9ad94]
              rounded-[10px]

              shadow-[0_10px_30px_rgba(0,0,0,0.4)]
              hover:shadow-[0_14px_40px_rgba(0,0,0,0.6)]
              transition-all duration-300
              no-underline
            "
          >
            PAY NOW
          </Link>
        </div>
      )}
    </div>
     

    </div>
         </main>

        

      
      
    </div>
  );
};

export default HomePage;