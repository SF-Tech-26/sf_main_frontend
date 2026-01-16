import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";

const RECAPTCHA_SITE_KEY = "6LcfDKsrAAAAALOedfX8knxtsIJpPqnwQ_h3LdjB";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", dob: "", gender: "",
    password: "", confirmPassword: "", college: "", yop: "",
    addr: "", city: "", state: "", security_question: "", security_answer: "",
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
    const required = ["name", "email", "mobile", "dob", "gender", "password", "confirmPassword", "college", "yop", "city", "state", "security_question", "security_answer"];
    for (const field of required) {
      if (!formData[field]) return `Please fill in the ${field.replace("_", " ")} field`;
    }
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    const captchaValue = recaptchaRef.current?.getValue();
    if (!captchaValue) { setError("Please complete the CAPTCHA verification"); return; }

    setIsLoading(true);
    try {
      const response = await registerUser({ ...formData, yop: parseInt(formData.yop), captcha: captchaValue });
      if (response.code === 0 || response.status === 200) {
        toast.success("Registration successful!");
        navigate("/signin");
      } else {
        setError(response.message || "Registration failed.");
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  // Updated background to white/15
const inputClass = `
  h-[52px] w-full px-2 rounded-[16px]
  bg-transparent
  border
  text-[#d6d2b8]
  placeholder-[#7f846f]
  outline-none
  transition-all
`;


const labelClass =
  "text-sm text-[#a7ad98] mb-1";

return (


    <div
      className="
        relative
        w-[320px]
        max-w-[80%]
        max-h-[65vh]
        flex flex-col
        rounded-[48px]
        border
        backdrop-blur-xl
        text-[#d6d2b8]
        overflow-y-auto scrollbar-hide
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
        className="text-center font-bold tracking-wider mb-6"
        style={{
          fontSize: "34px",
          color: "#e7e2b6",
          textShadow: "0 0 18px rgba(231,226,182,0.6)",
        }}
      >
        SIGN UP
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-2 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <label className={labelClass}>Full Name *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

        <label className={labelClass}>Email *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
        />

        <label className={labelClass}>Password *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 8 characters"
        />

        <label className={labelClass}>Confirm Password *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
        />

        <label className={labelClass}>Gender *</label>
        <select
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>

        <label className={labelClass}>Date of Birth *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <label className={labelClass}>Mobile Number *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="10-digit mobile number"
        />

        <label className={labelClass}>Year of Passing *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="yop"
          value={formData.yop}
          onChange={handleChange}
          placeholder="e.g., 2027"
        />

        <label className={labelClass}>College / University *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="Your institution name"
        />

        <label className={labelClass}>State *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Select State"
        />

        <label className={labelClass}>City *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Select City"
        />

        <label className={labelClass}>Security Question *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="security_question"
          value={formData.security_question}
          onChange={handleChange}
          placeholder="e.g., What is your favorite color?"
        />

        <label className={labelClass}>Security Answer *</label>
        <input
          className={inputClass}
          style={{ borderColor: "rgba(214,210,184,0.35)" }}
          name="security_answer"
          value={formData.security_answer}
          onChange={handleChange}
          placeholder="Enter Answer"
        />

        <div className="flex justify-center scale-90">
          <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} theme="dark" />
        </div>

       <button
  type="submit"
  disabled={isLoading}
  className="h-[43px] rounded-[15px] font-semibold tracking-wider text-[#1a1a12]"
 style={{
            background:
              "linear-gradient(to right, #e6d9a2, #b8ad7d, #8f845a)",
            boxShadow: `
              0 0 10px rgba(230, 217, 162, 0.35),
              0 0 22px rgba(90, 110, 95, 0.35)
            `,
          }}
>

          {isLoading ? "CREATING..." : "SIGN UP"}
        </button>

        <p className="text-center text-sm text-[#9e9a7a]">
          Already registered?{" "}
          <Link to="/signin" className="underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>

);



}