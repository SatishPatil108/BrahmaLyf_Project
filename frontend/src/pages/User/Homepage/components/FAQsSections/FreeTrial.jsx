import React, { useState, useCallback, useRef, useMemo } from "react";
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
  ChevronDown,
  Search,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useFAQPage } from "../../useHomepage";
import HtmlContent from "@/components/RichTextContent/HtmlContent";
import TrialSection from "./TrialSection";

const PAGE_SIZE = 12;

// ─── Theme tokens ─────────────────────────────────────────────────────────────

const T = {
  dark: {
    page: "bg-[#0e0d0c]",
    heading: "text-gray-50",
    body: "text-gray-300",
    muted: "text-gray-500",
    subtle: "text-gray-600",

    searchWrap:
      "bg-gray-800/60 border border-gray-700 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/10",
    searchIcon: "text-gray-500",
    searchInput: "bg-transparent text-gray-100 placeholder:text-gray-600",

    chip: "bg-gray-800 border border-gray-700 text-gray-400 hover:border-purple-500/40 hover:text-purple-400",
    chipActive: "bg-purple-500/15 border border-purple-500/40 text-purple-400",

    item: "border border-gray-800 hover:border-gray-700 bg-gray-900/40",
    itemOpen: "border border-gray-700 bg-gray-800/50",
    questionText: "text-gray-100",
    answerText: "text-gray-400",
    divider: "border-gray-700/60",

    iconWrap: "bg-gray-800 text-purple-400",
    chevron: "text-gray-500",
    chevronOpen: "text-purple-400",

    skeletonBase: "bg-gray-800",
    skeletonShimmer: "bg-gray-700",

    errorWrap: "bg-red-950/40 border border-red-900/50",
    errorText: "text-red-400",
    errorBtn:
      "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700",

    ctaCard:
      "bg-gradient-to-br from-purple-950/60 to-gray-900 border border-purple-500/20",
    ctaIcon: "bg-purple-500/15 text-purple-400",
    ctaHeading: "text-gray-100",
    ctaBody: "text-gray-400",
    ctaBtn:
      "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-[0_4px_20px_-4px_rgba(168,85,247,0.5)]",

    loadMoreBtn:
      "border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600",

    emptyIcon: "bg-gray-800 text-gray-600",
  },
  light: {
    page: "bg-[#f5f3f0]",
    heading: "text-gray-900",
    body: "text-gray-700",
    muted: "text-gray-500",
    subtle: "text-gray-400",

    searchWrap:
      "bg-white border border-gray-200 shadow-sm focus-within:border-purple-400/70 focus-within:ring-2 focus-within:ring-purple-400/10",
    searchIcon: "text-gray-400",
    searchInput: "bg-transparent text-gray-900 placeholder:text-gray-400",

    chip: "bg-white border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600",
    chipActive: "bg-purple-50 border border-purple-300 text-purple-700",

    item: "border border-gray-100 hover:border-gray-200 bg-white shadow-sm",
    itemOpen: "border border-gray-200 bg-white shadow-md",
    questionText: "text-gray-900",
    answerText: "text-gray-600",
    divider: "border-gray-100",

    iconWrap: "bg-purple-50 text-purple-600",
    chevron: "text-gray-400",
    chevronOpen: "text-purple-600",

    skeletonBase: "bg-gray-100",
    skeletonShimmer: "bg-gray-200",

    errorWrap: "bg-red-50 border border-red-200",
    errorText: "text-red-600",
    errorBtn: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",

    ctaCard:
      "bg-gradient-to-br from-purple-50 to-white border border-purple-100",
    ctaIcon: "bg-purple-100 text-purple-600",
    ctaHeading: "text-gray-900",
    ctaBody: "text-gray-500",
    ctaBtn:
      "bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-400 hover:to-pink-300 text-white shadow-[0_4px_20px_-4px_rgba(168,85,247,0.35)]",

    loadMoreBtn:
      "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-sm",

    emptyIcon: "bg-gray-100 text-gray-400",
  },
};

// ─── FAQ icon classifier ───────────────────────────────────────────────────────

const CATEGORIES = [
  {
    key: "courses",
    label: "Courses",
    icon: BookOpen,
    terms: ["course", "learning", "content", "material"],
  },
  { key: "coaches", label: "Coaches", icon: Users, terms: ["coach", "mentor"] },
  {
    key: "account",
    label: "Account",
    icon: Lock,
    terms: ["account", "login", "privacy", "security"],
  },
  {
    key: "billing",
    label: "Billing",
    icon: CreditCard,
    terms: ["payment", "price", "subscription", "plan", "refund", "cancel"],
  },
  { key: "general", label: "General", icon: HelpCircle, terms: [] },
];

function getCategory(question = "") {
  const q = question.toLowerCase();
  return (
    CATEGORIES.find((c) => c.terms.some((t) => q.includes(t))) ??
    CATEGORIES[CATEGORIES.length - 1]
  );
}

// ─── Dedup helper ──────────────────────────────────────────────────────────────

function mergeFAQs(existing, incoming) {
  if (!incoming?.length) return existing;
  const seen = new Set(existing.map((f) => f.id ?? f.question));
  const fresh = incoming.filter((f) => !seen.has(f.id ?? f.question));
  return fresh.length ? [...existing, ...fresh] : existing;
}

// ─── Skeleton loader ───────────────────────────────────────────────────────────

const Skeleton = ({ t }) => (
  <div className="space-y-3">
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`rounded-xl p-5 animate-pulse ${t.skeletonBase}`}>
        <div className="flex items-center gap-3">
          <div className={`size-9 rounded-lg shrink-0 ${t.skeletonShimmer}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-4 w-3/4 rounded-md ${t.skeletonShimmer}`} />
            <div className={`h-3 w-1/2 rounded-md ${t.skeletonShimmer}`} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Single FAQ accordion item ─────────────────────────────────────────────────

const FAQItem = ({ faq, index, t }) => {
  const [open, setOpen] = useState(false);
  const { icon: Icon } = getCategory(faq.question);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.5) }}
      className={`rounded-xl overflow-hidden transition-all duration-200 ${
        open ? t.itemOpen : t.item
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 sm:p-5 text-left group"
        aria-expanded={open}
      >
        <span
          className={`size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${t.iconWrap}`}
        >
          <Icon size={16} aria-hidden />
        </span>

        <span
          className={`flex-1 text-sm sm:text-base font-medium leading-snug ${t.questionText}`}
        >
          <HtmlContent content={faq.question} />
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 transition-all duration-300 ${
            open ? `rotate-180 ${t.chevronOpen}` : t.chevron
          }`}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={`px-5 pb-5 pt-0 pl-[3.75rem] text-sm leading-relaxed border-t ${t.divider} ${t.answerText}`}
            >
              <div className="pt-4">
                <HtmlContent content={faq.answer} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

const FreeTrial = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const t = T[theme] ?? T.light;

  const [page, setPage] = useState(1);
  const [allFAQs, setAllFAQs] = useState([]);

  const { loading, isError, FAQsDetails, refetch } = useFAQPage(
    page,
    PAGE_SIZE,
  );
  const mergedPagesRef = useRef(new Set());

  React.useEffect(() => {
    const incoming = FAQsDetails?.faqs;
    if (!incoming?.length) return;
    if (mergedPagesRef.current.has(page)) return;
    mergedPagesRef.current.add(page);
    setAllFAQs((prev) => mergeFAQs(prev, incoming));
  }, [FAQsDetails, page]);

  const hasNextPage = FAQsDetails?.has_next_page ?? false;

  const filtered = allFAQs;

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loading) return;
    setPage((p) => p + 1);
  }, [hasNextPage, loading]);

  const handleRetry = useCallback(() => refetch?.(page), [refetch, page]);

  // ── Loading (first page) ──
  if (loading && page === 1) {
    return (
      <div className={`min-h-screen ${t.page}`}>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton t={t} />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div
        className={`min-h-screen ${t.page} flex items-center justify-center p-6`}
      >
        <div
          className={`max-w-sm w-full rounded-2xl p-8 text-center ${t.errorWrap}`}
        >
          <AlertCircle className="size-10 mx-auto mb-4 text-red-500" />
          <p className={`text-sm font-medium mb-6 ${t.errorText}`}>
            {isError.message ?? "Failed to load FAQs"}
          </p>
          <button
            onClick={handleRetry}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${t.errorBtn}`}
          >
            <RotateCcw size={14} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Main ──
  return (
    <div className={`min-h-screen ${t.page}`}>
      <div className="pt-16 lg:pt-20">
        <TrialSection />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <p
            className={`text-xs font-semibold tracking-widest uppercase mb-3 ${t.muted}`}
          >
            Help Center
          </p>
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${t.heading}`}
          >
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">
              questions
            </span>
          </h1>
          <p className={`text-base max-w-lg mx-auto ${t.muted}`}>
            Everything you need to know about our courses, coaches, and
            platform.
          </p>
        </div>

        {/* ── FAQ list ── */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div
              className={`size-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${t.emptyIcon}`}
            >
              <HelpCircle size={20} aria-hidden />
            </div>
            <p className={`text-sm font-medium mb-1 ${t.heading}`}>
              No questions found
            </p>
            <p className={`text-sm ${t.muted}`}>
              Please check back later for updates
            </p>
          </div>
        ) : (
          <div className="space-y-2 mb-10">
            {filtered.map((faq, i) => (
              <FAQItem
                key={faq.id ?? `${faq.question}-${i}`}
                faq={faq}
                index={i}
                t={t}
              />
            ))}
          </div>
        )}

        {/* ── Load more ── */}
        {hasNextPage && (
          <div className="flex justify-center mb-10">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${t.loadMoreBtn}`}
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" aria-hidden />
                  Loading…
                </>
              ) : (
                "Load more questions"
              )}
            </button>
          </div>
        )}

        {/* ── Support CTA ── */}
        <div className={`rounded-2xl p-6 sm:p-8 text-center ${t.ctaCard}`}>
          <div
            className={`size-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${t.ctaIcon}`}
          >
            <MessageCircle size={22} aria-hidden />
          </div>
          <h2 className={`text-base font-semibold mb-1 ${t.ctaHeading}`}>
            Still have questions?
          </h2>
          <p className={`text-sm mb-5 ${t.ctaBody}`}>
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${t.ctaBtn}`}
          >
            <Sparkles size={14} aria-hidden />
            Contact support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeTrial;
