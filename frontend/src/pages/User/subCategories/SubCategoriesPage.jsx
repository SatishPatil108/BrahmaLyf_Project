import React, { useState, useCallback, useMemo, memo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
  Clock,
  Users,
  ChevronRight,
  Home,
} from "lucide-react";
import useSubCategoriesPage from "./useSubCategoriesPage";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useTheme } from "@/contexts/ThemeContext";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 14, stiffness: 90 },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const skeletonItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
};

// ─── Theme-aware difficulty config ────────────────────────────────────────────

const getDifficultyConfig = (theme) => ({
  1: {
    label: "Beginner",
    icon: BookOpen,
    // Card accent bar
    accentBar: "bg-gradient-to-b from-emerald-400 to-emerald-600",
    // Section title
    titleGradient: "from-emerald-500 to-teal-500",
    // Icon container
    iconBg: theme === "dark" ? "bg-emerald-950/70" : "bg-emerald-50",
    iconColor: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
    // Difficulty badge on image
    badgeText: theme === "dark" ? "text-emerald-300" : "text-emerald-700",
    badgeBg:
      theme === "dark"
        ? "bg-emerald-950/80 border-emerald-800/60"
        : "bg-emerald-50/95 border-emerald-200",
    // Card border
    cardBorderHover:
      theme === "dark"
        ? "hover:border-emerald-700/60"
        : "hover:border-emerald-300",
    // Card hover glow
    hoverGlow:
      theme === "dark"
        ? "hover:shadow-emerald-950/60"
        : "hover:shadow-emerald-100",
    // CTA text
    ctaColor: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
    // Count text
    countColor:
      theme === "dark" ? "text-emerald-500/70" : "text-emerald-500/80",
  },
  2: {
    label: "Intermediate",
    icon: TrendingUp,
    accentBar: "bg-gradient-to-b from-purple-400 to-purple-600",
    titleGradient: "from-purple-500 to-purple-500",
    iconBg: theme === "dark" ? "bg-purple-950/70" : "bg-purple-50",
    iconColor: theme === "dark" ? "text-purple-400" : "text-purple-600",
    badgeText: theme === "dark" ? "text-purple-300" : "text-purple-700",
    badgeBg:
      theme === "dark"
        ? "bg-purple-950/80 border-purple-800/60"
        : "bg-purple-50/95 border-purple-200",
    cardBorderHover:
      theme === "dark"
        ? "hover:border-purple-700/60"
        : "hover:border-purple-300",
    hoverGlow:
      theme === "dark"
        ? "hover:shadow-purple-950/60"
        : "hover:shadow-purple-100",
    ctaColor: theme === "dark" ? "text-purple-400" : "text-purple-600",
    countColor: theme === "dark" ? "text-purple-500/70" : "text-purple-500/80",
  },
  3: {
    label: "Advanced",
    icon: Award,
    accentBar: "bg-gradient-to-b from-rose-400 to-rose-600",
    titleGradient: "from-rose-500 to-pink-500",
    iconBg: theme === "dark" ? "bg-rose-950/70" : "bg-rose-50",
    iconColor: theme === "dark" ? "text-rose-400" : "text-rose-600",
    badgeText: theme === "dark" ? "text-rose-300" : "text-rose-700",
    badgeBg:
      theme === "dark"
        ? "bg-rose-950/80 border-rose-800/60"
        : "bg-rose-50/95 border-rose-200",
    cardBorderHover:
      theme === "dark" ? "hover:border-rose-700/60" : "hover:border-rose-300",
    hoverGlow:
      theme === "dark" ? "hover:shadow-rose-950/60" : "hover:shadow-rose-100",
    ctaColor: theme === "dark" ? "text-rose-400" : "text-rose-600",
    countColor: theme === "dark" ? "text-rose-500/70" : "text-rose-500/80",
  },
});

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

const SubcategorySkeleton = memo(({ theme }) => (
  <motion.div
    variants={skeletonItemVariants}
    className={`relative overflow-hidden rounded-2xl border animate-pulse
      ${
        theme === "dark"
          ? "bg-gray-800/50 border-gray-700"
          : "bg-slate-100 border-slate-200"
      }`}
  >
    <div
      className={`h-52 w-full ${theme === "dark" ? "bg-gray-700/60" : "bg-slate-200"}`}
    />
    <div className="p-5 space-y-3">
      <div
        className={`h-4 rounded-full w-1/3 ${theme === "dark" ? "bg-gray-700" : "bg-slate-200"}`}
      />
      <div
        className={`h-6 rounded-lg w-3/4 ${theme === "dark" ? "bg-gray-700" : "bg-slate-200"}`}
      />
      <div className="space-y-2">
        <div
          className={`h-3 rounded-full w-full ${theme === "dark" ? "bg-gray-700/70" : "bg-slate-200/80"}`}
        />
        <div
          className={`h-3 rounded-full w-2/3 ${theme === "dark" ? "bg-gray-700/70" : "bg-slate-200/80"}`}
        />
      </div>
      <div className="flex gap-4 pt-1">
        <div
          className={`h-4 rounded-full w-16 ${theme === "dark" ? "bg-gray-700" : "bg-slate-200"}`}
        />
        <div
          className={`h-4 rounded-full w-20 ${theme === "dark" ? "bg-gray-700" : "bg-slate-200"}`}
        />
      </div>
    </div>
  </motion.div>
));
SubcategorySkeleton.displayName = "SubcategorySkeleton";

// ─── Subdomain Card ────────────────────────────────────────────────────────────

const SubdomainCard = memo(({ sub, difficulty, theme, onClick, index }) => {
  const config = getDifficultyConfig(theme)[difficulty];
  const Icon = config.icon;
  const [imageLoaded, setImageLoaded] = useState(false);

  const descriptionMap = {
    1: "Start your BrahmaLyf journey by cultivating self-awareness, healthy habits, and a strong foundation for growth.",

    2: "Expand your understanding through deeper practices that enhance emotional resilience, mindfulness, and purpose.",

    3: "Unlock your highest potential with advanced teachings focused on transformation, mastery, and conscious leadership.",
  };

  return (
    <motion.article
      role="button"
      tabIndex={0}
      variants={itemVariants}
      custom={index}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onClick(sub)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick(sub)}
      className={`group relative flex flex-col cursor-pointer rounded-2xl overflow-hidden border
        transition-all duration-300 ease-out hover:shadow-2xl
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        ${config.cardBorderHover} ${config.hoverGlow}
        ${
          theme === "dark"
            ? "bg-gray-900 border-gray-800 shadow-lg shadow-black/30"
            : "bg-white border-slate-200 shadow-sm shadow-slate-200/80"
        }`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        {!imageLoaded && (
          <div
            className={`absolute inset-0 animate-pulse ${theme === "dark" ? "bg-gray-800" : "bg-slate-200"}`}
          />
        )}
        <img
          src={`${BASE_URL}${sub.subdomain_thumbnail}`}
          alt={sub.subdomain_name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transform group-hover:scale-105
            transition-transform duration-700 ease-out
            ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />
        {/* Overlay — slightly lighter for light mode */}
        <div
          className={`absolute inset-0 bg-gradient-to-t
          ${
            theme === "dark"
              ? "from-black/80 via-black/30 to-transparent"
              : "from-black/60 via-black/20 to-transparent"
          }`}
        />

        {/* Difficulty badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${config.badgeBg} ${config.badgeText}`}
          >
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Icon + heading */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className={`shrink-0 p-2 rounded-xl ${config.iconBg}`}>
            <Icon className={`w-4 h-4 ${config.iconColor}`} />
          </div>
          <h3
            className={`font-semibold text-base leading-snug pt-1
            ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
          >
            {sub.subdomain_name}
          </h3>
        </div>

        {/* Description */}
        <p
          className={`text-sm leading-relaxed line-clamp-2 mb-4
          ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
        >
          {descriptionMap[difficulty]}
        </p>

        {/* CTA */}
        <div
          className={`mt-auto flex items-center gap-1.5 text-sm font-medium ${config.ctaColor}
          group-hover:gap-2.5 transition-all duration-200`}
        >
          Explore path
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.article>
  );
});
SubdomainCard.displayName = "SubdomainCard";

// ─── Difficulty Section ────────────────────────────────────────────────────────

const DifficultySection = memo(
  ({ items, difficulty, theme, title, subtitle, onCardClick }) => {
    if (!items.length) return null;
    const config = getDifficultyConfig(theme)[difficulty];
    const Icon = config.icon;

    return (
      <motion.section variants={containerVariants} className="relative">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${config.iconBg}`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div>
              <h2
                className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${config.titleGradient} bg-clip-text text-transparent`}
              >
                {title}
              </h2>
              <p
                className={`text-xs mt-0.5 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`}
              >
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((sub, idx) => (
            <SubdomainCard
              key={sub.subdomain_id}
              sub={sub}
              difficulty={difficulty}
              theme={theme}
              onClick={onCardClick}
              index={idx}
            />
          ))}
        </div>
      </motion.section>
    );
  },
);
DifficultySection.displayName = "DifficultySection";

// ─── Main Component ────────────────────────────────────────────────────────────

const SubCategoriesPage = () => {
  const { domain_name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { pageNo, pageSize, setPageNo } = usePagination(1, 9);

  const { subdomainsDetails, loading, error } = useSubCategoriesPage(
    location.state?.domain_id,
    pageNo,
    pageSize,
  );

  const domainName = domain_name || "Learning Paths";
  const subdomains = subdomainsDetails?.subdomains || [];

  const grouped = useMemo(
    () => ({
      beginner: subdomains.filter((s) => s.progressive_difficulty === 1),
      intermediate: subdomains.filter((s) => s.progressive_difficulty === 2),
      advanced: subdomains.filter((s) => s.progressive_difficulty === 3),
    }),
    [subdomains],
  );

  const handleSubcategoryClick = useCallback(
    (sub) => {
      dispatch(clearUserError());
      navigate(`/categories/courses/${sub.subdomain_name}`, {
        state: { subdomainId: sub.subdomain_id },
      });
    },
    [dispatch, navigate],
  );

  const handleBack = useCallback(() => {
    dispatch(clearUserError());
    navigate(-1);
  }, [dispatch, navigate]);

  // ── Theme tokens ──
  const bg =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100"
      : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900";

  const headerBg =
    theme === "dark"
      ? "bg-gray-950/80 border-gray-800"
      : "bg-white/80 border-slate-200";

  const breadcrumbBase =
    theme === "dark"
      ? "text-gray-400 hover:text-gray-100"
      : "text-slate-400 hover:text-slate-800";

  const breadcrumbActive =
    theme === "dark" ? "text-gray-200" : "text-slate-700";
  const chevronColor = theme === "dark" ? "text-gray-600" : "text-slate-300";

  const eyebrowColor = theme === "dark" ? "text-indigo-400" : "text-indigo-500";

  const heroPillBg =
    theme === "dark"
      ? "bg-gray-800/80 border-gray-700 text-gray-300"
      : "bg-white border-slate-200 text-slate-500 shadow-sm";

  const heroTitle =
    theme === "dark"
      ? "from-gray-50 via-gray-100 to-gray-300"
      : "from-slate-800 via-slate-700 to-slate-500";

  const heroSubtitle = theme === "dark" ? "text-gray-400" : "text-slate-500";

  const dividerColor =
    theme === "dark" ? "border-gray-800" : "border-slate-200";

  const stateCardBg =
    theme === "dark"
      ? "bg-gray-900/80 border-gray-800"
      : "bg-white border-slate-200 shadow-sm";

  const stateIconBg = theme === "dark" ? "bg-gray-800" : "bg-slate-100";
  const stateIconColor = theme === "dark" ? "text-rose-400" : "text-rose-500";
  const stateTitleColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const stateBodyColor = theme === "dark" ? "text-gray-400" : "text-slate-500";

  const emptyIconBg = theme === "dark" ? "bg-gray-800" : "bg-slate-100";
  const emptyIconColor = theme === "dark" ? "text-gray-500" : "text-slate-400";
  const emptyTitleColor = theme === "dark" ? "text-gray-200" : "text-slate-700";
  const emptyBodyColor = theme === "dark" ? "text-gray-500" : "text-slate-400";

  // ── Guard: no domain id ──
  if (!location.state?.domain_id) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative z-10 max-w-sm w-full mx-4 rounded-2xl p-8 text-center border ${stateCardBg}`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${stateIconBg}`}
          >
            <Zap className={`w-5 h-5 ${stateIconColor}`} />
          </div>
          <h2 className={`text-lg font-semibold mb-2 ${stateTitleColor}`}>
            No Domain Selected
          </h2>
          <p className={`text-sm mb-6 ${stateBodyColor}`}>
            Please navigate from the categories page.
          </p>
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium
              transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className={`min-h-screen ${bg}`}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={skeletonVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Header skeleton */}
            <div className="space-y-3">
              <div
                className={`h-4 w-28 rounded-full animate-pulse ${theme === "dark" ? "bg-gray-800" : "bg-slate-200"}`}
              />
              <div
                className={`h-10 w-80 rounded-xl animate-pulse ${theme === "dark" ? "bg-gray-800" : "bg-slate-200"}`}
              />
              <div
                className={`h-3.5 w-60 rounded-full animate-pulse ${theme === "dark" ? "bg-gray-800" : "bg-slate-200"}`}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SubcategorySkeleton key={i} theme={theme} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error && error !== "No record found") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative z-10 max-w-sm w-full mx-4 rounded-2xl p-8 text-center border ${stateCardBg}`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${stateIconBg}`}
          >
            <Zap className={`w-5 h-5 ${stateIconColor}`} />
          </div>
          <h2 className={`text-lg font-semibold mb-2 ${stateTitleColor}`}>
            Something went wrong
          </h2>
          <p className={`text-sm mb-6 ${stateBodyColor}`}>
            {typeof error === "string"
              ? error
              : "Failed to load learning paths."}
          </p>
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main render ──
  return (
    <div
      className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-300 ${bg}`}
    >
      {/* Sticky header */}
      <header className={`sticky top-0 z-30  transition-colors duration-300 `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-2 text-sm">
          <motion.button
            whileHover={{ x: -2 }}
            onClick={handleBack}
            aria-label="Back to categories"
            className={`flex items-center gap-1.5 transition-colors duration-200 ${breadcrumbBase}`}
          >
            <Home className="w-3.5 h-3.5" />
          </motion.button>
          <ChevronRight className={`w-3 h-3 ${chevronColor}`} />

          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className={`transition-colors duration-200 ${
              theme === "dark"
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Go back to categories"
          >
            <span>Categories</span>
          </motion.button>

          <ChevronRight
            className={`w-3 h-3 ${
              theme === "dark" ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <span className={`font-medium truncate ${breadcrumbActive}`}>
            {domainName}
          </span>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-14"
        >
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-4 ${heroPillBg}`}
          >
            <Sparkles className={`w-3 h-3 ${eyebrowColor}`} />
            <span>Learning Paths</span>
          </div>
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r bg-clip-text text-transparent ${heroTitle}`}
          >
            {domainName}
          </h1>
          <p className={`text-base max-w-xl ${heroSubtitle}`}>
            Choose your level and explore expertly-crafted subdomains to build
            real-world skills.
          </p>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-14 md:space-y-18"
          >
            <DifficultySection
              items={grouped.beginner}
              difficulty={1}
              theme={theme}
              title="Foundation Path"
              subtitle="Start your journey with confidence"
              onCardClick={handleSubcategoryClick}
            />
            <DifficultySection
              items={grouped.intermediate}
              difficulty={2}
              theme={theme}
              title="Growth Path"
              subtitle="Build real-world expertise"
              onCardClick={handleSubcategoryClick}
            />
            <DifficultySection
              items={grouped.advanced}
              difficulty={3}
              theme={theme}
              title="Mastery Path"
              subtitle="Become an industry expert"
              onCardClick={handleSubcategoryClick}
            />
          </motion.div>
        </AnimatePresence>

        {/* Global empty state */}
        {!grouped.beginner.length &&
          !grouped.intermediate.length &&
          !grouped.advanced.length && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${emptyIconBg}`}
              >
                <BookOpen className={`w-7 h-7 ${emptyIconColor}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${emptyTitleColor}`}>
                No paths available yet
              </h3>
              <p className={`text-sm max-w-xs mb-6 ${emptyBodyColor}`}>
                Content for this domain is being crafted. Check back soon!
              </p>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500
                text-white text-sm font-medium transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse other categories
              </button>
            </motion.div>
          )}

        {/* Pagination */}
        {subdomainsDetails && subdomainsDetails.total_pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`mt-14 pt-8 border-t ${dividerColor}`}
          >
            <Pagination
              currentPage={pageNo}
              totalPages={subdomainsDetails.total_pages}
              onPageChange={setPageNo}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubCategoriesPage;
