import React, { useState, useEffect } from "react";
import { useFAQPage } from "../../useHomepage";
import {
  ChevronDown,
  HelpCircle,
  Search,
  Sparkles,
  Loader,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const FAQPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { loading, error, FAQsDetails, refetch } = useFAQPage(page, pageSize);
  const currentFAQs = FAQsDetails?.faqs || [];
  const totalFAQs = FAQsDetails?.total_records || 0;
  const hasNextPage = FAQsDetails?.has_next_page || false;

  const [allFAQs, setAllFAQs] = useState([]);

  // Combine FAQs from all pages when new FAQs are loaded
  useEffect(() => {
    if (currentFAQs.length > 0) {
      // Check for duplicates based on ID or question content
      const newFAQs = currentFAQs.filter(
        (newFaq) =>
          !allFAQs.some(
            (existingFaq) =>
              (newFaq.id && existingFaq.id === newFaq.id) ||
              newFaq.question === existingFaq.question
          )
      );

      if (newFAQs.length > 0) {
        setAllFAQs((prev) => [...prev, ...newFAQs]);
      }
    }
  }, [currentFAQs]);

  // Filter FAQs based on search
  const filteredFAQs = searchQuery
    ? allFAQs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (faq.answer &&
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : allFAQs;

  // Handle loading more FAQs
  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      if (refetch) {
        refetch(nextPage);
      }
    }
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Auto-close other FAQs when one opens
  const handleFAQClick = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (

    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8  `}>

      <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8`}>

        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex flex-col items-center gap-4 mb-6">
              {/* ICON */}
              <div
                className={`p-4 rounded-xl ${theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
              >
                <HelpCircle className="w-9 h-9 text-white" />
              </div>

              {/* MAIN HEADING */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h1>
            </div>

            {/* DESCRIPTION */}
            <p
              className={`text-base sm:text-lg max-w-2xl mx-auto mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Find answers to common questions about our courses, coaches, and
              platform.
            </p>

            {/* FAQ STATS */}
            <div
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 ${theme === "dark"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              <span className="text-sm font-medium">
                {allFAQs.length} {allFAQs.length === 1 ? "question" : "questions"}{" "}
                loaded • {totalFAQs} total
              </span>
            </div>

            {/* SEARCH BAR */}
            <div className="max-w-md mx-auto mb-8">
              <div
                className={`relative rounded-xl overflow-hidden shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
              >
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                />

                <input
                  type="text"
                  placeholder="Search in loaded questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-10 py-4 focus:outline-none ${theme === "dark"
                      ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                      : "bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                    }`}
                />

                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    ✕
                  </button>
                )}
              </div>

              {searchQuery && (
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    Found {filteredFAQs.length} result
                    {filteredFAQs.length !== 1 ? "s" : ""} in {allFAQs.length}{" "}
                    loaded questions
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Loading State - Initial Load */}
          {loading && page === 1 && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xl overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                >
                  <div className="animate-pulse">
                    <div className="p-4 sm:p-5">
                      <div
                        className={`h-6 w-3/4 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                          } mb-2`}
                      ></div>
                      <div
                        className={`h-4 w-full rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                          }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div
              className={`p-6 rounded-xl text-center ${theme === "dark"
                  ? "bg-red-900/20 border border-red-800"
                  : "bg-red-50 border border-red-200"
                }`}
            >
              <p
                className={`font-medium ${theme === "dark" ? "text-red-300" : "text-red-600"
                  }`}
              >
                {error.message || "Failed to load FAQs"}
              </p>
              <button
                onClick={() => refetch && refetch(page)}
                className={`mt-4 px-4 py-2 rounded-lg ${theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Results from Search */}
          {!loading && !error && searchQuery && filteredFAQs.length === 0 && (
            <div
              className={`py-12 rounded-xl text-center ${theme === "dark"
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-gray-50 border border-gray-200"
                }`}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
              >
                <Search
                  className={`w-8 h-8 ${theme === "dark" ? "text-gray-400" : "text-gray-300"
                    }`}
                />
              </div>
              <p
                className={`text-lg mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                No results found for "{searchQuery}"
              </p>
              <p
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Try different keywords or load more questions
              </p>
            </div>
          )}

          {/* Empty State - No FAQs at all */}
          {!loading && !error && allFAQs.length === 0 && !searchQuery && (
            <div
              className={`py-12 rounded-xl text-center ${theme === "dark"
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-gray-50 border border-gray-200"
                }`}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
              >
                <HelpCircle
                  className={`w-8 h-8 ${theme === "dark" ? "text-gray-400" : "text-gray-300"
                    }`}
                />
              </div>
              <p
                className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                No FAQs available yet
              </p>
            </div>
          )}

          {/* FAQ Items */}
          {!loading && !error && filteredFAQs.length > 0 && (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={`${faq.id || faq.question}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`rounded-xl overflow-hidden border transition-all duration-300 ${theme === "dark"
                      ? "bg-gray-800/50 border-gray-700 hover:border-purple-500"
                      : "bg-white border-gray-200 hover:border-purple-300"
                    } ${openIndex === index
                      ? theme === "dark"
                        ? "border-purple-500 shadow-lg"
                        : "border-purple-400 shadow-lg"
                      : ""
                    }`}
                >
                  <button
                    onClick={() => handleFAQClick(index)}
                    className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 transition-all duration-300 ${openIndex === index
                        ? theme === "dark"
                          ? "bg-purple-900/20"
                          : "bg-purple-50"
                        : ""
                      }`}
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${theme === "dark"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          }`}
                      >
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="text-left flex-1">
                        <h3
                          className={`text-base sm:text-lg font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {faq.question}
                        </h3>
                        {openIndex !== index && faq.answer && (
                          <p
                            className={`text-sm line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}
                          >
                            {faq.answer.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                        } ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                    />
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`p-4 sm:p-5 pt-0 pl-14 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                            }`}
                        >
                          <div
                            className={`pl-4 border-l-2 ${theme === "dark"
                                ? "border-purple-500"
                                : "border-purple-400"
                              }`}
                          >
                            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                            {faq.category && (
                              <div className="mt-4 flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "dark"
                                      ? "bg-gray-700 text-gray-300"
                                      : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                  {faq.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More Button - Only show if there are more FAQs to load */}
          {!loading && !error && !searchQuery && hasNextPage && (
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`px-6 py-3 rounded-full flex items-center gap-3 transition-all hover:scale-105 ${theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-400/25 disabled:opacity-50"
                  }`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Loading More Questions...</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Load More Questions</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p
                className={`text-sm mt-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Load next set of questions if you don't find your answer
              </p>
            </div>
          )}

          {/* All FAQs Loaded Message */}
          {!loading &&
            !error &&
            !hasNextPage &&
            allFAQs.length > 0 &&
            !searchQuery && (
              <div
                className={`mt-8 py-4 text-center ${theme === "dark"
                    ? "bg-gray-800/30 border border-gray-700 rounded-xl"
                    : "bg-gray-50 border border-gray-200 rounded-xl"
                  }`}
              >
                <Sparkles
                  className={`w-6 h-6 mx-auto mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-500"
                    }`}
                />
                <p
                  className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  You've viewed all {totalFAQs} FAQs
                </p>
              </div>
            )}

          {/* Contact Support Section */}
          <div
            className={`mt-12 pt-8 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles
                  className={`w-5 h-5 ${theme === "dark" ? "text-purple-400" : "text-purple-500"
                    }`}
                />
                <p
                  className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Still can't find your answer?
                </p>
              </div>
              <button
                onClick={() => navigate("/contact")}
                className={`px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 ${theme === "dark"
                    ? "bg-gray-800 text-purple-300 hover:bg-gray-700 hover:text-purple-200"
                    : "bg-gray-100 text-purple-600 hover:bg-gray-200 hover:text-purple-700"
                  }`}
              >
                Contact our support team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;