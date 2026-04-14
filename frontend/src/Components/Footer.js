import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 mt-auto">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-purple w-96 h-96 -bottom-32 -left-32 opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-rose-DEFAULT flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" fill="white" />
                  <circle cx="6" cy="6" r="2" fill="white" opacity="0.7" />
                  <circle cx="18" cy="6" r="2" fill="white" opacity="0.7" />
                  <circle cx="6" cy="18" r="2" fill="white" opacity="0.7" />
                  <circle cx="18" cy="18" r="2" fill="white" opacity="0.7" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg gradient-text">Color Insight</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              AI-powered color analysis that matches your unique skin tone to personalized outfit recommendations.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="mailto:ganeshravula099@gmail.com"
                className="text-xs text-[var(--text-secondary)] hover:text-[#d872f9] transition-colors"
              >
                ganeshravula099@gmail.com
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/",          label: "Home"      },
                { to: "/upload",    label: "Analyse"   },
                { to: "/camera",    label: "Camera"    },
                { to: "/favourite", label: "Favourites"},
                { to: "/profile",   label: "Profile"   },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-4">
              Account
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/login",  label: "Sign In"  },
                { to: "/signup", label: "Register" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
          <p>&copy; {year} Color Insight. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-rose-DEFAULT">♥</span>
            <span>for fashion & AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
