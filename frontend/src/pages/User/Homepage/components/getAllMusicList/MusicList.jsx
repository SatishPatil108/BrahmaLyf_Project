import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Play,
  Pause,
  Heart,
  Share2,
  Clock,
  Music,
  Headphones,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import { useMusicListPage } from "../../useHomepage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useTheme } from "@/contexts/ThemeContext";
import useDomainData from "@/pages/Admin/CourseList/useDomainData";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// Animation tokens
const ANIMATION = {
  spring: { type: "spring", stiffness: 400, damping: 30 },
  transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
};

// Design system tokens
const DESIGN = {
  radii: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
  },
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  },
};

// Reusable UI Components
const GlowEffect = ({ isDark, className = "" }) => (
  <div
    className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
  >
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 animate-pulse" />
  </div>
);

const GradientBadge = ({ icon: Icon, children, isDark }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-sm">
    <Icon className="w-3.5 h-3.5 text-violet-500" />
    <span className="text-xs font-semibold tracking-wider text-violet-600 dark:text-violet-400">
      {children}
    </span>
  </div>
);

const SectionHeader = ({ isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16 space-y-6"
  >
    <div className="flex justify-center">
      <GradientBadge icon={Headphones} isDark={isDark}>
        Curated Soundscapes
      </GradientBadge>
    </div>

    <h1 className="text-4xl sm:text-3xl lg:text-7xl  font-bold tracking-tight">
      <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
        Meditation & Sounds
      </span>
    </h1>

    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-wrap">
      Discover your perfect soundscape for focus, relaxation, and deep
      meditation
    </p>

     
  </motion.div>
);

// Optimized Music Card
const MusicCard = React.memo(
  ({ music, isDark, domainName, onClick, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handlePlay = (e) => {
      e.stopPropagation();
      setIsPlaying(!isPlaying);
      // Implement play functionality
    };

    return (
      <motion.article
        layoutId={`card-${music.id}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05, ...ANIMATION.spring }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        className="group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
        role="article"
        aria-label={`${music.music_title} by ${domainName}`}
      >
        {/* Circular Container */}
        <div className="flex flex-col items-center">
          {/* Circular Image Container */}
          <div className="relative w-36 max-w-[100px] mx-auto">
            <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500">
              {/* Loading Skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
              )}

              {/* Image */}
              <img
                src={
                  imageError
                    ? `https://placehold.co/400x400/8b5cf6/ffffff?text=${music.music_title[0]}`
                    : `${BASE_URL}${music.music_thumbnail}`
                }
                alt={music.music_title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isHovered ? "scale-110" : "scale-100"
                } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />

              {/* Gradient Overlay on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 rounded-full ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Play/Pause Button Overlay - Center */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1 : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ ...ANIMATION.spring, delay: 0.05 }}
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <div className="w-9 h-9  rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                  {isPlaying ? (
                    <Pause className="w-4 h-4  text-violet-600 ml-0.5" />
                  ) : (
                    <Play className="w-4 h-4 text-violet-600 fill-violet-600 ml-1" />
                  )}
                </div>
              </motion.button>

              {/* Outer Ring - Premium Detail */}
              <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-4 group-hover:ring-violet-500/50 transition-all duration-300 pointer-events-none" />

              {/* Duration Badge - Bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white/90 text-xs font-mono shadow-lg">
                  <Clock className="w-3 h-3" />
                  <span>{music.music_duration}</span>
                </div>
              </div>

              {/* Action Buttons - Top Right */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all hover:scale-110"
                ></motion.button>
              </div>

              {/* Playing Indicator Ring */}
              {isPlaying && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 rounded-full ring-4 ring-violet-500 shadow-lg shadow-violet-500/50"
                >
                  <div className="absolute inset-0 rounded-full animate-ping bg-violet-500/20" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Content Below Circle */}
          <div className="text-center mt-2.5 space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm  line-clamp-1 transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
              {music.music_title}
            </h3>

            <div className="flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Music className="w-1.5 h-1.5 text-white" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {domainName}
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  },
);

MusicCard.displayName = "MusicCard";

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="aspect-[4/3] rounded-2xl bg-gray-200 dark:bg-gray-800" />
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Load More Button
const LoadMoreButton = ({ onClick, isLoading, hasMore, isDark }) => {
  if (!hasMore) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center mt-12"
    >
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`
          group relative px-8 py-3 rounded-xl font-semibold text-sm
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
          ${isDark ? "focus:ring-offset-gray-900" : "focus:ring-offset-white"}
        `}
      >
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-100 group-hover:opacity-90 transition-opacity" />
        <span className="relative flex items-center gap-2 text-white">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Load More
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </>
          )}
        </span>
      </button>
    </motion.div>
  );
};

// Empty State
const EmptyState = ({ isDark }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20"
  >
    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 mb-6">
      <Music className="w-12 h-12 text-violet-500" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      No soundscapes found
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      Check back soon for new meditation tracks
    </p>
  </motion.div>
);

// Error State
const ErrorState = ({ error, onRetry, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20"
  >
    <div className="inline-flex p-4 rounded-2xl bg-red-500/10 mb-6">
      <Music className="w-12 h-12 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Unable to load tracks
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6">
      {error.message || "Something went wrong"}
    </p>
    <button
      onClick={onRetry}
      className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      Try again
    </button>
  </motion.div>
);

// Main Component
const MusicList = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [allMusics, setAllMusics] = useState([]);

  const { domainsDetails } = useDomainData();
  const domains = domainsDetails?.domains ?? [];

  const { loading, error, musicsDetails, refetch } = useMusicListPage(
    page,
    12,
    null,
  );

  const musics = musicsDetails?.musics ?? [];
  const hasNextPage = musicsDetails?.has_next_page ?? false;

  // Append new musics to existing list
  useEffect(() => {
    if (musics.length > 0) {
      setAllMusics((prev) => {
        const newMusics = musics.filter(
          (music) => !prev.some((p) => p.id === music.id),
        );
        return [...prev, ...newMusics];
      });
    }
  }, [musics]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !loading) {
      setPage((p) => p + 1);
    }
  }, [hasNextPage, loading]);

  const handleCardClick = useCallback(
    (music) => {
      dispatch(clearUserError());
      navigate(`/music/${music.id}`);
    },
    [dispatch, navigate],
  );

  const getDomainName = useCallback(
    (domainId) => {
      return (
        domains.find((d) => d.domain_id === domainId)?.domain_name ??
        "Meditation"
      );
    },
    [domains],
  );

  // Reset when component unmounts
  useEffect(() => {
    return () => {
      setAllMusics([]);
      setPage(1);
    };
  }, []);

  const displayMusics = allMusics.length > 0 ? allMusics : musics;

  return (
    <section className="relative min-h-screen py-16 sm:py-20 lg:py-24 overflow-hidden">
      <GlowEffect isDark={isDark} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader isDark={isDark} />

        <AnimatePresence mode="wait">
          {loading && displayMusics.length === 0 ? (
            <LoadingSkeleton key="loading" />
          ) : error ? (
            <ErrorState
              key="error"
              error={error}
              onRetry={refetch}
              isDark={isDark}
            />
          ) : displayMusics.length === 0 ? (
            <EmptyState key="empty" isDark={isDark} />
          ) : (
            <LayoutGroup>
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 auto-rows-fr"
              >
                {displayMusics.map((music, index) => (
                  <MusicCard
                    key={music.id}
                    music={music}
                    index={index}
                    isDark={isDark}
                    domainName={getDomainName(music.domain_id)}
                    onClick={() => handleCardClick(music)}
                  />
                ))}
              </motion.div>
            </LayoutGroup>
          )}
        </AnimatePresence>

        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={loading && displayMusics.length > 0}
          hasMore={hasNextPage}
          isDark={isDark}
        />
      </div>
    </section>
  );
};

export default React.memo(MusicList);
