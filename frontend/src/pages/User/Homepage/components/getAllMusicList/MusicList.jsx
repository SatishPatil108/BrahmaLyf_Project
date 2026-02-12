import React, { useRef, useState } from "react";
import { Play, Music, Headphones, Volume2, ExternalLink, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useMusicListPage } from "../../useHomepage";
import { useNavigate } from "react-router-dom";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const MusicList = () => {
    const { theme } = useTheme();
    const [page, setPage] = useState(1);
    const { loading, error, musicsDetails, refetch } = useMusicListPage(page, 10);

    const musics = musicsDetails?.musics || [];
    const currentPage = musicsDetails?.current_page || 1;
    const hasNextPage = musicsDetails?.has_next_page || false;
    const hasPrevPage = musicsDetails?.has_prev_page || false;
    const totalRecords = musicsDetails?.total_records || 0;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 320; // Width of card + gap
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Load next page
    const handleNextPage = () => {
        if (hasNextPage) {
            const nextPage = currentPage + 1;
            setPage(nextPage);
            if (refetch) {
                refetch(nextPage);
            }
        }
    };

    // Load previous page
    const handlePrevPage = () => {
        if (hasPrevPage) {
            const prevPage = currentPage - 1;
            setPage(prevPage);
            if (refetch) {
                refetch(prevPage);
            }
        }
    };

    return (
        <div className={`py-8 lg:py-20`}>

            {/* Header Section */}
            <div className="flex flex-col items-center text-center">
                <div className={`p-2 rounded-lg ${theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}>
                    <Headphones className="w-5 h-5 text-white" />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Meditation & Sounds
                    </span>
                </h2>

                {totalRecords > 0 && (
                    <p
                        className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        {totalRecords} tracks total • Page {currentPage}
                    </p>
                )}
            </div>

            <div className="px-4 sm:px-6 lg:px-8 mb-8">
                <p className={`text-base sm:text-lg mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Relax, focus, and meditate with our curated collection of soothing sounds
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="flex gap-4 overflow-hidden">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`w-64 sm:w-72 flex-shrink-0 rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                    <div className={`h-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                    <div className="p-4">
                                        <div className={`h-5 w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-3`}></div>
                                        <div className={`h-4 w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className={`p-6 rounded-xl text-center ${theme === 'dark'
                        ? 'bg-red-900/20 border border-red-800'
                        : 'bg-red-50 border border-red-200'}`}>
                        <p className={`font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                            {error.message || 'Failed to load music'}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && musics.length === 0 && (
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className={`py-12 rounded-xl text-center ${theme === 'dark'
                        ? 'bg-gray-800/50 border border-gray-700'
                        : 'bg-gray-50 border border-gray-200'}`}>
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <Music className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`} />
                        </div>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            No music tracks available
                        </p>
                    </div>
                </div>
            )}

            {/* Music Cards - Single Row Horizontal Scroll */}
            {!loading && !error && musics.length > 0 && (
                <div className="relative mb-8">
                     
                    {/* Mobile Navigation */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 sm:hidden">
                        <button
                            onClick={() => scroll('right')}
                            className={`p-2 rounded-full shadow-lg ${theme === 'dark'
                                ? 'bg-gray-800 text-gray-300'
                                : 'bg-white text-gray-600'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 px-4 sm:px-6 lg:px-8 py-4"
                    >
                        {musics.map((music, index) => (
                            <motion.div
                                key={music.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                    dispatch(clearUserError());
                                    navigate(`/music/${music.id}`);
                                }}
                                className={`flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 w-64 sm:w-72 md:w-80 snap-start ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-700 hover:border-purple-500 hover:shadow-xl'
                                    : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-xl'
                                    }`}
                            >
                                {/* Image Container */}
                                <div className="relative h-48 sm:h-56 overflow-hidden">
                                    <img
                                        src={`${BASE_URL}${music.music_thumbnail}`}
                                        alt={music.music_title}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = `https://placehold.co/300x200/${theme === 'dark' ? '374151' : 'f3f4f6'
                                                }/9ca3af?text=${encodeURIComponent(music.music_title)}`;
                                        }}
                                    />

                                    {/* Duration Badge */}
                                    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark'
                                        ? 'bg-black/80 text-white'
                                        : 'bg-white/95 text-gray-800'
                                        }`}>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {music.music_duration}
                                        </div>
                                    </div>

                                    {/* Play Button Overlay */}
                                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : ''
                                        }`}>
                                        <div className={`p-4 sm:p-5 rounded-full ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500'}`}>
                                            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className={`text-base sm:text-lg font-bold line-clamp-2 ${theme === 'dark'
                                            ? 'text-white hover:text-purple-300'
                                            : 'text-gray-800 hover:text-purple-600'
                                            }`}>
                                            {music.music_title}
                                        </h3>
                                        <ExternalLink className={`w-4 h-4 sm:w-5 sm:h-5 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Volume2 className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Meditation Music
                                            </span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
                                            ? 'bg-purple-900/30 text-purple-300'
                                            : 'bg-purple-50 text-purple-600'
                                            }`}>
                                            Listen Now
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center justify-center gap-4">

                {/* ARROWS + PAGE BUTTONS → CENTERED */}
                <div className="flex items-center gap-4 justify-center">

                    {/* Horizontal Scroll Arrows (Desktop only) */}
                    {musics.length > 3 && (
                        <div className="hidden sm:flex items-center gap-10">
                            <button
                                onClick={() => scroll("left")}
                                className={`p-3 rounded-full transition-all ${theme === "dark"
                                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                            >
                                <ChevronLeft className="w-10 h-10" />
                            </button>

                            <button
                                onClick={() => scroll("right")}
                                className={`p-3 rounded-full transition-all ${theme === "dark"
                                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                            >
                                <ChevronRight className="w-10 h-10" />
                            </button>
                        </div>

                    )}

                    {/* PAGE NAVIGATION BUTTONS */}
                    <div className="flex items-center gap-2 justify-center">
                        {hasPrevPage && (
                            <button
                                onClick={handlePrevPage}
                                disabled={loading}
                                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${theme === "dark"
                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
                                    }`}
                            >
                                <ChevronLeft className="w-10 h-10" />
                                <span className="text-md font-bold">Prev</span>
                            </button>
                        )}

                        {hasNextPage && (
                            <button
                                onClick={handleNextPage}
                                disabled={loading}
                                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${theme === "dark"
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 disabled:opacity-50"
                                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-50"
                                    }`}
                            >
                                <span className="text-md font-bold">Next</span>
                                <ChevronRight className="w-10 h-10" />
                            </button>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default MusicList;