import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ArrowRight,
  Play,
  Sparkles,
  Search,
  X,
  Heart,
  Brain,
  Moon,
  Sun,
  Shield,
  Users,
  Clock,
  Wallet,
  BookOpen,
  Headphones,
  Calendar,
  Trophy,
  Leaf,
  TrendingUp,
  Target,
  Smile,
  Feather,
  Zap,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import "./animation.css";
import MusicList from "./components/getAllMusicList/MusicList";
import introVideo from "@/assets/intro.mp4";
import DailyShorts from "./components/getAllDailyshorts/DailyShorts";
import { useTranslation } from "react-i18next";
import { philosophies, uspFeatures } from "./homepagedata";

// Optimized noise overlay with hardware acceleration
const NoiseOverlay = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none z-0 will-change-transform"
    aria-hidden="true"
  >
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

// Enhanced StatPill with better accessibility
const StatPill = ({ value, label, isDark }) => (
  <div
    className={`
      flex flex-col items-center px-6 py-3 rounded-2xl 
      border backdrop-blur-sm transition-all duration-200
      hover:scale-[1.02] active:scale-[0.98]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
      ${
        isDark
          ? "bg-white/5 border-white/10 hover:bg-white/8"
          : "bg-black/[0.02] border-black/8 hover:bg-black/[0.04]"
      }
    `}
  >
    <span
      className={`
      text-2xl sm:text-3xl font-bold tracking-tight
      ${isDark ? "text-white" : "text-gray-900"}
    `}
    >
      {value}
    </span>
    <span
      className={`
      text-xs font-medium mt-1 tracking-wide uppercase
      ${isDark ? "text-gray-400" : "text-gray-500"}
    `}
    >
      {label}
    </span>
  </div>
);

// Feature Card Component for USP section
const FeatureCard = ({ icon: Icon, title, description, isDark }) => (
  <div
    className={`
    group relative p-6 rounded-2xl border transition-all duration-300
    hover:scale-[1.02] hover:shadow-xl
    ${
      isDark
        ? "bg-white/5 border-white/10 hover:bg-white/8 hover:border-violet-500/30"
        : "bg-white border-gray-200 hover:border-violet-300 hover:shadow-lg"
    }
  `}
  >
    <div className="flex items-start gap-4">
      <div
        className={`
        flex-shrink-0 p-3 rounded-xl transition-all duration-300
        group-hover:scale-110
        ${
          isDark
            ? "bg-violet-500/20 text-violet-400"
            : "bg-violet-100 text-violet-600"
        }
      `}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3
          className={`font-semibold text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h3>
        <p
          className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {description}
        </p>
      </div>
    </div>
  </div>
);

// Philosophy Card Component
const PhilosophyCard = ({ icon: Icon, title, description, isDark }) => (
  <div
    className={`
    text-center p-6 rounded-2xl border transition-all duration-300
    hover:-translate-y-1
    ${
      isDark
        ? "bg-white/5 border-white/10 hover:bg-white/8"
        : "bg-white border-gray-200 hover:shadow-md"
    }
  `}
  >
    <div
      className={`
      inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
      ${isDark ? "bg-violet-500/20" : "bg-violet-100"}
    `}
    >
      <Icon
        className={`w-6 h-6 ${isDark ? "text-violet-400" : "text-violet-600"}`}
      />
    </div>
    <h3
      className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
    >
      {title}
    </h3>
    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      {description}
    </p>
  </div>
);

function Homepage() {
  const { theme } = useTheme();
  const [showVideo, setShowVideo] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const modalRef = useRef(null);

  // Close modal on Escape
  useEffect(() => {
    if (!showVideo) return;

    const handler = (e) => {
      if (e.key === "Escape") setShowVideo(false);
    };

    window.addEventListener("keydown", handler);

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [showVideo]);

  // Focus trap for modal
  useEffect(() => {
    if (showVideo && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showVideo]);

  return (
    <div
      className={`
      min-h-screen flex flex-col antialiased
      transition-colors duration-500 ease-out
      ${isDark ? "bg-[#0a0a0f] text-gray-100" : "bg-[#fafafa] text-gray-900"}
    `}
    >
      {/* ══════════════════════════════════════  HERO SECTION   ══════════════════════════════════════ */}
      <section className="relative flex items-center justify-center min-h-[92vh] overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Ambient mesh background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Primary glow */}
          <div
            className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px] ${
              isDark ? "bg-violet-700/20" : "bg-violet-400/15"
            }`}
          />
          {/* Secondary accent */}
          <div
            className={`absolute top-1/3 -right-48 w-[600px] h-[600px] rounded-full blur-[100px] ${
              isDark ? "bg-fuchsia-700/15" : "bg-pink-300/20"
            }`}
          />
          {/* Tertiary accent */}
          <div
            className={`absolute -bottom-20 -left-32 w-[500px] h-[500px] rounded-full blur-[100px] ${
              isDark ? "bg-cyan-800/15" : "bg-teal-300/15"
            }`}
          />

          {/* Fine grid */}
          <div
            className={`absolute inset-0 bg-[size:48px_48px] ${
              isDark
                ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]"
                : "bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)]"
            }`}
          />

          <NoiseOverlay />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl w-full pt-16 pb-24 sm:pt-20">
          {/* CTA Row */}
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-medium animate-fadeInUp">
              <div
                className={`
                inline-flex items-center gap-2
                ${
                  isDark
                    ? "text-violet-300 border-violet-500/50"
                    : "text-violet-700  border-violet-500/15"
                }
              `}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  BrahmaLYF | सामान्य माणसासाठी Practical Life Coaching
                </span>
              </div>
            </div>

            {/* Improved headline with better responsive scaling */}
            <h1 className="text-[clamp(2rem,8vw,4.5rem)] font-bold leading-[1.15] tracking-tighter mb-4 animate-fadeInUp">
              <span
                className={`
                bg-gradient-to-r from-gray-900 via-violet-600 to-violet-700
                dark:from-gray-100 dark:via-violet-300 dark:to-violet-400
                bg-clip-text text-transparent
              `}
              >
                BrahmaLYF
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                मनाचा स्थैर्याचा प्रवास
              </span>
            </h1>

            {/* Tagline */}
            <p
              className={`
              text-lg sm:text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-4 animate-fadeInUp
              ${isDark ? "text-gray-300" : "text-gray-700"}
            `}
            >
              "आम्ही लोकांच्या समस्या एका दिवसात मिटवण्याचे आश्वासन देत नाही.
              <br />
              पण आम्ही त्यांना त्या समस्यांना अधिक शांत, मजबूत आणि समजूतदारपणे
              हाताळायला नक्की शिकवू."
            </p>

            {/* Enhanced subheadline with better readability */}
            <p
              className={`
              text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 
              leading-relaxed md:leading-relaxed animate-fadeInUp
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              Practical life coaching, emotional guidance, mind-strengthening
              आणि inner balance — सामान्य माणसासाठी, सोप्या भाषेत, परवडणाऱ्या
              किमतीत.
            </p>

            {/* Improved CTA buttons with better interactions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-10 animate-fadeInUp">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 shadow-lg overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                }}
              >
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                Begin Your 52-Week Journey
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <button
                onClick={() => setShowVideo(true)}
                className={`
                  group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 
                  rounded-full font-semibold text-sm border transition-all duration-300 
                  hover:scale-105 active:scale-95 focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
                  ${
                    isDark
                      ? "bg-white/5 border-white/15 text-gray-200 hover:bg-white/10 hover:border-white/25"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                  }
                `}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                  <Play className="w-2.5 h-2.5 text-white fill-white translate-x-px" />
                </span>
                Watch Our Story
              </button>
            </div>
          </div>

          {/* Search bar */}
          {/* <div
            className={`relative flex items-center mx-auto max-w-md rounded-2xl border transition-all duration-200 overflow-hidden animate-fadeInUp ${
              isDark
                ? "bg-white/5 border-white/10 focus-within:border-violet-500/60 focus-within:bg-white/8 shadow-[0_0_0_3px_transparent] focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
                : "bg-white border-gray-200 focus-within:border-violet-400 shadow-sm focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
            }`}
            style={{ animationDelay: "320ms" }}
          >
            <Search
              className={`absolute left-4 w-4 h-4 pointer-events-none ${isDark ? "text-gray-500" : "text-gray-400"}`}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("search.placeholder")}
              className={`w-full pl-11 pr-4 py-3.5 bg-transparent text-sm outline-none placeholder:text-gray-400 ${
                isDark ? "text-gray-100" : "text-gray-800"
              }`}
            />
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white text-xs font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              {t("buttons.submit")}
            </button>
          </div> */}
        </div>
      </section>

      {/* ══════════════════════════════════════  WHAT IS BRAHMALYF SECTION ══════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className={`
              text-3xl sm:text-4xl font-bold mb-4 tracking-tight
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              BrahmaLYF म्हणजे काय?
            </h2>
            <p
              className={`text-lg max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              भारतातील सामान्य माणसासाठी practical life coaching, emotional
              guidance, mind-strengthening आणि inner balance शिकवणारा online
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div
                className={`
                p-6 rounded-2xl border-l-4 border-l-violet-500
                ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}
              `}
              >
                <h3
                  className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  आजची गरज
                </h3>
                <p
                  className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  अनेक लोकांना stress, overthinking, emotional गोंधळ, भीती,
                  guilt, नात्यांतील तणाव आणि inner थकवा जाणवतो; पण समजेल अशा
                  भाषेत, परवडणाऱ्या किमतीत आणि step-by-step पद्धतीने मदत सहज
                  मिळत नाही.
                </p>
              </div>

              <div
                className={`
                p-6 rounded-2xl border-l-4 border-l-fuchsia-500
                ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"}
              `}
              >
                <h3
                  className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  आमचा उद्देश
                </h3>
                <p
                  className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Self-work, mental clarity आणि inner growth ही काही मोजक्या
                  लोकांची गोष्ट न राहता, सर्वसामान्यांसाठीही accessible व्हावी.
                  मन आणि आतल्या आयुष्याची काळजी ही luxury न राहता, रोजच्या
                  आयुष्यातील practical गोष्ट व्हावी.
                </p>
              </div>
            </div>

            <div
              className={`
              relative rounded-2xl overflow-hidden p-8
              bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10
              border ${isDark ? "border-white/10" : "border-gray-200"}
            `}
            >
              <div className="relative z-10">
                <Heart className="w-12 h-12 text-violet-500 mb-6 mx-auto" />
                <blockquote className="text-center">
                  <p
                    className={`text-lg italic mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    "मन आणि आतल्या आयुष्याची काळजी ही luxury न राहता, रोजच्या
                    आयुष्यातील practical गोष्ट व्हावी"
                  </p>
                  <footer
                    className={`font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    — BrahmaLYF Philosophy
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════  CORE BELIEFS / PHILOSOPHY SECTION ══════════════════════════════════════ */}
      <section
        className={`
        py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8
        ${isDark ? "bg-white/[0.02]" : "bg-black/[0.01]"}
      `}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className={`
              text-3xl sm:text-4xl font-bold mb-4 tracking-tight
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              BrahmaLYF चे विश्वास
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              6 तत्वांवर उभा आहे आमचा प्रवास
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {philosophies.map((philosophy, index) => (
              <PhilosophyCard
                key={index}
                icon={philosophy.icon}
                title={philosophy.title}
                description={philosophy.description}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════  UNIQUE SELLING PROPOSITIONS (USP) ══════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              Why BrahmaLYF?
            </div>
            <h2
              className={`
              text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              ही 52-Week Mind–Soul Fitness Journey
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                वेगळी का आहे?
              </span>
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              8 अनोखी वैशिष्ट्ये जी बनवतात आमचा प्रवास खास
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uspFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════  DAILY SHORTS SECTION ══════════════════════════════════════ */}
      <div
        className={`
        relative border-t border-b transition-colors duration-300
        ${
          isDark
            ? "bg-gradient-to-b from-[#0a0a0f] via-[#0d0d18] to-[#0a0a0f] border-white/5"
            : "bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa] border-black/5"
        }
      `}
      >
        <DailyShorts />
      </div>

      {/* ══════════════════════════════════════  MUSIC SECTIONS ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-20">
        <MusicList />
      </div>

      {/* ══════════════════════════════════════  FINAL CTA SECTION ══════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className={`
            relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden
            border transition-all duration-500 hover:shadow-2xl
            ${
              isDark
                ? "bg-gradient-to-br from-violet-950/40 via-[#0d0d18] to-fuchsia-950/30 border-white/10"
                : "bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/60 border-violet-100"
            }
          `}
          >
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] opacity-20 pointer-events-none bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-[80px] opacity-15 pointer-events-none bg-gradient-to-tr from-cyan-500 to-violet-500" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
                <Feather className="w-7 h-7 text-white" />
              </div>

              <h2
                className={`
                text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4
                ${isDark ? "text-white" : "text-gray-900"}
              `}
              >
                तुमच्या Inner Fitness चा प्रवास
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  सुरु करा आजच
                </span>
              </h2>

              <p
                className={`
                text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed 
                ${isDark ? "text-gray-300" : "text-gray-600"}
              `}
              >
                52 आठवडे, 8 मॉड्यूल्स, एक परिवर्तन. ताण, भीती, गोंधळ यांना शांत,
                मजबूत आणि समजूतदारपणे सामोरे जायची वेळ आली आहे.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 overflow-hidden shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                  }}
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  Begin Your 52-Week Journey
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/free-trial"
                  className={`
                    inline-flex items-center justify-center gap-2 px-8 py-4 
                    rounded-full font-medium text-sm border transition-all duration-300 
                    hover:scale-105 active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
                    ${
                      isDark
                        ? "border-white/15 text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5"
                        : "border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 bg-white shadow-sm"
                    }
                  `}
                >
                  Explore Free Resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════  VIDEO MODAL ═════════════════════════════════ */}
      {showVideo && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Intro video player"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowVideo(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowVideo(false);
          }}
          tabIndex={-1}
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="relative w-full max-w-4xl animate-fadeInUp">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-14 right-0 inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg px-3 py-1.5"
              aria-label="Close video dialog"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>

            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <video
                className="w-full h-auto block"
                controls
                autoPlay
                playsInline
                src={introVideo}
              >
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
