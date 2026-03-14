import { Clock, Eye, Flame, Pause, Play, SquarePen, Trash2 } from "lucide-react";

const CATEGORY_COLORS = {
    Wellness:   { bg: "bg-emerald-50 dark:bg-emerald-900/30",   text: "text-emerald-700 dark:text-emerald-300",   dot: "bg-emerald-500" },
    Fitness:    { bg: "bg-orange-50 dark:bg-orange-900/30",     text: "text-orange-700 dark:text-orange-300",     dot: "bg-orange-500" },
    Philosophy: { bg: "bg-violet-50 dark:bg-violet-900/30",     text: "text-violet-700 dark:text-violet-300",     dot: "bg-violet-500" },
    Mindset:    { bg: "bg-sky-50 dark:bg-sky-900/30",           text: "text-sky-700 dark:text-sky-300",           dot: "bg-sky-500" },
};

const StatBadge = ({ icon: Icon, value, className = "" }) => (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold ${className}`}>
        <Icon className="w-2.5 h-2.5" />
        {value}
    </div>
);



const ShortCard = ({ short, isPlaying, onPlayPause, onEdit, onDelete, isSubmitting }) => {
    const cat = CATEGORY_COLORS[short.category] ?? CATEGORY_COLORS.Mindset;

    return (
        <div className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

            {/* Vertical thumbnail — 9:16 ratio feel with aspect-[9/14] */}
            <div className="relative aspect-[9/14] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Top row — category + trending badge */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cat.bg} ${cat.text} border border-white/10`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${cat.dot}`} />
                        {short.category}
                    </span>
                    {short.is_trending && (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-400/90 backdrop-blur-sm text-[10px] font-bold text-amber-900">
                            <Flame className="w-2.5 h-2.5" />
                            Hot
                        </div>
                    )}
                </div>

                {/* Bottom row — duration + views */}
                <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                    <div className="flex gap-1">
                        <StatBadge icon={Clock} value={short.duration} />
                        <StatBadge icon={Eye} value={short.views} />
                    </div>

                    {/* Play / Pause button */}
                    <button
                        onClick={() => onPlayPause(short.video_file)}
                        className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 hover:bg-white/35 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-lg"
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4 text-white" />
                        ) : (
                            <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                    </button>
                </div>

                {/* Vertical "SHORTS" label — subtle watermark */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-3 rotate-90 text-[8px] font-black tracking-[0.3em] text-white/20 uppercase pointer-events-none select-none">
                    SHORTS
                </div>
            </div>

            {/* Card body */}
            <div className="p-2.5">
                <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 flex-1">
                        {short.title}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={() => onEdit(short)}
                            className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                            title="Edit short"
                        >
                            <SquarePen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        </button>
                        <button
                            onClick={() => onDelete(short.id, short.title)}
                            disabled={isSubmitting}
                            className="p-1 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                            title="Delete short"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        </button>
                    </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {short.description}
                </p>

                {/* Now-playing indicator */}
                {isPlaying && (
                    <div className="mt-2 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-shrink-0">
                                <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                                </span>
                            </div>
                            {/* Animated bars */}
                            <div className="flex items-end gap-0.5 h-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse"
                                        style={{
                                            height: `${[8, 12, 6, 10][i - 1]}px`,
                                            animationDelay: `${(i - 1) * 120}ms`,
                                            animationDuration: '0.8s',
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Now playing</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShortCard;