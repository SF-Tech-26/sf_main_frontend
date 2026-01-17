import Home from "../components/Home";
import bgImage from "../assets/images/homeBg.webp";

export default function HomePage() {
  return (
    <div
      className="fixed-viewport w-full flex items-center justify-center bg-cover bg-top bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >

      <div
        style={{
          // transform: "translateY(clamp(40px, 16vh, 120px))",
        }}
      >
        <Home />
      </div>

    </div>

  );
}