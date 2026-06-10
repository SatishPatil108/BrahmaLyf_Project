import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  CalendarDays,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";
import useDomainData from "@/pages/Admin/CourseList/useDomainData";
import { useDailyShort } from "../../useHomepage";
import ShortCard from "./ShortCard";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

/* ── Date helpers ── */
const toDateStr = (isoString) => isoString?.slice(0, 10);
const getTargetDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
};
const formatDisplayDate = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* ── Design tokens ── */
const tokens = {
  accent: "#f43f5e",
  accentAlt: "#fb923c",
  accentPurple: "#a855f7",
};

/* ── Keyframes injected once ── */
const GlobalStyles = () => (
  <style>{`
    @keyframes ticker {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(0.85); opacity: 0.6; }
      70%  { transform: scale(1.15); opacity: 0; }
      100% { transform: scale(1.15); opacity: 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-6px); }
    }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
    .syne { font-family: 'Syne', sans-serif; }
    .dm-sans { font-family: 'DM Sans', sans-serif; }
  `}</style>
);

/* ══════════════════════════════════════  MAIN COMPONENT ══════════════════════════════════════ */
const DailyShorts = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [page, setPage] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { domainsDetails } = useDomainData();
  const domains = domainsDetails?.domains ?? [];
  const { loading, error, shortVideosDetails } = useDailyShort(page, 8, null);

  const videos = shortVideosDetails?.videos ?? [];
  const currentPage = shortVideosDetails?.current_page ?? 1;
  const hasNextPage = shortVideosDetails?.has_next_page ?? false;
  const hasPrevPage = shortVideosDetails?.has_prev_page ?? false;
  const totalRecords = shortVideosDetails?.total_records ?? 0;

  const targetDateStr = getTargetDateStr();
  const videoOfTheDay =
    videos.find((v) => toDateStr(v.created_on) === targetDateStr) ?? null;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const tickerWords = [
    "DAILY SHORTS",
    "60 SECONDS",
    "LEARN NOW",
    "QUICK CLIPS",
    "WATCH MORE",
    "DAILY SHORTS",
    "60 SECONDS",
    "LEARN NOW",
    "QUICK CLIPS",
    "WATCH MORE",
  ];

  return (
    <section
      className={`relative overflow-hidden dm-sans ${isDark ? "text-white" : "text-gray-900"}`}
    >
      <GlobalStyles />

      {/* ── Background ambient glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background: `radial-gradient(circle, ${tokens.accent}, transparent 70%)`,
          }}
        />
        <div
          className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: `radial-gradient(circle, ${tokens.accentPurple}, transparent 70%)`,
          }}
        />
      </div>

      {/* ── Top Ticker ── */}
      <TickerBand
        isDark={isDark}
        words={tickerWords}
        reverse={false}
        dotColor="bg-purple-600"
      />

      {/* ── Video of the Day ── */}
      <AnimatePresence>
        {!loading && !error && videoOfTheDay && (
          <VideoOfTheDay
            video={videoOfTheDay}
            isDark={isDark}
            domains={domains}
            onPress={() => {
              dispatch(clearUserError());
              navigate(`/short-video/${videoOfTheDay.id}`);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Section Header ── */}
      <div className="relative z-10 pt-14 pb-8 px-5 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="syne text-xs font-bold uppercase tracking-[0.2em] text-purple-500">
                  Daily Shorts
                </span>
              </div>
              {totalRecords > 0 && (
                <p
                  className={`text-xs font-medium ${isDark ? "text-white/30" : "text-black/35"}`}
                >
                  {totalRecords} videos · Page {currentPage}
                </p>
              )}
            </div>

            {/* Scroll controls — only shown when scrollable */}
            {videos.length > 3 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  aria-label="Scroll left"
                  className={`group w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none ${
                    isDark
                      ? "border-white/10 text-white/30 hover:border-white/30 hover:text-white hover:bg-white/5"
                      : "border-black/10 text-black/30 hover:border-black/25 hover:text-black hover:bg-black/5"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  aria-label="Scroll right"
                  className="group w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none bg-purple-500"
                >
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cards Strip ── */}
      <div className="relative z-10 px-5 sm:px-10 lg:px-16 pb-14">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton */}
          {loading && (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 rounded-2xl w-[150px] sm:w-[190px] lg:w-[210px] aspect-[9/16] ${
                    isDark ? "bg-white/[0.04]" : "bg-black/[0.04]"
                  }`}
                  style={{
                    animation: `pulse 1.6s ease-in-out ${i * 0.12}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div
              className={`p-8 rounded-2xl border text-center ${
                isDark
                  ? "border-rose-900/40 bg-rose-950/20 text-rose-400"
                  : "border-rose-200 bg-rose-50/60 text-rose-600"
              }`}
            >
              <Zap className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">
                {error.message ?? "Failed to load shorts"}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && videos.length === 0 && (
            <div
              className={`py-24 rounded-3xl border-2 border-dashed text-center ${
                isDark
                  ? "border-white/[0.07] text-white/25"
                  : "border-black/[0.07] text-black/25"
              }`}
            >
              <Clapperboard className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium tracking-wide">
                No shorts available right now
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && !error && videos.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  ref={scrollRef}
                  className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 hide-scrollbar"
                >
                  {videos.map((video, i) => (
                    <ShortCard
                      key={video.id}
                      video={video}
                      index={i}
                      hoveredIndex={hoveredIndex}
                      setHoveredIndex={setHoveredIndex}
                      isDark={isDark}
                      domains={domains}
                      onPress={() => {
                        dispatch(clearUserError());
                        navigate(`/short-video/${video.id}`);
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {(hasPrevPage || hasNextPage) && (
            <div className="flex items-center justify-center gap-3 mt-12">
              {hasPrevPage && (
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={loading}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none ${
                    isDark
                      ? "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                      : "border-black/10 text-black/50 hover:border-black/30 hover:text-black"
                  }`}
                >
                  ← Prev
                </button>
              )}
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                  isDark
                    ? "bg-white/[0.06] text-white/40"
                    : "bg-black/[0.05] text-black/40"
                }`}
              >
                {currentPage}
              </span>
              {hasNextPage && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-white transition-all disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                  style={{
                    background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.accentAlt})`,
                  }}
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Ticker ── */}
      <TickerBand
        isDark={isDark}
        words={tickerWords}
        reverse
        dotColor="bg-purple-600"
      />
    </section>
  );
};

/* ══════════════════════════════════════
   VIDEO OF THE DAY
══════════════════════════════════════ */
const VideoOfTheDay = ({ video, isDark, domains, onPress }) => {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-200, 200], [2, -2]);
  const rotateY = useTransform(mouseX, [-400, 400], [-3, 3]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const domainName =
    domains.find((d) => d.domain_id === video.domain_id)?.domain_name ??
    "General";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 px-5 sm:px-10 lg:px-16 pt-10 pb-2"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {/* Live dot */}
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-500"
                style={{ animation: "pulse-ring 1.8s ease-out infinite" }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span
              className="syne text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: tokens.accent }}
            >
              Video of the Day
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${
              isDark ? "text-white/30" : "text-black/30"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{formatDisplayDate(new Date())}</span>
          </div>
        </div>

        {/* Hero card — subtle 3D tilt on desktop */}
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            mouseX.set(0);
            mouseY.set(0);
          }}
          onMouseMove={handleMouseMove}
          onClick={onPress}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            perspective: 1000,
          }}
          whileTap={{ scale: 0.985 }}
          className={`relative rounded-[28px] overflow-hidden cursor-pointer ring-1 transition-all duration-500 ${
            hovered
              ? "ring-rose-500/50 shadow-[0_0_60px_-10px_rgba(244,63,94,0.35)]"
              : isDark
                ? "ring-white/[0.07] shadow-none"
                : "ring-black/[0.06] shadow-none"
          }`}
        >
          {/* Thumbnail */}
          <motion.img
            src={`${BASE_URL}${video.video_thumbnail}`}
            alt={video.video_title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Cinematic gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.10) 100%)",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end px-7 sm:px-10 pb-7 sm:pb-9">
            {/* Domain badge */}
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 self-start mb-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-white/80"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Sparkles className="w-2.5 h-2.5 text-rose-400" />
              {domainName}
            </motion.span>

            {/* Title */}
            <motion.h3
              className="syne text-white font-bold leading-[1.15] mb-5 max-w-md"
              style={{ fontSize: "clamp(1.35rem, 3vw, 2.1rem)" }}
              animate={{ x: hovered ? 2 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {video.video_title}
            </motion.h3>

            {/* CTA */}
            <motion.button
              onClick={onPress}
              animate={{ x: hovered ? 5 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-3 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full"
              aria-label={`Watch ${video.video_title}`}
            >
              {/* Play button */}
              <motion.span
                className="relative w-11 h-11 rounded-full flex items-center justify-center"
                animate={{
                  background: hovered
                    ? `linear-gradient(135deg, ${tokens.accent}, ${tokens.accentAlt})`
                    : "rgba(255,255,255,0.15)",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {/* Ripple */}
                {hovered && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-white/30"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                )}
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </motion.span>
              <span className="text-white/75 text-sm font-medium tracking-wide">
                Watch now
              </span>
            </motion.button>
          </div>

          {/* Progress accent line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] rounded-r-full"
            style={{
              background: `linear-gradient(90deg, ${tokens.accent}, ${tokens.accentAlt})`,
            }}
            animate={{ width: hovered ? "100%" : "28%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════  TICKER BAND  ══════════════════════════════════════ */
const TickerBand = ({ isDark, words, reverse, dotColor }) => (
  <div
    className={`relative z-10 overflow-hidden border-y ${
      isDark ? "border-white/[0.06]" : "border-black/[0.06]"
    } py-2`}
  >
    <div
      className="flex gap-10 whitespace-nowrap w-max select-none"
      style={{
        animation: `ticker 26s linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {[...words, ...words].map((w, i) => (
        <span
          key={i}
          className={`syne text-[11px] font-bold uppercase flex items-center gap-3.5 tracking-[0.22em] ${
            isDark ? "text-white/[0.14]" : "text-black/[0.13]"
          }`}
        >
          {w}
          <span
            className={`inline-block w-1 h-1 rounded-full ${dotColor} opacity-80`}
          />
        </span>
      ))}
    </div>
  </div>
);

export default DailyShorts;
