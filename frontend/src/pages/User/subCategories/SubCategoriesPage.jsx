import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useSubCategoriesPage from "./useSubCategoriesPage";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
} from "lucide-react";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const SubCategoriesPage = () => {
  const { domain_name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 6);
  const { subdomainsDetails, loading, error } = useSubCategoriesPage(
    location.state.domain_id,
    pageNo,
    pageSize,
  );

  const domainName = domain_name || "Subdomains";
  const subdomains = subdomainsDetails?.subdomains || [];

  const themeColors = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      cardBg: "bg-gray-800/50 backdrop-blur-sm border border-gray-700",
      border: "border-gray-700",
      headerBg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      backBtn: "bg-purple-500 hover:bg-purple-600 text-white",
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
      border: "border-gray-200",
      headerBg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      backBtn:
        "bg-purple-500 hover:bg-purple-600 text-white border border-purple-500 hover:border-purple-600",
    },
  };
  const tc = themeColors[theme] ?? themeColors.light;

  const difficultyConfig = {
    1: {
      label: "Beginner",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      bgColor: theme === "dark" ? "bg-green-900/30" : "bg-green-100",
      textColor: theme === "dark" ? "text-green-400" : "text-green-700",
      hoverBorder:
        theme === "dark"
          ? "hover:border-green-500/30"
          : "hover:border-green-500/50",
      badgeBg:
        theme === "dark"
          ? "bg-green-900/80 text-green-200 backdrop-blur-sm"
          : "bg-green-100/90 text-green-800",
      hoverText: "group-hover:text-green-500",
      zapColor: "text-green-500",
      ctaText: theme === "dark" ? "text-green-400" : "text-green-600",
      cta: "Explore Now →",
    },
    2: {
      label: "Intermediate",
      icon: TrendingUp,
      color: "from-yellow-500 to-orange-500",
      bgColor: theme === "dark" ? "bg-yellow-900/30" : "bg-yellow-100",
      textColor: theme === "dark" ? "text-yellow-400" : "text-yellow-700",
      hoverBorder:
        theme === "dark"
          ? "hover:border-yellow-500/30"
          : "hover:border-yellow-500/50",
      badgeBg:
        theme === "dark"
          ? "bg-yellow-900/80 text-yellow-200 backdrop-blur-sm"
          : "bg-yellow-100/90 text-yellow-800",
      hoverText: "group-hover:text-yellow-500",
      zapColor: "text-yellow-500",
      ctaText: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
      cta: "Level Up →",
    },
    3: {
      label: "Advanced",
      icon: Award,
      color: "from-red-500 to-pink-500",
      bgColor: theme === "dark" ? "bg-red-900/30" : "bg-red-100",
      textColor: theme === "dark" ? "text-red-400" : "text-red-700",
      hoverBorder:
        theme === "dark"
          ? "hover:border-red-500/30"
          : "hover:border-red-500/50",
      badgeBg:
        theme === "dark"
          ? "bg-red-900/80 text-red-200 backdrop-blur-sm"
          : "bg-red-100/90 text-red-800",
      hoverText: "group-hover:text-red-500",
      zapColor: "text-red-500",
      ctaText: theme === "dark" ? "text-red-400" : "text-red-600",
      cta: "Master Now →",
    },
  };

  const SubdomainCard = ({ sub, difficulty }) => {
    const config = difficultyConfig[difficulty];
    const Icon = config.icon;
    return (
      <div
        key={sub.subdomain_id}
        onClick={() => handleSubcategoryClick(sub)}
        className={`group relative rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-2xl
          ${tc.cardBg} ${config.hoverBorder}`}
      >
        {/* Image */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img
            src={`${BASE_URL}${sub.subdomain_thumbnail}`}
            alt={sub.subdomain_name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${config.badgeBg}`}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <h3
            className={`text-lg md:text-xl font-bold mb-2 transition-colors duration-300 ${tc.text} ${config.hoverText}`}
          >
            {sub.subdomain_name}
          </h3>
          <p className={`text-sm mb-4 line-clamp-2 ${tc.mutedText}`}>
            {difficulty === 1 &&
              "Start your journey with foundational concepts and step-by-step guidance"}
            {difficulty === 2 &&
              "Build on your foundation with more complex concepts and practical applications"}
            {difficulty === 3 &&
              "Master complex topics and become an expert in your field"}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Zap className={`w-4 h-4 ${config.zapColor}`} />
            <span className={`font-medium ${config.ctaText}`}>
              {config.cta}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const DifficultySection = ({ items, difficulty, title }) => {
    if (!items.length) return null;
    const config = difficultyConfig[difficulty];
    const Icon = config.icon;
    return (
      <section className="mb-12 md:mb-16">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`w-6 h-6 ${config.textColor}`} />
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold ${tc.text}`}>
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((sub) => (
            <SubdomainCard
              key={sub.subdomain_id}
              sub={sub}
              difficulty={difficulty}
            />
          ))}
        </div>
      </section>
    );
  };

  const StateCard = ({ children }) => (
    <div className={`min-h-screen flex items-center justify-center ${tc.bg}`}>
      <div
        className={`text-center p-8 rounded-xl shadow-lg max-w-md w-full mx-4 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {children}
      </div>
    </div>
  );

  const handleSubcategoryClick = (sub) => {
    dispatch(clearUserError());
    navigate(`/categories/courses/${sub.subdomain_name}`, {
      state: { subdomainId: sub.subdomain_id },
    });
  };

  // Early return — no domain id
  if (!location.state.domain_id) {
    return (
      <StateCard>
        <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2
          className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
        >
          No Course Selected
        </h2>
        <p className={`mb-6 ${tc.mutedText}`}>
          Please go back and select a course.
        </p>
        <button
          onClick={() => navigate(-1)}
          className={`px-6 py-3 bg-gradient-to-r ${tc.accent} text-white rounded-lg font-medium transition-all duration-300`}
        >
          ← Go Back
        </button>
      </StateCard>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${tc.bg}`}>
        <div className="text-center">
          <div
            className={`animate-spin h-16 w-16 rounded-full border-[3px] ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            } border-t-indigo-600 mx-auto`}
          />
          <p className={`mt-6 text-lg ${tc.mutedText}`}>
            Loading subcategories...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <StateCard>
        {error === "No record found" ? (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${tc.text}`}>
              No Subcategories Available
            </h2>
            <p className={`mb-6 ${tc.mutedText}`}>
              There are no subcategories in this category yet.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
            >
              Error
            </h2>
            <p className={`mb-6 ${tc.mutedText}`}>
              {error.message || "Failed to load subcategories"}
            </p>
          </>
        )}
        <button
          onClick={() => {
            dispatch(clearUserError());
            navigate(-1);
          }}
          className={`px-6 py-3 bg-gradient-to-r ${tc.accent} text-white rounded-lg font-medium transition-all duration-300`}
        >
          ← Go Back
        </button>
      </StateCard>
    );
  }

  const beginner = subdomains.filter((s) => s.progressive_difficulty === 1);
  const intermediate = subdomains.filter((s) => s.progressive_difficulty === 2);
  const advanced = subdomains.filter((s) => s.progressive_difficulty === 3);

  // Main render
  return (
    <div
      className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${tc.headerBg} ${tc.text}`}
    >
      {/* Header Section */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${tc.accent} text-white text-sm font-medium mb-4`}
            >
              <Sparkles className="w-4 h-4" />
              Transform Your Journey
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className={tc.accentText}>{domainName}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-12 flex-1`}
      >
        <DifficultySection
          items={beginner}
          difficulty={1}
          title="Beginner Level"
        />
        <DifficultySection
          items={intermediate}
          difficulty={2}
          title="Intermediate Level"
        />
        <DifficultySection
          items={advanced}
          difficulty={3}
          title="Advanced Level"
        />

        <Pagination
          currentPage={pageNo}
          totalPages={subdomainsDetails ? subdomainsDetails.total_pages : 1}
          onPageChange={setPageNo}
        />

        {/* Empty State */}
        {subdomains.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div
              className={`max-w-md mx-auto p-8 rounded-2xl shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${tc.text}`}>
                No Subcategories Yet
              </h2>
              <p className={`mb-8 ${tc.mutedText}`}>
                Subcategories for this domain will be added soon. Check back
                later!
              </p>
              <button
                onClick={() => navigate(-1)}
                className={`px-6 py-3 bg-gradient-to-r ${tc.accent} text-white rounded-lg font-medium transition-all duration-300`}
              >
                ← Browse Other Categories
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubCategoriesPage;
