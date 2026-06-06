// app/components/TrialSection.tsx
import {
  Sparkles,
  Clock,
  Brain,
  Heart,
  Wind,
  Moon,
  ArrowRight,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

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

const TrialSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = T[theme] ?? T.light;
  const benefits = [
    "5-10 minute daily practices",
    "Bite-sized video & audio guidance",
    "Practical tools for stress & anxiety",
    "No overwhelming promises — only real habits",
  ];

  const features = [
    { icon: Brain, text: "Reduce overthinking" },
    { icon: Heart, text: "Manage mood & emotions" },
    { icon: Wind, text: "Handle daily pressure" },
    { icon: Moon, text: "Improve sleep quality" },
  ];

  return (
    <section
      className={`relative isolate overflow-hidden px-6 py-24 transition-all duration-500 sm:py-20 lg:px-8 ${styles.page}`}
    >
      {/* Premium animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute left-[calc(50%-15rem)] top-[calc(50%-15rem)] h-[30rem] w-[30rem] rounded-full blur-3xl ${
            isDark ? "bg-purple-900/20" : "bg-purple-100/40"
          }`}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className={`absolute bottom-0 right-0 h-[20rem] w-[20rem] rounded-full blur-3xl ${
            isDark ? "bg-pink-900/20" : "bg-pink-100/30"
          }`}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-2 lg:order-1"
          >
            {/* Pill badge */}
            <div
              className={`mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm ${
                isDark
                  ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  : "bg-purple-50/90 text-purple-700 border border-purple-200/50"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>7-day free trial</span>
            </div>

            {/* Main heading */}
            <h1
              className={`text-4xl  font-bold tracking-tight sm:text-5xl lg:text-6xl ${styles.heading}`}
            >
              Start your 7-day{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Mind–Soul Journey
              </span>
            </h1>

            {/* Subheading */}
            <p className={`mt-6 text-lg leading-relaxed ${styles.body}`}>
              Experience the BrahmaLYF 52-week guided program — a gentle,
              practical approach to stress, anxiety, sleep, and emotional
              balance.
            </p>

            {/* Feature grid */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-2 text-sm ${styles.body}`}
                >
                  <feature.icon
                    className={`h-4 w-4 ${isDark ? "text-purple-400" : "text-purple-500"}`}
                  />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div
              className={`my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent ${isDark ? "via-gray-700" : "via-gray-200"}`}
            />

            {/* WhatsApp CTA - Primary */}
            <div className="space-y-4">
              <motion.a
                href="https://wa.me/9272341166?text=Hi%20BrahmaLYF,%20I%20want%20more%20information%20about%20your%20program."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:from-purple-500 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
              >
                <span>Start Free Trial on WhatsApp</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>

              {/* Secondary marathi CTA */}
              <motion.a
                href="https://wa.me/9272341166?text=नमस्कार,%20मला%20BrahmaLYF%20प्रोग्रामबद्दल%20अधिक%20माहिती%20हवी%20आहे."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 sm:w-auto ${
                  isDark
                    ? "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-base">
                  WhatsApp वर Free Trial सुरू करा
                </span>
              </motion.a>
            </div>

            {/* Trust badges */}
            <div
              className={`mt-8 flex flex-wrap items-center gap-4 text-xs ${styles.muted}`}
            >
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Daily WhatsApp guidance</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="order-1 lg:order-2"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-3xl p-6 shadow-2xl transition-all duration-300 sm:p-8 ${
                isDark
                  ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700"
                  : "bg-white/70 backdrop-blur-sm shadow-slate-200/50"
              }`}
            >
              {/* Animated gradient border effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md"
                  >
                    <Sparkles className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <p
                      className={`text-sm font-medium ${isDark ? "text-purple-400" : "text-purple-600"}`}
                    >
                      7-day trial
                    </p>
                    <h3 className={`text-xl font-bold ${styles.heading}`}>
                      BrahmaLYF Journey
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${styles.heading}`}>
                      ₹0
                    </span>
                    <span className={styles.muted}>for 7 days</span>
                  </div>
                  <p className={`text-sm ${styles.muted}`}>Then ₹3000/year</p>
                </div>

                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 + 0.2 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${isDark ? "text-purple-400" : "text-purple-500"}`}
                      />
                      <span className={`text-sm ${styles.body}`}>
                        {benefit}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* Mini timeline preview */}
                <div
                  className={`rounded-xl p-4 ${isDark ? "bg-gray-900/50" : "bg-slate-50"}`}
                >
                  <div
                    className={`flex items-center justify-between text-xs ${styles.muted}`}
                  >
                    {[
                      "Day 1",
                      "Day 2",
                      "Day 3",
                      "Day 4",
                      "Day 5",
                      "Day 6",
                      "Day 7",
                    ].map((day, i) => (
                      <span key={i}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: i * 0.03, duration: 0.4 }}
                        className="h-1.5 flex-1 origin-left rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                      />
                    ))}
                  </div>
                  <p className={`mt-3 text-center text-xs ${styles.muted}`}>
                    Daily 5–10 min practices on WhatsApp
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrialSection;
