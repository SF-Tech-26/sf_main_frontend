import { useNavigate } from "react-router-dom";
import bg from "../assets/background.png";
import cardImg from "../assets/image.png"; // your lantern image

function CardButton({ title, subtitle, path }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer group flex justify-center"
    >
      <div className="relative w-[280px] h-[420px] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105">
        {/* Card Image */}
        <img
          src={cardImg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-wide">
            {title}
          </h2>
          <p className="text-sm text-violet-300 mt-2">
            {subtitle}
          </p>

          <div className="mt-6 px-6 py-2 rounded-full border border-violet-400 text-violet-300 bg-violet-900/30 backdrop-blur-md group-hover:bg-violet-700/40 transition">
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen bg-black/70 text-white">

        {/* Header */}
        <div className="text-center pt-16">
          <h1 className="text-4xl font-bold tracking-wide">
            ETHEREAL ENIGMA
          </h1>
          <p className="text-indigo-300 mt-2 text-sm">
            Soul Frequency
          </p>
        </div>

        {/* Buttons */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-10 mt-20">
          <CardButton
            title="REGISTER"
            subtitle="Create a new event entry"
            path="/register"
          />

          <CardButton
            title="PROFILE"
            subtitle="View your identity"
            path="/profile"
          />

          <CardButton
            title="REPORTS"
            subtitle="Logs & analytics"
            path="/report"
          />
        </div> */}
        {/* Buttons at Bottom */}
        <div className="absolute bottom-10 left-0 right-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-10 justify-items-center">
            <CardButton
              title="REGISTER"
              
              path="/register"
            />

            <CardButton
              title="PROFILE"
              
              path="/profile"
            />

            <CardButton
              title="REPORTS"
                
              path="/report"
            />
          </div>
        </div>



      </div>
    </div>
  );
}
