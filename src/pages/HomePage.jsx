import Home from "../components/Home";
import bgImage from "../assets/images/homeBg.webp";

export default function HomePage() {
  return (
    <div
      className="h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-cover bg-top bg-no-repeat fixed inset-0"
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