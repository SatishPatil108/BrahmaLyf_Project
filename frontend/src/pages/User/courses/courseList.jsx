import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCoursesList from "./useCoursesList";
import { BookOpen, ArrowRight, AlertCircle } from "lucide-react";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = ({ theme }) => (
  <div
    className={`rounded-2xl overflow-hidden border ${
      theme === "dark"
        ? "bg-neutral-900 border-neutral-800"
        : "bg-white border-neutral-100"
    }`}
  >
    <div
      className={`h-52 animate-pulse ${
        theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
      }`}
    />
    <div className="p-6 space-y-3">
      <div
        className={`h-5 w-3/4 rounded-full animate-pulse ${
          theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
        }`}
      />
      <div
        className={`h-4 w-1/2 rounded-full animate-pulse ${
          theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
        }`}
        style={{ animationDelay: "150ms" }}
      />
    </div>
  </div>
);

// ─── Course Card ──────────────────────────────────────────────────────────────
const CourseCard = ({ course, index, theme, onClick }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    const timer = setTimeout(() => {
      el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <article
      ref={cardRef}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      aria-label={`Explore ${course.domain_name} courses`}
      className={`
        group relative flex flex-col rounded-2xl overflow-hidden border cursor-pointer
        outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
        transition-all duration-300 ease-out
        hover:-translate-y-1
        ${
          theme === "dark"
            ? "bg-neutral-900 border-neutral-800 hover:border-neutral-700 focus-visible:ring-offset-neutral-950"
            : "bg-white border-neutral-100 hover:border-neutral-200 focus-visible:ring-offset-white"
        }
      `}
      style={{
        boxShadow:
          theme === "dark"
            ? "0 1px 3px 0 rgba(0,0,0,0.4)"
            : "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          theme === "dark"
            ? "0 8px 30px rgba(0,0,0,0.5)"
            : "0 8px 30px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          theme === "dark"
            ? "0 1px 3px 0 rgba(0,0,0,0.4)"
            : "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)";
      }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <img
          src={`${BASE_URL}${course.domain_thumbnail}`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
          }}
        />
        {/* Scrim — bottom only, subtle */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <h2
          className={`text-base font-semibold leading-snug tracking-tight mb-5 ${
            theme === "dark" ? "text-neutral-100" : "text-neutral-900"
          }`}
        >
          {course.domain_name}
        </h2>

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              theme === "dark"
                ? "bg-violet-500/10 text-violet-400"
                : "bg-violet-50 text-violet-700"
            }`}
          >
            <BookOpen className="w-3 h-3" aria-hidden="true" />
            Browse courses
          </span>

          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
              group-hover:translate-x-0.5 group-hover:bg-violet-600 group-hover:text-white
              ${
                theme === "dark"
                  ? "bg-neutral-800 text-neutral-400"
                  : "bg-neutral-100 text-neutral-500"
              }`}
          >
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CourseList = () => {
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 6);
  const { coursesDetails, loading, error } = useCoursesList(pageNo, pageSize);

  const courses = coursesDetails?.domains?.map((course) => ({
    ...course,
    domain_id: course.domain_id || course.id,
  }));

  const totalPages = coursesDetails?.total_pages ?? 1;
  const totalRecords = coursesDetails?.total_records ?? 0;
  const currentPage = coursesDetails?.current_page ?? pageNo;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleCourseClick = (domain_id, domain_name) => {
    dispatch(clearUserError());
    navigate(`/categories/subcategories/${domain_name}`, {
      state: { domain_id },
    });
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isDark
          ? "bg-neutral-950 text-neutral-100"
          : "bg-neutral-50 text-neutral-900"
      }`}
    >
      {/* ── Header ── */}
      <header
        className={`border-b ${
          isDark ? "border-neutral-800/60" : "border-neutral-100"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
          {/* Eyebrow */}
          <p
            className={`text-xs font-semibold tracking-widest uppercase  ${
              isDark ? "text-violet-400" : "text-violet-600"
            }`}
          >
            Learning Paths
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] max-w-lg ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Explore course
              <br />
              <span
                className={`${isDark ? "text-neutral-400" : "text-neutral-400"}`}
              >
                categories
              </span>
            </h1>

            <p
              className={`text-sm sm:text-base max-w-xs leading-relaxed ${
                isDark ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              Pick a domain and start learning with structured, expert-curated
              content.
            </p>
          </div>
        </div>
      </header>

      {/* ── Main Grid ── */}
      <main className="max-w-6xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 flex-1">
        {/* Loading skeletons */}
        {loading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-label="Loading courses"
            aria-busy="true"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} theme={theme} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className={`flex items-start gap-4 max-w-md p-5 rounded-2xl border ${
              isDark
                ? "bg-red-950/30 border-red-900/40 text-red-300"
                : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                isDark ? "text-red-400" : "text-red-500"
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-sm mb-0.5">
                Couldn't load categories
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                {error.message || "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
        )}

        {/* Course grid */}
        {!loading && !error && courses && courses.length > 0 && (
          <>
            {/* Results count */}
            <p
              className={`text-xs font-medium mb-7 ${
                isDark ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              {totalRecords} {totalRecords === 1 ? "category" : "categories"}{" "}
              available
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course, index) => (
                <CourseCard
                  key={course.domain_id}
                  course={course}
                  index={index}
                  theme={theme}
                  onClick={() =>
                    handleCourseClick(course.domain_id, course.domain_name)
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !error && (!courses || courses.length === 0) && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                isDark ? "bg-neutral-800" : "bg-neutral-100"
              }`}
            >
              <BookOpen
                className={`w-6 h-6 ${
                  isDark ? "text-neutral-400" : "text-neutral-400"
                }`}
                aria-hidden="true"
              />
            </div>
            <h2
              className={`text-lg font-semibold mb-2 ${
                isDark ? "text-neutral-100" : "text-neutral-900"
              }`}
            >
              No categories yet
            </h2>
            <p
              className={`text-sm mb-8 max-w-xs leading-relaxed ${
                isDark ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              Course categories will appear here once they're published.
            </p>
            <button
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isDark
                  ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
              Back to home
            </button>
          </div>
        )}

        {/* Pagination — only renders when total_pages > 1 */}
        {!loading &&
          !error &&
          courses &&
          courses.length > 0 &&
          totalPages > 1 && (
            <div className="mt-14">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setPageNo(page)}
                showInfo={true}
                showPageNumbers={true}
                showPageSize={true}
                currentPageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPageNo(1);
                }}
                pageSizeOptions={[6, 12, 24]}
                size="medium"
              />
            </div>
          )}
      </main>
    </div>
  );
};

export default CourseList;
