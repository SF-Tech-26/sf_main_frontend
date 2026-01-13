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

  const inputClass = `
    h-[46px]
    w-full
    px-[14px] py-[12px]
    rounded-[10px]
    bg-transparent
    border border-[#7DF9FF]
    text-[#F0FDFF]
    outline-none
    focus:ring-2 focus:ring-[#60A5FA]
    indent-[8px]
    disabled:opacity-50
  `;
  
  return (
    <div
      className="
        w-[330px] max-w-[90%]
        h-[50vh]
        overflow-y-auto
        backdrop-blur-[12px]
        border border-[#7DF9FF]
        rounded-[40px]
        text-[#E6FBFF]
        px-[32px] py-[40px]
      "
      style={{
        background: "rgba(10, 20, 44, 0.92)",
        boxShadow: `
          0 0 35px rgba(125, 249, 255, 0.55),
          0 0 80px rgba(56, 189, 248, 0.35),
          0 0 140px rgba(167, 139, 250, 0.18)
        `,
      }}
    >
      <h1
        className="
          text-center
          font-bold
          tracking-wider
          text-[34px]
          mb-[28px]
        "
        style={{
          color: "#F0FDFF",
          textShadow: `
            0 0 10px rgba(125, 249, 255, 1),
            0 0 26px rgba(56, 189, 248, 0.85),
            0 0 52px rgba(167, 139, 250, 0.45)
          `,
        }}
      >
        SIGN UP
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] flex-grow items-center">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm w-full max-w-[300px]">
            {error}
          </div>
        )}

        <h2 className="text-[18px] font-semibold text-[#C7F5FF]">
          Personal Information
        </h2>

        {/* Full Name */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Full Name</label>
          <input
            className={inputClass}
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Email</label>
          <input
            className={inputClass}
            placeholder="abc@gmail.com"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Phone Number</label>
          <input
            className={inputClass}
            placeholder="Phone Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Date of Birth</label>
          <input
            className={inputClass}
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Gender</label>
          <select
            className={inputClass}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>

        <h2 className="text-[18px] font-semibold text-[#C7F5FF] mt-[6px]">
          College Information
        </h2>

        {/* College */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">College</label>
          <input
            className={inputClass}
            placeholder="College"
            name="college"
            value={formData.college}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* Passing Year */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Passing Year</label>
          <input
            className={inputClass}
            placeholder="Passing Year"
            name="yop"
            type="number"
            min="2020"
            max="2035"
            value={formData.yop}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Address</label>
          <input
            className={inputClass}
            placeholder="Address"
            name="addr"
            value={formData.addr}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* City */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">City</label>
          <input
            className={inputClass}
            placeholder="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* State */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">State</label>
          <input
            className={inputClass}
            placeholder="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        <h2 className="text-[18px] font-semibold text-[#C7F5FF] mt-[6px]">
          Security Information
        </h2>

        {/* Security Question */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Security Question</label>
          <input
            className={inputClass}
            placeholder="Security Question"
            name="security_question"
            value={formData.security_question}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* Security Answer */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Security Answer</label>
          <input
            className={inputClass}
            placeholder="Security Answer"
            name="security_answer"
            value={formData.security_answer}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        <h2 className="text-[18px] font-semibold text-[#C7F5FF] mt-[6px]">
          Account Credentials
        </h2>

        {/* Password */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Password</label>
          <input
            className={inputClass}
            type="password"
            placeholder="********"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-[6px] w-full mx-auto max-w-[300px]">
          <label className="text-sm text-[#C7F5FF]">Confirm Password</label>
          <input
            className={inputClass}
            type="password"
            placeholder="********"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              boxShadow: "inset 0 0 12px rgba(125, 249, 255, 0.15)",
            }}
          />
        </div>

        <div className="flex justify-center my-4">
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
            h-[46px]
            mx-auto
            w-full max-w-[300px]
            rounded-full
            font-semibold
            tracking-wider
            text-[#020617]
            bg-gradient-to-r from-[#38BDF8] via-[#7DF9FF] to-[#A78BFA]
            hover:scale-[1.03]
            transition
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          "
          style={{
            boxShadow: `
              0 0 22px rgba(125, 249, 255, 0.9),
              0 0 50px rgba(56, 189, 248, 0.65),
              0 0 90px rgba(167, 139, 250, 0.45)
            `,
          }}
        >
          {isLoading ? "REGISTERING..." : "CREATE ACCOUNT"}
        </button>

        <p className="mt-[14px] text-center text-sm text-[#C7F5FF]">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="underline text-[#9FE7FF] hover:text-[#7DF9FF] transition"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}