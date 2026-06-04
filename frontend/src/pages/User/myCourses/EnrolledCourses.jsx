import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useEnrolledCourses from "./useEnrolledCourses";
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  ChevronRight,
  Star,
  Users,
  PlayCircle,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  GraduationCap,
  Target,
  Flame,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearError, logoutUser } from "@/store/feature/auth/authSlice";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useTheme } from "@/contexts/ThemeContext";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

// Skeleton Loader Component
const CourseCardSkeleton = memo(() => (
  <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
    <div className="h-48 bg-gradient-to-br from-white/5 to-white/10 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-white/10 rounded-lg w-3/4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-white/10 rounded-lg w-2/3 animate-pulse" />
      </div>
      <div className="pt-4">
        <div className="h-10 bg-white/10 rounded-xl w-full animate-pulse" />
      </div>
    </div>
  </div>
));

CourseCardSkeleton.displayName = "CourseCardSkeleton";

// Individual Course Card Component
const CourseCard = memo(({ course, index, onClick, themeStyles }) => {
  const [isHovered, setIsHovered] = useState(false);
  const progressValue = course.progress || 0;
  const isActive = course.status === 1;
  const daysRemaining = useMemo(() => {
    if (!course.deadline) return null;
    const diff = Math.ceil(
      (new Date(course.deadline) - new Date()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 0;
  }, [course.deadline]);

  const getUrgencyColor = () => {
    if (!daysRemaining) return "text-gray-400";
    if (daysRemaining <= 3) return "text-red-400";
    if (daysRemaining <= 7) return "text-orange-400";
    return "text-green-400";
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
        ${themeStyles.card} 
        ${isHovered ? "shadow-2xl scale-[1.02]" : "shadow-lg"}`}
      onClick={onClick}
      role="article"
      aria-label={`Course: ${course.course_name}, ${isActive ? "Active" : "Completed"}, ${progressValue}% complete`}
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Course Image Section with Status Badge */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <BookOpen
              className={`w-20 h-20 ${themeStyles.text.accent} opacity-30`}
            />
          </motion.div>
        </div>

        {/* Premium Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md
              ${
                isActive
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20"
                  : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200"
              }`}
          >
            <div className="flex items-center gap-1.5">
              {isActive ? (
                <>
                  <Zap className="w-3 h-3" />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Completed</span>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Premium Action Badge on Hover */}
        <AnimatePresence>
          {isHovered && isActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 z-10"
            >
              <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-gray-900 text-xs font-semibold shadow-lg">
                Continue →
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-4">
        {/* Title and Meta */}
        <div className="space-y-2">
          <h3
            className={`text-xl font-bold line-clamp-2 transition-colors ${themeStyles.text.primary}`}
          >
            {course.course_name}
          </h3>

          {/* Instructor Info if available */}
          {course.instructor && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {course.instructor.charAt(0)}
                </span>
              </div>
              <span className={themeStyles.text.secondary}>
                {course.instructor}
              </span>
            </div>
          )}
        </div>

        {/* Course Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/5">
              <Clock className={`w-4 h-4 ${themeStyles.text.tertiary}`} />
            </div>
            <div>
              <p className={`text-xs ${themeStyles.text.tertiary}`}>Duration</p>
              <p
                className={`text-sm font-medium ${themeStyles.text.secondary}`}
              >
                {course.duration || "Self-paced"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/5">
              <Calendar className={`w-4 h-4 ${themeStyles.text.tertiary}`} />
            </div>
            <div>
              <p className={`text-xs ${themeStyles.text.tertiary}`}>Enrolled</p>
              <p
                className={`text-sm font-medium ${themeStyles.text.secondary}`}
              >
                {new Date(course.enrolled_on).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>


        {/* Action Button */}
        <motion.div
          whileHover={{ x: 4 }}
          className="pt-4 border-t border-white/10"
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold ${isActive ? "text-purple-400" : themeStyles.text.tertiary}`}
            >
              {isActive ? "Continue Learning" : "Review Course"}
            </span>
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ArrowRight
                className={`w-4 h-4 ${isActive ? "text-purple-400" : themeStyles.text.tertiary}`}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Premium Corner Accent */}
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-3xl pointer-events-none" />
    </motion.div>
  );
});

CourseCard.displayName = "CourseCard";

// Empty State Component
const PremiumEmptyState = ({ themeStyles, onExplore }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 24 }}
    className="relative max-w-2xl mx-auto"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
    <div className="relative text-center space-y-8">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm"
      >
        <GraduationCap className="w-16 h-16 text-purple-400" />
      </motion.div>

      <div className="space-y-3">
        <h2 className={`text-3xl font-bold ${themeStyles.text.primary}`}>
          Start Your Learning Journey
        </h2>
        <p className={`text-lg ${themeStyles.text.secondary} max-w-md mx-auto`}>
          Transform your career with our premium courses taught by industry
          experts
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          className={`px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg ${themeStyles.button}`}
        >
          <Sparkles className="w-5 h-5" />
          Explore Courses
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3.5 rounded-xl font-semibold border border-white/20 backdrop-blur-sm hover:bg-white/5 transition-colors"
        >
          View Recommendations
        </motion.button>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 pt-8">
        {[
          { icon: Shield, label: "Lifetime Access" },
          { icon: Award, label: "Certified" },
          { icon: Users, label: "10k+ Students" },
        ].map((badge, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <badge.icon className="w-4 h-4 text-purple-400" />
            <span className={`text-sm ${themeStyles.text.tertiary}`}>
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Error State Component
const PremiumErrorState = ({ themeStyles, error, onRetry, onExplore }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative max-w-md mx-auto"
  >
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-400" />
      </div>

      <div className="space-y-2">
        <h3 className={`text-2xl font-bold ${themeStyles.text.primary}`}>
          Unable to Load Courses
        </h3>
        <p className={`text-sm ${themeStyles.text.secondary}`}>
          {error?.message || "Something went wrong. Please try again."}
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl font-medium bg-white/10 hover:bg-white/20 transition-colors"
        >
          Try Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 ${themeStyles.button}`}
        >
          Browse Courses
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Main Component
const EnrolledCourses = () => {
  const { theme } = useTheme();
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 12);
  const { myCoursesDetails, isLoading, error } = useEnrolledCourses(
    pageNo,
    pageSize,
  );
  const myCourses = myCoursesDetails?.courses || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoized theme styles
  const themeStyles = useMemo(
    () => ({
      dark: {
        bg: "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950",
        card: "bg-gray-800/40 backdrop-blur-sm border-white/10 hover:border-purple-500/50",
        text: {
          primary: "text-white",
          secondary: "text-gray-300",
          tertiary: "text-gray-400",
          accent: "text-purple-400",
        },
        button:
          "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25",
        emptyState: {
          bg: "bg-gray-800/30",
          text: "text-gray-300",
          icon: "text-purple-400",
        },
      },
      light: {
        bg: "bg-gradient-to-br from-gray-50 via-white to-gray-50",
        card: "bg-white/80 backdrop-blur-sm border-gray-200/50 hover:border-purple-500/30",
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-600",
          tertiary: "text-gray-500",
          accent: "text-purple-600",
        },
        button:
          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25",
        emptyState: {
          bg: "bg-gray-50",
          text: "text-gray-600",
          icon: "text-purple-500",
        },
      },
    }),
    [],
  );

  const currentStyles = themeStyles[theme];

  // Error handling
  useEffect(() => {
    if (!error) return;

    if (
      error.message === "Invalid token" ||
      error.message === "Authorization token is missing"
    ) {
      setTimeout(() => {
        dispatch(clearUserError());
        dispatch(clearError());
        dispatch(logoutUser());
        navigate("/login");
      }, 0);
    }
  }, [error, dispatch, navigate]);

  const handleCourseClick = useCallback(
    (courseId) => {
      dispatch(clearUserError());
      navigate(`/enrolled-course/${courseId}`);
    },
    [dispatch, navigate],
  );

  const handleExplore = useCallback(() => {
    navigate("/categories");
  }, [navigate]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Loading State with Skeletons
  if (isLoading) {
    return (
      <div className={`min-h-screen ${currentStyles.bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-10 bg-white/10 rounded-xl w-64 animate-pulse" />
              <div className="h-5 bg-white/10 rounded-lg w-96 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && error.message !== "No courses found") {
    return (
      <div
        className={`min-h-screen ${currentStyles.bg} flex items-center justify-center p-4`}
      >
        <PremiumErrorState
          themeStyles={currentStyles}
          error={error}
          onRetry={handleRetry}
          onExplore={handleExplore}
        />
      </div>
    );
  }

  // Empty State
  if (!myCourses.length) {
    return (
      <div
        className={`min-h-screen ${currentStyles.bg} flex items-center justify-center p-4`}
      >
        <PremiumEmptyState
          themeStyles={currentStyles}
          onExplore={handleExplore}
        />
      </div>
    );
  }

  // Main Render
  return (
    <div className={`min-h-screen ${currentStyles.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
                <GraduationCap className="w-4 h-4" />
                <span>My Learning</span>
              </div>
              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${currentStyles.text.primary}`}
              >
                Continue Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Journey
                </span>
              </h1>
              <p
                className={`text-base sm:text-lg ${currentStyles.text.secondary}`}
              >
                You've enrolled in {myCourses.length}{" "}
                {myCourses.length === 1 ? "course" : "courses"} •{" "}
                <span className="text-purple-400">
                  {myCourses.filter((c) => c.status === 1).length} active
                </span>
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplore}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${currentStyles.button}`}
            >
              <Sparkles className="w-4 h-4" />
              Discover More
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {myCourses.map((course, index) => (
            <CourseCard
              key={course.course_id}
              course={course}
              index={index}
              onClick={() => handleCourseClick(course.course_id)}
              themeStyles={currentStyles}
            />
          ))}
        </motion.div>

        {/* Pagination */}
        {myCoursesDetails.total_pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <Pagination
              currentPage={pageNo}
              totalPages={myCoursesDetails.total_pages}
              onPageChange={setPageNo}
              currentPageSize={pageSize}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[6, 12, 24, 48]}
              showPageSize={true}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default React.memo(EnrolledCourses);
