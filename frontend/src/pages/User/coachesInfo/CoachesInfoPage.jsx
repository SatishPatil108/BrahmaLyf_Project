import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Home,
  Search,
  Filter,
} from "lucide-react";

import useCoachesInfoPage from "./useCoachesInfoPage";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useTheme } from "@/contexts/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// Theme configuration
const themeStyles = {
  dark: {
    page: "bg-[#0e0d0c]",
    heading: "text-gray-50",
    body: "text-gray-300",
    muted: "text-gray-500",
    subtle: "text-gray-600",

    searchWrap:
      "bg-gray-800/60 border border-gray-700 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/10",
    searchIcon: "text-gray-500",
    searchInput: "bg-transparent text-gray-100 placeholder:text-gray-600",

    chip: "bg-gray-800 border border-gray-700 text-gray-400 hover:border-purple-500/40 hover:text-purple-400",
    chipActive: "bg-purple-500/15 border border-purple-500/40 text-purple-400",

    item: "border border-gray-800 hover:border-gray-700 bg-gray-900/40",
    itemOpen: "border border-gray-700 bg-gray-800/50",
    questionText: "text-gray-100",
    answerText: "text-gray-400",
    divider: "border-gray-700/60",

    iconWrap: "bg-gray-800 text-purple-400",
    chevron: "text-gray-500",
    chevronOpen: "text-purple-400",

    skeletonBase: "bg-gray-800",
    skeletonShimmer: "bg-gray-700",

    errorWrap: "bg-red-950/40 border border-red-900/50",
    errorText: "text-red-400",
    errorBtn:
      "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700",

    ctaCard:
      "bg-gradient-to-br from-purple-950/60 to-gray-900 border border-purple-500/20",
    ctaIcon: "bg-purple-500/15 text-purple-400",
    ctaHeading: "text-gray-100",
    ctaBody: "text-gray-400",
    ctaBtn:
      "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-[0_4px_20px_-4px_rgba(168,85,247,0.5)]",

    loadMoreBtn:
      "border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600",

    emptyIcon: "bg-gray-800 text-gray-600",
    cardBg: "bg-gray-800 shadow-lg",
    cardHover: "hover:shadow-xl",
    borderColor: "border-gray-800",
  },
  light: {
    page: "bg-[#f5f3f0]",
    heading: "text-gray-900",
    body: "text-gray-700",
    muted: "text-gray-500",
    subtle: "text-gray-400",

    searchWrap:
      "bg-white border border-gray-200 shadow-sm focus-within:border-purple-400/70 focus-within:ring-2 focus-within:ring-purple-400/10",
    searchIcon: "text-gray-400",
    searchInput: "bg-transparent text-gray-900 placeholder:text-gray-400",

    chip: "bg-white border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600",
    chipActive: "bg-purple-50 border border-purple-300 text-purple-700",

    item: "border border-gray-100 hover:border-gray-200 bg-white shadow-sm",
    itemOpen: "border border-gray-200 bg-white shadow-md",
    questionText: "text-gray-900",
    answerText: "text-gray-600",
    divider: "border-gray-100",

    iconWrap: "bg-purple-50 text-purple-600",
    chevron: "text-gray-400",
    chevronOpen: "text-purple-600",

    skeletonBase: "bg-gray-100",
    skeletonShimmer: "bg-gray-200",

    errorWrap: "bg-red-50 border border-red-200",
    errorText: "text-red-600",
    errorBtn: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",

    ctaCard:
      "bg-gradient-to-br from-purple-50 to-white border border-purple-100",
    ctaIcon: "bg-purple-100 text-purple-600",
    ctaHeading: "text-gray-900",
    ctaBody: "text-gray-500",
    ctaBtn:
      "bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-400 hover:to-pink-300 text-white shadow-[0_4px_20px_-4px_rgba(168,85,247,0.35)]",

    loadMoreBtn:
      "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-sm",

    emptyIcon: "bg-gray-100 text-gray-400",
    cardBg: "bg-white shadow-md",
    cardHover: "hover:shadow-xl",
    borderColor: "border-gray-100",
  },
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Loading Skeleton Component
const LoadingSkeleton = ({ theme }) => {
  const styles = themeStyles[theme];

  return (
    <div className={`min-h-screen ${styles.page}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12">
          <div
            className={`h-10 w-48 ${styles.skeletonBase} rounded-lg mx-auto mb-4 animate-pulse`}
          />
          <div
            className={`h-5 w-32 ${styles.skeletonBase} rounded-lg mx-auto animate-pulse`}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden ${styles.cardBg}`}
            >
              <div className={`h-56 ${styles.skeletonBase} animate-pulse`} />
              <div className="p-6 space-y-3">
                <div
                  className={`h-6 ${styles.skeletonBase} rounded-lg w-3/4 animate-pulse`}
                />
                <div
                  className={`h-4 ${styles.skeletonBase} rounded-lg w-full animate-pulse`}
                />
                <div
                  className={`h-4 ${styles.skeletonBase} rounded-lg w-2/3 animate-pulse`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Error State Component
const ErrorState = ({ error, onRetry, onBack, theme }) => {
  const styles = themeStyles[theme];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className={`min-h-screen flex items-center justify-center p-4 ${styles.page}`}
    >
      <div className="max-w-md w-full">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg"
          >
            <AlertCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className={`text-2xl font-bold mb-2 ${styles.heading}`}>
            Unable to Load Content
          </h2>

          <p className={`mb-6 ${styles.body}`}>
            {typeof error === "string"
              ? error
              : error?.message || "Something went wrong. Please try again."}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${styles.errorBtn}`}
            >
              Go Back
            </button>
            <button
              onClick={onRetry}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${styles.ctaBtn}`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ onBack, theme }) => {
  const styles = themeStyles[theme];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className={`min-h-screen flex items-center justify-center p-4 ${styles.page}`}
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg`}
        >
          <BookOpen className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className={`text-2xl font-bold mb-2 ${styles.heading}`}>
          No Courses Available
        </h2>

        <p className={`mb-6 ${styles.body}`}>
          There are no courses in this category yet. Check back soon for new
          content!
        </p>

        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${styles.ctaBtn}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Other Categories
        </button>
      </div>
    </motion.div>
  );
};

// Coach Card Component
const CoachCard = ({ video, theme, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const styles = themeStyles[theme];

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={onClick}
      className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${styles.cardBg} ${styles.cardHover}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
        {!imageLoaded && (
          <div
            className={`absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600`}
          />
        )}
        <img
          src={
            video.thumbnail_url
              ? `${BASE_URL}${video.thumbnail_url}`
              : "/placeholder.jpg"
          }
          alt={video.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
            <div className="relative w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Coach Badge */}
        {video.coach_name && (
          <div className="absolute top-3 left-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
              <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-white/20">
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
              <span className="text-sm font-medium text-white">
                {video.coach_name}
              </span>
            </div>
          </div>
        )}

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 z-10 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium">
            {video.duration}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5">
        <h3
          className={`text-lg font-semibold mb-2 line-clamp-2 ${styles.heading}`}
        >
          {video.title}
        </h3>

        <div
          className={`text-sm mb-4 line-clamp-2 ${styles.body}`}
          dangerouslySetInnerHTML={{ __html: video.description }}
        />

        <div
          className={`flex items-center justify-between pt-3 border-t ${styles.divider}`}
        >
          <div className={`flex items-center gap-2 text-xs ${styles.muted}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{video.duration || "10 min"}</span>
          </div>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"
          >
            Learn More →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const CoachesInfoPage = () => {
  const { subdomain_name, coachId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { videosDetails, loading, error } = useCoachesInfoPage(
    location.state?.subdomainId,
    coachId,
  );

  const videos = videosDetails?.videos || [];
  const subdomainName = subdomain_name || "Programs";
  const domainName = "Life Coach";

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const styles = themeStyles[theme];

  // Handle back navigation
  const handleBack = useCallback(() => {
    dispatch(clearUserError());
    navigate(-1);
  }, [dispatch, navigate]);

  // Handle home navigation
  const handleHome = useCallback(() => {
    dispatch(clearUserError());
    navigate("/");
  }, [dispatch, navigate]);

  // Scroll handling
  const scrollToIndex = useCallback(
    (index) => {
      if (carouselRef.current && videos[index]) {
        const card = carouselRef.current.children[index];
        card?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
        setCurrentIndex(index);
      }
    },
    [videos],
  );

  const nextSlide = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  }, [currentIndex, videos.length, scrollToIndex]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  }, [currentIndex, scrollToIndex]);

  // Handle scroll events
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const slides = Array.from(carousel.children);
      const center = carousel.scrollLeft + carousel.offsetWidth / 2;

      const newIndex = slides.reduce((closest, slide, idx) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const closestCenter =
          slides[closest].offsetLeft + slides[closest].offsetWidth / 2;
        return Math.abs(slideCenter - center) < Math.abs(closestCenter - center)
          ? idx
          : closest;
      }, 0);

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "Escape") handleBack();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide, handleBack]);

  // Handle drag for mobile
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Loading state
  if (loading) return <LoadingSkeleton theme={theme} />;

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => dispatch(clearUserError())}
        onBack={handleBack}
        theme={theme}
      />
    );
  }

  // Empty state
  if (videos.length === 0) {
    return <EmptyState onBack={handleBack} theme={theme} />;
  }

  return (
    <div className={`min-h-screen ${styles.page}`}>
      {/* Sticky Header with Breadcrumb */}
      <div
        className={`sticky top-0 z-30 backdrop-blur-md         
      `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center gap-2 text-sm">
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHome}
              className={`flex items-center gap-1.5 transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Go to home"
            >
              <Home className="w-4 h-4" />
            </motion.button>

            <ChevronRight
              className={`w-3 h-3 ${
                theme === "dark" ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className={`transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Go back to categories"
            >
              <span>Categories</span>
            </motion.button>

            <ChevronRight
              className={`w-3 h-3 ${
                theme === "dark" ? "text-gray-600" : "text-gray-400"
              }`}
            />

            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className={`transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Go back to categories"
            >
              <span>{domainName}</span>
            </motion.button>

            <ChevronRight
              className={`w-3 h-3 ${
                theme === "dark" ? "text-gray-600" : "text-gray-400"
              }`}
            />

            <span className={`font-medium ${styles.heading}`}>
              {subdomainName}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${styles.heading}`}
          >
            {subdomainName}
          </h1>

          <p className={`text-lg sm:text-xl ${styles.body}`}>
            {videos.length} {videos.length === 1 ? "program" : "programs"} to
            master your skills
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {videos.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full ${
                  theme === "dark"
                    ? "bg-gray-800 shadow-lg hover:shadow-xl"
                    : "bg-white shadow-md hover:shadow-lg"
                } flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100`}
                aria-label="Previous slide"
              >
                <ChevronLeft className={`w-5 h-5 ${styles.body}`} />
              </button>

              <button
                onClick={nextSlide}
                disabled={currentIndex === videos.length - 1}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full ${
                  theme === "dark"
                    ? "bg-gray-800 shadow-lg hover:shadow-xl"
                    : "bg-white shadow-md hover:shadow-lg"
                } flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100`}
                aria-label="Next slide"
              >
                <ChevronRight className={`w-5 h-5 ${styles.body}`} />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 pb-8"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
          >
            <style>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {videos.map((video, index) => (
              <div
                key={video.video_id}
                className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center"
              >
                <CoachCard
                  video={video}
                  theme={theme}
                  onClick={() => navigate(`/course-details/${video.video_id}`)}
                />
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          {videos.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className="group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "w-8 bg-gradient-to-r from-purple-600 to-pink-500"
                        : `w-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} group-hover:w-4`
                    }`}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Counter (Mobile) */}
          {videos.length > 1 && (
            <div className="text-center mt-4 md:hidden">
              <span className={`text-sm font-medium ${styles.muted}`}>
                {currentIndex + 1} / {videos.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachesInfoPage;
