import { Globe, Heart, SquarePen, Play, Trash2 } from "lucide-react";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG ?? '';

// ── Extract YouTube Video ID from any YouTube URL format ──────────────────────
const extractYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/))([^"&?\/\s]{11})/,
        /(?:youtu\.be\/)([^"&?\/\s]{11})/,
        /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

const DailyShortCard = ({ short, isPlaying, onPlayPause, onEdit, onDelete, isSubmitting, domains = [] }) => {
    const [imgError, setImgError] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const videoId = extractYouTubeId(short.video_file);

    const thumbnailUrl = (() => {
        const t = short.video_thumbnail || short.thumbnail;
        if (!t) return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
        if (t.startsWith('http')) return t;
        const clean = t.startsWith('/') ? t.slice(1) : t;
        return `${BASE_URL}/${clean}`.replace(/([^:]\/)\/+/g, '$1');
    })();

    const title = short.video_title || short.title || 'Untitled';
    const description = short.video_description || short.description || '';
    const domainName = short.category
        || domains.find(d => d.domain_id === short.domain_id)?.domain_name
        || null;



    return (
        <div
            className="group relative flex flex-col"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* ── Card Shell ── */}
            <div
                className="relative w-full rounded-2xl overflow-hidden cursor-pointer select-none bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50"
                style={{
                    aspectRatio: '9/16',
                    boxShadow: hovered
                        ? '0 20px 40px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.2)'
                        : '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onClick={() => onPlayPause(short.id)}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                {/* ── YouTube Embed Player (when playing) ── */}
                {isPlaying && videoId ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0 z-20 bg-black"
                    />
                ) : (
                    <>
                        {/* Thumbnail */}
                        {thumbnailUrl && !imgError ? (
                            <img
                                src={thumbnailUrl}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                    transition: 'transform 0.3s ease',
                                    transform: hovered ? 'scale(1.05)' : 'scale(1)',
                                }}
                                onError={() => setImgError(true)}
                                loading="lazy"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
                                <Clapperboard className="w-10 h-10 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-2">No preview</span>
                            </div>
                        )}

                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

                        {/* Trending badge */}
                        {short.is_trending && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/90 backdrop-blur-sm z-10">
                                <Flame className="w-3 h-3 text-white" />
                                <span className="text-[10px] text-white font-medium">Trending</span>
                            </div>
                        )}

                        {/* Duration */}
                        {short.duration && (
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-xs text-white font-medium z-10">
                                {short.duration}
                            </div>
                        )}

                        {/* Play button - shows on hover */}
                        <div
                            className="absolute inset-0 flex items-center justify-center z-10"
                            style={{
                                opacity: hovered ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                            }}
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/30">
                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </div>
                        </div>

                        {/* Bottom content with Edit/Delete buttons */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                            {/* Top row with like and actions */}
                            <div className="flex items-center justify-between mb-2">
                                {/* Like button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
                                >
                                    <Heart className="w-3 h-3 text-white" />
                                    {short.views && (
                                        <span className="text-xs text-white/90">{short.views}</span>
                                    )}
                                </button>

                                {/* Edit/Delete buttons - appear on hover opposite to domain */}
                                <div
                                    className="flex items-center gap-1 transition-opacity duration-200"
                                    style={{
                                        opacity: showActions ? 1 : 0,
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(short);
                                        }}
                                        className="p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-indigo-600 transition-colors"
                                        title="Edit"
                                    >
                                        <SquarePen className="w-3.5 h-3.5 text-white" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(short.id, title);
                                        }}
                                        disabled={isSubmitting}
                                        className="p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-rose-600 transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-2">
                                {title}
                            </h3>

                            {/* Domain pill - bottom left */}
                            {domainName && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-white font-medium bg-indigo-500/80 backdrop-blur-sm">
                                    <Globe className="w-2.5 h-2.5" />
                                    {domainName}
                                </span>
                            )}
                        </div>
                    </>
                )}

                {/* Close button when playing */}
                {isPlaying && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPlayPause(short.id); }}
                        className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 hover:bg-black/90 transition-colors flex items-center justify-center"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                )}
            </div>

            {/* ── Card Footer with Description ── */}
            {/* <div className="mt-2 px-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {description || 'No description'}
                </p>
            </div> */}
        </div>
    );
};

export default DailyShortCard;