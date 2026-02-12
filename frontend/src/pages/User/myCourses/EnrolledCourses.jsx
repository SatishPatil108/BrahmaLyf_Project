import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useEnrolledCourses from "./useEnrolledCourses";
import { BookOpen, Clock, Calendar, ArrowRight, ChevronRight, Star, Users, PlayCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearError, logoutUser } from "@/store/feature/auth/authSlice";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useTheme } from "@/contexts/ThemeContext";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";

const EnrolledCourses = () => {
  const { theme } = useTheme();
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 10);
  const { myCoursesDetails, isLoading, error } = useEnrolledCourses(pageNo, pageSize);
  const myCourses = myCoursesDetails.courses || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
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


  // Theme-based styles
  const themeStyles = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      card: "bg-gray-800/50 border-gray-700 hover:border-purple-500 hover:bg-gray-800/70",
      text: {
        primary: "text-gray-100",
        secondary: "text-gray-300",
        tertiary: "text-gray-400",
        accent: "text-purple-400"
      },
      button: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
      emptyState: {
        bg: "bg-gray-800/30",
        text: "text-gray-300",
        icon: "text-purple-400"
      }
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      card: "bg-white/50 border-gray-200 hover:border-purple-500 hover:bg-white/70",
      text: {
        primary: "text-gray-900",
        secondary: "text-gray-600",
        tertiary: "text-gray-500",
        accent: "text-purple-600"
      },
      button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
      emptyState: {
        bg: "bg-gray-50",
        text: "text-gray-600",
        icon: "text-purple-500"
      }
    }
  };

  const styles = themeStyles[theme];

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 lg:px-20  ${styles.bg}`}>
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className={`w-10 h-10 ${styles.emptyState.icon} animate-pulse`} />
            </div>
          </div>
          <p className={`text-lg font-medium ${styles.text.secondary} animate-pulse`}>
            Loading your learning journey...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.message === "Invalid token" || error.message === "Authorization token is missing") {
      return null;
    }

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 lg:px-20 ${styles.bg}`}>
        <div className={`max-w-md w-full p-8 rounded-2xl ${styles.emptyState.bg} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${styles.text.primary}`}>Oops! Something went wrong</h3>
          <p className={`text-sm mb-6 ${styles.text.secondary}`}>
            {error === "No courses found"
              ? "You haven't enrolled in any courses yet."
              : error?.message || "Unable to load your courses."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              Try Again
            </button>
            <Link
              to="/categories"
              className={`px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center gap-2 ${styles.button}`}
            >
              <BookOpen className="w-4 h-4" />
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!myCourses || myCourses.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 lg:px-20  ${styles.bg}`}>
        <div className={`max-w-md w-full p-8 rounded-2xl ${styles.emptyState.bg} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h3 className={`text-2xl font-bold mb-3 ${styles.text.primary}`}>Your Learning Journey Awaits</h3>
          <p className={`text-base mb-6 ${styles.text.secondary}`}>
            You haven't enrolled in any courses yet. Start your transformation journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/categories"
              className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 flex items-center justify-center gap-2 ${styles.button}`}
            >
              <BookOpen className="w-5 h-5" />
              Explore Courses
            </Link>
            <Link
              to="/coaches"
              className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              Find Coaches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 lg:px-20 ${styles.bg}`}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 ${styles.text.primary}`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                My Learning Journey
              </span>
            </h1>
            <p className={`text-base sm:text-lg ${styles.text.secondary}`}>
              Continue your transformation with {myCourses.length} enrolled {myCourses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {myCourses.filter(c => c.status === 1).length} Active
            </span>
            <Link
              to="/categories"
              className={`px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-2 ${styles.button}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Browse More</span>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl border ${styles.card}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${styles.text.primary}`}>{myCourses.length}</p>
                <p className={`text-sm ${styles.text.secondary}`}>Total Courses</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-xl border ${styles.card}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${styles.text.primary}`}>
                  {myCourses.filter(c => c.status === 1).length}
                </p>
                <p className={`text-sm ${styles.text.secondary}`}>Active</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-xl border ${styles.card}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${styles.text.primary}`}>
                  {myCourses.reduce((acc, course) => acc + (parseInt(course.duration) || 0), 0)}h
                </p>
                <p className={`text-sm ${styles.text.secondary}`}>Total Hours</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-xl border ${styles.card}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${styles.text.primary}`}>
                  {new Set(myCourses
                    .filter(c => c.coach_id) // Remove null/undefined
                    .map(c => c.coach_id)
                  ).size}
                </p>
                <p className={`text-sm ${styles.text.secondary}`}>Coaches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {myCourses.map((course, index) => {
            const progressValue = course.progress || null;
            return (
              <div
                key={course.course_id}
                onClick={() => {
                  dispatch(clearUserError());
                  navigate(`/enrolled-course/${course.course_id}`);
                }}
                className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${styles.card} animate-fadeInUp`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Course Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === 1
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                    }`}
                  >
                    {course.status === 1 ? "Active" : "Completed"}
                  </span>
                </div>

                {/* Course Image/Icon */}
                <div className="h-40 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <BookOpen className={`w-16 h-16 ${styles.text.accent} opacity-50 group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                  <h3 className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-purple-500 transition-colors ${styles.text.primary}`}>
                    {course.course_name}
                  </h3>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${styles.text.tertiary}`} />
                      <span className={`text-sm ${styles.text.secondary}`}>
                        {course.duration || "Self-paced"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${styles.text.tertiary}`} />
                      <span className={`text-sm ${styles.text.secondary}`}>
                        Enrolled: {new Date(course.enrolled_on).toLocaleDateString()}
                      </span>
                    </div>

                    {progressValue &&
                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={styles.text.secondary}>Progress</span>
                          <span className={styles.text.accent}>{progressValue}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressValue}%` }}
                          ></div>
                        </div>
                      </div>}

                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className={`text-sm font-medium ${course.status === 1 ? 'text-green-500' : 'text-gray-500'}`}>
                      {course.status === 1 ? 'Continue Learning →' : 'View Course'}
                    </span>
                    <ChevronRight className={`w-5 h-5 ${styles.text.tertiary} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Pagination
          currentPage={pageNo}
          totalPages={myCoursesDetails.total_pages}
          onPageChange={setPageNo}
          currentPageSize={pageSize}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
          showPageSize={true}
        />
      </div>

      {/* Empty State Fallback (shouldn't show but just in case) */}
      {myCourses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className={`w-16 h-16 mx-auto mb-4 ${styles.emptyState.icon}`} />
          <h3 className={`text-xl font-bold mb-2 ${styles.text.primary}`}>No courses enrolled</h3>
          <p className={`text-base mb-6 ${styles.text.secondary}`}>
            Start your learning journey by exploring our courses
          </p>
          <Link
            to="/categories"
            className={`px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 ${styles.button}`}
          >
            <BookOpen className="w-5 h-5" />
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;