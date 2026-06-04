import React from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { fadeInUp } from "@/components/Animations/animations";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// ─── SectionHeader ────────────────────────────────────────────────────────────
export const SectionHeader = ({
  icon,
  title,
  subtitle,
  iconBgClass,
  iconColorClass,
  styles,
}) => (
  <motion.div variants={fadeInUp} className="flex items-start gap-4 mb-6">
    <div
      className={`p-3 rounded-xl ${iconBgClass} shrink-0 transition-all duration-300 group-hover:scale-110`}
    >
      <div className={iconColorClass}>{icon}</div>
    </div>
    <div>
      <h2
        className={`text-2xl font-bold tracking-tight ${styles.sectionHeaderTitle}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-1 ${styles.sectionHeaderSubtitle}`}>{subtitle}</p>
      )}
    </div>
  </motion.div>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, styles }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`group relative overflow-hidden rounded-2xl ${styles.statCardBg} border ${styles.statCardBorder} p-5 transition-all duration-300 hover:shadow-xl ${styles.cardHover}`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`p-2.5 rounded-xl ${styles.statIconBg} transition-all duration-300 group-hover:scale-110`}
      >
        <div className={styles.statIconColor}>{icon}</div>
      </div>
      <div>
        <p className={`text-sm font-medium ${styles.statLabel}`}>{label}</p>
        <p className={`text-lg font-semibold mt-0.5 ${styles.statValue}`}>
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── FeatureItem ──────────────────────────────────────────────────────────────
export const FeatureItem = ({ text, icon, styles }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-3 group"
  >
    {icon ?? (
      <CheckCircle
        className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${styles.featureIcon}`}
      />
    )}
    <span className={styles.featureText}>{text}</span>
  </motion.div>
);

// ─── ReviewCard ───────────────────────────────────────────────────────────────
export const ReviewCard = ({ feedback, formatDate, styles }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-6 transition-all duration-300 hover:shadow-xl`}
  >
    <div
      className="flex items-center gap-1 mb-4"
      aria-label={`${feedback.rating} out of 5 stars`}
    >
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`w-4 h-4 transition-all duration-200 ${
            i < feedback.rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"
          }`}
        />
      ))}
      <span className={`ml-2 text-sm font-medium ${styles.textSecondary}`}>
        {feedback.rating}.0
      </span>
    </div>

    <blockquote
      className={`italic mb-4 leading-relaxed ${styles.textSecondary}`}
    >
      {feedback.comments}
    </blockquote>

    <div className={`flex items-center gap-3 pt-3 border-t ${styles.divider}`}>
      <img
        src={`${BASE_URL}${feedback.profile_picture_url}`}
        alt={`Profile photo of ${feedback.user_name}`}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        loading="lazy"
      />
      <div>
        <p className={`font-semibold ${styles.textPrimary}`}>
          {feedback.user_name}
        </p>
        <p className={`text-sm ${styles.textMuted}`}>
          {formatDate(feedback.created_on)}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── ProseSection ─────────────────────────────────────────────────────────────

export const ProseSection = ({ html, styles }) => (
  <div
    className={`prose ${styles.proseClass} max-w-none leading-relaxed`}
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

// ─── CourseDetailsSkeleton ────────────────────────────────────────────────────
export const CourseDetailsSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded w-3/4" />
            <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded" />
            <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl"
                />
              ))}
            </div>
          </div>
          <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);
