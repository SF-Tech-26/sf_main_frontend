// src/pages/Dashboard.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import bg from "../assets/background.png";
import cardImg from "../assets/image.png";
import maleAvatar from "../assets/male2 face.png";
import femaleAvatar from "../assets/female1 face.png";

function CardButton({ title, icon, path }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer group flex justify-center"
    >
      <div className="relative w-[200px] h-[280px] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105">
        {/* Card Image */}
        <img
          src={cardImg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />

        {/* Icon & Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          {/* Icon Circle */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-md border-2 border-white/30 flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg">
            <img src={icon} alt={title} className="w-12 h-12 object-contain" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold tracking-wide text-white">
            {title}
          </h2>
        </div>
      </div>
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

  useEffect(() => {
    // Get token from localStorage or props
    // const token = localStorage.getItem("token");
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzZklkIjoiU0YwMDE2NDUiLCJpZCI6MTY0NSwiZW1haWwiOiJwdXNoa2FycmF0aG9yNzdAZ21haWwuY29tIiwibW9iaWxlIjoiNzY2NzMzMDMyNyIsImNvbGxlZ2UiOiJpaXQga2dwIiwiY2l0eSI6IlBhdG5hIiwibmFtZSI6InB1c2thciAiLCJkb2IiOiIyMDA0LTA1LTA4VDE4OjMwOjAwLjAwMFoiLCJ5b3AiOjIwMjgsImFkZHIiOiJub25lIiwic3RhdGUiOiJCaWhhciIsImdlbmRlciI6Ik0iLCJpc19jYSI6MCwic3RhdHVzIjoxLCJwYXltZW50X3N0YXR1cyI6MCwiZXhwIjoxNzY4MDczMzMxfQ.CL7sEoOkx3MelUneoJCu_emOfLMxUv3V34bTK4qDwRw";

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    // Decode token to get user info
    try {
      // JWT token format: header.payload.signature
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));

      console.log("Decoded Token:", decodedPayload); // Debug

      setUserInfo({
        name: decodedPayload.name || "User",
        sfId: decodedPayload.sfId || "SF-ID",
        gender: decodedPayload.gender || "M",
      });
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }, [navigate]);

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Choose avatar based on gender
  const avatarImage = userInfo.gender === "F" ? femaleAvatar : maleAvatar;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen bg-black/70 text-white flex flex-col">
        
        {/* Space for Navbar */}
        <div className="h-20"></div>

        {/* Logout Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600/80 hover:bg-red-700 rounded-full font-semibold backdrop-blur-sm border border-white/20 transition shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center">
          
          {/* Profile Avatar */}
          <div className="mb-6">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={avatarImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <h1 className="text-4xl font-bold tracking-wide mb-2">
            {userInfo.name}
          </h1>
          <p className="text-indigo-300 text-xl font-semibold mb-12">
            SF-ID: {userInfo.sfId}
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
            <CardButton
              title="Registered Events"
              icon={cardImg} // Replace with actual icon
              path="/register"
            />
            <CardButton
              title="Profile"
              icon={cardImg} // Replace with actual icon
              path="/profile"
            />
            <CardButton
              title="Report Issue"
              icon={cardImg} // Replace with actual icon
              path="/report"
            />
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}