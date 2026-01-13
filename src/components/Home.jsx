import { Link } from "react-router-dom";
import iitkgpLogo from "../assets/images/iitkgp.webp";
import springFestLogo from "../assets/images/new1.webp";
import sfHandLogo from "../assets/images/sf.webp";
import springFestTextLogo from "../assets/images/ILU1.webp";


export default function Home({ backgroundImage }) {

  const isPaid = false;
  return (
 <div
    className="h-screen w-screen bg-center bg-cover relative overflow-hidden"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >

 {/* Top-left logo */}
  <div className="absolute top-4 left-4 z-20">
    <img src={sfHandLogo} className="h-[48px] w-auto opacity-95" />
  </div>

<div
  className="
    absolute
    top-4
    right-4
    flex
    items-center
    gap-3
    z-20
  "
>
  <a href="https://www.iitkgp.ac.in/">
  <img
    src={iitkgpLogo}
    alt="IIT Kharagpur"
    className="
      h-[44px]
      w-auto
      object-contain
      opacity-90
    "
  />
  </a>

  <img
    src={springFestLogo}
    alt="Spring Fest 75"
    className="
      h-[44px]
      w-auto
      object-contain
      opacity-90
    "
  />
</div>


{/* Center Spring Fest text logo */}
{/* Center Spring Fest text logo */}
<div
  className="
    absolute
    top-[38%]
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
    z-10
    pointer-events-none
    scale-[1.75]
  "
>
  <img
    src={springFestTextLogo}
    alt="Spring Fest"
    className="w-[400px] h-auto object-contain opacity-90"
  />
</div>






<div className="absolute inset-0 flex flex-col items-center justify-center gap-[16px] translate-y-[120px]">


      {/* LOGIN BUTTON */}
        <Link
          to="/signin"
          className="
            inline-flex items-center justify-center
            w-[160px] h-[48px]

            text-[16px]
            font-semibold
            tracking-[0.18em]
            uppercase
            text-[#e8dcc4]

            bg-gradient-to-b
            from-[#3b3a35]
            to-[#1a1916]

            border border-[#6e6a5f]
            rounded-[10px]

            shadow-[0_10px_30px_rgba(0,0,0,0.6)]

            hover:from-[#4a483f]
            hover:to-[#23211c]
            hover:shadow-[0_14px_40px_rgba(0,0,0,0.8)]

            active:scale-[0.97]
            transition-all duration-300 ease-out

            no-underline
            outline-none
            focus:outline-none
            focus:ring-0
            select-none
          "
        >
          LOG IN
        </Link>
     

      {isPaid ? (
  <button
    disabled
    className="
      inline-flex items-center justify-center
      w-[160px] h-[48px]

      text-[14px]
      font-semibold
      tracking-[0.22em]
      uppercase
      text-[#9fe0b6]

      bg-[#0f2a1d]
      border border-[#2f6f4f]
      rounded-[10px]

      cursor-not-allowed
      opacity-85
      select-none
    "
  >
    PAID
  </button>
) : (
    <Link
    to="/payment"
    className="
      inline-flex items-center justify-center
      w-[160px] h-[48px]

      text-[14px]
      font-semibold
      tracking-[0.22em]
      uppercase
      text-[#eafff2]

      bg-gradient-to-b
      from-[#1f7a4a]
      to-[#0e3f28]

      border border-[#2fbf7a]
      rounded-[10px]

      shadow-[0_10px_30px_rgba(0,0,0,0.6)]

      hover:from-[#2a8f5b]
      hover:to-[#145a3a]
      hover:shadow-[0_14px_40px_rgba(0,0,0,0.85)]

      active:scale-[0.97]
      transition-all duration-300 ease-out

      no-underline
      outline-none
      focus:outline-none
      focus:ring-0
      select-none
    "
  >
    PAY NOW
  </Link>
)}



    </div>
  </div>


  );
}
