import React from "react";
import { useNavigate } from "react-router-dom";
import useCoursesList from "./useCoursesList";
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  Target,
  Play,
  ArrowRight,
  Zap,
} from "lucide-react";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const CourseList = () => {
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 6);
  const { coursesDetails, loading, error } = useCoursesList(pageNo, pageSize);
  const courses = coursesDetails.domains?.map((course) => ({
    ...course,
    domain_id: course.domain_id || course.id,
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const handleCourseClick = (domain_id, domain_name) => {
    dispatch(clearUserError());
    navigate(`/categories/subcategories/${domain_name}`, {
      state: { domain_id },
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* 🌟 HERO SECTION */}
      <section className="relative flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] overflow-hidden px-4 sm:px-6 lg:px-10">
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl w-full">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-fadeInUp">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
              Explore Course
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-600 animate-gradient">
              Categories
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate-slideUp font-light leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Choose a category and start your transformative learning journey to
            awaken your mind, elevate your spirit, and master every dimension of
            your life.
          </p>
        </div>
      </section>

      {/* 📊 CONTENT SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-12 flex-1">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div
                className={`animate-spin h-16 w-16 rounded-full border-3 ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                } border-t-purple-600 mx-auto`}
              ></div>
              <div className="absolute inset-0 animate-ping bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"></div>
            </div>
            <p
              className={`mt-6 text-xl ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Loading course categories...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className={`max-w-md w-full p-8 rounded-2xl backdrop-blur-sm border ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/50 border-gray-200"
              } shadow-xl`}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2
                className={`text-2xl font-bold text-center mb-4 ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                Error
              </h2>
              <p
                className={`text-center mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {error.message || "Failed to load courses"}
              </p>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && courses && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course, index) => (
              <div
                key={course.domain_id}
                onClick={() =>
                  handleCourseClick(course.domain_id, course.domain_name)
                }
                className={`group relative rounded-2xl overflow-hidden backdrop-blur-sm border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer animate-fadeInUp ${
                  theme === "dark"
                    ? "bg-gray-800/30 border-gray-700 hover:bg-gray-800/50"
                    : "bg-white/30 border-gray-200 hover:bg-white/50"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Container with Overlay */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img
                    src={`${BASE_URL}${course.domain_thumbnail}`}
                    alt={course.domain_name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80";
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* Course Count Badge */}
                  <div className="absolute top-4 right-4"></div>

                  {/* Play Button Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                        <Play
                          className="w-6 h-6 text-white ml-1"
                          fill="white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <h2
                        className={`text-xl md:text-2xl font-bold mb-2 group-hover:text-purple-500 transition-colors duration-300 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {course.domain_name}
                      </h2>
                    </div>

                    {/* Arrow Icon */}
                    <ArrowRight
                      className={`w-6 h-6 shrink-0 mt-1 transform group-hover:translate-x-2 transition-transform duration-300 ${
                        theme === "dark"
                          ? "text-gray-400 group-hover:text-purple-400"
                          : "text-gray-500 group-hover:text-purple-600"
                      }`}
                    />
                  </div>

                  {/* Action Section - Horizontal line removed */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          theme === "dark" ? "bg-gray-700" : "bg-purple-50"
                        }`}
                      >
                        <BookOpen
                          className={`w-5 h-5 ${
                            theme === "dark"
                              ? "text-purple-400"
                              : "text-purple-600"
                          }`}
                        />
                      </div>
                      <div>
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark"
                              ? "text-purple-400"
                              : "text-purple-600"
                          }`}
                        >
                          Explore Courses
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div
                  className={`absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                      : "bg-gradient-to-br from-purple-50/20 to-pink-50/20"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (!courses || courses.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className={`max-w-md w-full p-10 rounded-2xl backdrop-blur-sm border text-center ${
                theme === "dark"
                  ? "bg-gray-800/30 border-gray-700"
                  : "bg-white/30 border-gray-200"
              } shadow-xl`}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                No Courses Available
              </h2>
              <p
                className={`text-lg mb-8 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Course categories will be added soon. Check back later for
                transformative learning experiences!
              </p>
              <button
                onClick={() => navigate("/")}
                className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Return Home
              </button>
            </div>
          </div>
        )}

        {/* Footer Note */}
        {!loading && !error && courses && courses.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={pageNo}
              totalPages={coursesDetails.total_pages || 1}
              onPageChange={setPageNo}
            />
            <div className="inline-flex items-center gap-2 mb-4">
              <Zap
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-yellow-300" : "text-yellow-500"
                }`}
              />
              <p
                className={`text-lg font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {coursesDetails.total_records} transformative categor
                {coursesDetails.total_records === 1 ? "y" : "ies"} available
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Tap any category to begin your journey
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseList;
