import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import useCoachesInfoPage from "./useCoachesInfoPage";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useTheme } from "@/contexts/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const CoachesInfoPage = () => {
  const { subdomain_name, coachId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { videosDetails, loading, error } = useCoachesInfoPage(
    location.state?.subdomainId,
    coachId
  );
  const videos = videosDetails?.videos || [];
  const subdomainName = subdomain_name || "Programs";
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  /* ---------------- Slider Helpers ---------------- */
  const scrollToSlide = (index) => {
    const slider = sliderRef.current;
    const slide = slider?.children[index];
    if (!slide) return;

    slide.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setCurrentSlide(index);
  };

  const nextSlide = () =>
    currentSlide < videos.length - 1 && scrollToSlide(currentSlide + 1);
  const prevSlide = () => currentSlide > 0 && scrollToSlide(currentSlide - 1);

  /* -------- Sync dots on manual scroll -------- */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const slides = Array.from(slider.children);
      const center = slider.scrollLeft + slider.offsetWidth / 2;

      const index = slides.reduce((closest, slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const closestCenter =
          slides[closest].offsetLeft + slides[closest].offsetWidth / 2;
        return Math.abs(slideCenter - center) < Math.abs(closestCenter - center)
          ? i
          : closest;
      }, 0);

      if (index !== currentSlide) {
        setCurrentSlide(index);
      }
    };

    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [currentSlide]);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark"
            ? "bg-gray-900"
            : "    bg-gradient-to-br from-gray-50 to-gray-100"
        }`}
      >
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping    bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20"></div>
            <div
              className={`animate-spin h-16 w-16 rounded-full border-[3px] ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              } border-t-transparent mx-auto`}
            ></div>
          </div>
          <p
            className={`mt-6 text-lg font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading programs…
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- Error ---------------- */
  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || "Something went wrong";

    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          theme === "dark"
            ? "bg-gray-900"
            : "bg-l-to-br from-gray-50 to-gray-100"
        }`}
      >
        <div
          className={`max-w-md w-full p-6 rounded-2xl shadow-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0  bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-20"></div>
            <div
              className={`relative w-16 h-16 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-red-50"
              } flex items-center justify-center`}
            >
              <div className="text-2xl">⚠️</div>
            </div>
          </div>

          <h2
            className={`text-xl font-bold text-center mb-3 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Error Loading Content
          </h2>

          <p
            className={`text-center mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {errorMessage}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              Go Back
            </button>
            <button
              onClick={() => dispatch(clearUserError())}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-300   bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Empty State ---------------- */
  if (videos.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          theme === "dark"
            ? "bg-gray-900"
            : "bg-l-to-br from-gray-50 to-gray-100"
        }`}
      >
        <div
          className={`max-w-md w-full p-6 rounded-2xl shadow-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } text-center`}
        >
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0  bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-20"></div>
            <div
              className={`relative w-20 h-20 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-indigo-50"
              } flex items-center justify-center`}
            >
              <div className="text-3xl">📚</div>
            </div>
          </div>

          <h2
            className={`text-xl font-bold mb-3 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            No Courses Available
          </h2>

          <p
            className={`mb-6 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            There are no courses in this category yet. Check back soon!
          </p>

          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 py-3 px-5 rounded-lg font-medium transition-all duration-300     bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl`}
          >
            <ChevronLeft className="w-5 h-5" />
            Browse Other Categories
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Main UI ---------------- */
  return (
    <div
      className={`min-h-screen py-10 lg:px-20 ${
        theme === "dark"
          ? "bg-gray-900"
          : "    bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 px-2">
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {subdomainName}
          </h1>
          <p
            className={`text-base sm:text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {videos.length} program{videos.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Slider Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          {videos.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-yellow-500 hover:bg-amber-400 text-white shadow-lg"
                    : "bg-white hover:bg-gray-100 text-gray-800 shadow-xl"
                } ${
                  currentSlide === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-110"
                } ${isHovered ? "opacity-100" : "opacity-0"}`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 " />
              </button>

              <button
                onClick={nextSlide}
                disabled={currentSlide === videos.length - 1}
                className={`hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-yellow-500 hover:bg-amber-400 text-white shadow-lg"
                    : "bg-white hover:bg-gray-100 text-gray-800 shadow-xl"
                } ${
                  currentSlide === videos.length - 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-110"
                } ${isHovered ? "opacity-100" : "opacity-0"}`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-4 px-2 sm:px-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Hide scrollbar styles */}
            <style>{`
              [style*="scrollbar-width:none"]::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {videos.map((video, index) => (
              <div
                key={video.video_id}
                className="flex-none w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[30vw] snap-center"
              >
                <div
                  onClick={() => navigate(`/course-details/${video.video_id}`)}
                  className={`group relative cursor-pointer rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-750  hover:shadow-sm border border-gray-600"
                      : "bg-white hover:bg-gray-50  hover:shadow-sm"
                  }`}
                >
                  {/* Video Thumbnail */}
                  <div className="relative h-48 sm:h-52 md:h-56 lg:h-64 overflow-hidden">
                    <img
                      src={
                        video.thumbnail_url
                          ? `${BASE_URL}${video.thumbnail_url}`
                          : "/placeholder.jpg"
                      }
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0    bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full    bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                          <Play
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5 sm:ml-1"
                            fill="white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Coach Badge */}
                    {video.coach_name && (
                      <div className="absolute top-3 left-3">
                        <div
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-sm ${
                            theme === "dark" ? "bg-black/40" : "bg-white/80"
                          }`}
                        >
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden">
                            <img
                              src={
                                video.coach_profile_image
                                  ? `${BASE_URL}${video.coach_profile_image}`
                                  : "/avatar-placeholder.jpg"
                              }
                              alt={video.coach_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {video.coach_name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3
                      className={`relative text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 overflow-hidden transition-all duration-500 max-h-7 group-hover:max-h-32 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {video.title}
                      {/* Fade indicator */}
                      <span
                        className={`pointer-events-none absolute bottom-0 left-0 right-0 h-6 ${ theme === "dark" ? "bg-l-to-t from-gray-800 to-transparent" : "bg-l-to-t from-white to-transparent" } group-hover:opacity-0 transition-opacity duration-300`}
                      />
                    </h3>

                    <p
                      className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {video.description}
                    </p>

                    {/* Action Button */}
                    <button
                      className={`w-full py-2.5 sm:py-3 px-4 rounded-lg md:rounded-xl font-semibold transition-all duration-300    bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg text-sm sm:text-base`}
                    >
                      View Program Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {videos.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-6">
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    currentSlide === i
                      ? "w-6 sm:w-8    bg-gradient-to-r from-indigo-600 to-purple-600"
                      : theme === "dark"
                      ? "w-1.5 sm:w-2 bg-gray-600 hover:bg-gray-500"
                      : "w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          {videos.length > 1 && (
            <div
              className={`text-center mt-3 text-xs sm:text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {currentSlide + 1} / {videos.length}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {videos.length > 1 && (
          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 md:hidden px-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`p-2.5 sm:p-3 rounded-full ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-800"
              } shadow-lg ${
                currentSlide === 0 ? "opacity-40 cursor-not-allowed" : ""
              }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <span
              className={`text-xs sm:text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {currentSlide + 1} of {videos.length}
            </span>

            <button
              onClick={nextSlide}
              disabled={currentSlide === videos.length - 1}
              className={`p-2.5 sm:p-3 rounded-full ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-800"
              } shadow-lg ${
                currentSlide === videos.length - 1
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachesInfoPage;
