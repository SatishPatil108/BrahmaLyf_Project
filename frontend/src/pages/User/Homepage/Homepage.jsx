import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useHomepage from "./useHomepage";
import {
  Users,
  BookOpen,
  Award,
  ChevronDown,
  ArrowRight,
  Play,
  Sparkles,
  Search,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import "./animation.css";
import Categories from "./components/getAllCategories/Categories";
import MusicList from "./components/getAllMusicList/MusicList";
import FAQPage from "./components/FAQsSections/FAQPage";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import introVideo from "@/assets/intro.mp4";
import Feedbacks from "./components/Feedbacks/Feedbacks";
import DailyShorts from "./components/getAllDailyshorts/DailyShorts";
import { useTranslation } from "react-i18next";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

function Homepage() {
  const { dashboardData, loading, error } = useHomepage();
  const { theme } = useTheme();
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* 🌅 HERO SECTION */}
      <section className="relative flex items-center justify-center min-h-[85vh] sm:min-h-[90vh] lg:min-h-[95vh] overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background linear */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
              theme === "dark" ? "bg-purple-600" : "bg-purple-300"
            }`}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 ${
              theme === "dark" ? "bg-pink-600" : "bg-pink-300"
            }`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse delay-500 ${
              theme === "dark" ? "bg-blue-600" : "bg-blue-200"
            }`}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl w-full">
          <div className="flex justify-center mb-6">
            <Sparkles
              className={`w-8 h-8 sm:w-12 sm:h-12 animate-bounce ${
                theme === "dark" ? "text-yellow-300" : "text-yellow-500"
              }`}
            />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight animate-fadeInUp">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
              Unlock Your
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-600 animate-linear">
              Limitless Potential
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 animate-slideUp font-light leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Step into a world of transformation. Discover programs designed to
            awaken your mind, elevate your spirit, and master every dimension of
            your life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 animate-fadeIn delay-300">
            <button
              onClick={() => setShowVideo(true)}
              className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              <Play className="w-5 h-5 group-hover:scale-125 transition-transform" />
              Watch Our Story
            </button>

            <Link
              to="/categories"
              className="group px-8 py-4 border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white">
                Explore Categories
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex items-center border pl-2 gap-2 mt-8 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              className="w-full h-full outline-none text-xs sm:text-sm text-gray-800"
            />
            <button
              type="submit"
              className="bg-indigo-500 w-20 sm:w-34 md:w-26 h-8 sm:h-9 rounded-full text-xs sm:text-sm text-white mr-[5px] shrink-0"
            >
             {t("buttons.submit")}
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Daily Shorts Video Section */}
      <DailyShorts />

      {/* MUSIC SECTIONS */}
      <div className="space-y-16 px-4 sm:px-6 lg:px-25">
        <MusicList />
      </div>

      {/* 🎵 CATEGORIES  MUSIC SECTIONS */}
      <div className="space-y-16 px-4 sm:px-6 lg:px-25">
        <Categories />
      </div>

      {/* ❓ FAQ SECTION */}
      <FAQPage />

      {/* 💬 FEEDBACKS SECTION */}
      <Feedbacks />

      {/* 🚀 CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`rounded-3xl p-8 sm:p-12 relative overflow-hidden ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
            }`}
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
            </div>

            <Sparkles
              className={`w-16 h-16 mx-auto mb-6 animate-pulse ${
                theme === "dark" ? "text-yellow-300" : "text-yellow-500"
              }`}
            />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
                Ready to Begin Your Transformation?
              </span>
            </h2>

            <p
              className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Your next big breakthrough is just a few clicks away. Join our
              global community and start shaping your future today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/register"
                className="group px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl flex items-center gap-3"
              >
                Begin Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>

              <Link
                to="/programs"
                className={`px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500"
                    : "text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
                }`}
              >
                Explore Free Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🎥 VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
            <video className="w-full h-auto" controls autoPlay src={introVideo}>
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
