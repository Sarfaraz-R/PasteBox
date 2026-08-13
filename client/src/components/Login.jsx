import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock, FaRegEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "../redux/slice/auth/authThunk";
import { getApiBaseUrl } from "./ui/fileHelpers";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthError = params.get("oauth_error");
    const oauth = params.get("oauth");

    if (oauthError || oauth === "error") {
      toast.error("Google sign-in could not be completed. Please try again.");
      navigate("/login", { replace: true });
    }
  }, [location.search, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }

    const result = await dispatch(loginUser(formData));
    if (result.error) {
      toast.error(result.payload);
      return;
    }

    toast.success("Login successful");
    navigate("/dashboard");
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
        {[
          "left-[14%] top-1/4",
          "right-[14%] top-1/4",
          "left-[14%] bottom-1/4",
          "right-[14%] bottom-1/4",
        ].map((position) => (
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
        <section className="w-full max-w-[390px] rounded-[26px] border border-mid bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(149,189,215,0.4))] p-5 shadow-[0_22px_60px_rgba(60,93,120,0.18)] backdrop-blur-xl sm:p-6">
          <div className="mx-auto mb-6 flex w-fit flex-col items-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-mid/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(180,225,235,0.75))] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_14px_28px_rgba(60,93,120,0.16)]">
              <div className="absolute left-[-44px] top-1/2 h-px w-9 -translate-y-1/2 bg-[radial-gradient(circle,rgba(120,164,203,0.8)_0,rgba(120,164,203,0)_70%)] opacity-70" />
              <div className="absolute right-[-44px] top-1/2 h-px w-9 -translate-y-1/2 bg-[radial-gradient(circle,rgba(120,164,203,0.8)_0,rgba(120,164,203,0)_70%)] opacity-70" />
              <img src="/logo.png" alt="PasteBox logo" className="h-9 w-9 rounded-xl object-contain" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mb-5 flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-mid bg-white/75 text-sm font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:border-deep hover:bg-white"
            aria-label="Continue with Google"
          >
            <FcGoogle className="text-lg" />
            Continue with Google
          </button>

          <div className="mb-5 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/35">
            <div className="h-px flex-1 bg-mid" />
            <span>or</span>
            <div className="h-px flex-1 bg-mid" />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-ink">Welcome Back</h1>
            <p className="mt-3 text-sm text-ink/65">
              Don&apos;t have an account yet?{" "}
              <Link to="/signup" className="font-semibold text-ink transition hover:text-ink/75">
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7">
            <label className="mb-3.5 block">
              <div className="relative">
                <FaRegEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/45" />
                <input
                  className="w-full rounded-2xl border border-mid bg-white/85 py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-deep focus:bg-white focus:outline-none"
                  type="email"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="email address"
                />
              </div>
            </label>

            <label className="mb-4.5 block">
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/45" />
                <input
                  className="w-full rounded-2xl border border-mid bg-white/85 py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-deep focus:bg-white focus:outline-none"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Password"
                />
              </div>
            </label>

            <button
              type="submit"
              className="mt-1.5 flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#95bdd7,#78a4cb)] px-4 py-3.5 text-sm font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_30px_rgba(120,164,203,0.28)] hover:translate-y-[-1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-medium tracking-[0.24em] text-ink/45 transition hover:text-ink/75">
              PASTEBOX
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
