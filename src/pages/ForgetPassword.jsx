import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import bgImage from "../assets/images/homeBg.webp";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState(''); // Kept as per your original code

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const [confirm, setConfirm] = useState("");
  const handleConfirm = (e) => {
    setConfirm(e.target.value);
  };
  
  // Timer states for 5-minute cooldown
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const navigate = useNavigate();

  // Timer effect - counts down every second
  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setOtpDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [remainingTime]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const disableWithTimer = () => {
    setOtpDisabled(true);
    setRemainingTime(300); // 5 minutes = 300 seconds
  };

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
        "https://masterapi.springfest.in/api/user/forgotPassword/otpRemoveQA",
        {
          email: formData.email,
        }
      );

      if (response.data.code === 0) {
        toast.success(response.data.message || "OTP Sent Successfully!");
        disableWithTimer(); // Start 5-minute timer
        setStep(2);
      } else {
        setError(response.data.message || "Failed to send OTP");
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to send OTP";
      setError(msg);
      
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
    
    // Validate password match
    if (formData.password !== confirm) {
      setIsLoading(false);
      toast.error("Confirm password should match password");
      return;
    }

    try {
      const response = await axios.post(
        "https://masterapi.springfest.in/api/user/forgotPassword/verifyOtp",
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
          otp: "",
          password: "",
        });
        setConfirm("");
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
        "The OTP is now invalid. Please request a new OTP.",
        {
          icon: "⚠️",
          duration: 6000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://masterapi.springfest.in/api/user/forgotPassword/otpRemoveQA",
        {
          email: formData.email,
        }
      );

      if (response.data.code === 0) {
        toast.success(response.data.message || "OTP Resent Successfully!");
        disableWithTimer(); // Start 5-minute timer again
        // Clear OTP field
        setFormData({ ...formData, otp: "" });
      } else {
        setError(response.data.message || "Failed to resend OTP");
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to resend OTP";
      setError(msg);
      
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

  // Updated Theme Styles
  const inputStyle = `
    h-[46px] px-[14px] py-[12px] rounded-[10px] w-full
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
    indent-[4px]
  `;

  const labelStyle = "text-xs font-semibold text-purple-200/60 uppercase tracking-widest ml-1 drop-shadow-sm";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: 'fixed',
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Ambient Glow Background behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div style={{ transform: "translateY(clamp(40px, 10vh, 120px))" }} className="relative z-10">
        <div className="w-full flex justify-center">
          <div
            className="
              w-[350px] max-w-[90%] min-h-[420px] flex flex-col
              rounded-[24px] border border-purple-500/20 backdrop-blur-xl
              text-gray-200
              bg-black/30
            "
            style={{
              
              padding: "40px 32px",
            }}
          >
            <h1
              className="
                text-center font-bold tracking-wider mb-[26px]
                bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200
                drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]
              "
              style={{
                fontSize: "28px",
              }}
            >
              {step === 1 ? "RECOVER ACCOUNT" : "RESET PASSWORD"}
            </h1>

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2 rounded-xl text-xs text-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-[18px] flex-grow">
                <div className="flex flex-col gap-[6px]">
                  <label className={labelStyle}>Email</label>
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

                <div className="text-xs text-purple-200/40 mt-1 text-center">
                  Limited to 5 OTP requests per hour
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    mt-[8px] h-[46px] rounded-xl font-semibold tracking-[1px]
                    text-white
                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                    hover:from-violet-500 hover:to-fuchsia-500
                    hover:scale-[1.03] transition-all duration-300
                    shadow-[0_0_20px_rgba(139,92,246,0.3)]
                    hover:shadow-[0_0_30px_rgba(192,38,211,0.5)]
                    border border-white/10
                    disabled:opacity-70 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? "SENDING..." : "GET OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyReset} className="flex flex-col gap-[18px] flex-grow">
                <p className="text-center text-xs text-purple-200/60 bg-purple-500/10 py-2 rounded-lg border border-purple-500/20">
                  OTP sent to <span className="text-purple-200 font-semibold">{formData.email}</span>
                </p>
                
                <div className="flex flex-col gap-[6px]">
                  <label className={labelStyle}>Enter OTP</label>
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
                  <label className={labelStyle}>New Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="New password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    pattern="^(?=.*[A-Z])(?=.*[\W_]).{8,}$"
                    minLength={8}
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className={labelStyle}>Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={handleConfirm}
                    className={inputStyle}
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    mt-[8px] h-[46px] rounded-xl font-semibold tracking-[1px]
                    text-white
                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                    hover:from-violet-500 hover:to-fuchsia-500
                    hover:scale-[1.03] transition-all duration-300
                    shadow-[0_0_20px_rgba(139,92,246,0.3)]
                    hover:shadow-[0_0_30px_rgba(192,38,211,0.5)]
                    border border-white/10
                    disabled:opacity-70 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? "VERIFYING..." : "RESET PASSWORD"}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpDisabled || isLoading}
                  className="text-xs text-fuchsia-400/80 underline mt-2 hover:text-fuchsia-300 decoration-fuchsia-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpDisabled 
                    ? `Resend OTP in ${formatTime(remainingTime)}` 
                    : "Resend OTP"}
                </button>
              </form>
            )}

            <div className="mt-[20px] text-center text-[14px] flex flex-col gap-[6px] items-center">
              <Link
                to="/signin"
                className="text-purple-300/50 hover:text-purple-200 transition-colors hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.5)] flex items-center gap-2"
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