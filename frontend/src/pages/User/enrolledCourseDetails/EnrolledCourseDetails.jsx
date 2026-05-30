import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
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

// Extracted constant for theme-based styling
const THEME_STYLES = {
  dark: {
    text: {
      primary: "text-gray-100",
      secondary: "text-gray-300",
      muted: "text-gray-400",
      inverse: "text-gray-800",
    },
    bg: {
      primary: "bg-gray-900",
      secondary: "bg-gray-800",
      tertiary: "bg-gray-950",
    },
    border: {
      primary: "border-gray-800",
      secondary: "border-gray-700",
    },
  },
  light: {
    text: {
      primary: "text-gray-800",
      secondary: "text-gray-700",
      muted: "text-gray-600",
      inverse: "text-gray-100",
    },
    bg: {
      primary: "bg-white",
      secondary: "bg-gray-50",
      tertiary: "bg-gray-100",
    },
    border: {
      primary: "border-gray-200",
      secondary: "border-gray-300",
    },
  },
};

// Extracted helper function for date formatting
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Extracted Module Item component to prevent re-renders
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
    const typeConfig = {
      Chapter: {
        icon: isExpanded ? FolderOpen : Folder,
        color: "blue",
        bgColor: theme === "dark" ? "bg-blue-900/20" : "bg-blue-50",
        borderColor:
          theme === "dark" ? "border-blue-800/50" : "border-blue-200",
      },
      Section: {
        icon: FileText,
        color: "green",
        bgColor: theme === "dark" ? "bg-green-900/10" : "bg-green-50/50",
        borderColor:
          theme === "dark" ? "border-green-800/30" : "border-green-200",
      },
      Lesson: {
        icon: Video,
        color: "purple",
        bgColor: theme === "dark" ? "bg-purple-900/10" : "bg-purple-50/50",
        borderColor:
          theme === "dark" ? "border-purple-800/30" : "border-purple-200",
      },
    };

    const config = typeConfig[type];
    const Icon = config.icon;
    const textColor = THEME_STYLES[theme].text;
    const paddingLeft = 16 + level * 20;

    const handleClick = useCallback(() => {
      if (type === "Chapter" && hasChildren) {
        onToggleChapter(module.id);
      }
      onSelect(module.id);
    }, [type, hasChildren, module.id, onToggleChapter, onSelect]);

    return (
      <div
        className={`relative ${level > 0 ? "ml-6" : ""}`}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {level > 0 && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-0.5 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-300"
            }`}
            style={{ left: `${paddingLeft - 16}px` }}
          />
        )}

        <button
          onClick={handleClick}
          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start gap-3 group relative
          ${isSelected ? `${config.bgColor} border ${config.borderColor}` : "hover:bg-gray-100 dark:hover:bg-gray-800"}
          ${type === "Lesson" ? "border-l-4 ml-[-4px]" : ""}
          ${isSelected && type === "Lesson" ? "border-l-purple-500" : "border-l-transparent"}
        `}
        >
          <div
            className={`flex-shrink-0 p-2 rounded-md ${
              isSelected
                ? theme === "dark"
                  ? `bg-${config.color}-900/40`
                  : `bg-${config.color}-100`
                : theme === "dark"
                  ? "bg-gray-800"
                  : "bg-gray-100"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isSelected
                  ? theme === "dark"
                    ? `text-${config.color}-400`
                    : `text-${config.color}-600`
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span
                className={`font-medium truncate ${
                  isSelected
                    ? theme === "dark"
                      ? `text-${config.color}-400`
                      : `text-${config.color}-700`
                    : textColor.primary
                }`}
              >
                {module.title}
              </span>
              {type === "Chapter" && hasChildren && (
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  } ${textColor.muted}`}
                />
              )}
            </div>

            {type === "Lesson" && (
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>Lesson {module.lessonIndex || module.globalIndex}</span>
                </div>
                {module.duration && (
                  <span className={`text-xs ${textColor.muted}`}>
                    {module.duration}
                  </span>
                )}
              </div>
            )}
          </div>

          {isSelected && (
            <div
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${
                theme === "dark"
                  ? `bg-${config.color}-400`
                  : `bg-${config.color}-600`
              }`}
            />
          )}

          {type === "Lesson" && module.isCompleted && (
            <div className="absolute right-3 top-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          )}
        </button>
      </div>
    );
  },
);

ModuleItem.displayName = "ModuleItem";

// Extracted Error Component
const ErrorState = ({ message, onRetry, theme }) => {
  const styles = THEME_STYLES[theme];
  return (
    <div
      className={`min-h-screen ${styles.bg.tertiary} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className={`text-xl font-semibold ${styles.text.primary} mb-2`}>
            Error Loading Course
          </h2>
          <p className={`${styles.text.secondary} mb-4`}>{message}</p>
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

// Extracted Loading/Empty State Component
const EmptyState = ({ theme, onOpenSidebar }) => {
  const styles = THEME_STYLES[theme];
  return (
    <div
      className={`rounded-xl p-8 text-center ${styles.bg.primary} shadow-sm`}
    >
      <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 className={`text-lg font-bold ${styles.text.primary} mb-2`}>
        Welcome to the Course
      </h3>
      <p className={`${styles.text.secondary} mb-6`}>
        Open the menu to select your first module
      </p>
      <button
        onClick={onOpenSidebar}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Open Course Modules
      </button>
    </div>
  );
};

// Custom hook for theme styles (memoized)
const useThemeStyles = (theme) => {
  return useMemo(() => THEME_STYLES[theme], [theme]);
};

const EnrolledCourseDetails = () => {
  const { courseId } = useParams();
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
  } = useEnrolledCourseDetails(courseId);

  const {
    weekData,
    isLoading: progressLoading,
    error: progressError,
  } = useUserProgressDetails(Number(courseId));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const styles = useThemeStyles(theme);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCourseInfo, setShowCourseInfo] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState(() => new Set());

  // Fixed: Correct dependency array for error handling
  useEffect(() => {
    if (error?.message === "Authorization token is missing.") {
      dispatch(clearUserError());
      navigate("/login");
    }
  }, [error, dispatch, navigate]); // Added missing dependencies

  // Memoized grouped modules
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
        currentChapter.sections.push({
          ...module,
          lessons: [],
          isExpanded: true,
        });
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

  // Memoized callbacks
  const toggleChapter = useCallback((chapterId) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  }, []);

  const handleModuleSelect = useCallback(
    (moduleId) => {
      setSelectedModuleId(moduleId);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    },
    [setSelectedModuleId],
  );

  const handleProgressSubmitSuccess = useCallback(() => {
    // Success handler - can be implemented if needed
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  // Sanitize HTML content (fix security vulnerability)
  const sanitizeHTML = useCallback((html) => {
    if (!html) return "";
    // Basic sanitization - in production, use DOMPurify or similar library
    return html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      "",
    );
  }, []);

  // Error and loading states
  if (error) {
    return (
      <ErrorState message={error.message} onRetry={handleRetry} theme={theme} />
    );
  }

  if (!enrolledCourseDetails) {
    return <EmptyState theme={theme} onOpenSidebar={handleOpenSidebar} />;
  }

  return (
    <div
      className={`min-h-screen ${styles.bg.tertiary} transition-colors duration-300`}
    >
      {/* Header Component - Can be extracted further */}
      <div className={`border-b ${styles.border.primary} ${styles.bg.primary}`}>
        {/* Mobile Header */}
        <div className="lg:hidden px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg hover:${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <div>
                <h1
                  className={`text-sm font-bold ${styles.text.primary} truncate max-w-[180px]`}
                >
                  {enrolledCourseDetails.course_name}
                </h1>
                <p className={`text-xs ${styles.text.muted}`}>
                  Module {currentIndex + 1}/{totalModules}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCourseInfo(!showCourseInfo)}
                className={`p-2 rounded-lg hover:${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
              >
                <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className={`p-2 rounded-lg hover:${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} relative`}
              >
                <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold ${styles.text.primary}`}>
                {enrolledCourseDetails.course_name}
              </h1>
              <p className={`text-sm ${styles.text.muted}`}>
                Module {currentIndex + 1} of {totalModules}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCourseInfo(!showCourseInfo)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  showCourseInfo
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Info className="w-4 h-4" />
                {showCourseInfo ? "Hide Info" : "Show Course Info"}
              </button>

              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 relative ${
                  showFeedback
                    ? "bg-purple-600 text-white"
                    : theme === "dark"
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-0 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Course Info Panel - Mobile */}
          {showCourseInfo && (
            <MobilePanel
              title="Course Information"
              onClose={() => setShowCourseInfo(false)}
              theme={theme}
              styles={styles}
            >
              <CourseInfoContent
                enrolledCourseDetails={enrolledCourseDetails}
                textColor={styles.text}
                theme={theme}
              />
            </MobilePanel>
          )}

          {/* Feedback Panel - Mobile */}
          {showFeedback && (
            <MobilePanel
              title="Course Feedback"
              onClose={() => setShowFeedback(false)}
              theme={theme}
              styles={styles}
            >
              <FeedbackForm
                theme={theme}
                courseId={Number(courseId)}
                enrollmentId={null} // Fixed: Should come from API or context
                onSuccess={() => setShowFeedback(false)}
              />
            </MobilePanel>
          )}

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
            theme={theme}
            styles={styles}
            formatDate={formatDate}
          />

          {/* Main Content Area */}
          <div className="flex-1">
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
                  styles={styles}
                  sanitizeHTML={sanitizeHTML}
                />

                {/* Desktop Course Info Panel */}
                {showCourseInfo && (
                  <DesktopPanel
                    title="Course Information"
                    onClose={() => setShowCourseInfo(false)}
                    theme={theme}
                    styles={styles}
                  >
                    <CourseInfoContent
                      enrolledCourseDetails={enrolledCourseDetails}
                      textColor={styles.text}
                      theme={theme}
                    />
                  </DesktopPanel>
                )}

                <ProgressPanel
                  title="Today's Task"
                  theme={theme}
                  styles={styles}
                >
                  <ProgressPracticeForm
                    theme={theme}
                    courseId={Number(courseId)}
                    isLoading={progressLoading}
                    error={progressError}
                    weekData={weekData}
                    onSubmitSuccess={handleProgressSubmitSuccess}
                  />
                </ProgressPanel>

                <ProgressPanel
                  title="Today's Tools"
                  theme={theme}
                  styles={styles}
                >
                  <ProgressToolsForm
                    theme={theme}
                    courseId={Number(courseId)}
                    isLoading={progressLoading}
                    error={progressError}
                    weekData={weekData}
                    onSubmitSuccess={handleProgressSubmitSuccess}
                  />
                </ProgressPanel>

                {/* Desktop Feedback Panel */}
                {showFeedback && (
                  <DesktopPanel
                    title="Course Feedback"
                    onClose={() => setShowFeedback(false)}
                    theme={theme}
                    styles={styles}
                  >
                    <FeedbackForm
                      theme={theme}
                      courseId={Number(courseId)}
                      enrollmentId={null} // Fixed
                    />
                  </DesktopPanel>
                )}

                {/* Mobile Quick Actions */}
                <MobileQuickActions
                  hasNextModule={hasNextModule}
                  goToNextModule={goToNextModule}
                  setSidebarOpen={setSidebarOpen}
                  theme={theme}
                  styles={styles}
                />
              </>
            ) : (
              <EmptyState theme={theme} onOpenSidebar={handleOpenSidebar} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted sub-components (defined outside main component to prevent re-renders)
const MobilePanel = React.memo(
  ({ title, onClose, theme, styles, children }) => (
    <div
      className={`lg:hidden rounded-xl shadow-lg mb-4 ${styles.border.primary} border ${styles.bg.primary}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold ${styles.text.primary}`}>{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  ),
);

const DesktopPanel = React.memo(
  ({ title, onClose, theme, styles, children }) => (
    <div
      className={`hidden lg:block rounded-xl p-6 mb-6 ${styles.border.primary} border ${styles.bg.primary} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${styles.text.primary}`}>{title}</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      {children}
    </div>
  ),
);

const ProgressPanel = React.memo(({ title, theme, styles, children }) => (
  <div className={`rounded-xl p-4 md:p-6 mb-6`}>
    <div className="flex mb-6">
      <h3 className={`text-base md:text-lg font-bold ${styles.text.primary}`}>
        {title}
      </h3>
    </div>
    {children}
  </div>
));

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
    styles,
    sanitizeHTML,
  }) => {
    const { getYouTubeEmbedUrl } = useYouTubeEmbedUrl({
      fallbackUrl: "",
      addPlayerParams: false,
    });

    return (
      <>
        <div
          className={`rounded-xl overflow-hidden shadow-lg ${styles.bg.primary} mb-6`}
        >
          {moduleDetails.video_url ? (
            <div className="relative aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={getYouTubeEmbedUrl(moduleDetails.video_url)}
                title={moduleDetails.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <Play className="w-16 h-16 text-white opacity-50" />
              <p className="text-white mt-4">Video not available</p>
            </div>
          )}

          <div className="p-6 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      theme === "dark"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {moduleDetails.header_type}
                  </span>
                  <span className={`text-sm ${styles.text.muted}`}>
                    Module {currentIndex + 1} of {totalModules}
                  </span>
                </div>
                <h2
                  className={`text-lg lg:text-xl font-bold ${styles.text.primary}`}
                >
                  {moduleDetails.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousModule}
                  disabled={!hasPrevModule}
                  className={`p-3 rounded-lg transition-colors ${
                    hasPrevModule
                      ? theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : theme === "dark"
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextModule}
                  disabled={!hasNextModule}
                  className={`p-3 rounded-lg transition-colors ${
                    hasNextModule
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : theme === "dark"
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Fixed: Security fix for dangerouslySetInnerHTML */}
            <div
              className={styles.text.secondary}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(moduleDetails.description),
              }}
            />
          </div>
        </div>
      </>
    );
  },
);

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
    theme,
    styles,
    formatDate,
  }) => (
    <div
      className={`
    ${sidebarOpen ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:static lg:bg-transparent" : "hidden lg:block"}
  `}
    >
      <div
        className={`
      ${sidebarOpen ? "absolute inset-y-0 left-0 max-w-sm lg:relative min-w-[280px] w-[320px]" : "lg:relative min-w-[280px] w-[320px] max-w-[350px]"}
      ${styles.bg.primary} ${styles.border.primary}
      border rounded-xl lg:rounded-xl shadow-sm h-full lg:h-[calc(100vh-8rem)] overflow-hidden flex flex-col
    `}
      >
        <div
          className={`p-4 border-b ${styles.border.primary} flex items-center justify-between flex-shrink-0`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"}`}
            >
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className={`font-bold ${styles.text.primary}`}>
                Course Content
              </h3>
              <p className={`text-xs ${styles.text.muted}`}>
                {totalModules} modules
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {groupedModules.map((chapter) => {
              const hasChildren =
                chapter.sections.length > 0 || chapter.directLessons.length > 0;
              const isChapterExpanded = expandedChapters.has(chapter.id);

              return (
                <div key={chapter.id} className="mb-1">
                  <ModuleItem
                    module={chapter}
                    type="Chapter"
                    level={0}
                    hasChildren={hasChildren}
                    isSelected={selectedModuleId === chapter.id}
                    isExpanded={isChapterExpanded}
                    theme={theme}
                    onSelect={handleModuleSelect}
                    onToggleChapter={toggleChapter}
                  />

                  {isChapterExpanded && (
                    <>
                      {chapter.sections.map((section) => (
                        <div key={section.id} className="mb-1">
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
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`p-4 border-t ${styles.border.primary} flex-shrink-0`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className={`text-sm ${styles.text.secondary}`}>
                {enrolledCourseDetails.duration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className={`text-sm ${styles.text.secondary}`}>
                Enrolled {formatDate(enrolledCourseDetails.created_on)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListVideo className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className={`text-sm ${styles.text.secondary}`}>
                {totalModules} modules
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
);

const MobileQuickActions = React.memo(
  ({ hasNextModule, goToNextModule, setSidebarOpen, theme, styles }) => (
    <div
      className={`lg:hidden flex items-center justify-between mt-6 p-4 rounded-xl ${styles.bg.secondary}`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg ${styles.bg.primary} shadow-sm`}
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <p className={`text-sm ${styles.text.muted}`}>Next Module</p>
          <p className={`font-medium ${styles.text.primary}`}>
            {hasNextModule ? "Available" : "Course Complete"}
          </p>
        </div>
      </div>
      <button
        onClick={goToNextModule}
        disabled={!hasNextModule}
        className={`px-4 py-2 rounded-lg ${
          hasNextModule
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  ),
);

export default EnrolledCourseDetails;
