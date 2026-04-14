import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "../context/ToastContext";

const API_URL = "http://localhost:8080";

const PASSWORD_RULES = [
  { test: (p) => p.length >= 8,            label: "At least 8 characters" },
  { test: (p) => /[A-Z]/.test(p),          label: "One uppercase letter"  },
  { test: (p) => /[a-z]/.test(p),          label: "One lowercase letter"  },
  { test: (p) => /\d/.test(p),             label: "One number"            },
  { test: (p) => /[@$!%*?&#^()_+]/.test(p),label: "One special character" },
];

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const pct    = (passed / PASSWORD_RULES.length) * 100;
  const color  = pct <= 40 ? "bg-rose-500" : pct <= 70 ? "bg-amber-500" : "bg-emerald-500";
  const label  = pct <= 40 ? "Weak" : pct <= 70 ? "Fair" : pct <= 90 ? "Good" : "Strong";

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= passed ? color : "bg-white/10"}`} />
        ))}
      </div>
      <p className="text-xs text-[var(--text-secondary)]">Strength: <span className="font-medium">{label}</span></p>
    </div>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const toast    = useToast();

  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim())          errs.name     = "Name is required";
    else if (name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!email.trim())         errs.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password)             errs.password = "Password is required";
    else if (!PASSWORD_RULES.every((r) => r.test(password)))
      errs.password = "Password does not meet all requirements";
    return errs;
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/user/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (data?.success) {
        toast.success("Account created! Please sign in. 🎉");
        navigate("/login");
      } else {
        toast.error(data?.message || "Registration failed.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="orb orb-rose   w-[500px] h-[500px] -top-40 -right-40 opacity-25" />
      <div className="orb orb-purple w-[400px] h-[400px] -bottom-20 -left-20 opacity-20" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="glass-dark border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-DEFAULT to-brand-500 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold">Create Account</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Start your color journey today</p>
          </div>

          <form onSubmit={handleRegister} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Full Name</label>
              <input
                type="text"
                className={`input-field ${errors.name ? "border-rose-DEFAULT" : ""}`}
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                autoComplete="name"
              />
              {errors.name && <p className="text-rose-DEFAULT text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Email</label>
              <input
                type="email"
                className={`input-field ${errors.email ? "border-rose-DEFAULT" : ""}`}
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
                  className={`input-field pr-12 ${errors.password ? "border-rose-DEFAULT" : ""}`}
                  placeholder="Create strong password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-white transition-colors"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <PasswordStrength password={password} />
              {errors.password && <p className="text-rose-DEFAULT text-xs mt-1">{errors.password}</p>}

              {/* Rules checklist */}
              {password && (
                <ul className="mt-2 space-y-1">
                  {PASSWORD_RULES.map((r) => (
                    <li key={r.label} className={`flex items-center gap-1.5 text-xs ${r.test(password) ? "text-emerald-400" : "text-[var(--text-secondary)]"}`}>
                      {r.test(password)
                        ? <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        : <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
                      }
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              className="btn-rose w-full py-4 text-base mt-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : "Create Account"}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#d872f9] hover:text-white transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
