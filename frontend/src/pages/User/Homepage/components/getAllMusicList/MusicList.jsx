import React, { useRef, useState } from "react";
import {
    Play, Music, Headphones, Volume2, Clock,
    ChevronLeft, ChevronRight, LayoutGrid, Loader2, SlidersHorizontal, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicListPage } from "../../useHomepage";
import { useNavigate } from "react-router-dom";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";
import useDomainData from "@/pages/Admin/CourseList/useDomainData";
 
const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;
const ALL_ID = null;  

const MusicList = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [page, setPage] = useState(1);
    const [selectedDomainId, setSelectedDomainId] = useState(ALL_ID);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Domains for sidebar
    const { domainsDetails } = useDomainData();
    const domains = domainsDetails?.domains ?? [];

    // Pass domainId — when null the thunk sends no domain_id param → returns all
    const { loading, error, musicsDetails } = useMusicListPage(
        page,
        10,
        selectedDomainId  
    );

    const musics = musicsDetails?.musics ?? [];
    const currentPage = musicsDetails?.current_page ?? 1;
    const hasNextPage = musicsDetails?.has_next_page ?? false;
    const hasPrevPage = musicsDetails?.has_prev_page ?? false;
    const totalRecords = musicsDetails?.total_records ?? 0;

    // ── Helpers ──────────────────────────────────────────────────────────────

    const handleDomainSelect = (domainId) => {
        setSelectedDomainId(domainId);
        setPage(1);
        setMobileSidebarOpen(false);
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -340 : 340,
                behavior: "smooth",
            });
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) setPage((p) => p + 1);
    };

    const handlePrevPage = () => {
        if (hasPrevPage) setPage((p) => p - 1);
    };

    const activeDomainName =
        selectedDomainId === ALL_ID
            ? "All Tracks"
            : domains.find((d) => d.domain_id === selectedDomainId)?.domain_name ?? "Tracks";

    // ── Shared sidebar item styles ────────────────────────────────────────────

    const itemBase =
        "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3";

    const itemActive = isDark
        ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
        : "bg-purple-50 text-purple-700 border border-purple-200";

    const itemIdle = isDark
        ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

    const SidebarContent = () => (
        <>
            <p className={`text-xs font-semibold uppercase tracking-widest px-2 mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Filter by Domain
            </p>

            {/* All Tracks */}
            <button
                onClick={() => handleDomainSelect(ALL_ID)}
                className={`${itemBase} ${selectedDomainId === ALL_ID ? itemActive : itemIdle}`}
            >
                <LayoutGrid className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">All Tracks</span>
                {selectedDomainId === ALL_ID && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600"}`}>
                        {totalRecords}
                    </span>
                )}
            </button>

            <div className={`my-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`} />

            {/* Domain loading */}
            {domains.length === 0 && (
                <div className="flex items-center justify-center py-6">
                    <Loader2 className={`w-4 h-4 animate-spin ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                </div>
            )}

            {/* Domain items */}
            {domains.map((domain) => {
                const isActive = selectedDomainId === domain.domain_id;
                return (
                    <button
                        key={domain.domain_id}
                        onClick={() => handleDomainSelect(domain.domain_id)}
                        className={`${itemBase} ${isActive ? itemActive : itemIdle}`}
                    >
                        {domain.domain_thumbnail ? (
                            <img
                                src={`${BASE_URL}${domain.domain_thumbnail}`}
                                alt=""
                                className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className={`w-5 h-5 rounded-full flex-shrink-0 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                        )}
                        <span className="flex-1 truncate">{domain.domain_name}</span>
                        {isActive && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600"}`}>
                                {totalRecords}
                            </span>
                        )}
                    </button>
                );
            })}
        </>
    );

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <section className={`py-10 lg:py-20 ${isDark ? "text-white" : "text-gray-900"}`}>

            {/* Header */}
            <div className="flex flex-col items-center text-center px-4 mb-10">
                <div className={`p-2.5 rounded-xl mb-3 ${isDark
                    ? "bg-gradient-to-br from-purple-600 to-pink-600"
                    : "bg-gradient-to-br from-purple-500 to-pink-500"}`}>
                    <Headphones className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Meditation & Sounds
                    </span>
                </h2>
                <p className={`mt-3 text-base sm:text-lg max-w-xl ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Relax, focus, and meditate with our curated collection of soothing sounds
                </p>
            </div>

            {/* ── Body: sidebar + content ── */}
            <div className="px-4 sm:px-6 lg:px-8">

                {/* Mobile filter button */}
                <div className="flex items-center justify-between mb-4 lg:hidden">
                    <div>
                        <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{activeDomainName}</p>
                        {totalRecords > 0 && (
                            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                {totalRecords} track{totalRecords !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setMobileSidebarOpen(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                        {selectedDomainId !== ALL_ID && (
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                        )}
                    </button>
                </div>

                {/* Mobile sidebar drawer */}
                <AnimatePresence>
                    {mobileSidebarOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileSidebarOpen(false)}
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            />
                            {/* Drawer */}
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "tween", damping: 15, stiffness: 200 }}
                                className={`fixed inset-y-0 left-0 z-50 w-72 p-5 overflow-y-auto lg:hidden ${isDark ? "bg-gray-900" : "bg-white"}`}
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                                        Browse by Domain
                                    </h3>
                                    <button
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className={`p-1.5 rounded-lg ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <SidebarContent />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Desktop layout: sidebar + content side by side */}
                <div className="flex gap-6 items-start">

                    {/* Desktop sidebar */}
                    <aside className={`hidden lg:flex flex-col flex-shrink-0 w-56 rounded-2xl border backdrop-blur-sm p-3 sticky top-24 ${isDark
                        ? "bg-gray-900/80 border-gray-800"
                        : "bg-white/90 border-gray-200 shadow-sm"}`}>
                        <SidebarContent />
                    </aside>

                    {/* Main content — full width on mobile, flex-1 on desktop */}
                    <div className="flex-1 min-w-0 w-full">

                        {/* Section title + scroll arrows (desktop) */}
                        <div className="hidden lg:flex items-center justify-between mb-5">
                            <div>
                                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                                    {activeDomainName}
                                </h3>
                                {totalRecords > 0 && (
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                        {totalRecords} track{totalRecords !== 1 ? "s" : ""} • Page {currentPage}
                                    </p>
                                )}
                            </div>
                            {musics.length > 3 && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => scroll("left")} className={`p-2 rounded-full transition-all ${isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => scroll("right")} className={`p-2 rounded-full transition-all ${isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="animate-pulse flex gap-4 overflow-hidden">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`w-40 sm:w-48 flex-shrink-0 rounded-xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                                        <div className={`h-40 sm:h-48 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                                        <div className="p-3 space-y-2">
                                            <div className={`h-4 w-3/4 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                                            <div className={`h-3 w-1/2 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error */}
                        {error && !loading && (
                            <div className={`p-6 rounded-xl text-center border ${isDark ? "bg-red-900/20 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>
                                {error.message ?? "Failed to load music"}
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && !error && musics.length === 0 && (
                            <div className={`py-16 rounded-2xl text-center border-2 border-dashed ${isDark ? "bg-gray-800/40 border-gray-700 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                                <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-base font-medium">No tracks in this category</p>
                                <p className="text-sm mt-1 opacity-60">Try selecting a different domain</p>
                            </div>
                        )}

                        {/* Music cards */}
                        {!loading && !error && musics.length > 0 && (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${selectedDomainId ?? "all"}-${currentPage}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        ref={scrollRef}
                                        className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 sm:gap-6 pb-4"
                                    >
                                        {musics.map((music, index) => (
                                            <motion.div
                                                key={music.id}
                                                whileHover={{ scale: 1.00 }}
                                                whileTap={{ scale: 0.97 }}
                                                onMouseEnter={() => setHoveredIndex(index)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                                onClick={() => {
                                                    dispatch(clearUserError());
                                                    navigate(`/music/${music.id}`);
                                                }}
                                                className="flex flex-col items-center flex-shrink-0 w-36 sm:w-48 cursor-pointer"
                                            >
                                                {/* Circle thumbnail */}
                                                <div className={`relative w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-md ${isDark
                                                    ? "border-gray-700 hover:border-purple-500 hover:shadow-purple-500/20"
                                                    : "border-gray-200 hover:border-purple-300 hover:shadow-purple-300/30"}`}
                                                >
                                                    <img
                                                        src={`${BASE_URL}${music.music_thumbnail}`}
                                                        alt={music.music_title}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.src = `https://placehold.co/300x300/${isDark ? "374151" : "f3f4f6"}/9ca3af?text=${encodeURIComponent(music.music_title)}`;
                                                        }}
                                                    />
                                                    {/* Duration badge */}
                                                    <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 whitespace-nowrap ${isDark ? "bg-black/80 text-white" : "bg-white/95 text-gray-800"}`}>
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {music.music_duration}
                                                    </div>
                                                    {/* Play overlay */}
                                                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-opacity duration-300 ${hoveredIndex === index ? "opacity-100" : "opacity-0"}`}>
                                                        <div className={`p-3 rounded-full ${isDark ? "bg-purple-600" : "bg-purple-500"}`}>
                                                            <Play className="w-5 h-5 text-white" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Title + domain label */}
                                                <div className="mt-3 text-center w-full px-1">
                                                    <h3 className={`text-xs sm:text-sm font-semibold line-clamp-1 ${isDark ? "text-white" : "text-gray-800"}`}>
                                                        {music.music_title}
                                                    </h3>
                                                    <div className="flex items-center justify-center gap-1 mt-1">
                                                        <Volume2 className={`w-3 h-3 ${isDark ? "text-purple-400" : "text-purple-500"}`} />
                                                        <span className={`text-[10px] sm:text-xs truncate max-w-[90px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                                            {domains.find((d) => d.domain_id === music.domain_id)?.domain_name ?? "Meditation"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}

                        {/* Pagination */}
                        {(hasPrevPage || hasNextPage) && (
                            <div className="flex items-center justify-center gap-3 mt-8">
                                {hasPrevPage && (
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={loading}
                                        className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm font-semibold transition-all disabled:opacity-50 ${isDark
                                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Prev
                                    </button>
                                )}
                                <span className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                    Page {currentPage}
                                </span>
                                {hasNextPage && (
                                    <button
                                        onClick={handleNextPage}
                                        disabled={loading}
                                        className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm font-semibold transition-all disabled:opacity-50 ${isDark
                                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                                            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"}`}
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MusicList;