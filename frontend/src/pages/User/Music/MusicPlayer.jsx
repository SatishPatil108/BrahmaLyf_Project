import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronDown, X } from "lucide-react";
import useHomepage, { useMusicListPage } from "../Homepage/useHomepage";
import { useTheme } from "@/contexts/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const MusicPlayer = () => {
  const { musicId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { musicsDetails } = useMusicListPage();
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);

  const music = musicsDetails?.musics.find(item => item.id === Number(musicId));

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showDesc, setShowDesc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Theme colors
  const themeColors = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      cardBg: "bg-gray-800/80 backdrop-blur-sm border border-gray-700",
      text: "text-gray-100",
      mutedText: "text-gray-400",
      accent: "from-purple-600 to-pink-500",
      accentText: "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
      iconColor: "text-purple-400",
      controlBg: "bg-gray-700/60 hover:bg-gray-700",
      progressBg: "bg-gray-700",
      sliderBg: "bg-gray-600",
      shadow: "shadow-2xl shadow-black/30",
      accentColor: "#9333ea"
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
      cardBg: "bg-white/90 backdrop-blur-sm border border-gray-200",
      text: "text-gray-900",
      mutedText: "text-gray-600",
      accent: "from-purple-500 to-pink-400",
      accentText: "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
      iconColor: "text-purple-600",
      controlBg: "bg-gray-100/80 hover:bg-gray-200",
      progressBg: "bg-gray-200",
      sliderBg: "bg-gray-300",
      shadow: "shadow-2xl shadow-gray-300/50",
      accentColor: "#8b5cf6"
    }
  };

  const colors = themeColors[theme] || themeColors.light;

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize audio once
  useEffect(() => {
    if (!music || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = `${BASE_URL}${music.music_file}`;
    audio.volume = volume;

    const handleLoadedData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [music]);

  // Update volume without re-initializing audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => {
        console.error("Error playing audio:", e);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const rewind = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const forward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      audioRef.current.duration,
      audioRef.current.currentTime + 10
    );
  };

  const handleProgressChange = (e) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(newProgress);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!containerRef.current) return;

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
          setVolume(volume === 0 ? 0.7 : 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, volume]);

  if (!music) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.bg}`}>
        <div className={`p-8 rounded-2xl ${colors.cardBg} ${colors.shadow}`}>
          <p className={`text-lg ${colors.text}`}>Music not found...</p>
          <button
            onClick={() => navigate(-1)}
            className={`mt-4 px-6 py-2 rounded-lg bg-gradient-to-r ${colors.accent} text-white font-medium hover:scale-105 transition-transform`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${colors.bg}`}
      tabIndex={0}
    >
      <div
        className={`w-full max-w-lg md:max-w-2xl rounded-3xl p-6 md:p-8 ${colors.cardBg} ${colors.shadow} animate-fadeIn`}
      >
        {/* Back Button & Title */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`p-2.5 rounded-full ${colors.controlBg} transition-all hover:scale-105 active:scale-95`}
            aria-label="Go back"
          >
            <X className={`w-5 h-5 md:w-6 md:h-6 ${colors.iconColor}`} />
          </button>
          <h1 className={colors.accentText + " text-xl md:text-2xl font-bold"}>
            Now Playing
          </h1>
          <div className="w-10 md:w-12" />
        </div>

        {/* Album Art */}
        <div className="relative mb-8">
          <div
            className={`w-56 h-56 md:w-72 md:h-72 mx-auto rounded-2xl overflow-hidden shadow-xl ${
              isPlaying ? "animate-pulse-slow" : ""
            }`}
          >
            <img
              src={`${BASE_URL}${music.music_thumbnail}`}
              alt={music.music_title}
              className="w-full h-full object-cover"
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div
                className={`absolute inset-0 animate-pulse ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            )}
          </div>

          {/* Playing Indicator */}
          {isPlaying && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium animate-bounce shadow-lg">
              ● LIVE
            </div>
          )}
        </div>

        {/* Music Info */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${colors.text}`}>
            {music.music_title}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.accent}`}
            />
            <p className={`text-sm ${colors.mutedText}`}>
              {music.music_artist || "Unknown Artist"}
            </p>
          </div>

          {/* Description Toggle */}
          <button
            onClick={() => setShowDesc(!showDesc)}
            className={`flex items-center justify-center gap-2 mx-auto mb-4 px-4 py-2 rounded-lg ${
              showDesc ? colors.controlBg : ""
            } transition-all`}
            aria-label={showDesc ? "Hide description" : "Show description"}
          >
            <span className={`text-sm ${colors.text}`}>Description</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                showDesc ? "rotate-180" : ""
              } ${colors.iconColor}`}
            />
          </button>

          {/* Description */}
          {showDesc && (
            <div
              className={`p-4 rounded-xl ${colors.progressBg} animate-slideDown mb-6`}
            >
              <p className={`text-sm leading-relaxed ${colors.mutedText}`}>
                {music.music_description || "No description available."}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className={`font-medium ${colors.text}`}>
              {formatTime(currentTime)}
            </span>
            <span className={colors.mutedText}>{formatTime(duration)}</span>
          </div>
          <input
            ref={progressBarRef}
            type="range"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-lg"
            style={{
              background: `linear-gradient(to right, ${colors.accentColor} ${progress}%, ${
                theme === "dark" ? "#374151" : "#e5e7eb"
              } ${progress}%)`
            }}
            aria-label="Progress"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6">
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-6 md:gap-8">
            <button
              onClick={rewind}
              className={`p-4 md:p-5 rounded-full ${colors.controlBg} transition-all hover:scale-110 active:scale-95 shadow-md`}
              aria-label="Rewind 10 seconds"
            >
              <SkipBack className={`w-5 h-5 md:w-6 md:h-6 ${colors.iconColor}`} />
            </button>

            <button
              onClick={togglePlay}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${colors.accent} text-white`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 md:w-10 md:h-10" />
              ) : (
                <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />
              )}
            </button>

            <button
              onClick={forward}
              className={`p-4 md:p-5 rounded-full ${colors.controlBg} transition-all hover:scale-110 active:scale-95 shadow-md`}
              aria-label="Forward 10 seconds"
            >
              <SkipForward className={`w-5 h-5 md:w-6 md:h-6 ${colors.iconColor}`} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-center gap-4">
            <Volume2 className={`w-5 h-5 md:w-6 md:h-6 ${colors.iconColor}`} />
            <input
              ref={volumeBarRef}
              type="range"
              value={volume}
              min="0"
              max="1"
              step="0.01"
              onChange={handleVolumeChange}
              className="w-40 md:w-48 h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-lg"
              style={{
                background: `linear-gradient(to right, ${colors.accentColor} ${volume * 100}%, ${
                  theme === "dark" ? "#374151" : "#e5e7eb"
                } ${volume * 100}%)`
              }}
              aria-label="Volume"
            />
            <span className={`text-sm font-medium ${colors.text} min-w-10`}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint - Desktop Only */}
        <div
          className={`hidden lg:block mt-10 pt-6 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <p className={`text-xs text-center ${colors.mutedText}`}>
            Press{" "}
            <kbd
              className={`px-2 py-1 mx-1 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } ${colors.text}`}
            >
              Space
            </kbd>{" "}
            to play/pause •{" "}
            <kbd
              className={`px-2 py-1 mx-1 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } ${colors.text}`}
            >
              ← →
            </kbd>{" "}
            to seek •{" "}
            <kbd
              className={`px-2 py-1 mx-1 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } ${colors.text}`}
            >
              M
            </kbd>{" "}
            to mute •{" "}
            <kbd
              className={`px-2 py-1 mx-1 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } ${colors.text}`}
            >
              Esc
            </kbd>{" "}
            to go back
          </p>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} preload="metadata" />
      </div>
    </div>
  );
};

export default MusicPlayer;