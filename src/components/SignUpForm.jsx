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

  const inputClass = "w-full px-4 py-2 rounded-lg bg-purple-950 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50";

  return (
    <div className="w-full max-w-md bg-purple-900/80 backdrop-blur-xl border border-purple-500 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
      <h1 className="text-center text-4xl font-creepster text-orange-400 mb-4">
        SIGN UP
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Personal Information */}
        <input
          className={inputClass}
          placeholder="Full Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          placeholder="Email Address *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          placeholder="Phone Number (10 digits) *"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          disabled={isLoading}
        />
        <select
          className={inputClass}
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">Select Gender *</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>

        <h2 className="text-orange-300 font-creepster text-xl mt-4">
          College Information
        </h2>

        <input
          className={inputClass}
          placeholder="College Name *"
          name="college"
          value={formData.college}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          placeholder="Year of Passing *"
          name="yop"
          type="number"
          min="2020"
          max="2035"
          value={formData.yop}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          placeholder="Address"
          name="addr"
          value={formData.addr}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          placeholder="City *"
          name="city"
          value={formData.city}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          placeholder="State *"
          name="state"
          value={formData.state}
          onChange={handleChange}
          disabled={isLoading}
        />

        <h2 className="text-orange-300 font-creepster text-xl mt-4">
          Security Information
        </h2>

        <input
          className={inputClass}
          placeholder="Security Question *"
          name="security_question"
          value={formData.security_question}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          placeholder="Security Answer *"
          name="security_answer"
          value={formData.security_answer}
          onChange={handleChange}
          disabled={isLoading}
        />

        <h2 className="text-orange-300 font-creepster text-xl mt-4">
          Account Credentials
        </h2>

        <input
          className={inputClass}
          type="password"
          placeholder="Password (min 6 characters) *"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Confirm Password *"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
        />

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
          className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "REGISTERING..." : "ENTER THE FEST"}
        </button>

        <p className="text-center text-sm text-purple-200 mt-3">
          Already have an account?{" "}
          <Link to="/signin" className="text-orange-400 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
