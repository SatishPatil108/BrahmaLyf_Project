export const getThemeStyles = (theme) => {
  const isDark = theme === "dark";

  return {
    // ── Page ──────────────────────────────────────────────────────────
    pageBg: isDark
      ? "bg-gray-950"
      : "bg-gradient-to-br from-slate-50 via-white to-slate-100",

    // ── Hero ──────────────────────────────────────────────────────────
    heroBg: isDark
      ? "bg-gradient-to-b from-gray-900 to-gray-950"
      : "bg-gradient-to-b from-white to-slate-50",
    heroGrid: isDark ? "bg-grid-pattern-dark" : "bg-grid-pattern-light",

    // ── Text ──────────────────────────────────────────────────────────
    textPrimary:   isDark ? "text-white"      : "text-gray-900",
    textSecondary: isDark ? "text-gray-300"   : "text-gray-600",
    textMuted:     isDark ? "text-gray-400"   : "text-gray-500",
    textAccent:    isDark ? "text-indigo-400" : "text-indigo-600",

    // ── Headings ──────────────────────────────────────────────────────
    headingPrimary:   isDark ? "text-white"     : "text-gray-900",
    headingSecondary: isDark ? "text-gray-200"  : "text-gray-800",

    // ── Breadcrumb ────────────────────────────────────────────────────
    breadcrumbBase:    isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700",
    breadcrumbActive:  isDark ? "text-white"    : "text-gray-900",
    breadcrumbChevron: isDark ? "text-gray-600" : "text-gray-300",

    // ── Cards ─────────────────────────────────────────────────────────
    cardBg:     isDark ? "bg-gray-900"  : "bg-white",
    cardBorder: isDark ? "border-gray-800" : "border-slate-200",
    cardHover:  isDark ? "hover:border-gray-700" : "hover:border-slate-300",
    cardShadow: isDark ? "shadow-xl"    : "shadow-lg",

    // ── Stat cards ────────────────────────────────────────────────────
    statCardBg:     isDark ? "bg-gray-900"  : "bg-white",
    statCardBorder: isDark ? "border-gray-800" : "border-slate-200",
    statIconBg:     isDark ? "bg-gray-800"  : "bg-indigo-50",
    statIconColor:  isDark ? "text-indigo-400" : "text-indigo-600",
    statLabel:      isDark ? "text-gray-400"   : "text-gray-600",
    statValue:      isDark ? "text-white"      : "text-gray-900",

    // ── Section headers ───────────────────────────────────────────────
    sectionHeaderBg: {
      overview:   isDark ? "bg-gray-800"        : "bg-slate-100",
      audience:   isDark ? "bg-blue-900/30"     : "bg-blue-50",
      outcomes:   isDark ? "bg-green-900/30"    : "bg-green-50",
      curriculum: isDark ? "bg-purple-900/30"   : "bg-purple-50",
      practice:   isDark ? "bg-orange-900/30"   : "bg-orange-50",
      tools:      isDark ? "bg-pink-900/30"     : "bg-pink-50",
      reviews:    isDark ? "bg-yellow-900/30"   : "bg-yellow-50",
    },
    sectionHeaderIcon: {
      overview:   isDark ? "text-gray-300"   : "text-slate-700",
      audience:   isDark ? "text-blue-400"   : "text-blue-600",
      outcomes:   isDark ? "text-green-400"  : "text-green-600",
      curriculum: isDark ? "text-purple-400" : "text-purple-600",
      practice:   isDark ? "text-orange-400" : "text-orange-600",
      tools:      isDark ? "text-pink-400"   : "text-pink-600",
      reviews:    isDark ? "text-yellow-400" : "text-yellow-600",
    },
    sectionHeaderTitle:    isDark ? "text-white"     : "text-gray-900",
    sectionHeaderSubtitle: isDark ? "text-gray-400"  : "text-gray-600",

    // ── Tabs ──────────────────────────────────────────────────────────
    tabsBg:            isDark ? "bg-gray-900/95"  : "bg-white/95",
    tabsBorder:        isDark ? "border-gray-800" : "border-slate-200",
    tabActive:         isDark ? "text-indigo-400 border-indigo-400" : "text-indigo-600 border-indigo-600",
    tabInactive:       isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900",
    tabInactiveBorder: isDark ? "hover:border-gray-700" : "hover:border-slate-300",

    // ── Enroll card ───────────────────────────────────────────────────
    enrollCardBg:    isDark ? "bg-gray-900"    : "bg-white",
    enrollCardBorder:isDark ? "border-gray-800": "border-slate-200",
    enrollTitle:     isDark ? "text-white"     : "text-gray-900",
    enrollDateBg:    isDark ? "bg-indigo-950/30 border-indigo-800" : "bg-indigo-50 border-indigo-200",
    enrollDateText:  isDark ? "text-indigo-300" : "text-indigo-700",

    // ── Buttons ───────────────────────────────────────────────────────
    ctaButton: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",

    // ── Features ──────────────────────────────────────────────────────
    featureIcon: isDark ? "text-emerald-400" : "text-emerald-600",
    featureText: isDark ? "text-gray-300"    : "text-gray-700",

    // ── Dividers ──────────────────────────────────────────────────────
    divider: isDark ? "border-gray-800" : "border-slate-100",

    // ── Prose (dangerouslySetInnerHTML) ───────────────────────────────
    // Use prose-invert in dark mode so Tailwind Typography colour tokens invert
    proseClass: isDark ? "text-white" : "prose-gray",

    // ── Bottom CTA ────────────────────────────────────────────────────
    bottomCtaBg: isDark
      ? "bg-gradient-to-r from-indigo-900 to-purple-900"
      : "bg-gradient-to-r from-indigo-600 to-purple-600",
  };
};