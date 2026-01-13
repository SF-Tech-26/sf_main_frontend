import Home from "../components/Home";
import bgImage from "../assets/images/homeBg.png";

export default function HomePage() {
  return (
    <div
  className="min-h-screen w-full flex items-center justify-center"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
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