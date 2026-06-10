import { useState, useEffect, useRef, useCallback } from "react";
import SongGrid from "./MusicList";
import PlayerBar from "@/pages/User/Music/PlayerBar";
import { useMusicListPage } from "../../useHomepage";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

export default function MusicDetails() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ─── Playback State ───────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // ─── UI State ─────────────────────────────────────────────────────
  const [likedSongs, setLikedSongs] = useState(new Set());

  // ─── Pagination ───────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const { loading, error, musicsDetails } = useMusicListPage(page, 8, null);

  const songs = musicsDetails?.musics || [];
  const currentPage = musicsDetails?.current_page ?? 1;
  const hasNextPage = musicsDetails?.has_next_page ?? false;
  const hasPrevPage = musicsDetails?.has_prev_page ?? false;
  const totalRecords = musicsDetails?.total_records ?? 0;

  // ─── Refs ─────────────────────────────────────────────────────────
  const audioRef = useRef(new Audio());

  // Always holds latest state — safe to read inside async callbacks
  const stateRef = useRef({});
  stateRef.current = { currentIdx, isPlaying, isShuffle, isRepeat, progress };

  // ─── Derived ──────────────────────────────────────────────────────
  const currentSong = currentIdx >= 0 ? songs[currentIdx] : null;

  // ─── Duration helpers ─────────────────────────────────────────────
  const parseDuration = (d) => {
    if (!d || !d.includes(":")) return 0;
    const [m, s] = d.split(":").map(Number);
    return m * 60 + s;
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  // ─── Next / Prev index ────────────────────────────────────────────
  const getNextIdx = useCallback(
    (dir) => {
      const { currentIdx: idx, isShuffle: shuffle } = stateRef.current;
      if (shuffle) {
        let r;
        do {
          r = Math.floor(Math.random() * songs.length);
        } while (r === idx && songs.length > 1);
        return r;
      }
      const n = idx + dir;
      if (n < 0) return songs.length - 1;
      if (n >= songs.length) return 0;
      return n;
    },
    [songs],
  );

  // ─── Core: select a song by index ────────────────────────────────
  const playSong = useCallback((idx) => {
    setCurrentIdx(idx);
    setIsPlaying(true);
    setProgress(0);
  }, []);

  // ─── Load + play audio when song changes ─────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    const song = songs[currentIdx];
    if (!song?.music_file) return;

    audio.pause();
    audio.src = "";
    audio.src = `${BASE_URL}${song.music_file}`;
    audio.volume = isMuted ? 0 : volume / 100;
    audio.load();

    const onCanPlay = () => {
      if (stateRef.current.isPlaying) {
        audio.play().catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
      }
    };

    audio.addEventListener("canplay", onCanPlay, { once: true });

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [currentIdx, songs]); 

  // ─── Sync play / pause ────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      if (audio.readyState >= 2) {
        audio.play().catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
      }
    } else {
      if (!audio.paused) audio.pause();
    }
  }, [isPlaying]); 

  // ─── Sync volume / mute ───────────────────────────────────────────
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // ─── Track progress + handle song end ────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnded = () => {
      const { isRepeat, currentIdx } = stateRef.current;
      if (isRepeat) {
        playSong(currentIdx);
      } else {
        playSong(getNextIdx(1));
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [getNextIdx, playSong]);

  // ─── Controls ─────────────────────────────────────────────────────
  const handlePlayPause = () => {
    if (currentIdx === -1) return;
    setIsPlaying((p) => !p);
  };

  const handleNext = () => {
    if (currentIdx === -1) return;
    playSong(getNextIdx(1));
  };

  const handlePrev = () => {
    if (currentIdx === -1) return;
    if (stateRef.current.progress > 10) {
      // More than 10% through → restart current song
      audioRef.current.currentTime = 0;
      setProgress(0);
    } else {
      playSong(getNextIdx(-1));
    }
  };

  const handleSeek = (val) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (val / 100) * audio.duration;
    }
    setProgress(val);
  };

  const handleToggleLike = (id) => {
    setLikedSongs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleClose = () => {
    audioRef.current.pause();
    audioRef.current.src = "";
    setCurrentIdx(-1);
    setIsPlaying(false);
    setProgress(0);
  };

  // ─── Elapsed time ─────────────────────────────────────────────────
  const elapsed = formatTime(
    (progress / 100) * (audioRef.current.duration || 0),
  );

  return (
    <div
      className={`min-h-screen ${isDark ? "text-white" : "text-gray-900"} font-sans`}
    >
      <div className="relative z-10 pt-14 pb-8 px-5 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="syne text-xs font-bold uppercase tracking-[0.2em] text-purple-500">
                  Music Library
                </span>
              </div>
              {totalRecords > 0 && (
                <p
                  className={`text-xs font-medium ${isDark ? "text-white/30" : "text-black/35"}`}
                >
                  {totalRecords} tracks · Page {currentPage}
                </p>
              )}
            </div>

            {songs.length > 3 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrevPage}
                  aria-label="Previous page"
                  className={`group w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none disabled:opacity-30 ${
                    isDark
                      ? "border-white/10 text-white/30 hover:border-white/30 hover:text-white hover:bg-white/5"
                      : "border-black/10 text-black/30 hover:border-black/25 hover:text-black hover:bg-black/5"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNextPage}
                  aria-label="Next page"
                  className="group w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none bg-purple-500 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="px-5 pt-1 mx-0 lg:mx-8">
        <p
          className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"} tracking-widest uppercase mb-3`}
        >
          Trending now
        </p>
        <SongGrid
          songs={songs}
          currentIdx={currentIdx}
          isPlaying={isPlaying}
          likedSongs={likedSongs}
          onPlay={playSong}
          onToggleLike={handleToggleLike}
          allSongs={songs}
        />
      </main>

      {currentSong && (
        <PlayerBar
          song={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          elapsed={elapsed}
          volume={volume}
          isMuted={isMuted}
          isShuffle={isShuffle}
          isRepeat={isRepeat}
          isLiked={likedSongs.has(currentSong.id)}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={handleSeek}
          onVolume={setVolume}
          onMute={() => setIsMuted((m) => !m)}
          onShuffle={() => setIsShuffle((s) => !s)}
          onRepeat={() => setIsRepeat((r) => !r)}
          onToggleLike={() => handleToggleLike(currentSong.id)}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
