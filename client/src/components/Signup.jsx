import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock, FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { registerUser } from "../redux/slice/auth/authThunk";
import { getApiBaseUrl } from "./ui/fileHelpers";

const backgroundNodes = [
  "left-[14%] top-1/4",
  "right-[14%] top-1/4",
  "left-[14%] bottom-1/4",
  "right-[14%] bottom-1/4",
];

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordRules = useMemo(() => [
    { label: "8+ characters", valid: formData.password.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(formData.password) },
    { label: "Lowercase", valid: /[a-z]/.test(formData.password) },
    { label: "Number", valid: /[0-9]/.test(formData.password) },
    { label: "Special", valid: /[^A-Za-z0-9]/.test(formData.password) },
  ], [formData.password]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.fullname || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all the fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordRules.some((rule) => !rule.valid)) {
      toast.error("Please use a stronger password");
      return;
    }

    const result = await dispatch(registerUser(formData));
    if (result.error) {
      toast.error(result.payload);
      return;
    }

    toast.success("Registration successful");
    navigate("/login");
  };

  const handleGoogleLogin = () => {
    window.location.href = `${getApiBaseUrl()}/auth/google`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--primary-bg)] px-4 py-6 text-[var(--text-color)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,232,162,0.22),transparent_28%),radial-gradient(circle_at_center,rgba(149,189,215,0.2),transparent_45%)]" />
        <div className="absolute left-[14%] top-1/4 h-px w-[22%] bg-[#78a4cb]/35" />
        <div className="absolute right-[14%] top-1/4 h-px w-[22%] bg-[#78a4cb]/35" />
        <div className="absolute left-[14%] bottom-1/4 h-px w-[22%] bg-[#78a4cb]/35" />
        <div className="absolute right-[14%] bottom-1/4 h-px w-[22%] bg-[#78a4cb]/35" />
        <div className="absolute left-[35%] top-1/4 h-[18%] w-[6%] border-r border-t border-[#78a4cb]/35" />
        <div className="absolute right-[35%] top-1/4 h-[18%] w-[6%] border-l border-t border-[#78a4cb]/35" />
        <div className="absolute left-[35%] bottom-1/4 h-[18%] w-[6%] border-r border-b border-[#78a4cb]/35" />
        <div className="absolute right-[35%] bottom-1/4 h-[18%] w-[6%] border-l border-b border-[#78a4cb]/35" />
        {backgroundNodes.map((position) => (
          <div
            key={position}
            className={`absolute ${position} h-10 w-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-mid/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(149,189,215,0.45))] shadow-[0_10px_26px_rgba(60,93,120,0.16)]`}
          >
            <div className="absolute inset-y-1/2 right-[-34px] h-px w-8 -translate-y-1/2 bg-[#78a4cb]/35" />
            <div className="absolute inset-y-1/2 right-[-42px] h-3 w-3 -translate-y-1/2 rounded-sm border border-mid/80 bg-white shadow-[0_0_10px_rgba(120,164,203,0.35)]" />
            <div className="absolute left-3 top-4 h-[2px] w-[2px] rounded-full bg-[#78a4cb]/60 shadow-[12px_0_0_rgba(120,164,203,0.28),24px_0_0_rgba(120,164,203,0.2),36px_6px_0_rgba(120,164,203,0.24),16px_16px_0_rgba(120,164,203,0.18),30px_18px_0_rgba(120,164,203,0.28)]" />
          </div>
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl items-center justify-center">
        <section className="w-full max-w-[460px] rounded-[24px] border border-mid bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(149,189,215,0.4))] p-4 shadow-[0_20px_50px_rgba(60,93,120,0.16)] backdrop-blur-xl sm:p-5">
          <div className="mx-auto mb-4 flex w-fit flex-col items-center">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-mid/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(180,225,235,0.75))] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_12px_24px_rgba(60,93,120,0.14)]">
              <div className="absolute left-[-44px] top-1/2 h-px w-9 -translate-y-1/2 bg-[radial-gradient(circle,rgba(120,164,203,0.8)_0,rgba(120,164,203,0)_70%)] opacity-70" />
              <div className="absolute right-[-44px] top-1/2 h-px w-9 -translate-y-1/2 bg-[radial-gradient(circle,rgba(120,164,203,0.8)_0,rgba(120,164,203,0)_70%)] opacity-70" />
              <img src="/logo.png" alt="PasteBox logo" className="h-8 w-8 rounded-xl object-contain" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mb-3.5 flex h-10 w-full items-center justify-center gap-2.5 rounded-2xl border border-mid bg-white/75 text-sm font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:border-deep hover:bg-white"
            aria-label="Continue with Google"
          >
            <FcGoogle className="text-lg" />
            Continue with Google
          </button>

          <div className="mb-3.5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/35">
            <div className="h-px flex-1 bg-mid" />
            <span>or</span>
            <div className="h-px flex-1 bg-mid" />
          </div>

          <div className="text-center">
            <h1 className="text-[1.7rem] font-bold tracking-tight text-ink">Create Account</h1>
            <p className="mt-1.5 text-sm text-ink/65">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-ink transition hover:text-ink/75">
                Login
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            {[
              ["fullname", "text", "Full name", FaRegUser, "name"],
              ["email", "email", "email address", FaRegEnvelope, "email"],
              ["password", "password", "Password", FaLock, "new-password"],
              ["confirmPassword", "password", "Confirm password", FaLock, "new-password"],
            ].map(([name, type, placeholder, Icon, autoComplete]) => (
              <label className="mb-2.5 block" key={name}>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/45" />
                  <input
                    className="w-full rounded-2xl border border-mid bg-white/85 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-deep focus:bg-white focus:outline-none"
                    type={type}
                    name={name}
                    autoComplete={autoComplete}
                    onChange={handleChange}
                    value={formData[name]}
                    placeholder={placeholder}
                  />
                </div>
              </label>
            ))}

            <div className="mb-3.5 flex flex-wrap gap-1.5">
              {passwordRules.map((rule) => (
                <span
                  key={rule.label}
                  className={`rounded-full border px-2.5 py-1 text-[10px] ${
                    rule.valid
                      ? "border-mid bg-deep/15 text-ink"
                      : "border-mid bg-white/70 text-ink/55"
                  }`}
                >
                  {rule.label}
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="mt-0.5 flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#95bdd7,#78a4cb)] px-4 py-3 text-sm font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_30px_rgba(120,164,203,0.28)] hover:translate-y-[-1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs font-medium tracking-[0.24em] text-ink/45 transition hover:text-ink/75">
              PASTEBOX
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
