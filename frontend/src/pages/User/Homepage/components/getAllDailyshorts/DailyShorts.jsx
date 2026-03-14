import React, { useRef, useState } from "react";
import { Play, ChevronLeft, ChevronRight, Clapperboard, CalendarDays, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";
import useDomainData from "@/pages/Admin/CourseList/useDomainData";
import { useDailyShort } from "../../useHomepage";
import ShortCard from "./ShortCard";
const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;



/* ── Date helpers ── */
const toDateStr = (isoString) => isoString?.slice(0, 10); // "2026-03-05"

const getTargetDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 9);
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
  // console.log(videos);

  const currentPage = shortVideosDetails?.current_page ?? 1;
  const hasNextPage = shortVideosDetails?.has_next_page ?? false;
  const hasPrevPage = shortVideosDetails?.has_prev_page ?? false;
  const totalRecords = shortVideosDetails?.total_records ?? 0;

  /* ── Video of the Day logic ── */
  const targetDateStr = getTargetDateStr();
  // console.log(targetDateStr);

  const videoOfTheDay = videos.find(
    (v) => toDateStr(v.created_on) === targetDateStr
  ) ?? null;



  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  const tickerWords = [
    "DAILY SHORTS", "60 SECONDS", "LEARN NOW", "QUICK CLIPS", "WATCH MORE",
    "DAILY SHORTS", "60 SECONDS", "LEARN NOW", "QUICK CLIPS", "WATCH MORE",
  ];

  return (
    <section
      className={`relative overflow-hidden ${isDark ? "text-white" : "text-gray-900"}`}
    >
      {/* ── Top Ticker ── */}
      <TickerBand isDark={isDark} words={tickerWords} reverse={false} dotColor="bg-rose-500" />

      {/* ── Video of the Day ── */}
      {!loading && !error && videoOfTheDay && (
        <VideoOfTheDay
          video={videoOfTheDay}
          isDark={isDark}
          domains={domains}
          targetDateStr={targetDateStr}
          onPress={() => {
            dispatch(clearUserError());
            navigate(`/short-video/${videoOfTheDay.id}`)
          }}
        />
      )}

      {/* ── Header ── */}
      <div className="relative z-10 pt-16 pb-10 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-8 h-px bg-rose-500" />
                <span className="text-rose-500 uppercase tracking-widest text-xs font-bold">
                  Daily Shorts
                </span>
              </div>
              <h2
                className={`leading-none lg:text-7xl text-5xl tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Learn in
                <br />
                <ShimmerText>60 Seconds</ShimmerText>
              </h2>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3">
              <p
                className={`text-sm leading-relaxed max-w-xs ${isDark ? "text-white" : "text-gray-900"}`}
                style={{ fontStyle: "italic" }}
              >
                Quick, inspiring micro-lessons crafted for modern learners on the go.
              </p>
              {videos.length > 3 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scroll("left")}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${isDark
                      ? "border-white/15 text-white/40 hover:border-white/40 hover:text-white"
                      : "border-black/15 text-black/40 hover:border-black/40 hover:text-black"}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center hover:bg-rose-400 transition-all duration-200 text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {totalRecords > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`mt-6 flex items-center gap-3 text-xs ${isDark ? "text-white/30" : "text-black/30"}`}
            >
              <span>{totalRecords} videos</span>
              <span className="w-1 h-1 rounded-full bg-current inline-block opacity-50" />
              <span>Page {currentPage}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">

          {loading && (
            <div className="flex gap-5 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 rounded-2xl w-[160px] sm:w-[200px] lg:w-[220px] aspect-[9/16] animate-pulse ${isDark ? "bg-white/5" : "bg-black/5"}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className={`p-8 rounded-2xl border text-center ${isDark ? "border-rose-900/50 bg-rose-950/30 text-rose-400" : "border-rose-200 bg-rose-50 text-rose-600"}`}>
              {error.message ?? "Failed to load shorts"}
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className={`py-20 rounded-3xl border-2 border-dashed text-center ${isDark ? "border-white/10 text-white/30" : "border-black/10 text-black/30"}`}>
              <Clapperboard className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No shorts videos available right now</p>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >

                {/* Unified horizontal scroll — mobile & desktop */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                      onPress={() => { dispatch(clearUserError()); navigate(`/short-video/${video.id}`); }}
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
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all disabled:opacity-40 ${isDark
                    ? "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                    : "border-black/15 text-black/60 hover:border-black/40 hover:text-black"}`}
                >
                  ← Prev
                </button>
              )}
              <span className={`text-xs tabular-nums ${isDark ? "text-white/25" : "text-black/25"}`}>
                {currentPage}
              </span>
              {hasNextPage && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-500 text-white hover:bg-rose-400 transition-all disabled:opacity-40"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Ticker ── */}
      <TickerBand isDark={isDark} words={tickerWords} reverse dotColor="bg-orange-400" />
    </section>
  );
};

/* ── VideoOfTheDay ── */
const VideoOfTheDay = ({ video, isDark, domains, targetDateStr, onPress }) => {
  const [hovered, setHovered] = useState(false);
  const domainName = domains.find((d) => d.domain_id === video.domain_id)?.domain_name ?? "General";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 px-6 sm:px-10 lg:px-16 pt-10 pb-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-rose-500 uppercase tracking-widest text-xs font-bold">
            Video of the Day
          </span>
          <span className={`ml-auto flex items-center gap-1.5 text-xs ${isDark ? "text-white/30" : "text-black/30"}`}>
            <CalendarDays className="w-3.5 h-3.5" />
            {formatDisplayDate(new Date())}
          </span>
        </div>

        {/* Card */}
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onPress}
          whileTap={{ scale: 0.985 }}
          className={`relative rounded-3xl overflow-hidden cursor-pointer group border transition-colors duration-300 ${isDark
            ? "border-white/8 hover:border-rose-500/40"
            : "border-black/8 hover:border-rose-500/40"}`}
          style={{ height: "clamp(220px, 36vw, 360px)" }}
        >
          {/* Thumbnail */}
          <img
            src={`${BASE_URL}${video.video_thumbnail}`}
            alt={video.video_title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-end px-8 sm:px-12 pb-8">
            <div className="max-w-lg">

              {/* Title */}
              <h3
                className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {video.video_title}
              </h3>

              {/* Play CTA */}
              <motion.div
                className="flex items-center gap-3"
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30 transition-all duration-300"
                  style={{
                    background: hovered ? "rgba(244,63,94,0.9)" : "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
                <span className="text-white/80 text-sm font-medium">Watch now</span>
              </motion.div>

            </div>
          </div>


          {/* Animated rose accent line bottom */}
          <div
            className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-rose-500 to-orange-400 origin-left transition-transform duration-500"
            style={{ width: "100%", transform: hovered ? "scaleX(1)" : "scaleX(0.3)" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ── ShimmerText ── */
const ShimmerText = ({ children }) => (
  <span
    style={{
      background: "linear-gradient(90deg, #f43f5e 0%, #fb923c 40%, #fde68a 60%, #f43f5e 100%)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: "shimmer 4s linear infinite",
    }}
  >
    {children}
  </span>
);

/* ── TickerBand ── */
const TickerBand = ({ isDark, words, reverse, dotColor }) => (
  <div className={`relative z-10 overflow-hidden border-y ${isDark ? "border-white/10" : "border-black/10"} py-2.5`}>
    <div
      className="flex gap-12 whitespace-nowrap w-max"
      style={{
        animation: `ticker 22s linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      {[...words, ...words].map((w, i) => (
        <span
          key={i}
          className={`text-xs font-bold uppercase flex items-center gap-4 ${isDark ? "text-white/20" : "text-black/20"}`}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.25em" }}
        >
          {w}
          <span className={`inline-block w-1 h-1 rounded-full ${dotColor}`} />
        </span>
      ))}
    </div>
  </div>
);

export default DailyShorts;