import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import bgImage from "../assets/images/bgpic.jpg";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    security_question: "",
    security_answer: "",
    otp: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // API 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/forgotPassword/requestOtp",
        {
          email: formData.email,
          security_question: formData.security_question,
          security_answer: formData.security_answer,
        }
      );

      if (response.data.code === 0) {
        toast.success(response.data.message || "OTP Sent Successfully!");
        setStep(2);
      } else {
        setError(response.data.message || "Failed to send OTP");
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Server Error";
      setError(msg);
      
      // Handle rate limiting
      if (msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("hour")) {
        toast.error("Rate limit exceeded (5 requests/hour). Please try again later.");
      } else if (err.response?.status === 429) {
        toast.error("Too many requests. Please wait before trying again.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // API 2: Verify OTP & Reset Password
  const handleVerifyReset = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/forgotPassword/verifyOtp",
        {
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        }
      );

      // Success handling - check both code and status
      if (response.data.code === 0 || response.status === 200) {
        toast.success("Password Reset Successfully!");
        // Clear form data for security
        setFormData({
          email: "",
          security_question: "",
          security_answer: "",
          otp: "",
          password: "",
        });
        navigate("/signin");
      } else {
        setError(response.data.message || "Verification Failed");
        toast.error(response.data.message || "Verification Failed");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Invalid OTP or Server Error";
      setError(msg);
      
      // Clear OTP field on failure since it's now invalid
      setFormData({ ...formData, otp: "" });
      
      toast.error("OTP verification failed");
      
      // Inform user that OTP is now invalid and they need a new one
      toast(
        "❌ The OTP is now invalid. Please request a new OTP.",
        {
          icon: "⚠️",
          duration: 6000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = `
    h-[46px] px-[14px] py-[12px] rounded-[10px] bg-transparent
    border border-[#5EEBFF] text-[#E0F7FF] outline-none
    focus:ring-2 focus:ring-[#38BDF8] indent-[8px] w-full
  `;

  const buttonStyle = {
    boxShadow: `
      0 0 18px rgba(94, 235, 255, 0.7),
      0 0 36px rgba(56, 189, 248, 0.45)
    `,
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ transform: "translateY(clamp(40px, 10vh, 120px))" }}>
        <div className="w-full flex justify-center">
          <div
            className="
              w-[350px] max-w-[90%] min-h-[420px] flex flex-col
              rounded-[40px] border border-[#5EEBFF] backdrop-blur-[12px]
              text-[#CFF6FF]
            "
            style={{
              background: "rgba(14, 26, 48, 0.88)",
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
                fontSize: "28px",
                color: "#E0F7FF",
                textShadow: `
                  0 0 8px rgba(94, 235, 255, 0.9),
                  0 0 18px rgba(56, 189, 248, 0.6),
                  0 0 36px rgba(56, 189, 248, 0.4)
                `,
              }}
            >
              {step === 1 ? "RECOVER ACCOUNT" : "RESET PASSWORD"}
            </h1>

            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-[18px] flex-grow">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm text-[#BEE9FF]">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="abc@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm text-[#BEE9FF]">Security Question</label>
                  <input
                    name="security_question"
                    type="text"
                    placeholder="e.g. Pet's name?"
                    value={formData.security_question}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm text-[#BEE9FF]">Security Answer</label>
                  <input
                    name="security_answer"
                    type="text"
                    placeholder="Answer"
                    value={formData.security_answer}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>

                <div className="text-xs text-[#BEE9FF]/60 mt-1">
                  ⚠️ Limited to 5 OTP requests per hour
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    mt-[8px] h-[46px] rounded-full font-semibold tracking-[1px]
                    text-[#001B2E] bg-gradient-to-r from-[#38BDF8] via-[#5EEBFF] to-[#22D3EE]
                    hover:scale-[1.03] transition disabled:opacity-70 disabled:cursor-not-allowed
                  "
                  style={buttonStyle}
                >
                  {isLoading ? "SENDING..." : "GET OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyReset} className="flex flex-col gap-[18px] flex-grow">
                <p className="text-center text-xs text-[#BEE9FF]/70">
                  OTP sent to {formData.email}
                </p>
                
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm text-[#BEE9FF]">Enter OTP</label>
                  <input
                    name="otp"
                    type="text"
                    placeholder="123456"
                    value={formData.otp}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    maxLength={6}
                  />
                </div>
                
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm text-[#BEE9FF]">New Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="New strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    mt-[8px] h-[46px] rounded-full font-semibold tracking-[1px]
                    text-[#001B2E] bg-gradient-to-r from-[#38BDF8] via-[#5EEBFF] to-[#22D3EE]
                    hover:scale-[1.03] transition disabled:opacity-70 disabled:cursor-not-allowed
                  "
                  style={buttonStyle}
                >
                  {isLoading ? "VERIFYING..." : "RESET PASSWORD"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setFormData({ ...formData, otp: "", password: "" });
                  }}
                  className="text-xs text-[#5EEBFF] underline mt-2 hover:text-white transition"
                >
                  Request New OTP
                </button>
              </form>
            )}

            <div className="mt-[20px] text-center text-[14px] flex flex-col gap-[6px] items-center">
              <Link
                to="/signin"
                className="text-[#9FE7FF] hover:text-[#5EEBFF] transition flex items-center gap-2"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}