import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Clapperboard, CalendarDays, Sparkles } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const ShortCard = ({ video, index, hoveredIndex, setHoveredIndex, isDark, domains, onPress }) => {
    const isHovered = hoveredIndex === index;
    const domainName = domains.find((d) => d.domain_id === video.domain_id)?.domain_name ?? "General";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            whileTap={{ scale: 0.96 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={onPress}
            className="relative flex-shrink-0 cursor-pointer snap-start"
            style={{ width: "clamp(150px, 18vw, 220px)" }}
        >
            {/* Glow border on hover */}
            <div
                className="absolute inset-[-1px] rounded-[20px] pointer-events-none transition-opacity duration-300 z-0"
                style={{
                    background: "linear-gradient(135deg, rgba(244,63,94,0.6), rgba(251,146,60,0.4), transparent 60%)",
                    opacity: isHovered ? 1 : 0,
                }}
            />

            {/* Card inner */}
            <div className="relative rounded-[20px] overflow-hidden z-[1]" style={{ aspectRatio: "9/16" }}>
                {/* Thumbnail */}
                <img
                    src={`${BASE_URL}${video.video_thumbnail}`}
                    alt={video.video_title}
                    className="w-full h-full object-cover"
                    style={{
                        transform: isHovered ? "scale(1.08)" : "scale(1)",
                        transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                />

                {/* Vignette */}
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)" }}
                />

                {/* Top badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                        className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "0.1em" }}
                    >
                        Short
                    </span>
                </div>

                {/* Play button */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.7 }}
                    transition={{ duration: 0.25 }}
                >
                    <div
                        className="flex items-center justify-center rounded-full border border-white/40"
                        style={{
                            width: 52, height: 52,
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                        }}
                    >
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                </motion.div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                    <span
                        className="text-rose-400 uppercase block mb-1.5"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}
                    >
                        {domainName}
                    </span>
                    <h3
                        className="text-white line-clamp-2"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, lineHeight: 1.35 }}
                    >
                        {video.video_title}
                    </h3>
                    <div
                        className="mt-2 h-px bg-rose-500 origin-left"
                        style={{
                            transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                            transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                    />
                </div>
            </div>

            {/* Decorative index number */}
            <div
                className="absolute -bottom-3 -right-1 pointer-events-none select-none"
                style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "80px",
                    lineHeight: 1,
                    color: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
                    zIndex: -1,
                }}
            >
                {String(index + 1).padStart(2, "0")}
            </div>
        </motion.div>
    );
};

export default ShortCard;