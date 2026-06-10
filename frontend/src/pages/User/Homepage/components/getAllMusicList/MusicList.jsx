import { Heart, HeartHandshake } from "lucide-react";
// ─── Waveform animation (pure CSS, no JS) ────────────────────────────────────
function Waveform() {
  return (
    <span className="flex items-end gap-[2px] h-4" aria-label="Now playing">
      {[0, 150, 80, 220].map((delay, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-white animate-waveform"
          style={{
            height: ["8px", "14px", "10px", "16px"][i],
            animationDelay: `${delay}ms`,
          }}
        />
      ))}
    </span>
  );
}

// ─── SongCard ─────────────────────────────────────────────────────────────────
function SongCard({
  song,
  isActive,
  isPlaying,
  isLiked,
  onPlay,
  onToggleLike,
  songIndex,
}) {
  const showPause = isActive && isPlaying;

  // Extract file extension for visual representation
  const getFileExtension = (filePath) => {
    if (!filePath) return "🎵";
    const ext = filePath.split(".").pop().toLowerCase();
    switch (ext) {
      case "mpeg":
      case "mp3":
        return "🎵";
      case "wav":
        return "🎶";
      default:
        return "🎼";
    }
  };

  // Format duration if needed (handles "1:30" format)
  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    return duration;
  };

  return (
    <article
      onClick={() => onPlay(songIndex)}
      className={`
        group relative rounded-4xl border bg-white dark:bg-neutral-900 p-3 cursor-pointer
        transition-all duration-150 ease-out
        hover:-translate-y-0.5 hover:shadow-md hover:shadow-neutral-200/60 dark:hover:shadow-neutral-900
        ${
          isActive
            ? "border-violet-400 dark:border-violet-500 ring-1 ring-violet-300 dark:ring-violet-600"
            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
        }
      `}
      aria-label={`${isActive ? (isPlaying ? "Pause" : "Resume") : "Play"} ${song.music_title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && onPlay(songIndex)
      }
    >
      {/* Album art / Thumbnail */}
      <div className="relative aspect-square rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mb-3 overflow-hidden flex items-center justify-center">
        {/* Display actual thumbnail if exists, otherwise emoji fallback */}
        {song.music_thumbnail ? (
          <img
            src={song.music_thumbnail}
            alt={song.music_title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-4xl select-none" role="img" aria-hidden="true">
            {getFileExtension(song.music_file)}
          </span>
        )}

        {/* Hover / active overlay */}
        <div
          className={`
            absolute inset-0 rounded-xl flex items-center justify-center
            bg-black/30 transition-opacity duration-150
            ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
          aria-hidden="true"
        >
          {isActive && isPlaying ? (
            <Waveform />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow-sm backdrop-blur-sm">
              {showPause ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-violet-700"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-violet-700 translate-x-0.5"
                >
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Domain/Status badge - using domain_id as tag */}
        {song.domain_id && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/90 text-violet-700 leading-none shadow-sm">
            {song.domain_id === 1 ? "🎵 Track" : `Domain ${song.domain_id}`}
          </span>
        )}
      </div>

      {/* Music Title */}
      <p className="text-[13px] font-medium text-neutral-900 dark:text-neutral-50 truncate leading-tight">
        {song.music_title}
      </p>

      {/* Description/Artist field - using music_description as fallback */}
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
        {song.music_description || "Instrumental"}
      </p>

      {/* Footer row with duration and like button */}
      <div className="flex items-center justify-between mt-2.5">
        <span className="text-[11px] text-neutral-300 dark:text-neutral-600 tabular-nums">
          {formatDuration(song.music_duration)}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(song.id);
          }}
          className={`
            p-1 rounded-full transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
            ${
              isLiked
                ? "text-pink-500"
                : "text-neutral-300 dark:text-neutral-600 hover:text-pink-400"
            }
          `}
          aria-label={
            isLiked ? `Unlike ${song.music_title}` : `Like ${song.music_title}`
          }
          aria-pressed={isLiked}
        >
          {isLiked ? <HeartHandshake size={14} /> : <Heart size={14} />}
        </button>
      </div>
    </article>
  );
}

// ─── SongGrid ─────────────────────────────────────────────────────────────────
export default function SongGrid({
  songs = [],
  currentIdx,
  isPlaying,
  likedSongs,
  onPlay,
  onToggleLike,
  allSongs = [],
}) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))" }}
    >
      {songs.map((song) => {
        const realIdx = allSongs.indexOf(song);
        return (
          <SongCard
            key={song.id}
            song={song}
            songIndex={realIdx}
            isActive={realIdx === currentIdx}
            isPlaying={isPlaying}
            isLiked={likedSongs.has(song.id)}
            onPlay={onPlay}
            onToggleLike={onToggleLike}
          />
        );
      })}
    </div>
  );
}
