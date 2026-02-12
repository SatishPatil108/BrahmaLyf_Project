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
    pageSize
  );
  const domainName = domain_name || "Subdomains";
  const subdomains = subdomainsDetails?.subdomains || [];

  // Early returns
  if (!location.state.domain_id) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`text-center p-8 rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg max-w-md w-full mx-4`}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            No Course Selected
          </h2>
          <p
            className={`mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Please go back and select a course.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // Filter subdomains by difficulty
  const beginner = subdomains.filter((sub) => sub.progressive_difficulty === 1);
  const intermediate = subdomains.filter(
    (sub) => sub.progressive_difficulty === 2
  );
  const advanced = subdomains.filter((sub) => sub.progressive_difficulty === 3);

  const handleSubcategoryClick = (sub) => {
    dispatch(clearUserError());
    navigate(`/categories/courses/${sub.subdomain_name}`, {
      state: { subdomainId: sub.subdomain_id },
    });
  };

  // Difficulty level icons and colors
  const difficultyConfig = {
    1: {
      label: "Beginner",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-700/50",
      hoverColor: "hover:bg-gradient-to-br hover:from-green-900/40 hover:to-emerald-900/30",
    },
    2: {
      label: "Intermediate",
      icon: TrendingUp,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-700 dark:text-yellow-400",
      borderColor: "border-yellow-200 dark:border-yellow-700/50",
      hoverColor: "hover:bg-gradient-to-br hover:from-yellow-900/40 hover:to-orange-900/30",
    },
    3: {
      label: "Advanced",
      icon: Award,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-700 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-700/50",
      hoverColor: "hover:bg-gradient-to-br hover:from-red-900/40 hover:to-pink-900/30",
    },
  };
  const BeginnerIcon = difficultyConfig[1].icon;
  const IntermediateIcon = difficultyConfig[2].icon;
  const AdvancedIcon = difficultyConfig[3].icon;

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`animate-spin h-16 w-16 rounded-full border-[3px] ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            } border-t-indigo-600 mx-auto`}
          ></div>
          <p
            className={`mt-6 text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading subcategories...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`text-center p-8 rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg max-w-md w-full mx-4`}
        >
          {error === "No record found" ? (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                No Subcategories Available
              </h2>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                There are no subcategories in this category yet.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                Error
              </h2>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {error.message || "Failed to load subcategories"}
              </p>
            </>
          )}
          <button
            onClick={() => {
              dispatch(clearUserError());
              navigate(-1);
            }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div
      className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Header Section */}
      <div
        className={`relative ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-gradient-to-br from-indigo-50 to-purple-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>

          {/* Header Content */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Transform Your Journey
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight animate-fadeInUp">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                {domainName}
              </span>
            </h1>

            <p
              className={`text-lg max-w-3xl mx-auto mb-6 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Select a subcategory and continue your transformative learning
              journey
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div
                className={`px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-bold">{subdomains.length}</span>
                <span
                  className={`ml-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Subcategories
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-bold">{beginner.length}</span>
                <span
                  className={`ml-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Beginner
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-bold">{intermediate.length}</span>
                <span
                  className={`ml-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Intermediate
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-bold">{advanced.length}</span>
                <span
                  className={`ml-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Advanced
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-12 flex-1">
        {/* Beginner Section */}
        {beginner.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className={`p-2 rounded-lg ${difficultyConfig[1].bgColor}`}>
                <BeginnerIcon
                  className={`w-6 h-6 ${difficultyConfig[1].textColor}`}
                />
              </div>
              <h2
                className={`text-2xl md:text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Beginner Level
              </h2>
              <div className="ml-auto text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                {beginner.length} program{beginner.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {beginner.map((sub) => (
                <div
                  key={sub.subdomain_id}
                  onClick={() => handleSubcategoryClick(sub)}
                  className={`group relative rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700 hover:border-green-500/30"
                      : "bg-white border-gray-200 hover:border-green-500/50"
                  } shadow-lg hover:shadow-2xl`}
                >
                  {/* Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={`${BASE_URL}${sub.subdomain_thumbnail}`}
                      alt={sub.subdomain_name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === "dark"
                            ? "bg-green-900/80 text-green-200 backdrop-blur-sm"
                            : "bg-green-100/90 text-green-800"
                        }`}
                      >
                        Beginner
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <h3
                      className={`text-lg md:text-xl font-bold mb-2 group-hover:text-green-500 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {sub.subdomain_name}
                    </h3>
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Start your journey with foundational concepts and
                      step-by-step guidance
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span
                        className={`font-medium ${
                          theme === "dark"
                            ? "text-green-400"
                            : "text-green-600"
                        }`}
                      >
                        Explore Now →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Intermediate Section */}
        {intermediate.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className={`p-2 rounded-lg ${difficultyConfig[2].bgColor}`}>
                <IntermediateIcon
                  className={`w-6 h-6 ${difficultyConfig[2].textColor}`}
                />
              </div>
              <h2
                className={`text-2xl md:text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Intermediate Level
              </h2>
              <div className="ml-auto text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                {intermediate.length} program
                {intermediate.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {intermediate.map((sub) => (
                <div
                  key={sub.subdomain_id}
                  onClick={() => handleSubcategoryClick(sub)}
                  className={`group relative rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700 hover:border-yellow-500/30"
                      : "bg-white border-gray-200 hover:border-yellow-500/50"
                  } shadow-lg hover:shadow-2xl`}
                >
                  {/* Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={`${BASE_URL}${sub.subdomain_thumbnail}`}
                      alt={sub.subdomain_name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === "dark"
                            ? "bg-yellow-900/80 text-yellow-200 backdrop-blur-sm"
                            : "bg-yellow-100/90 text-yellow-800"
                        }`}
                      >
                        Intermediate
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <h3
                      className={`text-lg md:text-xl font-bold mb-2 group-hover:text-yellow-500 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {sub.subdomain_name}
                    </h3>
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Build on your foundation with more complex concepts and
                      practical applications
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span
                        className={`font-medium ${
                          theme === "dark"
                            ? "text-yellow-400"
                            : "text-yellow-600"
                        }`}
                      >
                        Level Up →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Advanced Section */}
        {advanced.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className={`p-2 rounded-lg ${difficultyConfig[3].bgColor}`}>
                <AdvancedIcon
                  className={`w-6 h-6 ${difficultyConfig[3].textColor}`}
                />
              </div>
              <h2
                className={`text-2xl md:text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Advanced Level
              </h2>
              <div className="ml-auto text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white">
                {advanced.length} program{advanced.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {advanced.map((sub) => (
                <div
                  key={sub.subdomain_id}
                  onClick={() => handleSubcategoryClick(sub)}
                  className={`group relative rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700 hover:border-red-500/30"
                      : "bg-white border-gray-200 hover:border-red-500/50"
                  } shadow-lg hover:shadow-2xl`}
                >
                  {/* Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={`${BASE_URL}${sub.subdomain_thumbnail}`}
                      alt={sub.subdomain_name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === "dark"
                            ? "bg-red-900/80 text-red-200 backdrop-blur-sm"
                            : "bg-red-100/90 text-red-800"
                        }`}
                      >
                        Advanced
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <h3
                      className={`text-lg md:text-xl font-bold mb-2 group-hover:text-red-500 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {sub.subdomain_name}
                    </h3>
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Master complex topics and become an expert in your field
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-red-500" />
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-red-400" : "text-red-600"
                        }`}
                      >
                        Master Now →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <Pagination
          currentPage={pageNo}
          totalPages={subdomainsDetails ? subdomainsDetails.total_pages : 1}
          onPageChange={setPageNo}
        />
        {/* Empty State if no subdomains */}
        {subdomains.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div
              className={`max-w-md mx-auto p-8 rounded-2xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                No Subcategories Yet
              </h2>
              <p
                className={`mb-8 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Subcategories for this domain will be added soon. Check back
                later!
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
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