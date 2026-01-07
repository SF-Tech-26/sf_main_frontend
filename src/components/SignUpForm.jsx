import { Link } from "react-router-dom";

export default function SignUpForm() {
  return (
    <div className="w-full max-w-md bg-purple-900/80 backdrop-blur-xl border border-purple-500 rounded-2xl p- shadow-2xl overflow-y-auto max-h-[90vh]">
      <h1 className="text-center text-4xl font-creepster text-orange-400 mb-4">
        SIGN UP
      </h1>

      <div className="space-y-3">
        <input className="form-input" placeholder="Name" />
        <input className="form-input" placeholder="Email Address" />
        <input className="form-input" placeholder="Phone Number" />
        <input className="form-input" type="date" />
        <input className="form-input" placeholder="Gender" />

        <h2 className="text-orange-300 font-creepster text-xl mt-4">
          College Information
        </h2>

        <input className="form-input" placeholder="College" />
        <input className="form-input" placeholder="Passing Year" />
        <input className="form-input" placeholder="City" />
        <input className="form-input" placeholder="State" />

        <h2 className="text-orange-300 font-creepster text-xl mt-4">
          Account Credentials
        </h2>

        <input className="form-input" type="password" placeholder="Password" />
        <input className="form-input" type="password" placeholder="Confirm Password" />

        <button className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold hover:scale-105 transition">
          ENTER THE FEST
        </button>

        <p className="text-center text-sm text-purple-200 mt-3">
          Already have an account?{" "}
          <Link to="/signin" className="text-orange-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
