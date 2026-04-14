import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const API_URL = "http://localhost:8080";

const Login = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();
  const toast     = useToast();

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});

  const from = location.state?.from?.pathname || "/";

  const validate = () => {
    const errs = {};
    if (!email.trim())    errs.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password)        errs.password = "Password is required";
    return errs;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/user/login`, { email: email.trim().toLowerCase(), password });
      if (data?.success) {
        login(data.user);
        toast.success("Welcome back! 🎉");
        navigate(from, { replace: true });
      } else {
        toast.error(data?.message || "Invalid credentials.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="orb orb-purple w-[500px] h-[500px] -top-40 -left-40 opacity-25" />
      <div className="orb orb-rose   w-[400px] h-[400px] -bottom-20 -right-20 opacity-20" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Card */}
        <div className="glass-dark border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-rose-DEFAULT mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Sign in to your Color Insight account</p>
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Email</label>
              <input
                type="email"
                className={`input-field ${errors.email ? "border-rose-DEFAULT focus:border-rose-DEFAULT" : ""}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                autoComplete="email"
              />
              {errors.email && <p className="text-rose-DEFAULT text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input-field pr-12 ${errors.password ? "border-rose-DEFAULT focus:border-rose-DEFAULT" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-white transition-colors"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-rose-DEFAULT text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full py-4 text-base mt-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#d872f9] hover:text-white transition-colors font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
