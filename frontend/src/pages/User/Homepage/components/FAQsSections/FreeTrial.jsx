import React, { useState, useCallback, useRef } from "react";
import {
  HelpCircle,
  Sparkles,
  AlertCircle,
  BookOpen,
  Users,
  Lock,
  CreditCard,
  RefreshCw,
  Ban,
  FileText,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useFAQPage } from "../../useHomepage";
import HtmlContent from "@/components/RichTextContent/HtmlContent";

const PAGE_SIZE = 12;

const THEME_STYLES = {
  dark: {
    pageBg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
    headerBg: "bg-gray-900 border-gray-700",
    headerOverlay: "from-purple-900/20 to-transparent opacity-50",
    headingText: "text-gray-100",
    bodyText: "text-gray-300",
    mutedText: "text-gray-500",
    cardBg: "bg-gray-800/50 border-gray-700",
    cardIconBg: "bg-purple-900/30",
    cardIconColor: "text-purple-400",
    cardDivider: "border-gray-700",
    faqItemBg: "bg-gray-800/40 border-gray-700",
    faqItemHover: "hover:border-purple-500",
    faqQuestion: "text-gray-100",
    faqAnswer: "text-gray-300",
    loaderBg: "bg-gray-800",
    loaderPulse: "bg-gray-700",
    errorBg: "bg-red-900/20 border-red-800",
    errorText: "text-red-300",
    errorBtn: "bg-gray-700 text-gray-300 hover:bg-gray-600",
    emptyBg: "bg-gray-800/50 border-gray-700",
    emptyIconBg: "bg-gray-700",
    missionIconBg: "bg-purple-900/30",
    missionIconColor: "text-purple-400",
    missionHeading: "text-gray-100",
    missionAccent: "text-purple-500",
    missionBody: "text-gray-400",
    missionBrand: "text-purple-500",
    contactBtn: "bg-gray-800 text-purple-300 hover:bg-gray-700",
  },
  light: {
    pageBg: "bg-gradient-to-br from-slate-50 via-white to-slate-50",
    headerBg: "bg-white border-slate-200 shadow-sm",
    headerOverlay: "from-purple-50 to-transparent opacity-50",
    headingText: "text-slate-900",
    bodyText: "text-slate-600",
    mutedText: "text-slate-500",
    cardBg: "bg-white border-slate-200",
    cardIconBg: "bg-purple-100",
    cardIconColor: "text-purple-600",
    cardDivider: "border-slate-100",
    faqItemBg: "bg-white border-slate-200",
    faqItemHover: "hover:border-purple-300",
    faqQuestion: "text-slate-900",
    faqAnswer: "text-slate-600",
    loaderBg: "bg-gray-100",
    loaderPulse: "bg-gray-300",
    errorBg: "bg-red-50 border-red-200",
    errorText: "text-red-600",
    errorBtn: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    emptyBg: "bg-gray-50 border-gray-200",
    emptyIconBg: "bg-gray-100",
    missionIconBg: "bg-purple-100",
    missionIconColor: "text-purple-600",
    missionHeading: "text-slate-900",
    missionAccent: "text-purple-600",
    missionBody: "text-slate-600",
    missionBrand: "text-purple-700",
    contactBtn: "bg-gray-100 text-purple-600 hover:bg-gray-200",
  },
};

// ─── Animation variants (static — no reason to recreate per render) ───────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.2 },
  },
};

// ─── Pure helpers (no component state dependency) ─────────────────────────────

function getFAQIcon(question) {
  const q = question.toLowerCase();
  if (q.includes("course") || q.includes("learning"))
    return <BookOpen size={18} />;
  if (q.includes("coach") || q.includes("mentor")) return <Users size={18} />;
  if (q.includes("account") || q.includes("login")) return <Lock size={18} />;
  if (q.includes("payment") || q.includes("price"))
    return <CreditCard size={18} />;
  if (q.includes("refund") || q.includes("cancel")) return <Ban size={18} />;
  if (q.includes("subscription") || q.includes("plan"))
    return <RefreshCw size={18} />;
  if (q.includes("content") || q.includes("material"))
    return <FileText size={18} />;
  if (q.includes("privacy") || q.includes("security"))
    return <Shield size={18} />;
  return <HelpCircle size={18} />;
}

function mergeFAQs(existing, incoming) {
  if (!incoming.length) return existing;
  const seen = new Set(existing.map((f) => f.id ?? f.question));
  const unique = incoming.filter((f) => !seen.has(f.id ?? f.question));
  return unique.length ? [...existing, ...unique] : existing;
}

/** Clamps an animation delay so late list items don't wait forever. */
function faqDelay(index) {
  return Math.min(index * 0.05, 1);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// const MissionSection = ({ styles }) => (
//   <motion.section
//     className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mb-8"
//     initial="hidden"
//     animate="visible"
//     variants={containerVariants}
//   >
//     <div className="max-w-6xl mx-auto text-center">
//       <motion.div className="flex justify-center mb-6" variants={itemVariants}>
//         <motion.div
//           className={`p-3 rounded-xl ${styles.missionIconBg}`}
//           variants={iconVariants}
//           whileHover={{ rotate: 360, scale: 1.1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <Sparkles className={`w-8 h-8 ${styles.missionIconColor}`} />
//         </motion.div>
//       </motion.div>

//       <motion.h2
//         className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${styles.missionHeading}`}
//         variants={itemVariants}
//       >
//         <span className={styles.missionAccent}>Our Mission</span>
//       </motion.h2>

//       <motion.p
//         className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${styles.missionBody}`}
//         variants={itemVariants}
//       >
//         At{" "}
//         <span className={`font-semibold ${styles.missionBrand}`}>
//           BrahmaLYF
//         </span>
//         , we believe everyone has the power to grow, heal, and transform. Our
//         platform connects you with world-class coaches and programs that empower
//         you to reach your highest potential.
//       </motion.p>
//     </div>
//   </motion.section>
// );

/** Shared page shell so loading/error/empty states don't repeat layout markup. */
const PageShell = ({ styles, children }) => (
  <div className={`min-h-screen ${styles.pageBg}`}>
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const FreeTrial = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Single source of truth for the current page being fetched.
  const [page, setPage] = useState(1);

  const [allFAQs, setAllFAQs] = useState([]);

  const { loading, isError, FAQsDetails, refetch } = useFAQPage(
    page,
    PAGE_SIZE,
  );

  const styles = THEME_STYLES[theme] ?? THEME_STYLES.light;

  const mergedPagesRef = useRef(new Set());

  React.useEffect(() => {
    const incoming = FAQsDetails?.faqs;
    if (!incoming?.length) return;
    if (mergedPagesRef.current.has(page)) return;
    mergedPagesRef.current.add(page);
    setAllFAQs((prev) => mergeFAQs(prev, incoming));
  }, [FAQsDetails, page]);

  const hasNextPage = FAQsDetails?.has_next_page ?? false;

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loading) return;
    setPage((prev) => prev + 1);
  }, [hasNextPage, loading]);

  const handleRetry = useCallback(() => {
    refetch?.(page);
  }, [refetch, page]);

  const handleContactNav = useCallback(() => {
    navigate("/contact");
  }, [navigate]);

  // ── Render: loading skeleton (first page only) ──
  if (loading && page === 1) {
    return (
      <PageShell styles={styles}>
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden ${styles.loaderBg}`}
            >
              <div className="animate-pulse p-4 sm:p-5">
                <div
                  className={`h-6 w-3/4 rounded ${styles.loaderPulse} mb-2`}
                />
                <div className={`h-4 w-full rounded ${styles.loaderPulse}`} />
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    );
  }

  // ── Render: error ──
  if (isError) {
    return (
      <PageShell styles={styles}>
        <div className={`p-6 rounded-xl text-center border ${styles.errorBg}`}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className={`font-medium ${styles.errorText} mb-4`}>
            {isError.message ?? "Failed to load FAQs"}
          </p>
          <button
            onClick={handleRetry}
            className={`px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 ${styles.errorBtn}`}
          >
            Try Again
          </button>
        </div>
      </PageShell>
    );
  }

  // ── Render: main ──
  return (
    <div className={`min-h-screen ${styles.pageBg}`}>
      {/* Page header */}
      <header
        className={`relative overflow-hidden border-b ${styles.headerBg}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${styles.headerOverlay}`}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <div className={`p-2 ${styles.cardIconBg} rounded-xl shrink-0`}>
                <HelpCircle
                  size={24}
                  className={`sm:w-7 sm:h-7 ${styles.cardIconColor}`}
                />
              </div>
              <h1
                className={`text-3xl font-bold tracking-tight leading-tight ${styles.headingText} sm:text-4xl lg:text-5xl xl:text-6xl`}
              >
                Frequently Asked Questions
              </h1>
            </div>
            <p
              className={`mt-4 text-sm sm:text-base lg:text-lg ${styles.mutedText} max-w-2xl mx-auto px-2`}
            >
              Find answers to common questions about our courses, coaches, and
              platform
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* FAQ list */}
        <div className="space-y-4 mb-12">
          {allFAQs.map((faq, index) => (
            <motion.div
              key={faq.id ?? `${faq.question}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: faqDelay(index) }}
              className={`rounded-xl overflow-hidden border transition-all duration-300 ${styles.faqItemBg} ${styles.faqItemHover}`}
            >
              {/* Question */}
              <div className={`p-2 sm:p-6 ${styles.cardBg}`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${styles.cardIconBg}`}
                  >
                    <span className={styles.cardIconColor}>
                      {getFAQIcon(faq.question)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-base sm:text-lg font-semibold ${styles.faqQuestion}`}
                    >
                      <HtmlContent content={faq.question} />
                    </h3>
                  </div>
                </div>
              </div>

              {/* Answer */}
              <div
                className={`px-5 pb-2 sm:px-6 sm:pb-6 pt-0 ${styles.faqAnswer}`}
              >
                <div className={`pl-14 ${styles.cardDivider}`}>
                  <HtmlContent content={faq.answer} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load more */}
        {hasNextPage && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${styles.contactBtn}`}
            >
              {loading ? "Loading…" : "Load More"}
            </button>
          </div>
        )}

        {/* Support CTA */}
        <div className={`mt-12 pt-8 border-t ${styles.cardDivider}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${styles.cardIconColor}`} />
              <p className={`text-sm ${styles.mutedText}`}>
                Still can't find your answer?
              </p>
            </div>
            <button
              onClick={handleContactNav}
              className={`px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 ${styles.contactBtn}`}
            >
              Contact our support team
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeTrial;
