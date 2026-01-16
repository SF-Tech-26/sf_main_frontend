import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { loginUser, googleLogin } from "../services/authService";
import { useGoogleLogin } from "@react-oauth/google";


export default function SignInForm() {

const handleGoogleSuccess = async (tokenResponse) => {
    setIsLoading(true);
    try {
      const response = await googleLogin(tokenResponse.access_token);
      if (response.code === 0) {
        const { token, data } = response.data;
        login(token, data);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        setError(response.message || "Google Login failed.");
      }
    } catch (err) {
      setError("Google Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google Login Failed"),
  });

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
      w-[300px] max-w-[80%]
      min-h-[400px]
      flex flex-col
      rounded-[40px]
      border
      backdrop-blur-[12px]
      text-[#e4ece8]
    "
   
style={{
  padding: "25px 25px",
  background: "rgba(10,14,11,0.92)",
  borderRadius: "36px",

  /* Inner stroke */
  border: "1px solid rgba(214,210,184,0.35)",

  /* Depth + glow */
  boxShadow: `
    inset 0 0 0 1px rgba(214,210,184,0.12),
    0 0 18px rgba(214,210,184,0.25),
    0 0 80px rgba(0,0,0,0.9)
  `,
}}


  >
    <h1
      className="text-center font-bold tracking-wider mb-[15px]"
      style={{
        fontSize: "34px",
        color: "#e6d9a2",
        textShadow: `
          0 0 6px rgba(230, 217, 162, 0.6),
          0 0 14px rgba(180, 170, 120, 0.4),
          0 0 28px rgba(90, 110, 95, 0.35)
        `,
      }}
    >
      SIGN IN
    </h1>

    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-[14px] flex-grow">
        {/* Email */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-sm text-[#9fb3a4]">Email</label>
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
              border
              text-[#e4ece8]
              outline-none
              focus:ring-2
              indent-[2px]
            "
<<<<<<< HEAD
          >
            {isLoading ? "Logging in" : "Log in"}
          </button>
=======
            style={{
              borderColor: "rgba(230, 217, 162, 0.35)",
              boxShadow: "inset 0 0 0 rgba(0,0,0,0)",
            }}
          />
        </div>
>>>>>>> 204529a (signin signup done)

        {/* Password */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-sm text-[#9fb3a4]">Password</label>
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
              border
              text-[#e4ece8]
              outline-none
              focus:ring-2
              indent-[2px]
            "
            style={{
              borderColor: "rgba(230, 217, 162, 0.35)",
            }}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            mt-[8px]
            h-[46px]
            rounded-[15px]
            font-semibold
            tracking-[1px]
            text-[#1a1a14]
            transition
            hover:scale-[1.03]
          "
          style={{
            background:
              "linear-gradient(to right, #e6d9a2, #b8ad7d, #8f845a)",
            boxShadow: `
              0 0 10px rgba(230, 217, 162, 0.35),
              0 0 22px rgba(90, 110, 95, 0.35)
            `,
          }}
        >
          {isLoading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <div className="flex items-center gap-4 my-1">
  <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent flex-1"></div>
  <span className="text-purple-300/40 text-[10px] font-bold tracking-widest uppercase">
    OR
  </span>
  <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent flex-1"></div>
</div>


<button
            type="button"
            onClick={() => loginWithGoogle()}
            disabled={isLoading}
            className="
              h-[50px]
              rounded-xl
              font-semibold
              text-purple-100/80
              bg-white/[0.03]
              border border-purple-500/10
              hover:bg-purple-500/10
              hover:border-purple-400/30
              hover:text-white
              transition-all
              duration-300
              flex items-center justify-center gap-3
              hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]
            "
          >
            <FcGoogle size={22} className="drop-shadow-sm" />
            Google
          </button>



        {/* Links */}
        <div className="mt-[10px] text-center text-[14px] flex flex-col gap-[6px] items-center">
          <Link
            to="/forgot-password"
            className="text-[#b8ad7d] underline hover:text-[#e6d9a2] transition"
          >
            Forgot Password?
          </Link>

          <Link
            to="/signup"
            className="text-[#b8ad7d] underline hover:text-[#e6d9a2] transition"
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

     
