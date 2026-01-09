import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div
      className="
        w-[330px] max-w-[90%]
        h-[50vh]
        overflow-y-auto
        backdrop-blur-[12px]
        border border-[#7DF9FF]
        rounded-[40px]
        text-[#E6FBFF]
        px-[32px] py-[40px]
      "
      style={{
        background: "rgba(10, 20, 44, 0.92)",
        boxShadow: `
          0 0 35px rgba(125, 249, 255, 0.55),
          0 0 80px rgba(56, 189, 248, 0.35),
          0 0 140px rgba(167, 139, 250, 0.18)
        `,
      }}
    >
      {/* Title */}
      <h1
        className="
          text-center
          font-bold
          tracking-wider
          text-[34px]
          mb-[28px]
        "
        style={{
          color: "#F0FDFF",
          textShadow: `
            0 0 10px rgba(125, 249, 255, 1),
            0 0 26px rgba(56, 189, 248, 0.85),
            0 0 52px rgba(167, 139, 250, 0.45)
          `,
        }}
      >
        SIGN UP
      </h1>

      {/* FORM BODY */}
      <div className="flex flex-col gap-[18px] flex-grow items-center">
        <h2 className="text-[18px] font-semibold text-[#C7F5FF]">
          Personal Information
        </h2>

        {[
          { label: "Email", type: "email", placeholder: "abc@gmail.com" },
          { label: "Phone Number", type: "text", placeholder: "Phone Number" },
          { label: "Date of Birth", type: "date" },
          { label: "Gender", type: "text", placeholder: "M/F" },
        ].map(({ label, type, placeholder }) => (
          <div
            key={label}
            className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]"
          >
            <label className="text-sm text-[#C7F5FF]">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              className="
                h-[46px]
                w-full
                px-[14px] py-[12px]
                rounded-[10px]
                bg-transparent
                border border-[#7DF9FF]
                text-[#F0FDFF]
                outline-none
                focus:ring-2 focus:ring-[#60A5FA]
                indent-[8px]
              "
              style={{
                boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
              }}
            />
          </div>
        ))}

        <h2 className="text-[18px] font-semibold text-[#C7F5FF] mt-[6px]">
          College Information
        </h2>

        {["College", "Passing Year", "City", "State"].map((item) => (
          <div
            key={item}
            className="flex flex-col gap-[6px] mx-auto w-full max-w-[300px]"
          >
            <label className="text-sm text-[#C7F5FF]">{item}</label>
            <input
              placeholder={item}
              className="
                h-[46px]
                w-full
                px-[14px] py-[12px]
                rounded-[10px]
                bg-transparent
                border border-[#7DF9FF]
                text-[#F0FDFF]
                outline-none
                focus:ring-2 focus:ring-[#60A5FA]
                indent-[8px]
              "
              style={{
                boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
              }}
            />
          </div>
        ))}

        <h2 className="text-[18px] font-semibold text-[#C7F5FF] mt-[6px]">
          Account Credentials
        </h2>

        {["Password", "Confirm Password"].map((item) => (
          <div
            key={item}
            className="flex flex-col gap-[6px] mx-auto w-full max-w-[300px]"
          >
            <label className="text-sm text-[#C7F5FF]">{item}</label>
            <input
              type="password"
              placeholder="********"
              className="
                h-[46px]
                w-full
                px-[14px] py-[12px]
                rounded-[10px]
                bg-transparent
                border border-[#7DF9FF]
                text-[#F0FDFF]
                outline-none
                focus:ring-2 focus:ring-[#60A5FA]
                indent-[8px]
              "
              style={{
                boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
              }}
            />
          </div>
        ))}

        <button
          className="
            mt-[12px]
            h-[46px]
            mx-auto
            w-full max-w-[300px]
            rounded-full
            font-semibold
            tracking-wider
            text-[#020617]
            bg-gradient-to-r from-[#38BDF8] via-[#7DF9FF] to-[#A78BFA]
            hover:scale-[1.03]
            transition
          "
          style={{
            boxShadow: `
              0 0 22px rgba(125, 249, 255, 0.9),
              0 0 50px rgba(56, 189, 248, 0.65),
              0 0 90px rgba(167, 139, 250, 0.45)
            `,
          }}
        >
          CREATE ACCOUNT
        </button>

        <p className="mt-[14px] text-center text-sm text-[#C7F5FF]">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="underline text-[#9FE7FF] hover:text-[#7DF9FF] transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
