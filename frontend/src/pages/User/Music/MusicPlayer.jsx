import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import useHomepage, { useMusicListPage } from "../Homepage/useHomepage";
import { useTheme } from "@/contexts/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

/* ─────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────── */
const formatTime = (time) => {
  if (!time || isNaN(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

/* Animated waveform bars shown while playing */
const WaveformBars = ({ isPlaying, isDark }) => (
  <div aria-hidden="true" className="flex items-end gap-[3px] h-4">
    {[0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9].map((h, i) => (
      <span
        key={i}
        className={`w-[3px] rounded-full transition-all ${
          isDark ? "bg-violet-400" : "bg-violet-500"
        }`}
        style={{
          height: isPlaying ? `${h * 16}px` : "4px",
          animation: isPlaying
            ? `waveBar 0.8s ease-in-out ${i * 0.1}s infinite alternate`
            : "none",
          transition: "height 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    ))}
  </div>
);

/* Styled range slider via inline style — consistent cross-browser */
const RangeSlider = ({
  value,
  min = 0,
  max = 100,
  step = 0.1,
  onChange,
  accentHex,
  trackHex,
  ariaLabel,
  className = "",
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className={`appearance-none cursor-pointer rounded-full h-1.5 outline-none
        focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(139,92,246,0.5),0_2px_8px_rgba(0,0,0,0.25)]
        [&::-webkit-slider-thumb]:transition-transform
        [&::-webkit-slider-thumb]:hover:scale-125
        [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
        [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
        [&::-moz-range-thumb]:bg-white
        ${className}`}
      style={{
        background: `linear-gradient(to right, ${accentHex} ${pct}%, ${trackHex} ${pct}%)`,
      }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────── */
const MusicPlayer = () => {
  const { musicId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { musicsDetails } = useMusicListPage();
  const isDark = theme === "dark";

  const audioRef = useRef(null);
  const containerRef = useRef(null);

  const music = musicsDetails?.musics.find(
    (item) => item.id === Number(musicId),
  );

  /* ── State ─────────────────────────────────────────────── */
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [showDesc, setShowDesc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  /* ── Design tokens ────────────────────────────────────── */
  const accent = isDark ? "#a78bfa" : "#7c3aed";
  const trackBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";

  /* ── Audio setup ─────────────────────────────────────── */
  useEffect(() => {
    if (!music || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = `${BASE_URL}${music.music_file}`;
    audio.volume = volume;

    const onLoaded = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onTimeUpdate = () => {
      if (!isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadeddata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadeddata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [music]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* ── Playback controls ───────────────────────────────── */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const isAudioReady = () => {
    const audio = audioRef.current;
    return audio && isFinite(audio.duration) && audio.duration > 0;
  };

  const rewind = useCallback(() => {
    if (!isAudioReady()) return;
    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 10,
    );
  }, []);

  const forward = useCallback(() => {
    if (!isAudioReady()) return;
    audioRef.current.currentTime = Math.min(
      audioRef.current.duration,
      audioRef.current.currentTime + 10,
    );
  }, []);

  const handleProgressChange = (e) => {
    if (!isAudioReady()) return;
    const val = parseFloat(e.target.value);
    const newTime = (val / 100) * audioRef.current.duration;
    if (isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setProgress(val);
    }
  };

  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.7);
    }
  };

  /* ── Keyboard shortcuts ──────────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          rewind();
          break;
        case "ArrowRight":
          forward();
          break;
        case "Escape":
          navigate(-1);
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPlaying, volume, togglePlay, rewind, forward]);

  /* ── Not found ───────────────────────────────────────── */
  if (!music) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${
          isDark ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <div
          className={`flex flex-col items-center gap-5 p-10 rounded-3xl border text-center max-w-sm w-full ${
            isDark
              ? "bg-gray-900 border-white/8 text-white"
              : "bg-white border-gray-100 text-gray-900 shadow-xl shadow-gray-100"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isDark ? "bg-white/5" : "bg-violet-50"
            }`}
          >
            <SkipForward
              className={`w-7 h-7 ${isDark ? "text-violet-400" : "text-violet-500"}`}
            />
          </div>
          <div>
            <p
              className={`text-base font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Track not found
            </p>
            <p
              className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}
            >
              This track may have been removed or the link is invalid.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  const thumbnailSrc = `${BASE_URL}${music.music_thumbnail}`;

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
        @keyframes playerFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .player-card { animation: playerFadeUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .art-ring { transition: box-shadow 0.6s ease; }
        .art-ring.playing {
          box-shadow: 0 0 0 4px rgba(139,92,246,0.3), 0 32px 64px -16px rgba(139,92,246,0.5);
        }
      `}</style>

      {/* ── Full-page immersive container ─────────────────────── */}
      <div
        ref={containerRef}
        className={`relative min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden transition-colors duration-500 ${
          isDark ? "bg-gray-950" : "bg-slate-50"
        }`}
        tabIndex={-1}
      >
        {/* Ambient blurred album art background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {imgLoaded && (
            <img
              src={thumbnailSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-20 transition-opacity duration-1000"
              style={{ filter: "blur(80px) saturate(1.8)" }}
            />
          )}
          {/* Vignette overlay */}
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-950/90"
                : "bg-gradient-to-b from-slate-50/80 via-slate-50/60 to-slate-50/95"
            }`}
          />
        </div>

        {/* ── Player card ──────────────────────────────────────── */}
        <div
          className={`player-card relative z-10 w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden border ${
            isDark
              ? "bg-gray-900/70 border-white/8 backdrop-blur-2xl"
              : "bg-white/80 border-gray-200/60 backdrop-blur-2xl shadow-2xl shadow-violet-200/30"
          }`}
        >
          {/* Inner padding */}
          <div className="p-6 sm:p-8">
            {/* ── Header ─────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  isDark
                    ? "text-white/50 hover:text-white hover:bg-white/8"
                    : "text-gray-400 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <span
                className={`text-[11px] font-bold tracking-[0.18em] uppercase ${
                  isDark ? "text-white/25" : "text-gray-300"
                }`}
              >
                Now Playing
              </span>

              <div className="w-16" aria-hidden="true" />
            </div>

            {/* ── Album art ──────────────────────────────────── */}
            <div className="flex justify-center mb-8">
              <div
                className={`art-ring relative rounded-2xl overflow-hidden ${
                  isPlaying ? "playing" : ""
                }`}
                style={{ width: 220, height: 220 }}
              >
                {/* Skeleton */}
                {!imgLoaded && (
                  <div
                    className={`absolute inset-0 animate-pulse rounded-2xl ${
                      isDark ? "bg-white/5" : "bg-gray-100"
                    }`}
                  />
                )}
                <img
                  src={thumbnailSrc}
                  alt={music.music_title}
                  onLoad={() => {
                    setImgLoaded(true);
                    setIsLoading(false);
                  }}
                  onError={(e) => {
                    e.target.src = `https://placehold.co/440x440/${isDark ? "1e1b4b" : "f5f3ff"}/a78bfa?text=${encodeURIComponent(music.music_title?.[0] ?? "♪")}`;
                    setImgLoaded(true);
                  }}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  } ${isPlaying ? "scale-[1.03]" : "scale-100"}`}
                  style={{ transitionProperty: "opacity, transform" }}
                />
                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 pointer-events-none" />
              </div>
            </div>

            {/* ── Track info ─────────────────────────────────── */}
            <div className="mb-7">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2
                  className={`text-xl sm:text-2xl font-bold leading-snug tracking-tight flex-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {music.music_title}
                </h2>
                {/* Live waveform indicator */}
                <div className="flex-shrink-0 pt-1">
                  <WaveformBars isPlaying={isPlaying} isDark={isDark} />
                </div>
              </div>

              <p
                className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}
              >
                {music.music_artist || "Unknown Artist"}
              </p>

              {/* Description accordion */}
              {music.music_description && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowDesc((s) => !s)}
                    aria-expanded={showDesc}
                    className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-md ${
                      isDark
                        ? "text-violet-400 hover:text-violet-300"
                        : "text-violet-500 hover:text-violet-700"
                    }`}
                  >
                    About this track
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${showDesc ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    style={{
                      maxHeight: showDesc ? "200px" : "0px",
                      opacity: showDesc ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.35s ease, opacity 0.25s ease",
                    }}
                  >
                    <div
                      className={`mt-3 p-4 rounded-xl text-xs leading-relaxed ${
                        isDark
                          ? "bg-white/5 text-white/50"
                          : "bg-gray-50 text-gray-500"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: music.music_description,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Progress ────────────────────────────────────── */}
            <div className="mb-7">
              <RangeSlider
                value={progress}
                min={0}
                max={100}
                step={0.1}
                onChange={handleProgressChange}
                accentHex={accent}
                trackBg={trackBg}
                ariaLabel="Playback progress"
                className="w-full mb-3"
                trackHex={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
              />
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold tabular-nums ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  {formatTime(currentTime)}
                </span>
                <span
                  className={`text-[11px] font-semibold tabular-nums ${
                    isDark ? "text-white/25" : "text-gray-300"
                  }`}
                >
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* ── Playback controls ───────────────────────────── */}
            <div className="flex items-center justify-center gap-5 sm:gap-7 mb-7">
              {/* Rewind */}
              <button
                onClick={rewind}
                aria-label="Rewind 10 seconds"
                className={`group flex flex-col items-center gap-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl p-1 ${
                  isDark
                    ? "text-white/40 hover:text-white"
                    : "text-gray-300 hover:text-gray-700"
                }`}
              >
                <SkipBack className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold tracking-wider opacity-60">
                  10s
                </span>
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                disabled={isLoading}
                className={`
                  relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:scale-105 active:scale-95
                  bg-gradient-to-br from-violet-500 to-fuchsia-600
                  shadow-lg shadow-violet-500/40
                  ${isPlaying ? "hover:shadow-violet-500/50" : ""}
                `}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                ) : (
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1" />
                )}
                {/* Pulse ring when playing */}
                {isPlaying && (
                  <span className="absolute inset-0 rounded-full bg-violet-400/20 animate-ping" />
                )}
              </button>

              {/* Forward */}
              <button
                onClick={forward}
                aria-label="Forward 10 seconds"
                className={`group flex flex-col items-center gap-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl p-1 ${
                  isDark
                    ? "text-white/40 hover:text-white"
                    : "text-gray-300 hover:text-gray-700"
                }`}
              >
                <SkipForward className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold tracking-wider opacity-60">
                  10s
                </span>
              </button>
            </div>

            {/* ── Volume ─────────────────────────────────────── */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                aria-label={volume === 0 ? "Unmute" : "Mute"}
                className={`flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-1 ${
                  isDark
                    ? "text-white/30 hover:text-white/70"
                    : "text-gray-300 hover:text-gray-600"
                }`}
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <RangeSlider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                accentHex={accent}
                trackHex={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
                ariaLabel="Volume"
                className="flex-1"
              />

              <span
                className={`text-[11px] font-semibold tabular-nums w-8 text-right ${
                  isDark ? "text-white/25" : "text-gray-300"
                }`}
              >
                {Math.round(volume * 100)}
              </span>
            </div>
          </div>

          {/* ── Keyboard shortcuts footer ────────────────────── */}
          <div
            className={`hidden lg:flex items-center justify-center gap-4 px-8 py-4 border-t text-[11px] ${
              isDark
                ? "border-white/6 text-white/20"
                : "border-gray-100 text-gray-300"
            }`}
          >
            {[
              ["Space", "play/pause"],
              ["← →", "seek 10s"],
              ["M", "mute"],
              ["Esc", "back"],
            ].map(([key, label]) => (
              <span key={key} className="flex items-center gap-1.5">
                <kbd
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-mono text-[10px] leading-none border ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white/40"
                      : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}
                >
                  {key}
                </kbd>
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden audio */}
      <audio ref={audioRef} preload="metadata" />
    </>
  );
};

export default MusicPlayer;
