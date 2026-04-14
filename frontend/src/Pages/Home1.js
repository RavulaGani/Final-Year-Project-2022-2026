import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🎨",
    title: "AI Skin Analysis",
    desc: "Advanced computer vision identifies your unique skin undertone and seasonal color type.",
  },
  {
    icon: "✨",
    title: "Color Recommendations",
    desc: "Get a personalized color palette — exact hex codes that complement your natural tones.",
  },
  {
    icon: "👗",
    title: "Outfit Matching",
    desc: "Browse clothing filtered to your palette, by category: casual, formal, traditional & more.",
  },
];

const SEASONS = [
  { name: "Spring",  emoji: "🌸", colors: ["#FFB6C1","#FFF0A0","#98FB98","#FFA07A"] },
  { name: "Summer",  emoji: "☀️", colors: ["#B0E0E6","#DDA0DD","#F0E68C","#87CEEB"] },
  { name: "Autumn",  emoji: "🍂", colors: ["#D2691E","#8B4513","#DAA520","#A0522D"] },
  { name: "Winter",  emoji: "❄️", colors: ["#191970","#8B0000","#2F4F4F","#708090"] },
];

const Home1 = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll(".opacity-start");
    els?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "none";
      }, i * 150);
    });
  }, []);

  return (
    <div className="page-bg noise-overlay">
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden"
      >
        {/* Orbs */}
        <div className="orb orb-purple w-[600px] h-[600px] -top-40 -left-40 opacity-30 animate-float" />
        <div className="orb orb-rose   w-[400px] h-[400px] top-1/2  right-0  opacity-20 animate-float" style={{ animationDelay: "1s" }} />
        <div className="orb orb-blue   w-[300px] h-[300px] bottom-0  left-1/4 opacity-20 animate-float" style={{ animationDelay: "2s" }} />

        {/* Badge */}
        <div className="opacity-start animate-fade-in-down mb-6" style={{ opacity: 0, transform: "translateY(-20px)" }}>
          <span className="badge badge-brand">✦ AI-Powered Fashion Intelligence</span>
        </div>

        {/* Heading */}
        <h1
          className="opacity-start font-display font-black leading-none mb-6"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            fontSize: "clamp(3rem, 10vw, 8rem)",
          }}
        >
          <span className="gradient-text">Color</span>
          <br />
          <span className="text-white">Insight</span>
        </h1>

        <p
          className="opacity-start text-[var(--text-secondary)] max-w-xl mx-auto mb-10 text-lg leading-relaxed"
          style={{ opacity: 0, transform: "translateY(20px)" }}
        >
          Discover the colors that truly complement you. Upload your photo, let AI read your skin
          tone, and unlock a wardrobe built exactly for your palette.
        </p>

        {/* CTA */}
        <div
          className="opacity-start flex flex-col sm:flex-row gap-4 items-center"
          style={{ opacity: 0, transform: "translateY(20px)" }}
        >
          <Link to="/signup" className="btn-primary px-8 py-4 text-base">
            Start Your Analysis →
          </Link>
          <Link to="/login" className="btn-secondary px-8 py-4 text-base">
            Sign In
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs tracking-widest uppercase text-[var(--text-secondary)]">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-brand-500 to-transparent" />
        </div>
      </section>

      {/* ── Seasons Visual ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-rose mb-4">Your Season Awaits</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3">
              Find Your <span className="gradient-text-rose">Color Season</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4 max-w-md mx-auto">
              Every person falls into one of four seasonal color families. Our AI finds yours instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEASONS.map((s, i) => (
              <div
                key={s.name}
                className="card p-6 text-center group cursor-default opacity-start animate-fade-in-up"
                style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-4xl block mb-4 group-hover:animate-float">{s.emoji}</span>
                <h3 className="font-display font-bold text-xl mb-4">{s.name}</h3>
                <div className="flex justify-center gap-2">
                  {s.colors.map((c) => (
                    <div
                      key={c}
                      className="w-7 h-7 rounded-full border-2 border-white/10 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 relative">
        <div className="orb orb-purple w-96 h-96 right-0 top-1/2 -translate-y-1/2 opacity-15" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-brand mb-4">How It Works</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3">
              Three Steps to <span className="gradient-text">Your Style</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card p-8 opacity-start animate-fade-in-up relative overflow-hidden"
                style={{ opacity: 0, animationDelay: `${i * 0.15}s` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full" />
                <div className="text-4xl mb-4">{f.icon}</div>
                <div className="badge badge-gold mb-3">Step {i + 1}</div>
                <h3 className="font-display text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(192,68,238,0.2) 0%, rgba(255,77,109,0.2) 100%)",
              border: "1px solid rgba(192,68,238,0.3)",
            }}
          >
            <div className="orb orb-purple w-64 h-64 -top-16 -left-16 opacity-30" />
            <div className="orb orb-rose   w-48 h-48 -bottom-8 -right-8 opacity-20" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
                Ready to find your colors?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Join thousands discovering their perfect palette. Free to start — no credit card needed.
              </p>
              <Link to="/signup" className="btn-primary px-10 py-4 text-lg inline-block">
                Create Free Account →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home1;
