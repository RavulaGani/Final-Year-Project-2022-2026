/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#fdf4ff",
          100: "#fae8ff",
          200: "#f3d0fe",
          300: "#e9a8fd",
          400: "#d872f9",
          500: "#c044ee",
          600: "#a21bcf",
          700: "#8618aa",
          800: "#6f178a",
          900: "#5c1870",
        },
        rose: {
          DEFAULT: "#ff4d6d",
        },
        gold: "#f5a623",
      },
      keyframes: {
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%":   { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(192,68,238,0.4)" },
          "50%":       { boxShadow: "0 0 35px rgba(192,68,238,0.8)" },
        },
        "gradient-shift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bounce-in": {
          "0%":   { transform: "scale(0.3)", opacity: "0" },
          "50%":  { transform: "scale(1.05)" },
          "70%":  { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "toast-in": {
          "0%":   { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "toast-out": {
          "0%":   { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
      animation: {
        "fade-in-up":     "fade-in-up 0.6s ease-out forwards",
        "fade-in-down":   "fade-in-down 0.6s ease-out forwards",
        "fade-in":        "fade-in 0.5s ease-out forwards",
        "slide-in-left":  "slide-in-left 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "scale-in":       "scale-in 0.5s ease-out forwards",
        "pulse-glow":     "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "float":          "float 3s ease-in-out infinite",
        "spin-slow":      "spin-slow 8s linear infinite",
        "shimmer":        "shimmer 2s linear infinite",
        "bounce-in":      "bounce-in 0.6s ease-out forwards",
        "toast-in":       "toast-in 0.3s ease-out forwards",
        "toast-out":      "toast-out 0.3s ease-in forwards",
      },
      backgroundSize: {
        "200%": "200%",
      },
    },
  },
  plugins: [],
};
