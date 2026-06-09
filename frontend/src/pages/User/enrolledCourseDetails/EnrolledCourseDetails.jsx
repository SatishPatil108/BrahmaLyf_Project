import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  ListVideo,
  MessageSquare,
  X,
  Menu,
  Info,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Video,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart2,
  Wrench,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import useEnrolledCourseDetails from "./useEnrolledCourseDetails";
import { clearUserError } from "@/store/feature/user/userSlice";
import { useTheme } from "@/contexts/ThemeContext";
import FeedbackForm from "@/pages/User/FeedbackForm/FeedbackForm.jsx";
import { useYouTubeEmbedUrl } from "@/hooks/useYouTubeEmbedUrl";
import useUserProgressDetails from "./useUserProgressDetails";
import ProgressToolsForm from "./ProgressToolsForm";
import CourseInfoContent from "./CourseInfoContent";
import ProgressPracticeForm from "./ProgressPracticeForm";
import useUserToolsDetails from "./useUserToolsDetails";
import CustomDrawer from "@/components/CustomDrawer";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const sanitizeHTML = (html) => {
  if (!html) return "";
  return html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );
};

// ─── Design tokens (static — no dynamic Tailwind interpolation) ──────────────

const dk = {
  // backgrounds
  base: "bg-[#0a0a0f]",
  surface: "bg-[#111118]",
  raised: "bg-[#16161f]",
  hover: "hover:bg-[#1c1c28]",
  // text
  hi: "text-gray-50",
  mid: "text-gray-400",
  lo: "text-gray-600",
  // border
  line: "border-white/[0.07]",
  lineHi: "border-white/[0.12]",
};

const lk = {
  base: "bg-[#f5f5f7]",
  surface: "bg-white",
  raised: "bg-[#fafafa]",
  hover: "hover:bg-gray-50",
  hi: "text-gray-900",
  mid: "text-gray-500",
  lo: "text-gray-400",
  line: "border-gray-200/80",
  lineHi: "border-gray-300",
};

const useTokens = (theme) =>
  useMemo(() => (theme === "dark" ? dk : lk), [theme]);

// ─── Skeleton ────────────────────────────────────────────────────────────────

const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-lg bg-white/[0.05] dark:bg-white/[0.04] ${className}`}
  />
);

// ─── Module type configs (static classes only) ───────────────────────────────

const MODULE_CONFIGS = {
  Chapter: {
    accent: "text-blue-400",
    dot: "bg-blue-400",
    ring: "ring-blue-500/30",
    selBg: "bg-blue-500/10",
  },
  Section: {
    accent: "text-emerald-400",
    dot: "bg-emerald-400",
    ring: "ring-emerald-500/30",
    selBg: "bg-emerald-500/10",
  },
  Lesson: {
    accent: "text-violet-400",
    dot: "bg-violet-400",
    ring: "ring-violet-500/30",
    selBg: "bg-violet-500/10",
  },
};

// ─── ModuleItem ───────────────────────────────────────────────────────────────

const ModuleItem = React.memo(
  ({
    module,
    type,
    level = 0,
    hasChildren = false,
    isSelected,
    isExpanded,
    theme,
    onSelect,
    onToggleChapter,
  }) => {
    const cfg = MODULE_CONFIGS[type];
    const Icon =
      type === "Chapter"
        ? isExpanded
          ? FolderOpen
          : Folder
        : type === "Section"
          ? FileText
          : PlayCircle;

    const handleClick = useCallback(() => {
      if (type === "Chapter" && hasChildren) onToggleChapter(module.id);
      onSelect(module.id);
    }, [type, hasChildren, module.id, onToggleChapter, onSelect]);

    return (
      <div className={level > 0 ? "pl-4" : ""}>
        <button
          onClick={handleClick}
          aria-expanded={type === "Chapter" ? isExpanded : undefined}
          className={[
            "w-full text-left rounded-xl transition-all duration-200 group flex items-center gap-3",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
            "px-3 py-2.5",
            isSelected
              ? `${cfg.selBg} ring-1 ${cfg.ring}`
              : theme === "dark"
                ? "hover:bg-white/[0.05]"
                : "hover:bg-gray-100/80",
          ].join(" ")}
        >
          {/* Icon */}
          <div
            className={[
              "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
              isSelected
                ? theme === "dark"
                  ? "bg-white/10"
                  : "bg-white shadow-sm"
                : theme === "dark"
                  ? "bg-white/[0.05]"
                  : "bg-gray-100",
            ].join(" ")}
          >
            <Icon
              className={`w-3.5 h-3.5 ${isSelected ? cfg.accent : theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <span
              className={[
                "block text-sm font-medium truncate leading-tight",
                isSelected
                  ? cfg.accent
                  : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700",
              ].join(" ")}
            >
              {module.title}
            </span>
            {type === "Lesson" && (
              <span
                className={`block text-xs mt-0.5 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}
              >
                Lesson {module.lessonIndex || module.globalIndex}
                {module.duration ? ` · ${module.duration}` : ""}
              </span>
            )}
          </div>

          {/* Right indicators */}
          {type === "Chapter" && hasChildren && (
            <ChevronDown
              className={[
                "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                isExpanded ? "rotate-180" : "",
                theme === "dark" ? "text-gray-600" : "text-gray-400",
              ].join(" ")}
            />
          )}
          {type === "Lesson" && module.isCompleted && (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          )}
        </button>
      </div>
    );
  },
);
ModuleItem.displayName = "ModuleItem";

// ─── Progress bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ value = 0, theme }) => (
  <div
    className={`h-1 w-full rounded-full overflow-hidden ${theme === "dark" ? "bg-white/[0.07]" : "bg-gray-200"}`}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = React.memo(
  ({
    sidebarOpen,
    setSidebarOpen,
    groupedModules,
    selectedModuleId,
    handleModuleSelect,
    toggleChapter,
    expandedChapters,
    enrolledCourseDetails,
    totalModules,
    currentIndex,
    theme,
  }) => {
    const progress =
      totalModules > 0
        ? Math.round(((currentIndex + 1) / totalModules) * 100)
        : 0;

    return (
      <>
        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Panel */}
        <aside
          className={[
            "flex flex-col flex-shrink-0 w-72 xl:w-80",
            "lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start",
            // Mobile: slide-in drawer
            "fixed inset-y-0 left-0 z-50 lg:z-auto",
            "transition-transform duration-300 ease-out",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
            theme === "dark"
              ? "bg-[#111118] border-r border-white/[0.07] lg:border lg:rounded-2xl"
              : "bg-white border-r border-gray-200 lg:border lg:rounded-2xl shadow-sm",
          ].join(" ")}
        >
          {/* Header */}
          <div
            className={`px-4 pt-5 pb-4 border-b ${theme === "dark" ? "border-white/[0.06]" : "border-gray-100"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/15`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Course Content
                  </p>
                  <p
                    className={`text-sm font-semibold mt-0.5 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {totalModules} modules
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className={`lg:hidden p-1.5 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-white/[0.06] text-gray-500" : "hover:bg-gray-100 text-gray-500"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                >
                  Your progress
                </span>
                <span
                  className={`text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  {progress}%
                </span>
              </div>
              <ProgressBar value={progress} theme={theme} />
            </div>
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            {groupedModules.map((chapter) => {
              const hasChildren =
                chapter.sections.length > 0 || chapter.directLessons.length > 0;
              const isExpanded = expandedChapters.has(chapter.id);

              return (
                <div key={chapter.id}>
                  <ModuleItem
                    module={chapter}
                    type="Chapter"
                    level={0}
                    hasChildren={hasChildren}
                    isSelected={selectedModuleId === chapter.id}
                    isExpanded={isExpanded}
                    theme={theme}
                    onSelect={handleModuleSelect}
                    onToggleChapter={toggleChapter}
                  />

                  {isExpanded && (
                    <div className="mt-0.5 mb-1 space-y-0.5">
                      {chapter.sections.map((section) => (
                        <div key={section.id}>
                          <ModuleItem
                            module={section}
                            type="Section"
                            level={1}
                            isSelected={selectedModuleId === section.id}
                            theme={theme}
                            onSelect={handleModuleSelect}
                            onToggleChapter={toggleChapter}
                          />
                          {section.lessons.map((lesson) => (
                            <ModuleItem
                              key={lesson.id}
                              module={lesson}
                              type="Lesson"
                              level={2}
                              isSelected={selectedModuleId === lesson.id}
                              theme={theme}
                              onSelect={handleModuleSelect}
                              onToggleChapter={toggleChapter}
                            />
                          ))}
                        </div>
                      ))}
                      {chapter.directLessons.map((lesson) => (
                        <ModuleItem
                          key={lesson.id}
                          module={lesson}
                          type="Lesson"
                          level={1}
                          isSelected={selectedModuleId === lesson.id}
                          theme={theme}
                          onSelect={handleModuleSelect}
                          onToggleChapter={toggleChapter}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer meta */}
          <div
            className={`px-4 py-4 border-t ${theme === "dark" ? "border-white/[0.06]" : "border-gray-100"}`}
          >
            <div className="space-y-2">
              {[
                { icon: Clock, label: enrolledCourseDetails.duration },
                {
                  icon: Calendar,
                  label: `Enrolled ${formatDate(enrolledCourseDetails.created_on)}`,
                },
                { icon: ListVideo, label: `${totalModules} modules total` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon
                    className={`w-3.5 h-3.5 flex-shrink-0 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </>
    );
  },
);
Sidebar.displayName = "Sidebar";

// ─── VideoPlayer ──────────────────────────────────────────────────────────────

const VideoPlayer = React.memo(
  ({
    moduleDetails,
    currentIndex,
    totalModules,
    hasPrevModule,
    hasNextModule,
    goToPreviousModule,
    goToNextModule,
    theme,
  }) => {
    const { getYouTubeEmbedUrl } = useYouTubeEmbedUrl({
      fallbackUrl: "",
      addPlayerParams: false,
    });

    return (
      <div
        className={[
          "rounded-2xl overflow-hidden mb-5",
          theme === "dark"
            ? "bg-[#111118] border border-white/[0.07]"
            : "bg-white border border-gray-200 shadow-sm",
        ].join(" ")}
      >
        {/* Video */}
        <div className="relative aspect-video bg-black group">
          {moduleDetails.video_url ? (
            <iframe
              className="w-full h-full"
              src={getYouTubeEmbedUrl(moduleDetails.video_url)}
              title={moduleDetails.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-900 to-black">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-7 h-7 text-white/60 ml-1" />
              </div>
              <p className="text-sm text-white/40">No video available</p>
            </div>
          )}
        </div>

        {/* Meta bar */}
        <div className="px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Title + badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={[
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold",
                    theme === "dark"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-blue-50 text-blue-600 border border-blue-200/80",
                  ].join(" ")}
                >
                  <Layers className="w-3 h-3" />
                  {moduleDetails.header_type}
                </span>
                <span
                  className={`text-xs ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}
                >
                  {currentIndex + 1} / {totalModules}
                </span>
              </div>
              <h2
                className={`text-lg font-semibold leading-snug ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
              >
                {moduleDetails.title}
              </h2>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={goToPreviousModule}
                disabled={!hasPrevModule}
                aria-label="Previous module"
                className={[
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
                  hasPrevModule
                    ? theme === "dark"
                      ? "bg-white/[0.06] hover:bg-white/[0.1] text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : theme === "dark"
                      ? "bg-white/[0.03] text-gray-700 cursor-not-allowed"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed",
                ].join(" ")}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={goToNextModule}
                disabled={!hasNextModule}
                aria-label="Next module"
                className={[
                  "flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
                  hasNextModule
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : theme === "dark"
                      ? "bg-white/[0.03] text-gray-700 cursor-not-allowed"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed",
                ].join(" ")}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {moduleDetails.description && (
            <div
              className={`
               mt-4 pt-4 border-t text-sm leading-relaxed prose prose-sm max-w-none
               ${theme === "dark" ? "border-white/[0.06] text-gray-200 prose-invert" : "border-gray-100 text-gray-900"}
              `}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(moduleDetails.description),
              }}
            />
          )}
        </div>
      </div>
    );
  },
);
VideoPlayer.displayName = "VideoPlayer";

// ─── SectionCard ─────────────────────────────────────────────────────────────

const SectionCard = ({ icon: Icon, title, accent, children, theme }) => (
  <div
    className={[
      "rounded-2xl overflow-hidden mb-5",
      theme === "dark"
        ? "bg-[#111118] border border-white/[0.07]"
        : "bg-white border border-gray-200 shadow-sm",
    ].join(" ")}
  >
    <div
      className={`flex items-center gap-3 px-5 py-4 border-b ${theme === "dark" ? "border-white/[0.06]" : "border-gray-100"}`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent.iconBg}`}
      >
        <Icon className={`w-3.5 h-3.5 ${accent.iconColor}`} />
      </div>
      <h3
        className={`text-sm font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
      >
        {title}
      </h3>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────

const EmptyState = ({ theme, onOpenSidebar }) => (
  <div
    className={[
      "rounded-2xl p-12 text-center border",
      theme === "dark"
        ? "bg-[#111118] border-white/[0.07]"
        : "bg-white border-gray-200 shadow-sm",
    ].join(" ")}
  >
    <div
      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${theme === "dark" ? "bg-white/[0.05]" : "bg-gray-100"}`}
    >
      <BookOpen
        className={`w-6 h-6 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
      />
    </div>
    <h3
      className={`text-base font-semibold mb-1.5 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
    >
      Welcome to the Course
    </h3>
    <p
      className={`text-sm mb-6 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
    >
      Select a module from the course content panel to begin learning.
    </p>
    <button
      onClick={onOpenSidebar}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
    >
      Browse Modules
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);

// ─── ErrorState ───────────────────────────────────────────────────────────────

const ErrorState = ({ message, onRetry, theme }) => (
  <div
    className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#0a0a0f]" : "bg-gray-50"}`}
  >
    <div className="text-center max-w-sm px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2
        className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
      >
        Failed to load course
      </h2>
      <p
        className={`text-sm mb-6 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
      >
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const EnrolledCourseDetails = () => {
  const { courseId } = useParams();
  const userId = useSelector((state) => state.auth.user?.user_id);

  const {
    enrolledCourseDetails,
    moduleDetails,
    isLoading,
    error,
    selectedModuleId,
    setSelectedModuleId,
    currentIndex,
    totalModules,
    goToPreviousModule,
    goToNextModule,
    hasPrevModule,
    hasNextModule,
  } = useEnrolledCourseDetails(courseId, userId);

  const {
    weekData,
    isLoading: progressLoading,
    error: progressError,
  } = useUserProgressDetails(Number(courseId));

  const { toolData } = useUserToolsDetails(Number(courseId));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState(() => new Set());

  useEffect(() => {
    if (error?.message === "Authorization token is missing.") {
      dispatch(clearUserError());
      navigate("/login");
    }
  }, [error, dispatch, navigate]);

  const groupedModules = useMemo(() => {
    if (!enrolledCourseDetails?.modules) return [];
    const chapters = [];
    let currentChapter = null;
    let chapterIndex = 0;
    let globalLessonIndex = 0;

    enrolledCourseDetails.modules.forEach((module) => {
      if (module.header_type === "Chapter") {
        if (currentChapter) chapters.push(currentChapter);
        chapterIndex++;
        currentChapter = {
          ...module,
          chapterIndex,
          sections: [],
          directLessons: [],
          isExpanded: expandedChapters.has(module.id),
        };
      } else if (module.header_type === "Section" && currentChapter) {
        currentChapter.sections.push({ ...module, lessons: [] });
      } else if (module.header_type === "Lesson" && currentChapter) {
        globalLessonIndex++;
        const lastSection =
          currentChapter.sections[currentChapter.sections.length - 1];
        if (lastSection) {
          lastSection.lessons.push({
            ...module,
            lessonIndex: lastSection.lessons.length + 1,
            globalIndex: globalLessonIndex,
          });
        } else {
          currentChapter.directLessons.push({
            ...module,
            lessonIndex: currentChapter.directLessons.length + 1,
            globalIndex: globalLessonIndex,
          });
        }
      }
    });
    if (currentChapter) chapters.push(currentChapter);
    return chapters;
  }, [enrolledCourseDetails?.modules, expandedChapters]);

  const toggleChapter = useCallback((chapterId) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      next.has(chapterId) ? next.delete(chapterId) : next.add(chapterId);
      return next;
    });
  }, []);

  const handleModuleSelect = useCallback(
    (moduleId) => {
      setSelectedModuleId(moduleId);
      if (window.innerWidth < 1024) setSidebarOpen(false);
    },
    [setSelectedModuleId],
  );

  const handleProgressSubmitSuccess = useCallback(() => {}, []);
  const handleRetry = useCallback(() => window.location.reload(), []);

  if (error)
    return (
      <ErrorState message={error.message} onRetry={handleRetry} theme={theme} />
    );
  if (!enrolledCourseDetails)
    return (
      <EmptyState theme={theme} onOpenSidebar={() => setSidebarOpen(true)} />
    );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#0a0a0f]" : "bg-[#f5f5f7]"}`}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header
        className={[
          "sticky top-0 z-30 border-b backdrop-blur-xl",
          theme === "dark"
            ? "bg-[#0a0a0f]/90 border-white/[0.06]"
            : "bg-white/90 border-gray-200/80",
        ].join(" ")}
      >
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              className={[
                "lg:hidden p-2 rounded-lg transition-colors flex-shrink-0",
                theme === "dark"
                  ? "text-gray-400 hover:bg-white/[0.06]"
                  : "text-gray-500 hover:bg-gray-100",
              ].join(" ")}
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div className="min-w-0">
              <h1
                className={`text-sm sm:text-lg font-semibold truncate ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
              >
                {enrolledCourseDetails.course_name}
              </h1>
              <p
                className={`text-xs hidden sm:block ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}
              >
                Module {currentIndex + 1} of {totalModules}
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowInfo(true)}
              aria-label="Course information"
              className={[
                "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-colors",
                theme === "dark"
                  ? "bg-white/[0.06] hover:bg-white/[0.1] text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600",
              ].join(" ")}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Info</span>
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              aria-label="Leave feedback"
              className={[
                "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-colors",
                theme === "dark"
                  ? "bg-white/[0.06] hover:bg-white/[0.1] text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600",
              ].join(" ")}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Feedback</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-start gap-5">
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            groupedModules={groupedModules}
            selectedModuleId={selectedModuleId}
            handleModuleSelect={handleModuleSelect}
            toggleChapter={toggleChapter}
            expandedChapters={expandedChapters}
            enrolledCourseDetails={enrolledCourseDetails}
            totalModules={totalModules}
            currentIndex={currentIndex}
            theme={theme}
          />

          {/* Main */}
          <main className="flex-1 min-w-0">
            {moduleDetails && currentIndex !== -1 ? (
              <>
                <VideoPlayer
                  moduleDetails={moduleDetails}
                  currentIndex={currentIndex}
                  totalModules={totalModules}
                  hasPrevModule={hasPrevModule}
                  hasNextModule={hasNextModule}
                  goToPreviousModule={goToPreviousModule}
                  goToNextModule={goToNextModule}
                  theme={theme}
                />

                <SectionCard
                  icon={Sparkles}
                  title="Today's Practice"
                  theme={theme}
                  accent={{
                    iconBg: "bg-violet-500/10",
                    iconColor: "text-violet-400",
                  }}
                >
                  <ProgressPracticeForm
                    theme={theme}
                    courseId={Number(courseId)}
                    isLoading={progressLoading}
                    error={progressError}
                    weekData={weekData}
                    onSubmitSuccess={handleProgressSubmitSuccess}
                  />
                </SectionCard>

                <SectionCard
                  icon={Wrench}
                  title="Today's Tools"
                  theme={theme}
                  accent={{
                    iconBg: "bg-amber-500/10",
                    iconColor: "text-amber-400",
                  }}
                >
                  <ProgressToolsForm
                    theme={theme}
                    courseId={Number(courseId)}
                    isLoading={progressLoading}
                    error={progressError}
                    toolData={toolData}
                    onSubmitSuccess={handleProgressSubmitSuccess}
                  />
                </SectionCard>

                {/* Mobile: next module CTA */}
                <div
                  className={[
                    "lg:hidden flex items-center justify-between mt-2 p-4 rounded-2xl border",
                    theme === "dark"
                      ? "bg-[#111118] border-white/[0.07]"
                      : "bg-white border-gray-200 shadow-sm",
                  ].join(" ")}
                >
                  <div>
                    <p
                      className={`text-xs ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}
                    >
                      Up next
                    </p>
                    <p
                      className={`text-sm font-medium mt-0.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {hasNextModule
                        ? "Next module ready"
                        : "Course complete 🎉"}
                    </p>
                  </div>
                  <button
                    onClick={goToNextModule}
                    disabled={!hasNextModule}
                    className={[
                      "flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-medium transition-colors",
                      hasNextModule
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : theme === "dark"
                          ? "bg-white/[0.04] text-gray-700 cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed",
                    ].join(" ")}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <EmptyState
                theme={theme}
                onOpenSidebar={() => setSidebarOpen(true)}
              />
            )}
          </main>
        </div>
      </div>

      {/* ── SlideOvers ──────────────────────────────────────────────────── */}

      <CustomDrawer
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Course Information"
      >
        <CourseInfoContent
          enrolledCourseDetails={enrolledCourseDetails}
          textColor={{}}
          theme={theme}
        />
      </CustomDrawer>

      <CustomDrawer
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        title="Leave Feedback"
      >
        <FeedbackForm
          theme={theme}
          courseId={Number(courseId)}
          enrollmentId={enrolledCourseDetails?.enrollment_id}
          onSuccess={() => setShowFeedback(false)}
        />
      </CustomDrawer>
    </div>
  );
};

export default EnrolledCourseDetails;
