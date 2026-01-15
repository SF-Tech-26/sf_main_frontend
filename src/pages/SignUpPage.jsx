import SignUpForm from "../components/SignUpForm";
import bgImage from "../assets/images/homeBg.webp";

export default function SignUpPage() {
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
    display: "flex",
    justifyContent: "center",   // locks X center
    width: "100%",
   
  }}
>
  <SignUpForm />
</div>

</div>

  );
}
