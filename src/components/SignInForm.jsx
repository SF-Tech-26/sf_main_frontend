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
        navigate("/dashboard");
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
    <div className="w-full max-w-md bg-purple-900/80 backdrop-blur-xl border border-purple-500 rounded-2xl p-6 shadow-2xl">
      <h1 className="text-center text-4xl font-creepster text-orange-400 mb-6">
        SIGN IN
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-purple-950 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-purple-950 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold tracking-wide hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "SIGNING IN..." : "ENTER THE FEST"}
        </button>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-purple-200">
            New User?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:underline font-semibold"
            >
              Sign Up
            </Link>
          </p>

          <p className="text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-purple-200 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
