import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";

// Production reCAPTCHA site key
const RECAPTCHA_SITE_KEY = "6LcfDKsrAAAAALOedfX8knxtsIJpPqnwQ_h3LdjB";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    college: "",
    yop: "",
    addr: "",
    city: "",
    state: "",
    security_question: "",
    security_answer: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const recaptchaRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = [
      "name", "email", "mobile", "dob", "gender", "password",
      "confirmPassword", "college", "yop", "city", "state",
      "security_question", "security_answer"
    ];

    for (const field of required) {
      if (!formData[field]) {
        return `Please fill in the ${field.replace("_", " ")} field`;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.mobile)) {
      return "Please enter a valid 10-digit phone number";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const captchaValue = recaptchaRef.current?.getValue();
    if (!captchaValue) {
      setError("Please complete the CAPTCHA verification");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        dob: formData.dob,
        gender: formData.gender,
        password: formData.password,
        college: formData.college,
        yop: parseInt(formData.yop),
        addr: formData.addr || "N/A",
        city: formData.city,
        state: formData.state,
        security_question: formData.security_question,
        security_answer: formData.security_answer,
        captcha: captchaValue,
      };

      const response = await registerUser(payload);

      if (response.code === 0 || response.status === 200) {
        toast.success("Registration successful! Please sign in.");
        navigate("/signin");
      } else {
        setError(response.message || "Registration failed. Please try again.");
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  // Updated input styling to match the Dark Magical theme
  const inputClass = `
    h-[46px]
    w-full
    px-[14px] py-[12px]
    rounded-[10px]
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
    disabled:opacity-50
  `;

  const labelClass = "text-xs font-semibold text-purple-200/60 uppercase tracking-widest ml-1 drop-shadow-sm";

  return (
    <div className="relative flex justify-center items-center py-10">
       {/* Ambient Glow Background for the card */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-purple-600/20 rounded-full blur-[90px] pointer-events-none"></div>

      <div
        className="
          relative
          w-[360px] max-w-[95%]
          h-[75vh]
          overflow-y-auto
          backdrop-blur-xl
          border border-purple-500/20
          rounded-[24px]
          text-gray-200
          px-[32px] py-[40px]
          shadow-2xl
          scrollbar-hide
          bg-black/30
        "
        style={{
          boxShadow: "0 20px 50px -12px rgba(88, 28, 135, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        <h1
          className="
            text-center
            font-bold
            tracking-tight
            text-[30px]
            mb-[28px]
            bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200
            drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]
          "
        >
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] flex-grow items-center">
          {error && (
             <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl text-xs text-center shadow-[0_0_10px_rgba(239,68,68,0.2)] w-full">
              {error}
            </div>
          )}

          {/* Section: Personal Info */}
          <div className="w-full max-w-[300px] mt-2">
            <h2 className="text-sm font-bold text-fuchsia-300/80 uppercase tracking-widest mb-4 border-b border-purple-500/30 pb-1">
              Personal Info
            </h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Full Name</label>
                <input
                  className={inputClass}
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Email</label>
                <input
                  className={inputClass}
                  placeholder="user@guild.com"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Phone Number</label>
                <input
                  className={inputClass}
                  placeholder="1234567890"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Date of Birth</label>
                <input
                  className={inputClass}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Gender</label>
                <select
                  className={inputClass}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="" className="bg-[#1a1025] text-gray-300">Select Gender</option>
                  <option value="M" className="bg-[#1a1025] text-gray-300">Male</option>
                  <option value="F" className="bg-[#1a1025] text-gray-300">Female</option>
                  <option value="O" className="bg-[#1a1025] text-gray-300">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Academic */}
          <div className="w-full max-w-[300px] mt-2">
            <h2 className="text-sm font-bold text-fuchsia-300/80 uppercase tracking-widest mb-4 border-b border-purple-500/30 pb-1">
              Academic Info
            </h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>College</label>
                <input
                  className={inputClass}
                  placeholder=""
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Passing Year</label>
                <input
                  className={inputClass}
                  placeholder="2026"
                  name="yop"
                  type="number"
                  min="2020"
                  max="2035"
                  value={formData.yop}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="w-full max-w-[300px] mt-2">
            <h2 className="text-sm font-bold text-fuchsia-300/80 uppercase tracking-widest mb-4 border-b border-purple-500/30 pb-1">
              Location
            </h2>
             
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Address</label>
                <input
                  className={inputClass}
                  placeholder=""
                  name="addr"
                  value={formData.addr}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  placeholder="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>State</label>
                <input
                  className={inputClass}
                  placeholder=""
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Section: Security */}
          <div className="w-full max-w-[300px] mt-2">
            <h2 className="text-sm font-bold text-fuchsia-300/80 uppercase tracking-widest mb-4 border-b border-purple-500/30 pb-1">
              Security
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Security Question</label>
                <input
                  className={inputClass}
                  placeholder="First pet's name?"
                  name="security_question"
                  value={formData.security_question}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Security Answer</label>
                <input
                  className={inputClass}
                  placeholder="Answer"
                  name="security_answer"
                  value={formData.security_answer}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Password</label>
                <input
                  className={inputClass}
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Confirm Password</label>
                <input
                  className={inputClass}
                  type="password"
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center my-2 scale-90">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              theme="dark"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              mt-[12px]
              h-[50px]
              mx-auto
              w-full max-w-[300px]
              rounded-xl
              font-bold
              tracking-wide
              text-white
              bg-gradient-to-r from-violet-600 to-fuchsia-600
              hover:from-violet-500 hover:to-fuchsia-500
              hover:scale-[1.02]
              hover:shadow-[0_0_30px_rgba(192,38,211,0.4)]
              shadow-[0_0_20px_rgba(139,92,246,0.3)]
              transition-all
              duration-300
              border border-white/10
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            "
          >
            {isLoading ? "CASTING ACCOUNT" : "CREATE ACCOUNT"}
          </button>

          <p className="mt-[14px] text-center text-sm text-purple-200/50">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-fuchsia-400 font-medium hover:text-fuchsia-300 hover:underline decoration-fuchsia-500/30 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}