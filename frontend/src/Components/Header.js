import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/",          label: "Home",      authRequired: true  },
  { to: "/upload",    label: "Analyse",   authRequired: true  },
  { to: "/camera",    label: "Camera",    authRequired: true  },
  { to: "/favourite", label: "Favourites",authRequired: true  },
  { to: "/profile",   label: "Profile",   authRequired: true  },
];

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
    <div className="relative w-9 h-9">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-rose-DEFAULT opacity-80 group-hover:opacity-100 transition-opacity animate-spin-slow" />
      <div className="absolute inset-0.5 rounded-full bg-surface flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="url(#lg)" />
          <circle cx="6"  cy="6"  r="2" fill="#c044ee" opacity="0.7" />
          <circle cx="18" cy="6"  r="2" fill="#ff4d6d" opacity="0.7" />
          <circle cx="6"  cy="18" r="2" fill="#2563eb" opacity="0.7" />
          <circle cx="18" cy="18" r="2" fill="#f5a623" opacity="0.7" />
          <defs>
            <linearGradient id="lg" x1="8" y1="8" x2="16" y2="16">
              <stop stopColor="#c044ee" />
              <stop offset="1" stopColor="#ff4d6d" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
    <span
      className="font-display font-bold text-xl tracking-tight"
      style={{
        background: "linear-gradient(135deg, #f8f4ff, #d872f9)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      Color Insight
    </span>
  </Link>
);

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/home1");
  };

  const isActive = (path) => location.pathname === path;

  const visibleLinks = NAV_LINKS.filter((l) =>
    !l.authRequired || isAuthenticated
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-dark shadow-2xl py-3"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAuthenticated && (
              <Link
                to="/home1"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/home1")
                    ? "text-white bg-white/10"
                    : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
                }`}
              >
                About
              </Link>
            )}
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? "text-white bg-gradient-to-r from-brand-600/30 to-brand-500/20 border border-brand-500/30"
                    : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-rose-DEFAULT flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"  className="btn-secondary text-sm py-2 px-5">Login</Link>
                <Link to="/signup" className="btn-primary  text-sm py-2 px-5">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg glass border border-white/10 text-[var(--text-secondary)] hover:text-white transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-72 glass-dark border-l border-white/10 p-6 pt-20 flex flex-col gap-2 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {!isAuthenticated && (
            <Link to="/home1" className="mobile-nav-link">About</Link>
          )}
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(link.to)
                  ? "text-white bg-gradient-to-r from-brand-600/30 to-brand-500/20 border border-brand-500/30"
                  : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-auto border-t border-white/10 pt-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-rose-DEFAULT flex items-center justify-center font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full btn-secondary text-sm py-3">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login"  className="btn-secondary text-sm py-3 text-center">Login</Link>
                <Link to="/signup" className="btn-primary  text-sm py-3 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
