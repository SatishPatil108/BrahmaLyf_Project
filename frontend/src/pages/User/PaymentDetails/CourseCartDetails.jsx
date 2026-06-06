import React, {
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCourseDetailsById } from "@/store/feature/user";
import {
  ArrowLeft,
  Lock,
  Tag,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  Loader2,
  Shield,
  CreditCard,
  BookOpen,
  RefreshCw,
  Sparkles,
  Clock,
  Users,
  Gift,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const GST_RATE = 0.18;

const VALID_COUPONS = {
  WELCOME20: { type: "percent", value: 20, label: "20% off", minPurchase: 0 },
  FLAT500: { type: "flat", value: 500, label: "₹500 off", minPurchase: 2000 },
  SKILL100: { type: "flat", value: 100, label: "₹100 off", minPurchase: 500 },
};

const TRUST_BADGES = [
  { icon: Shield, label: "SSL Secure", description: "256-bit encryption" },
  { icon: CreditCard, label: "Instant Access", description: "Post payment" },
  {
    icon: RefreshCw,
    label: "30-Day Refund",
    description: "No questions asked",
  },
];

const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
  slideIn: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  scaleUp: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 },
  },
};

// ─── Utility Functions ────────────────────────────────────────────────────────
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const computePricing = ({ basePrice, discountAmount, includeGST }) => {
  const afterDiscount = Math.max(0, basePrice - discountAmount);
  const gstAmount = includeGST ? afterDiscount * GST_RATE : 0;
  const total = afterDiscount + gstAmount;
  return { afterDiscount, gstAmount, total };
};

// ─── Custom Hooks ────────────────────────────────────────────────────────────
const useThemeStyles = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return useMemo(
    () => ({
      isDark,
      pageBg: isDark
        ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-50",
      cardBg: isDark
        ? "bg-gray-900/80 backdrop-blur-sm"
        : "bg-white/80 backdrop-blur-sm",
      cardBorder: isDark ? "border-gray-800" : "border-gray-200",
      textPrimary: isDark ? "text-white" : "text-gray-900",
      textSecondary: isDark ? "text-gray-400" : "text-gray-600",
      textMuted: isDark ? "text-gray-500" : "text-gray-400",
      accent: "bg-gradient-to-r from-blue-600 to-purple-600",
      accentHover: "hover:from-blue-700 hover:to-purple-700",
      inputBg: isDark ? "bg-gray-800/50" : "bg-gray-50",
      inputBorder: isDark
        ? "border-gray-700 focus:border-blue-500"
        : "border-gray-200 focus:border-blue-500",
      badgeBg: isDark ? "bg-gray-800" : "bg-gray-100",
    }),
    [isDark],
  );
};

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const SkeletonLoader = () => {
  const styles = useThemeStyles();
  return (
    <div className="space-y-4">
      <div className={`h-32 rounded-2xl ${styles.cardBg} animate-pulse`} />
      <div className={`h-64 rounded-2xl ${styles.cardBg} animate-pulse`} />
    </div>
  );
};

// ─── Price Breakdown Item ────────────────────────────────────────────────────
const PriceBreakdownItem = ({
  label,
  value,
  highlight = false,
  subtext = null,
}) => {
  const styles = useThemeStyles();
  return (
    <div className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
      <div>
        <span className={`text-sm ${styles.textSecondary}`}>{label}</span>
        {subtext && (
          <p className={`text-xs ${styles.textMuted} mt-0.5`}>{subtext}</p>
        )}
      </div>
      <span
        className={`text-sm font-semibold ${highlight ? "text-emerald-500" : styles.textPrimary}`}
      >
        {value}
      </span>
    </div>
  );
};

// ─── Coupon Section ──────────────────────────────────────────────────────────
const CouponSection = ({ appliedCoupon, onApply, onRemove }) => {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);
  const [errorMsg, setError] = useState("");
  const styles = useThemeStyles();

  const handleApply = useCallback(async () => {
    const code = input.trim().toUpperCase();
    if (!code) return;

    setStatus("validating");
    setError("");
    await new Promise((r) => setTimeout(r, 600));

    const coupon = VALID_COUPONS[code];
    if (coupon) {
      setStatus("success");
      onApply({ code, ...coupon });
      setTimeout(() => setInput(""), 500);
    } else {
      setStatus("error");
      setError("Invalid or expired coupon code");
    }
  }, [input, onApply]);

  const handleRemove = useCallback(() => {
    setInput("");
    setStatus(null);
    setError("");
    onRemove();
  }, [onRemove]);

  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20">
            <Gift className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-500">
              {appliedCoupon.code}
            </p>
            <p className="text-xs text-emerald-400/80">
              {appliedCoupon.label} applied
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-xs font-medium text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
        >
          Remove
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${styles.textMuted}`}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (status === "error") setStatus(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Enter coupon code"
            className={`w-full pl-10 pr-3 py-3 text-sm rounded-xl border ${styles.inputBg} ${styles.inputBorder} ${styles.textPrimary} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          disabled={!input.trim() || status === "validating"}
          className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {status === "validating" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-xs text-red-500"
          >
            <XCircle className="w-3.5 h-3.5" />
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CourseCartDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const styles = useThemeStyles();

  const courseId = location.state?.courseId;
  const { courseDetails, loading } = useSelector((s) => s.user);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [includeGST, setIncludeGST] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    dispatch(fetchCourseDetailsById(courseId));
  }, [dispatch, courseId]);

  const originalPrice = courseDetails?.original_price ?? 4000;
  const basePrice = courseDetails?.price ?? 3000;

  const discountAmount = useMemo(() => {
    const catalogDiscount = Math.max(0, originalPrice - basePrice);
    if (!appliedCoupon) return catalogDiscount;

    const couponDiscount =
      appliedCoupon.type === "percent"
        ? Math.round(basePrice * (appliedCoupon.value / 100))
        : appliedCoupon.value;

    const maxDiscount = basePrice - catalogDiscount;
    const totalDiscount =
      catalogDiscount + Math.min(couponDiscount, maxDiscount);

    // Check minimum purchase requirement
    if (appliedCoupon.minPurchase && basePrice < appliedCoupon.minPurchase) {
      return catalogDiscount;
    }

    return totalDiscount;
  }, [appliedCoupon, basePrice, originalPrice]);

  const { gstAmount, total } = computePricing({
    basePrice: originalPrice,
    discountAmount,
    includeGST,
  });

  const savingsPct =
    originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

  const handleEnroll = useCallback(() => {
    // Handle enrollment logic
    console.log("Enrolling in course:", courseId);
  }, [courseId]);

  if (!courseId) {
    return (
      <motion.div
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="initial"
        animate="animate"
        className={`min-h-screen flex items-center justify-center ${styles.pageBg}`}
      >
        <div className="text-center space-y-4">
          <div
            className={`inline-flex p-6 rounded-full ${styles.cardBg} border ${styles.cardBorder}`}
          >
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className={`text-2xl font-bold ${styles.textPrimary}`}>
            No Course Selected
          </h2>
          <p className={styles.textSecondary}>
            Please select a course to continue
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/courses")}
            className={`px-6 py-3 rounded-xl font-semibold ${styles.accent} text-white shadow-lg`}
          >
            Browse Courses
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (loading) return <SkeletonLoader />;

  return (
    <div
      className={`min-h-screen ${styles.pageBg} transition-colors duration-300`}
    >
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 ${styles.cardBg} backdrop-blur-md border-b ${styles.cardBorder}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ x: -2 }}
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${styles.textSecondary} hover:bg-gray-100 dark:hover:bg-gray-800 transition-all`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </motion.button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <h1 className={`text-lg font-semibold ${styles.textPrimary}`}>
                Secure Checkout
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500`}
              >
                Step 1 of 2
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            animate="animate"
            className="lg:col-span-2 space-y-6"
          >
            {/* Course Card */}
            <div
              className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} overflow-hidden`}
            >
              <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Premium Course</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {courseDetails?.course_name}
                  </h2>
                  {courseDetails?.instructor && (
                    <p className="text-white/80 text-sm">
                      by {courseDetails.instructor}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${styles.textSecondary}`} />
                    <span className={`text-sm ${styles.textSecondary}`}>
                      20+ hours
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${styles.textSecondary}`} />
                    <span className={`text-sm ${styles.textSecondary}`}>
                      5,000+ students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${styles.textSecondary}`} />
                    <span className={`text-sm ${styles.textSecondary}`}>
                      Beginner to Advanced
                    </span>
                  </div>
                </div>
                <p className={`${styles.textSecondary} leading-relaxed`}>
                  Master the fundamentals and advanced concepts with hands-on
                  projects and real-world applications.
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div
              className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-6`}
            >
              <h3 className={`text-lg font-bold ${styles.textPrimary} mb-4`}>
                What You'll Learn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Daily mind-strengthening practices",
                  "Practical guidance for stress, anxiety & emotions",
                  "Structured 52-week personal growth roadmap",
                  "Short videos, audios & self-reflection exercises",
                  "Tools to build inner clarity and resilience",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className={`text-sm ${styles.textSecondary}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Checkout Card */}
          <motion.div
            variants={ANIMATION_VARIANTS.slideIn}
            initial="initial"
            animate="animate"
            className="lg:sticky lg:top-24"
          >
            <div
              className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} overflow-hidden shadow-xl`}
            >
              {/* Price Section */}
              <div className="p-6 bg-gradient-to-br from-blue-600/5 to-purple-600/5">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold mb-3">
                    <Zap className="w-3 h-3" />
                    Limited Time Offer
                  </div>
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-4xl font-bold  text-purple-500">
                      ₹{formatCurrency(total)}
                    </span>
                    {discountAmount > 0 && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ₹{formatCurrency(originalPrice)}
                        </span>
                        <span className="text-sm font-semibold text-emerald-500">
                          -{savingsPct}%
                        </span>
                      </>
                    )}
                  </div>
                  {includeGST && (
                    <p className={`text-xs ${styles.textMuted} mt-2`}>
                      Inclusive of 18% GST (₹{formatCurrency(gstAmount)})
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnroll}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all mb-4"
                >
                  <Lock className="w-4 h-4" />
                  Secure Enrollment · ₹{formatCurrency(total)}
                </motion.button>

                <div className="flex justify-center gap-4 text-xs">
                  <a
                    href="/terms"
                    className={`${styles.textMuted} hover:${styles.textSecondary} transition-colors`}
                  >
                    Terms
                  </a>
                  <span className={styles.textMuted}>•</span>
                  <a
                    href="/privacy"
                    className={`${styles.textMuted} hover:${styles.textSecondary} transition-colors`}
                  >
                    Privacy
                  </a>
                  <span className={styles.textMuted}>•</span>
                  <a
                    href="/refund"
                    className={`${styles.textMuted} hover:${styles.textSecondary} transition-colors`}
                  >
                    Refund Policy
                  </a>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <CouponSection
                  appliedCoupon={appliedCoupon}
                  onApply={setAppliedCoupon}
                  onRemove={() => setAppliedCoupon(null)}
                />
              </div>

              {/* GST Toggle */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${styles.textPrimary}`}
                    >
                      Include GST (18%)
                    </span>
                    <div className="relative group">
                      <Info
                        className={`w-3.5 h-3.5 ${styles.textMuted} cursor-help`}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Tax as per Indian regulations
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIncludeGST(!includeGST)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeGST ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeGST ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </motion.button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-800">
                <motion.button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-600 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span
                    className={`text-sm font-semibold ${styles.textPrimary}`}
                  >
                    Price Breakdown
                  </span>
                  <motion.div
                    animate={{ rotate: showBreakdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown
                      className={`w-4 h-4 ${styles.textSecondary}`}
                    />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showBreakdown && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden px-6 pb-6"
                    >
                      <PriceBreakdownItem
                        label="Original Price"
                        value={`₹${formatCurrency(originalPrice)}`}
                      />
                      {discountAmount > 0 && (
                        <PriceBreakdownItem
                          label={
                            appliedCoupon
                              ? `Coupon (${appliedCoupon.code})`
                              : "Discount"
                          }
                          value={`-₹${formatCurrency(discountAmount)}`}
                          highlight
                          subtext={appliedCoupon?.label}
                        />
                      )}
                      <PriceBreakdownItem
                        label="GST (18%)"
                        value={
                          includeGST
                            ? `₹${formatCurrency(gstAmount)}`
                            : "Not applicable"
                        }
                      />
                      <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800">
                        <PriceBreakdownItem
                          label="Total Payable"
                          value={`₹${formatCurrency(total)}`}
                          highlight
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CourseCartDetails;
