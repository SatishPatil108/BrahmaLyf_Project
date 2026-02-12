import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Star,
  MessageCircle,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useFeedback } from "../../useHomepage";
import usePagination from "@/hooks";

const Feedbacks = () => {
  const { theme } = useTheme();
  const { pageNo, setPageNo } = usePagination(1, 5);
  const { allCoursesFeedback, loading, error } = useFeedback(pageNo, 5);

  const feedbacks = allCoursesFeedback?.feedbacks || [];
  const totalRecords = allCoursesFeedback?.total_records || 0;
  const hasNextPage = allCoursesFeedback?.has_next_page || false;

  const BASE_URL = import.meta.env.VITE_BASE_URL_IMG || "";

  const themeColors = {
    dark: {
      cardBg: "bg-gray-800/50",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      border: "border-gray-700",
    },
    light: {
      cardBg: "bg-gray-50",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText:
        "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      border: "border-gray-200",
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Recent";
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));

  const handleLoadMore = () => {
    if (hasNextPage) setPageNo((prev) => prev + 1);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.accent}`}>
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold">
              <span className={colors.accentText}>Feedbacks</span>
            </h2>
          </div>
          <p className={`text-lg ${colors.mutedText}`}>
            What our students say about their learning journey
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg animate-pulse ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-red-500">
            {error.message || "Failed to load feedbacks"}
          </p>
        )}

        {/* Feedback Cards */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.feedback_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${colors.cardBg} ${colors.border}`}
              >
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    {feedback.profile_picture_url ? (
                      <img
                        src={`${BASE_URL}${feedback.profile_picture_url}`}
                        alt={feedback.user_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-purple-500 w-full h-full flex items-center justify-center">
                        <User className="text-white w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className={`font-semibold ${colors.text}`}>
                        {feedback.user_name}
                      </h4>
                      <div className="flex">{renderStars(feedback.rating)}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(feedback.created_on)}
                    </div>
                  </div>
                </div>

                <p className={`text-sm ${colors.mutedText}`}>
                  “{feedback.comments}”
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && hasNextPage && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2 mx-auto"
            >
              Load More <ChevronRight className="w-4 h-4" />
            </button>
            <p className={`text-xs mt-2 ${colors.mutedText}`}>
              Showing {feedbacks.length} of {totalRecords}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
