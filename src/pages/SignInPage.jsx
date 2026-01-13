import SignInForm from "../components/SignInForm";
import bgImage from "../assets/images/bgpic.jpg";

export default function SignInPage() {
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
    transform: "translateY(clamp(40px, 10vh, 120px))",
  }}
>
  <SignInForm />
</div>
  
</div>

  );
}