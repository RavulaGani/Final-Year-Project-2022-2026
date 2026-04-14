import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const COLOR_STORIES = [
  {
    name: "Red",
    hex: "#e53e3e",
    season: "Autumn / Winter",
    desc: "Bold and passionate. Red radiates power, confidence, and magnetic energy — ideal for statement pieces that demand attention.",
    tip: "Pair with navy or charcoal for a sophisticated look.",
    image: "https://media.istockphoto.com/id/484845976/photo/wardrobe-with-red-clothes-hanging-on-a-rack-nicely-arranged.jpg?s=2048x2048&w=is&k=20&c=5aduN3xNz2nljLWPxaYYPesXZYitsvbosP8_L1S7Y7I=",
  },
  {
    name: "Blue",
    hex: "#3182ce",
    season: "Summer / Winter",
    desc: "Calm and trustworthy. Blue's vast spectrum — from sky to navy — makes it the most versatile color in any wardrobe.",
    tip: "Light blues work for summer; deep navy for formal occasions.",
    image: "https://i.pinimg.com/originals/62/39/42/623942eaf6ee252820a4f18216f02959.jpg",
  },
  {
    name: "Green",
    hex: "#38a169",
    season: "Spring / Autumn",
    desc: "Natural and renewing. Green brings balance and freshness, from soft sage to rich forest tones.",
    tip: "Earthy greens pair beautifully with rust and cream tones.",
    image: "https://img.freepik.com/premium-photo/stylish-green-closet_1017677-2663.jpg",
  },
  {
    name: "Yellow",
    hex: "#d69e2e",
    season: "Spring",
    desc: "Optimistic and radiant. Yellow lifts any outfit with warmth and joy — great for accessories if you're new to the shade.",
    tip: "Soft mustard is more wearable than bright lemon for most skin tones.",
    image: "https://beautywithlily.com/wp-content/uploads/2019/08/yellowww.jpg",
  },
  {
    name: "Purple",
    hex: "#805ad5",
    season: "Summer / Winter",
    desc: "Mysterious and luxurious. Purple conveys creativity and sophistication, from soft lavender to deep plum.",
    tip: "Dark purples flatter cool undertones; lavender suits warm and neutral.",
    image: "https://img.freepik.com/premium-photo/closet-with-purple-shirts-purple-shirts-purple-one-that-says-other_854727-84457.jpg",
  },
];

const QUICK_ACTIONS = [
  { to: "/upload", icon: "📸", label: "Analyse Photo",  desc: "Upload an image for AI colour analysis", color: "from-brand-600/20 to-brand-500/10 border-brand-500/30" },
  { to: "/camera", icon: "📷", label: "Live Camera",    desc: "Use webcam for instant real-time analysis", color: "from-rose-DEFAULT/20 to-rose-DEFAULT/10 border-rose-DEFAULT/30" },
  { to: "/favourite", icon: "❤️", label: "Favourites",  desc: "View your saved outfit recommendations", color: "from-amber-500/20 to-amber-400/10 border-amber-500/30" },
];

const Home = () => {
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  const prev = () => setActiveSlide((s) => (s - 1 + COLOR_STORIES.length) % COLOR_STORIES.length);
  const next = () => setActiveSlide((s) => (s + 1) % COLOR_STORIES.length);
  const story = COLOR_STORIES[activeSlide];

  return (
    <div className="page-bg min-h-screen pt-20">
      {/* ── Welcome Banner ── */}
      <section className="px-4 py-12 relative overflow-hidden">
        <div className="orb orb-purple w-96 h-96 -top-20 -right-20 opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="glass-dark border border-white/5 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[var(--text-secondary)] text-sm font-mono tracking-widest uppercase mb-2">
                  Welcome back
                </p>
                <h1 className="font-display text-3xl sm:text-5xl font-bold">
                  Hey, <span className="gradient-text">{user?.name?.split(" ")[0] || "Stylist"}</span> ✦
                </h1>
                <p className="text-[var(--text-secondary)] mt-3 max-w-md">
                  Ready to discover outfits that are made for your unique color palette?
                </p>
              </div>
              <Link to="/upload" className="btn-primary px-8 py-4 whitespace-nowrap flex-shrink-0">
                Analyse Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`p-6 rounded-2xl border bg-gradient-to-br ${a.color} hover:scale-[1.02] transition-all duration-300 group`}
              >
                <span className="text-3xl block mb-3 group-hover:animate-float">{a.icon}</span>
                <h3 className="font-semibold text-lg mb-1">{a.label}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Color Stories Carousel ── */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="badge badge-brand mb-2">Color Education</span>
              <h2 className="font-display text-3xl font-bold mt-2">The Color Stories</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:border-brand-500/50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:border-brand-500/50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96">
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-full object-cover transition-opacity duration-500"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div
                className="absolute bottom-4 left-4 w-10 h-10 rounded-full border-2 border-white/30"
                style={{ backgroundColor: story.hex }}
              />
            </div>

            {/* Content */}
            <div className="card p-8">
              <h3 className="font-display text-4xl font-bold mb-2">{story.name}</h3>
              <span className="badge badge-rose mb-4">{story.season}</span>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">{story.desc}</p>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-lg flex-shrink-0">💡</span>
                <p className="text-sm text-amber-300">{story.tip}</p>
              </div>
              {/* Dots */}
              <div className="flex gap-2 mt-6">
                {COLOR_STORIES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeSlide ? "w-8 bg-brand-500" : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="px-4 py-16" id="about-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-gold mb-4">About Color Insight</span>
            <h2 className="font-display text-4xl font-bold mt-3">
              Why Color <span className="gradient-text">Matters</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "🎨", title: "How It Works",      text: "Using computer vision, we identify dominant skin undertones from your photo and map them to a seasonal color theory palette." },
              { emoji: "❤️", title: "Why Use Us",         text: "Stop guessing what colors suit you. Get scientifically backed recommendations that complement your natural coloring." },
              { emoji: "🚀", title: "Our Mission",        text: "Blend AI and fashion to democratize personal styling — making expert color advice accessible to everyone." },
            ].map((item) => (
              <div key={item.title} className="card p-8 text-center">
                <span className="text-4xl block mb-4">{item.emoji}</span>
                <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
