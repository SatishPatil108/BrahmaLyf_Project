import { useState, useRef, useEffect } from "react";
import { Play, X, Maximize2, Volume2, Pause } from "lucide-react";
import { useYouTubeEmbedUrl } from "@/hooks/useYouTubeEmbedUrl";

const VideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  title = "Video Player",
  autoPlay = false,
  showControls = true,
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

  const { getYouTubeEmbedUrl } = useYouTubeEmbedUrl({
    fallbackUrl: null,
    isPlaying: true,
    showControls: false,
    addPlayerParams: true, // important
  });

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) =>
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        );
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) =>
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        );
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Hide overlay after video starts playing
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => setShowOverlay(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(true);
    }
  }, [isPlaying]);

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {!isPlaying || !embedUrl ? (
        // Thumbnail View
        <div className="relative w-full h-full">
          <img
            src={`${BASE_URL}${thumbnailUrl}`}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
              e.target.className = "w-full h-full object-contain bg-gray-900";
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Play Button */}
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label="Play video"
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </div>
          </button>

          {/* Video Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-lg font-semibold drop-shadow-lg">
              {title}
            </h3>
            <p className="text-gray-300 text-sm mt-1">Click to play video</p>
          </div>
        </div>
      ) : (
        // Video View
        <>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            frameBorder="0"
          />

          {/* Video Overlay Controls */}
          {(showOverlay || isHovering) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
              {/* Top Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    aria-label="Close video"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-white font-medium text-lg drop-shadow-lg">
                    {title}
                  </h3>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>

              {/* Center Controls */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => {
                    // Toggle play/pause for YouTube iframe
                    if (iframeRef.current) {
                      iframeRef.current.contentWindow.postMessage(
                        '{"event":"command","func":"pauseVideo","args":""}',
                        "*"
                      );
                    }
                    setIsPlaying(false);
                  }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  aria-label="Pause video"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Pause className="w-8 h-8 text-white" />
                  </div>
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      YouTube
                    </span>
                  </div>

                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {isPlaying && !embedUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading video...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
