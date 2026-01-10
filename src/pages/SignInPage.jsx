import SignInForm from "../components/SignInForm";
import bgImage from "../assets/images/Rectangle.png";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <SignInForm />
    </div>
  );
}
