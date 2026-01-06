import SignUpForm from "../components/SignUpForm";
import bgImage from "../assets/images/Rectangle.png";

export default function SignUpPage() {
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
      <SignUpForm />
    </div>
  );
}
