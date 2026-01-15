import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import bg from "../assets/dashBG.png";
import mobileBg from "../assets/mobile.png";
import maleAvatar from "../assets/male2 face.png";
import femaleAvatar from "../assets/female1 face.png";
import yellowLantern from "../assets/yellowlantern.png";
import pinkLantern from "../assets/pinklantern.png";
import blueLantern from "../assets/bluelantern.png";

function LanternButton({ title, icon, path, glowColor, isMobile }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className={`flex flex-col items-center cursor-pointer group ${isMobile ? "m-2" : "m-10"}`}
    >
      {/* Lantern Glow */}
      <div className={`relative flex justify-center items-center ${isMobile ? "mb-1" : "mb-4"}`}>

        {/* Soft glow */}
        <div
          className={`absolute inset-0 ${glowColor} rounded-full blur-3xl opacity-60 animate-[pulse_2s_ease-in-out_infinite]`}
          style={{ transform: "scale(0.9)" }}
        />

        {/* Glow ring */}
        <div
          className={`absolute inset-0 ${glowColor} rounded-full blur-2xl opacity-40 animate-[glow_3s_ease-in-out_infinite]`}
        />

        {/* Lantern */}
        <img
          src={icon}
          alt={title}
          className={`${isMobile ? "w-20 h-20" : "w-48 h-48"} relative z-10 animate-[lanternGlow_2s_ease-in-out_infinite] drop-shadow-2xl transition-transform duration-300 group-hover:scale-110`}
        />
      </div>

      <h2 className={`${isMobile ? "text-xs" : "text-2xl"} font-bold text-white tracking-wide ${isMobile ? "text-center max-w-[80px]" : ""}`}>
        {title}
      </h2>

      {/* Animations */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes lanternGlow {
          0%, 100% {
            filter: drop-shadow(0 0 10px currentColor)
                    drop-shadow(0 0 20px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 20px currentColor)
                    drop-shadow(0 0 40px currentColor)
                    brightness(1.25);
          }
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    sfId: "",
    gender: "M",
  });

  // Detect mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auth logic
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      setUserInfo({
        name: payload.name || "User",
        sfId: payload.sfId || "SF-ID",
        gender: payload.gender || "M",
      });
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/signin");
    }
  }, [navigate]);

  const avatar = userInfo.gender === "F" ? femaleAvatar : maleAvatar;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div
      className={`${isMobile ? "h-screen overflow-hidden" : "min-h-screen"} bg-no-repeat ${isMobile ? "bg-cover bg-center" : "bg-cover bg-center"} relative`}
      style={{
        backgroundImage: `url(${isMobile ? mobileBg : bg})`,
        backgroundColor: '#000',
      }}
    >
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`absolute ${isMobile ? "top-4 right-4 text-xs px-3 py-1.5" : "top-6 right-6 text-sm px-4 py-2"} bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 z-50`}
      >
        Logout
      </button>

      <div className={`${isMobile ? "h-screen" : "min-h-screen"} text-white flex flex-col items-center justify-center`}>

        {/* Avatar */}
        <div className={`${isMobile ? "w-32 h-32 mb-3" : "w-56 h-56 mb-6"} rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-1 shadow-2xl`}>
          <div className="w-full h-full rounded-full bg-white overflow-hidden">
            <img
              src={avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <h1 className={`${isMobile ? "text-2xl mb-0.5" : "text-4xl mb-1"} font-bold`}>{userInfo.name}</h1>
        <p className={`text-indigo-300 ${isMobile ? "text-sm mb-6" : "text-lg mb-12"}`}>
          SF-ID: {userInfo.sfId}
        </p>

        {/* Lantern Navigation */}
        <div className={`flex ${isMobile ? "flex-row justify-center gap-2" : "flex-wrap justify-center"}`}>
          <LanternButton
            title="Registered Events"
            icon={pinkLantern}
            path="/register"
            glowColor="bg-pink-500"
            isMobile={isMobile}
          />
          <LanternButton
            title="Profile"
            icon={yellowLantern}
            path="/profile"
            glowColor="bg-yellow-400"
            isMobile={isMobile}
          />
          <LanternButton
            title="Report Issue"
            icon={blueLantern}
            path="/report"
            glowColor="bg-blue-400"
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}