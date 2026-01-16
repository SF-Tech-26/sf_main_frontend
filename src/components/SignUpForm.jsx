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
    h-[50px] w-full px-4 rounded-xl 
    bg-white/15 border border-purple-500/20
    text-purple-50 placeholder-purple-300/30 outline-none transition-all duration-300
    focus:border-purple-400/60 focus:bg-white/20 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]
    disabled:opacity-50
  `;

  const labelClass = "text-xs font-semibold text-purple-200/60 uppercase tracking-widest ml-1 drop-shadow-sm";

  return (
    <div className=" w-[90%] flex justify-center py-10 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div
        className="relative w-[450px] max-w-[95%] max-h-[85vh] flex flex-col rounded-[24px] border border-purple-500/20 backdrop-blur-xl text-gray-200 shadow-2xl bg-black/70 overflow-y-auto scrollbar-hide"
        style={{ padding: "40px 32px" }}
      >
        <h1 className="text-center font-bold tracking-tight mb-[30px] bg-clip-text text-transparent bg-gradient-to-r from-black via-indigo-700 to-blue-950 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] text-[30px]">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl text-xs text-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Identity */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[10px] font-bold text-purple-400/60 uppercase tracking-[0.2em] border-b border-purple-500/10 pb-1">Identity</h2>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Email</label>
                <input className={inputClass} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="user@guild.com" />
              </div>
            </section>

            {/* Vitals */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[10px] font-bold text-purple-400/60 uppercase tracking-[0.2em] border-b border-purple-500/10 pb-1">Vital Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Mobile</label>
                  <input className={inputClass} name="mobile" value={formData.mobile} onChange={handleChange} placeholder="1234567890" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>DOB</label>
                  <input className={inputClass} type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Gender</label>
                <select className={inputClass} name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="" className="bg-indigo-950">Select</option>
                  <option value="M" className="bg-indigo-950">Male</option>
                  <option value="F" className="bg-indigo-950">Female</option>
                  <option value="O" className="bg-indigo-950">Other</option>
                </select>
              </div>
            </section>

            {/* Security */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[10px] font-bold text-purple-400/60 uppercase tracking-[0.2em] border-b border-purple-500/10 pb-1">Security</h2>
              <input className={inputClass} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              <input className={inputClass} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
            </section>
          </div>

          <div className="flex justify-center scale-90">
            <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} theme="dark" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-[50px] rounded-xl font-bold text-white bg-gradient-to-r from-indigo-950 to-blue-900 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10"
          >
            {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>

          <p className="text-center text-sm text-purple-200/40">
            Already registered?{" "}
            <Link to="/signin" className="text-blue-700 font-medium hover:text-fuchsia-300 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}