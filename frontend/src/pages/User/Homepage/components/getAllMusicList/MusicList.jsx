import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Play,
  Music,
  Headphones,
  Volume2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Pause,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicListPage } from "../../useHomepage";
import { useNavigate } from "react-router-dom";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";
import useDomainData from "@/pages/Admin/CourseList/useDomainData";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

/* ─── Skeleton Loader ─────────────────────────────────────────────── */
const SkeletonCard = ({ isDark }) => (
  <div className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]">
    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4">
      <div
        className={`absolute inset-0 ${
          isDark ? "bg-white/8" : "bg-gray-100"
        } animate-pulse`}
      />
    </div>
    <div className="space-y-2 px-1">
      <div
        className={`h-4 w-3/4 rounded-full animate-pulse ${
          isDark ? "bg-white/10" : "bg-gray-100"
        }`}
      />
      <div
        className={`h-3 w-1/2 rounded-full animate-pulse ${
          isDark ? "bg-white/6" : "bg-gray-50"
        }`}
      />
    </div>
  </div>
);

/* ─── Music Card Component ────────────────────────────────────────── */
const MusicCard = ({
  music,
  index,
  isDark,
  domains,
  isActive,
  onEnter,
  onLeave,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const domainName =
    domains.find((d) => d.domain_id === music.domain_id)?.domain_name ??
    "Meditation";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.article
      variants={itemVariants}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => {
        setIsHovering(true);
        onEnter?.();
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        onLeave?.();
      }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => {
        setIsPressed(false);
        onClick();
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Play ${music.music_title} — ${domainName} — Duration ${music.music_duration}`}
      className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl transition-transform duration-200"
    >
      {/* Thumbnail Container */}
      <div
        className={`
          relative rounded-2xl overflow-hidden aspect-[4/3] mb-4
          transition-all duration-500 ease-out
          ${isHovering ? "shadow-2xl" : "shadow-md"}
          ${isDark ? "shadow-black/20" : "shadow-gray-200"}
        `}
      >
        <img
          src={
            imageError
              ? `https://placehold.co/480x360/${isDark ? "1a1a2e" : "f5f3ff"}/a78bfa?text=${encodeURIComponent(music.music_title[0])}`
              : `${BASE_URL}${music.music_thumbnail}`
          }
          alt={music.music_title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Overlay */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-300
            ${isHovering || isPressed ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"}
          `}
        >
          <motion.div
            initial={false}
            animate={{
              scale: isHovering || isPressed ? 1 : 0.8,
              opacity: isHovering || isPressed ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-black/40"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-violet-700 fill-violet-700 ml-0.5" />
          </motion.div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
              text-[10px] sm:text-[11px] font-mono font-semibold tracking-wide
              bg-black/60 backdrop-blur-md text-white/90
              shadow-sm
            `}
          >
            <Clock className="w-2.5 h-2.5 opacity-70" />
            {music.music_duration}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-1 space-y-1.5">
        <h3
          className={`
            text-sm sm:text-base font-semibold leading-tight line-clamp-1
            transition-colors duration-200
            ${
              isDark
                ? "text-white/90 group-hover:text-white"
                : "text-gray-900 group-hover:text-violet-700"
            }
          `}
        >
          {music.music_title}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`
              w-5 h-5 rounded-full flex items-center justify-center
              ${isDark ? "bg-violet-500/15" : "bg-violet-50"}
            `}
          >
            <Volume2
              className={`w-3 h-3 ${isDark ? "text-violet-400" : "text-violet-500"}`}
              aria-hidden="true"
            />
          </div>
          <span
            className={`text-[11px] sm:text-xs truncate ${isDark ? "text-white/40" : "text-gray-400"}`}
          >
            {domainName}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/* ─── Scroll Controls ─────────────────────────────────────────────── */
const ScrollControls = ({
  onScrollLeft,
  onScrollRight,
  canLeft,
  canRight,
  isDark,
}) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onScrollLeft}
      disabled={!canLeft}
      aria-label="Scroll left"
      className={`
        w-11 h-11 sm:w-10 sm:h-10 rounded-full
        flex items-center justify-center
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
        disabled:opacity-30 disabled:cursor-not-allowed
        ${
          canLeft
            ? isDark
              ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200"
            : isDark
              ? "bg-transparent text-white/20 border border-white/5"
              : "bg-transparent text-gray-300 border border-gray-150"
        }
      `}
    >
      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
    <button
      onClick={onScrollRight}
      disabled={!canRight}
      aria-label="Scroll right"
      className={`
        w-11 h-11 sm:w-10 sm:h-10 rounded-full
        flex items-center justify-center
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
        disabled:opacity-30 disabled:cursor-not-allowed
        ${
          canRight
            ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-violet-500/30 hover:brightness-110"
            : isDark
              ? "bg-white/5 text-white/20"
              : "bg-gray-100 text-gray-400"
        }
      `}
    >
      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  </div>
);

/* ─── Empty State ─────────────────────────────────────────────────── */
const EmptyState = ({ isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center"
    style={{
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" />
    <div className="relative">
      <div
        className={`
          w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5
          ${isDark ? "bg-white/5" : "bg-gray-50"}
        `}
      >
        <Music
          className={`w-8 h-8 ${isDark ? "text-white/30" : "text-gray-300"}`}
        />
      </div>
      <h3
        className={`text-lg font-semibold mb-2 ${isDark ? "text-white/60" : "text-gray-500"}`}
      >
        No soundscapes yet
      </h3>
      <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
        Check back soon for new meditation tracks
      </p>
    </div>
  </motion.div>
);

/* ─── Error State ─────────────────────────────────────────────────── */
const ErrorState = ({ error, isDark, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    role="alert"
    className={`
      rounded-2xl p-8 text-center border
      ${isDark ? "bg-red-950/20 border-red-900/40" : "bg-red-50 border-red-100"}
    `}
  >
    <div
      className={`
        w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4
        ${isDark ? "bg-red-900/30" : "bg-red-100"}
      `}
    >
      <Music
        className={`w-6 h-6 ${isDark ? "text-red-400" : "text-red-500"}`}
      />
    </div>
    <h3
      className={`text-base font-semibold mb-1 ${isDark ? "text-red-400" : "text-red-600"}`}
    >
      Unable to load tracks
    </h3>
    <p
      className={`text-sm mb-4 ${isDark ? "text-red-300/70" : "text-red-500/70"}`}
    >
      {error.message ?? "Something went wrong"}
    </p>
    <button
      onClick={onRetry}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
        ${
          isDark
            ? "bg-white/10 text-white/80 hover:bg-white/15"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
    >
      Try again
    </button>
  </motion.div>
);

/* ─── Main Component ──────────────────────────────────────────────── */
const MusicList = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [page, setPage] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { domainsDetails } = useDomainData();
  const domains = domainsDetails?.domains ?? [];

  const { loading, error, musicsDetails, refetch } = useMusicListPage(
    page,
    12,
    null,
  );

  const musics = musicsDetails?.musics ?? [];
  const currentPage = musicsDetails?.current_page ?? 1;
  const hasNextPage = musicsDetails?.has_next_page ?? false;
  const hasPrevPage = musicsDetails?.has_prev_page ?? false;
  const totalRecords = musicsDetails?.total_records ?? 0;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < maxScrollLeft - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, musics.length]);

  const scroll = useCallback(
    (direction) => {
      const el = scrollRef.current;
      if (!el) return;
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateScrollState, 400);
    },
    [updateScrollState],
  );

  const handleNextPage = () => hasNextPage && setPage((p) => p + 1);
  const handlePrevPage = () => hasPrevPage && setPage((p) => p - 1);
  const handleRetry = () => refetch?.();

  const handleCardClick = (music) => {
    dispatch(clearUserError());
    navigate(`/music/${music.id}`);
  };

  const showScrollControls = !loading && !error && musics.length > 4;
  const showPagination = hasPrevPage || hasNextPage;

  return (
    <section
      aria-label="Meditation & Soundscapes Collection"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Ambient Background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className={`
            absolute -top-40 left-1/2 -translate-x-1/2
            w-[500px] h-[500px] rounded-full blur-3xl
            ${isDark ? "bg-violet-900/20" : "bg-violet-100/40"}
          `}
        />
        <div
          className={`
            absolute -bottom-40 right-1/2 translate-x-1/2
            w-[400px] h-[400px] rounded-full blur-3xl
            ${isDark ? "bg-fuchsia-900/10" : "bg-fuchsia-50/30"}
          `}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              backgroundColor: isDark
                ? "rgba(139,92,246,0.1)"
                : "rgba(139,92,246,0.06)",
              border: `1px solid ${isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.15)"}`,
            }}
          >
            <Headphones
              className="w-3.5 h-3.5 text-violet-500"
              aria-hidden="true"
            />
            <span
              className={`text-xs font-semibold tracking-wider uppercase ${isDark ? "text-violet-300" : "text-violet-600"}`}
            >
              Curated Soundscapes
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-5"
          >
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Meditation & Sounds
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-base sm:text-lg max-w-md mx-auto leading-relaxed ${isDark ? "text-white/50" : "text-gray-500"}`}
          >
            Relax, focus, and restore with our immersive collection of
            therapeutic soundscapes.
          </motion.p>
        </div>

        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600"
              aria-hidden="true"
            />
            <span
              className={`text-sm font-semibold tracking-wider uppercase ${isDark ? "text-white/60" : "text-gray-500"}`}
            >
              All Tracks
            </span>
            {totalRecords > 0 && !loading && (
              <span
                className={`
                  text-xs px-2.5 py-0.5 rounded-full font-medium
                  ${isDark ? "bg-white/10 text-white/40" : "bg-gray-100 text-gray-500"}
                `}
              >
                {totalRecords.toLocaleString()}
              </span>
            )}
          </div>

          {showScrollControls && (
            <ScrollControls
              onScrollLeft={() => scroll("left")}
              onScrollRight={() => scroll("right")}
              canLeft={canScrollLeft}
              canRight={canScrollRight}
              isDark={isDark}
            />
          )}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 sm:gap-4 md:gap-5 overflow-hidden pb-4"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} isDark={isDark} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto"
            >
              <ErrorState error={error} isDark={isDark} onRetry={handleRetry} />
            </motion.div>
          ) : musics.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto"
            >
              <EmptyState isDark={isDark} />
            </motion.div>
          ) : (
            <motion.div
              key={`page-${currentPage}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                {/* Scroll Container */}
                <div
                  ref={scrollRef}
                  onScroll={updateScrollState}
                  className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scroll-smooth pb-6 -mx-2 px-2 scrollbar-hide"
                  role="list"
                  aria-label="Music tracks"
                  tabIndex={0}
                >
                  {musics.map((music, index) => (
                    <div
                      key={music.id}
                      role="listitem"
                      className="flex-shrink-0"
                    >
                      <MusicCard
                        music={music}
                        index={index}
                        isDark={isDark}
                        domains={domains}
                        isActive={hoveredIndex === index}
                        onEnter={() => setHoveredIndex(index)}
                        onLeave={() => setHoveredIndex(null)}
                        onClick={() => handleCardClick(music)}
                      />
                    </div>
                  ))}
                </div>

                {/* Gradient Fades (for visual cue only) */}
                {canScrollLeft && (
                  <div
                    aria-hidden="true"
                    className={`
                      absolute left-0 top-0 bottom-0 w-12 pointer-events-none
                      bg-gradient-to-r
                      ${
                        isDark
                          ? "from-gray-950 via-gray-950/60 to-transparent"
                          : "from-white via-white/60 to-transparent"
                      }
                    `}
                  />
                )}
                {canScrollRight && (
                  <div
                    aria-hidden="true"
                    className={`
                      absolute right-0 top-0 bottom-0 w-12 pointer-events-none
                      bg-gradient-to-l
                      ${
                        isDark
                          ? "from-gray-950 via-gray-950/60 to-transparent"
                          : "from-white via-white/60 to-transparent"
                      }
                    `}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {showPagination && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`
              flex items-center justify-center gap-3 mt-10 pt-8
              border-t
              ${isDark ? "border-white/8" : "border-gray-100"}
            `}
          >
            {hasPrevPage && (
              <button
                onClick={handlePrevPage}
                disabled={loading}
                className={`
                  group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                  ${
                    isDark
                      ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 shadow-sm"
                  }
                `}
              >
                <ChevronLeft
                  className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                Previous
              </button>
            )}

            <div
              className={`
                min-w-[72px] px-4 py-2.5 rounded-xl text-center text-sm font-semibold
                ${isDark ? "bg-white/8 text-white/60" : "bg-gray-100 text-gray-600"}
              `}
              aria-current="page"
            >
              {currentPage}
            </div>

            {hasNextPage && (
              <button
                onClick={handleNextPage}
                disabled={loading}
                className={`
                  group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                  bg-gradient-to-r from-violet-600 to-fuchsia-600
                  text-white shadow-md hover:shadow-violet-500/30 hover:brightness-110
                `}
              >
                Next
                <ChevronRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MusicList;
