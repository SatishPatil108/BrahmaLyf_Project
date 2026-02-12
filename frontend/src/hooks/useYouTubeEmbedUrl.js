import { useCallback } from "react";

export const useYouTubeEmbedUrl = ({
  fallbackUrl = null,
  isPlaying = false,
  showControls = true,
  addPlayerParams = false, // only for version-1
} = {}) => {
  const getYouTubeEmbedUrl = useCallback(
    (url) => {
      if (!url || typeof url !== "string") return fallbackUrl;

      try {
        const parsedUrl = new URL(url);
        let videoId = "";

        // Extract video id from all formats
        if (parsedUrl.searchParams.has("v")) {
          videoId = parsedUrl.searchParams.get("v");
        } else if (parsedUrl.hostname.includes("youtu.be")) {
          videoId = parsedUrl.pathname.slice(1);
        } else if (parsedUrl.pathname.startsWith("/shorts/")) {
          videoId = parsedUrl.pathname.split("/shorts/")[1];
        } else if (parsedUrl.pathname.startsWith("/embed/")) {
          videoId = parsedUrl.pathname.split("/embed/")[1];
        }

        // Clean
        videoId = videoId.split("?")[0].split("&")[0];

        if (!videoId) return fallbackUrl ?? url;

        const embed = `https://www.youtube.com/embed/${videoId}`;

        // Version 1 – Add player params
        if (addPlayerParams) {
          const params = new URLSearchParams({
            enablejsapi: "1",
            autoplay: isPlaying ? "1" : "0",
            rel: "0",
            modestbranding: "1",
            showinfo: "0",
            controls: showControls ? "1" : "0",
          });

          return `${embed}?${params}`;
        }

        // Version 2 & 3 – simple embed
        return embed;
      } catch {
        return fallbackUrl ?? url;
      }
    },
    [fallbackUrl, addPlayerParams, isPlaying, showControls]
  );

  return { getYouTubeEmbedUrl };
};