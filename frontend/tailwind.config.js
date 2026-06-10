import { scrollbarHide } from "tailwind-scrollbar-hide";

export default {
  darkMode: "class", // 👈 enables manual dark theme toggling via .dark class
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    screens: {
      mobile: { max: "767px" },
      desktop: "768px",
    },

    keyframes: {
      // Waveform equalizer bar animation
      waveform: {
        "0%, 100%": { transform: "scaleY(1)" },
        "50%": { transform: "scaleY(0.3)" },
      },
    },
    animation: {
      // duration 0.9s, ease-in-out, infinite loop
      waveform: "waveform 0.9s ease-in-out infinite",
    },
    borderRadius: {
      "2xl": "1rem",
      "3xl": "1.25rem",
    },
  },
  plugins: [scrollbarHide(), require("@tailwindcss/line-clamp")],
};
