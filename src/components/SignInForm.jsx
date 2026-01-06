import { Link } from "react-router-dom";

export default function SignInForm() {
  return (
    <div className="w-full max-w-md bg-purple-900/80 backdrop-blur-xl border border-purple-500 rounded-2xl p-6 shadow-2xl">
      <h1 className="text-center text-4xl font-creepster text-orange-400 mb-6">
        SIGN IN
      </h1>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 rounded-lg bg-purple-950 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-lg bg-purple-950 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold tracking-wide hover:scale-105 transition">
          ENTER THE FEST
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
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

