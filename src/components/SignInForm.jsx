import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loginUser, googleLogin } from "../services/authService";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

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
        const { token, data } = response.data;
        login(token, data);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="w-full flex justify-center py-10 relative overflow-hidden">
      {/* Decorative ambient glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div
        className="
          relative
          w-[380px] max-w-[95%]
          min-h-[450px]
          flex flex-col
          rounded-[24px]
          border border-purple-500/20
          backdrop-blur-xl
          text-gray-200
          shadow-2xl
          bg-black/30
        "
        style={{
          // Deep magical gradient background
          // Mystical purple glow shadow
          boxShadow: "0 25px 50px -12px rgba(88, 28, 135, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
          padding: "48px 32px",
        }}
      >
        <h1
          className="text-center font-bold tracking-tight mb-[30px] bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          style={{
            fontSize: "30px",
            letterSpacing: "-0.5px",
          }}
        >
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl text-xs text-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-purple-200/60 uppercase tracking-widest ml-1 drop-shadow-sm">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              placeholder="mage@guild.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="
                h-[50px]
                px-4
                rounded-xl
                bg-black/20
                border border-purple-500/20
                text-purple-50
                placeholder-purple-300/20
                outline-none
                transition-all
                duration-300
                focus:border-purple-400/60
                focus:bg-purple-900/10
                focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-purple-200/60 uppercase tracking-widest ml-1 drop-shadow-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              className="
                h-[50px]
                px-4
                rounded-xl
                bg-black/20
                border border-purple-500/20
                text-purple-50
                placeholder-purple-300/20
                outline-none
                transition-all
                duration-300
                focus:border-purple-400/60
                focus:bg-purple-900/10
                focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]
              "
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              mt-2
              h-[50px]
              rounded-xl
              font-bold
              text-white
              bg-gradient-to-r from-violet-600 to-fuchsia-600
              hover:from-violet-500 hover:to-fuchsia-500
              active:scale-[0.98]
              transition-all
              duration-300
              shadow-[0_0_20px_rgba(139,92,246,0.3)]
              hover:shadow-[0_0_30px_rgba(192,38,211,0.5)]
              border border-white/10
            "
          >
            {isLoading ? "logging in" : "Enter fest"}
          </button>

          <div className="flex items-center gap-4 my-1">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent flex-1"></div>
            <span className="text-purple-300/40 text-[10px] font-bold tracking-widest uppercase">OR</span>
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

          <div className="mt-4 text-center text-sm flex flex-col gap-3">
            <Link
              to="/forgot-password"
              className="text-purple-300/50 hover:text-purple-200 transition-colors hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]"
            >
              Forgot Password?
            </Link>
            <p className="text-purple-200/40">
              New to the guild?{" "}
              <Link to="/signup" className="text-fuchsia-400 font-medium hover:text-fuchsia-300 hover:underline decoration-fuchsia-500/30">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}