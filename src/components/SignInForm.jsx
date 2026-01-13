import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.code === 0) {
        // Login successful
        const { token, data } = response.data;
        login(token, data);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className="
          w-[350px] max-w-[90%]
          min-h-[420px]
          flex flex-col
          rounded-[40px]
          border border-[#5EEBFF]
          backdrop-blur-[12px]
          text-[#CFF6FF]
        "
        style={{
          background: "rgba(14, 26, 48, 0.88)", // deep space blue glass
          boxShadow: `
            0 0 40px rgba(94, 235, 255, 0.45),
            0 0 80px rgba(56, 189, 248, 0.25)
          `,
          padding: "40px 32px",
        }}
      >
      <h1
          className="text-center font-bold tracking-wider mb-[26px]"
          style={{
            fontSize: "34px",
            color: "#E0F7FF",
            textShadow: `
              0 0 8px rgba(94, 235, 255, 0.9),
              0 0 18px rgba(56, 189, 248, 0.6),
              0 0 36px rgba(56, 189, 248, 0.4)
            `,
          }}
        >
          SIGN IN
        </h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        
<div className="flex flex-col gap-[18px] flex-grow">
          {/* Email */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-sm text-[#BEE9FF]">Email</label>
            <input
              type="email"
              value={email}
              placeholder="abc@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="
                h-[46px]
                px-[14px] py-[12px]
                rounded-[10px]
                bg-transparent
                border border-[#5EEBFF]
                text-[#E0F7FF]
                outline-none
                focus:ring-2 focus:ring-[#38BDF8]
                indent-[8px]
              "
            />
          </div>

        <div className="flex flex-col gap-[6px]">
            <label className="text-sm text-[#BEE9FF]">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              disabled={isLoading}
               onChange={(e) => setPassword(e.target.value)}
              className="
                h-[46px]
                px-[14px] py-[12px]
                rounded-[10px]
                bg-transparent
                border border-[#5EEBFF]
                text-[#E0F7FF]
                outline-none
                focus:ring-2 focus:ring-[#38BDF8]
                indent-[8px]
              "
            />
          </div>

           <button
           type="submit"
          disabled={isLoading}
            className="
              mt-[8px]
              h-[46px]
              rounded-full
              font-semibold
              tracking-[1px]
              text-[#001B2E]
              bg-gradient-to-r from-[#38BDF8] via-[#5EEBFF] to-[#22D3EE]
              hover:scale-[1.03]
              transition
            "
            style={{
              boxShadow: `
                0 0 18px rgba(94, 235, 255, 0.7),
                0 0 36px rgba(56, 189, 248, 0.45)
              `,
            }}
          >
            {isLoading ? "SIGNING IN..." : "ENTER THE FEST"}
        </button>

        {/* Links */}
          <div className="mt-[10px] text-center text-[14px] flex flex-col gap-[6px] items-center">
            <Link
              to="/forgot-password"
              className="text-[#9FE7FF] underline hover:text-[#5EEBFF] transition"
            >
              Forgot Password?
            </Link>

            <Link
              to="/signup"
              className="text-[#9FE7FF] underline hover:text-[#5EEBFF] transition"
            >
              Create New Account
            </Link>
          </div>
        </div>
     </form>
      </div>
    </div>
  );
}

     
