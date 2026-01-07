import { Link } from "react-router-dom";

export default function SignInForm() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "420px",          // smaller desktop width
          maxWidth: "90%",         // responsive
          minHeight: "480px",      // flexible height
          background: "rgba(30, 42, 38, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid #6CFFB3",
          borderRadius: "40px",
          boxShadow: "0 0 50px #6CFFB3",
          padding: "40px 32px",    // correct place for padding
          display: "flex",
          flexDirection: "column",
          color: "#A7F3D0",
        }}
      >
        {/* Title */}
        <h1
  className="text-center font-bold tracking-wider"
  style={{
    fontSize: "34px",
    marginBottom: "26px",
    color: "#A7F3D0",
    textShadow: `
      0 0 6px rgba(108, 255, 179, 0.6),
      0 0 14px rgba(108, 255, 179, 0.5),
      0 0 28px rgba(108, 255, 179, 0.35)
    `,
  }}
>
  SIGNIN
</h1>


        {/* Form body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",        // controls vertical rhythm
            flexGrow: 1,
          }}
        >
          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="Email Address"
              style={{
                height: "46px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "transparent",
                border: "1px solid #6CFFB3",
                color: "#A7F3D0",
                outline: "none",
              }}
              className="focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="text-sm">Password</label>
            <input
              type="password"
              placeholder="Password"
              style={{
                height: "46px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "transparent",
                border: "1px solid #6CFFB3",
                color: "#A7F3D0",
                outline: "none",
              }}
              className="focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Button */}
          <button
            style={{
              marginTop: "8px",
              height: "46px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #4ade80, #22c55e)",
              color: "#000",
              fontWeight: 600,
              letterSpacing: "1px",
              border: "none",
              cursor: "pointer",
            }}
            className="hover:scale-[1.03] transition"
          >
            UNLOCK THE SECRETS
          </button>

          {/* Links */}
          <div
            style={{
              marginTop: "10px",
              textAlign: "center",
              fontSize: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <Link
              to="/forgot-password"
              style={{ color: "#86efac", textDecoration: "underline" }}
              className="hover:text-green-400 transition"
            >
              Forgot Password?
            </Link>

            <Link
              to="/signup"
              style={{ color: "#86efac", textDecoration: "underline" }}
              className="hover:text-green-400 transition"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
