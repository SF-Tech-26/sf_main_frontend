import { Link } from "react-router-dom";

export default function Home({ backgroundImage }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-center bg-cover relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      
 <Link
  to="/signin"
  className="
    inline-flex
    items-center
    justify-center

    w-[120px]
    h-[45px]

    text-[20px]
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
    backdrop-blur-[2px]

    hover:from-[#4a483f]
    hover:to-[#23211c]
    hover:shadow-[0_14px_40px_rgba(0,0,0,0.8)]

    active:scale-[0.97]
    transition-all duration-300 ease-out

    no-underline
    bg-transparent
    outline-none
    focus:outline-none
    focus:ring-0
    select-none
  "
>
  LOG IN
</Link>

    </div>
  );
}
