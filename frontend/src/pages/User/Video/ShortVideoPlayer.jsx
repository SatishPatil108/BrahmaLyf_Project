import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDailyShort } from "../Homepage/useHomepage";
import { ChevronLeft } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const ShortVideoPlayer = () => {
    const { shortVideoId } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { shortVideosDetails } = useDailyShort();

    const video = shortVideosDetails?.videos.find(
        (item) => item.id === Number(shortVideoId)
    );

    const [descExpanded, setDescExpanded] = useState(false);
    const isDark = theme === "dark";

    // Same themeColors pattern as About page
    const themeColors = {
        dark: {
            bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
            cardBg: "bg-gray-800/50 backdrop-blur-sm border border-gray-700",
            text: "text-gray-100",
            mutedText: "text-gray-400",
            accent: "from-purple-600 to-pink-500",
            accentText: "text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text",
        },
        light: {
            bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
            cardBg: "bg-white/70 backdrop-blur-sm border border-gray-200",
            text: "text-gray-900",
            mutedText: "text-gray-600",
            accent: "from-purple-500 to-pink-400",
            accentText: "text-transparent bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text",
        },
    };
    const colors = themeColors[theme] || themeColors.light;

    if (!video) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${colors.bg}`}>
                <div className={`p-6 rounded-2xl ${colors.cardBg} shadow-2xl text-center`}>
                    <p className={`text-base mb-3 ${colors.text}`}>Video not found...</p>
                    <button
                        onClick={() => navigate(-1)}
                        className={`px-5 py-2 rounded-xl bg-gradient-to-r ${colors.accent} text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-transform`}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${colors.bg}`}>

            <div className="p-6">
                <ChevronLeft onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className={`top-5 left-4 z-50 w-10 h-10 sm:w-11 sm:h-11
                                flex items-center justify-center rounded-full
                                ${isDark ? "text-white" : "text-black"} border border-gray-600
                                hover:scale-105 active:scale-90
                                transition-all duration-200 cursor-pointer`}
                />
            </div>


            {/* Page content */}
            <div className="max-w-lg mx-auto px-4 pt-20 sm:pt-24 pb-16 flex flex-col items-center">

                {/* Title — above video like About's h1 */}
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 ${colors.accentText}`}>
                    {video.video_title.charAt(0).toUpperCase() + video.video_title.slice(1)}
                </h1>

                {/* Video frame */}
                <div className="relative w-full sm:w-[85%] md:w-[75%]">

                    {/* Frame card — matches About's cardBg */}
                    <div
                        className={`relative z-10 w-full rounded-[22px] overflow-hidden
                                    ${colors.cardBg}`}
                        style={{ aspectRatio: "9/16", maxHeight: "68vh" }}
                    >
                        <iframe
                            className="w-full h-full border-0 block"
                            src={`${video.video_file}?autoplay=1&rel=0&modestbranding=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={video.video_title}
                        />
                    </div>
                </div>

                {/* Description — below video, same card style as About highlights */}
                {video.video_description && (
                    <div className={`w-full sm:w-[85%] md:w-[75%] mt-6 rounded-2xl ${colors.cardBg}  overflow-hidden`}>

                        {/* Toggle header */}
                        <button
                            onClick={() => setDescExpanded(!descExpanded)}
                            aria-expanded={descExpanded}
                            className={`w-full flex items-center justify-between px-5 py-4
                                        ${colors.text} font-semibold text-sm sm:text-base
                                        hover:opacity-80 transition-opacity duration-150
                                        bg-transparent border-0 cursor-pointer text-left`}
                        >
                            <span>Description</span>
                            <svg
                                width="14" height="14" viewBox="0 0 12 12" fill="none"
                                className={`transition-transform duration-300 flex-shrink-0
                                            ${descExpanded ? "rotate-180" : ""}
                                            ${isDark ? "text-purple-400" : "text-purple-500"}`}
                            >
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Expandable body */}
                        <div
                            className="overflow-hidden"
                            style={{
                                maxHeight: descExpanded ? "400px" : "0px",
                                opacity: descExpanded ? 1 : 0,
                                transition: "max-height 0.35s ease, opacity 0.3s ease",
                            }}
                        >
                            <p className={`px-5 pb-5 text-sm sm:text-base leading-relaxed ${colors.mutedText}`}>
                                {video.video_description}
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ShortVideoPlayer;