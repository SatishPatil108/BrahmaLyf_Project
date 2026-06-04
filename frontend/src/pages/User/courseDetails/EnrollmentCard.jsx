import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Bookmark, Share2, Calendar, CheckCircle } from "lucide-react";
import { FeatureItem } from "./CourseUIPrimitives";
import { scaleOnHover } from "@/components/Animations/animations";

const EnrollmentCard = ({
  course,
  enrolling,
  onEnroll,
  formatDate,
  showToast,
  styles,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = useCallback(() => {
    setIsBookmarked((prev) => {
      const next = !prev;
      showToast(next ? "Added to bookmarks" : "Removed from bookmarks");
      return next;
    });
  }, [showToast]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: course?.course_name,
          text: "Check out this course!",
          url: window.location.href,
        })
        .catch(() => showToast("Share cancelled"));
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  }, [course?.course_name, showToast]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:sticky lg:top-24 h-fit"
    >
      <div
        className={`rounded-2xl ${styles.enrollCardBg} ${styles.cardShadow} border ${styles.enrollCardBorder} overflow-hidden transition-all duration-300 hover:shadow-2xl`}
      >
        <div className="p-6">
          {/* ── Header ────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${styles.enrollTitle}`}>
              Enroll Now
            </h3>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookmark}
                aria-label={
                  isBookmarked ? "Remove bookmark" : "Bookmark course"
                }
                aria-pressed={isBookmarked}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bookmark
                  aria-hidden="true"
                  className={`w-5 h-5 transition-all duration-200 ${
                    isBookmarked
                      ? "fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                aria-label="Share course"
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Share2
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-400 dark:text-gray-600"
                />
              </motion.button>
            </div>
          </div>

          {/* ── Date + features ───────────────────────────────── */}
          <div className="space-y-4 mb-6">
            <div
              className={`flex items-center gap-3 p-3 rounded-xl ${styles.enrollDateBg} border transition-all duration-300`}
            >
              <Calendar
                aria-hidden="true"
                className={`w-5 h-5 ${styles.textAccent}`}
              />
              <div>
                <p className={`text-sm ${styles.textAccent}`}>Created on</p>
                <p className={`font-medium ${styles.enrollDateText}`}>
                  {formatDate(course?.created_on)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <FeatureItem text="Certificate of Completion" styles={styles} />
              <FeatureItem text="Lifetime Access" styles={styles} />
              <FeatureItem text="Mobile & Tablet Friendly" styles={styles} />
            </div>
          </div>

          {/* ── CTA ───────────────────────────────────────────── */}
          <motion.button
            {...scaleOnHover}
            onClick={onEnroll}
            disabled={enrolling}
            aria-busy={enrolling}
            className={`w-full py-4 rounded-xl font-semibold text-white ${styles.ctaButton} shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group`}
          >
            <span className="relative z-10">
              {enrolling ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Enrolling…
                </span>
              ) : (
                "Enroll Now"
              )}
            </span>
            {!enrolling && (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrollmentCard;
