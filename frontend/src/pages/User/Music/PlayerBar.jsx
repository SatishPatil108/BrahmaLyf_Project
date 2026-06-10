import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// ─── Control button ───────────────────────────────────────────────
function CtrlBtn({ onClick, label, active, size = 18, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={[
        "p-2 rounded-full transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
        active
          ? "text-violet-500"
          : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────
function ProgressBar({ progress, elapsed, total, onSeek }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[11px] tabular-nums text-neutral-400 w-7 text-right shrink-0">
        {elapsed}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={Math.round(progress)}
        onChange={(e) => onSeek(Number(e.target.value))}
        aria-label="Seek"
        className="flex-1 h-1 rounded-full accent-violet-500 cursor-pointer"
      />
      <span className="text-[11px] tabular-nums text-neutral-400 w-7 shrink-0">
        {total}
      </span>
    </div>
  );
}

// ─── PlayerBar ────────────────────────────────────────────────────
export default function PlayerBar({
  song,
  isPlaying,
  progress,
  elapsed,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  isLiked,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolume,
  onMute,
  onShuffle,
  onRepeat,
  onToggleLike,
  onClose
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!song) return null;

  const thumbnailUrl = song.music_thumbnail
    ? `${BASE_URL}/${song.music_thumbnail}`
    : null;

  return (
    <div
      role="region"
      aria-label="Music player"
      className={[
        "fixed bottom-0 inset-x-0 z-50",
        "pb-[env(safe-area-inset-bottom)]",
        "border-t",
        isDark
          ? "bg-neutral-900/95 border-neutral-800"
          : "bg-white/95 border-neutral-200",
        "backdrop-blur-xl shadow-2xl",
        "animate-slide-up",
      ].join(" ")}
    >
      <button
        onClick={onClose}
        aria-label="Close player"
        className={[
          "absolute top-2 right-3",
          "p-1 rounded-full transition-colors duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
          isDark
            ? "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800"
            : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100",
        ].join(" ")}
      >
        <X size={14} />
      </button>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-8 sm:py-3">
        {/* ── Progress bar (full width, always on top) ───────── */}
        <ProgressBar
          progress={progress}
          elapsed={elapsed}
          total={song.music_duration}
          onSeek={onSeek}
        />

        {/* ── Main controls row ──────────────────────────────── */}
        <div className="flex items-center gap-2 mt-2">
          {/* LEFT: Thumbnail + song info + like */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Thumbnail */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0 overflow-hidden bg-neutral-200 dark:bg-neutral-700">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={song.music_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-lg">
                  ♪
                </div>
              )}
            </div>

            {/* Title + description */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-[13px] font-semibold truncate leading-tight ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                {song.music_title}
              </p>
              <p className="text-[11px] text-neutral-400 truncate">
                {song.music_description}
              </p>
            </div>

            {/* Like button */}
            <button
              onClick={onToggleLike}
              aria-label={isLiked ? "Unlike" : "Like"}
              aria-pressed={isLiked}
              className={[
                "p-1.5 rounded-full shrink-0 transition-colors duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                isLiked
                  ? "text-pink-500"
                  : "text-neutral-300 dark:text-neutral-600 hover:text-pink-400",
              ].join(" ")}
            >
              <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* CENTER: Transport controls */}
          <div className="flex items-center gap-0 shrink-0">
            {/* Shuffle — hidden on xs */}
            <span className="hidden sm:inline-flex">
              <CtrlBtn onClick={onShuffle} label="Shuffle" active={isShuffle}>
                <Shuffle size={15} />
              </CtrlBtn>
            </span>

            <CtrlBtn onClick={onPrev} label="Previous">
              <SkipBack size={18} />
            </CtrlBtn>

            {/* Play / Pause */}
            <button
              onClick={onPlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
              className={[
                "w-10 h-10 sm:w-11 sm:h-11 rounded-full mx-1",
                "flex items-center justify-center shrink-0",
                "bg-violet-600 hover:bg-violet-700 active:scale-95",
                "text-white transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
              ].join(" ")}
            >
              {isPlaying ? (
                <Pause size={18} fill="white" />
              ) : (
                <Play size={18} fill="white" />
              )}
            </button>

            <CtrlBtn onClick={onNext} label="Next">
              <SkipForward size={18} />
            </CtrlBtn>

            {/* Repeat — hidden on xs */}
            <span className="hidden sm:inline-flex">
              <CtrlBtn onClick={onRepeat} label="Repeat" active={isRepeat}>
                <Repeat size={15} />
              </CtrlBtn>
            </span>
          </div>

          {/* RIGHT: Volume — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1.5 flex-1 justify-end">
            <button
              onClick={onMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-20 h-1 rounded-full accent-violet-500 cursor-pointer"
              style={{ opacity: isMuted ? 0.4 : 1, transition: "opacity 0.2s" }}
            />
          </div>
        </div>

        {/* ── Mobile-only: shuffle + repeat row ─────────────── */}
        <div className="flex sm:hidden items-center justify-center gap-6 mt-1.5">
          <CtrlBtn onClick={onShuffle} label="Shuffle" active={isShuffle}>
            <Shuffle size={14} />
          </CtrlBtn>
          <CtrlBtn onClick={onRepeat} label="Repeat" active={isRepeat}>
            <Repeat size={14} />
          </CtrlBtn>
          {/* Mobile volume mute toggle */}
          <button
            onClick={onMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors rounded-full focus:outline-none"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
