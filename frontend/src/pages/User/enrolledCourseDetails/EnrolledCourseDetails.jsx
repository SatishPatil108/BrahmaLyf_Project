import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Target,
  Clock,
  Calendar,
  CheckCircle,
  ListVideo,
  GraduationCap,
  MessageSquare,
  X,
  Menu,
  Info,
  ChevronUp,
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCourseInfo, setShowCourseInfo] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCourseInfoMobile, setShowCourseInfoMobile] = useState(false);
  const [showFeedbackMobile, setShowFeedbackMobile] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState(new Set());

  useEffect(() => {
    if (error?.message === "Authorization token is missing.") {
      dispatch(clearUserError());
      navigate("/login");
    }
  }, [error, navigate, dispatch]);

  useEffect(() => {
    if (currentIndex === totalModules - 1 && totalModules > 0) {
      setShowFeedback(true);
    }
  }, [currentIndex, totalModules]);

  // Helper function for consistent text colors
  const textColor = {
    primary: theme === "dark" ? "text-gray-100" : "text-gray-800",
    secondary: theme === "dark" ? "text-gray-300" : "text-gray-700",
    muted: theme === "dark" ? "text-gray-400" : "text-gray-600",
    inverse: theme === "dark" ? "text-gray-800" : "text-gray-100",
  };

  const bgColor = {
    primary: theme === "dark" ? "bg-gray-900" : "bg-white",
    secondary: theme === "dark" ? "bg-gray-800" : "bg-gray-50",
    tertiary: theme === "dark" ? "bg-gray-950" : "bg-gray-100",
  };

  const borderColor = {
    primary: theme === "dark" ? "border-gray-800" : "border-gray-200",
    secondary: theme === "dark" ? "border-gray-700" : "border-gray-300",
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const { getYouTubeEmbedUrl } = useYouTubeEmbedUrl({
    fallbackUrl: "",
    addPlayerParams: false,
  });

  // Group modules hierarchically
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

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const handleModuleSelect = (moduleId) => {
    setSelectedModuleId(moduleId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Render module item with proper indentation
  const renderModuleItem = (module, type, level = 0, hasChildren = false) => {
    const isSelected = selectedModuleId === module.id;
    const isExpanded = expandedChapters.has(module.id);

    const typeConfig = {
      Chapter: {
        icon: isExpanded ? FolderOpen : Folder,
        color: "blue",
        bgColor: theme === "dark" ? "bg-blue-900/20" : "bg-blue-50",
        textColor: isSelected
          ? theme === "dark"
            ? "text-blue-400"
            : "text-blue-700"
          : textColor.primary,
        borderColor:
          theme === "dark" ? "border-blue-800/50" : "border-blue-200",
      },
      Section: {
        icon: FileText,
        color: "green",
        bgColor: theme === "dark" ? "bg-green-900/10" : "bg-green-50/50",
        textColor: isSelected
          ? theme === "dark"
            ? "text-green-400"
            : "text-green-700"
          : textColor.primary,
        borderColor:
          theme === "dark" ? "border-green-800/30" : "border-green-200",
      },
      Lesson: {
        icon: Video,
        color: "purple",
        bgColor: theme === "dark" ? "bg-purple-900/10" : "bg-purple-50/50",
        textColor: isSelected
          ? theme === "dark"
            ? "text-purple-400"
            : "text-purple-700"
          : textColor.primary,
        borderColor:
          theme === "dark" ? "border-purple-800/30" : "border-purple-200",
      },
    };

    const config = typeConfig[type];
    const Icon = config.icon;
    const paddingLeft = 16 + level * 20;

    return (
      <div
        className={`relative ${level > 0 ? "ml-6" : ""}`}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Vertical connecting line */}
        {level > 0 && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-0.5 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-300"
            }`}
            style={{ left: `${paddingLeft - 16}px` }}
          />
        )}

        <button
          onClick={() => {
            if (type === "Chapter" && hasChildren) {
              toggleChapter(module.id);
              handleModuleSelect(module.id);
            } else {
              handleModuleSelect(module.id);
            }
          }}
          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start gap-3 group relative
            ${
              isSelected
                ? `${config.bgColor} border ${config.borderColor}`
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }
            ${type === "Lesson" ? "border-l-4 ml-[-4px]" : ""}
            ${
              isSelected && type === "Lesson"
                ? "border-l-purple-500"
                : "border-l-transparent"
            }
          `}
        >
          {/* Icon */}
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

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`font-medium truncate ${config.textColor}`}>
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

          {/* Selection indicator */}
          {isSelected && (
            <div
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${
                theme === "dark"
                  ? `bg-${config.color}-400`
                  : `bg-${config.color}-600`
              }`}
            />
          )}
        </button>

        {/* Progress indicator for lessons */}
        {type === "Lesson" && module.isCompleted && (
          <div className="absolute right-3 top-3">
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>
    );
  };

 

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${bgColor.tertiary} transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-600 dark:border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <p className={`mt-4 text-lg font-medium ${textColor.primary}`}>
              Loading course content...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${bgColor.tertiary} transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className={`text-xl font-semibold ${textColor.primary} mb-2`}>
              Error Loading Course
            </h2>
            <p className={`${textColor.secondary} mb-4`}>{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!enrolledCourseDetails) {
    return (
      <div
        className={`min-h-screen ${bgColor.tertiary} transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className={`text-xl font-semibold ${textColor.primary} mb-2`}>
              Course Not Found
            </h2>
            <p className={`${textColor.secondary}`}>
              The requested course could not be found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${bgColor.tertiary} transition-colors duration-300`}
    >
      {/* Mobile Header */}
      <div
        className={`lg:hidden border-b ${borderColor.primary} ${bgColor.primary}`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg hover:${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <div>
                <h1
                  className={`text-sm font-bold ${textColor.primary} truncate max-w-[180px]`}
                >
                  {enrolledCourseDetails.course_name}
                </h1>
                <p className={`text-xs ${textColor.muted}`}>
                  Module {currentIndex + 1}/{totalModules}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCourseInfoMobile(!showCourseInfoMobile)}
                className={`p-2 rounded-lg hover:${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setShowFeedbackMobile(!showFeedbackMobile)}
                className={`p-2 rounded-lg hover:${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                } relative`}
              >
                <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {currentIndex === totalModules - 1 && totalModules > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div
        className={`hidden lg:block border-b ${borderColor.primary} ${bgColor.primary}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold ${textColor.primary}`}>
                {enrolledCourseDetails.course_name}
              </h1>
              <p className={`text-sm ${textColor.muted}`}>
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
                {currentIndex === totalModules - 1 && totalModules > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-0 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Mobile Course Info Panel */}
          {showCourseInfoMobile && (
            <div
              className={`lg:hidden rounded-xl shadow-lg mb-4 ${borderColor.primary} border ${bgColor.primary}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold ${textColor.primary}`}>
                    Course Information
                  </h3>
                  <button
                    onClick={() => setShowCourseInfoMobile(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h4 className={`font-medium ${textColor.primary}`}>
                        Learning Outcomes
                      </h4>
                    </div>
                    <p className={`text-sm ${textColor.secondary} pl-6`}>
                      {enrolledCourseDetails.learning_outcomes}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <h4 className={`font-medium ${textColor.primary}`}>
                        Target Audience
                      </h4>
                    </div>
                    <p className={`text-sm ${textColor.secondary} pl-6`}>
                      {enrolledCourseDetails.target_audience}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <h4 className={`font-medium ${textColor.primary}`}>
                        Course Overview
                      </h4>
                    </div>
                    <p className={`text-sm ${textColor.secondary} pl-6`}>
                      {enrolledCourseDetails.curriculum_description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Feedback Panel */}
          {showFeedbackMobile && (
            <div
              className={`lg:hidden rounded-xl shadow-lg mb-4 ${borderColor.primary} border ${bgColor.primary}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold ${textColor.primary}`}>
                    Course Feedback
                  </h3>
                  <button
                    onClick={() => setShowFeedbackMobile(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <FeedbackForm
                  theme={theme}
                  courseId={Number(courseId)}
                  enrollmentId={1}
                  onSuccess={() => setShowFeedbackMobile(false)}
                />
              </div>
            </div>
          )}

          {/* Left Sidebar - Course Index (W3Schools Style) */}
          <div
            className={`
            ${
              sidebarOpen
                ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:static lg:bg-transparent"
                : "hidden lg:block"
            }
          `}
          >
            <div
              className={`
              ${
                sidebarOpen
                  ? "absolute inset-y-0 left-0 w-4/5 max-w-sm lg:relative min-w-[280px] w-[320px] max-w-[350px]"
                  : "lg:relative min-w-[280px] w-[320px] max-w-[350px]"
              }
              ${bgColor.primary} ${borderColor.primary}
              border rounded-xl lg:rounded-xl shadow-sm h-full lg:h-[calc(100vh-8rem)] overflow-hidden flex flex-col
            `}
            >
              {/* Sidebar Header */}
              <div
                className={`p-4 border-b ${borderColor.primary} flex items-center justify-between flex-shrink-0`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"
                    }`}
                  >
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${textColor.primary}`}>
                      Course Content
                    </h3>
                    <p className={`text-xs ${textColor.muted}`}>
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
              {/* Module List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  {groupedModules.map((chapter) => {
                    const hasChildren =
                      chapter.sections.length > 0 ||
                      chapter.directLessons.length > 0;
                    const isChapterExpanded = expandedChapters.has(chapter.id);

                    return (
                      <div key={chapter.id} className="mb-1">
                        {/* Chapter */}
                        {renderModuleItem(chapter, "Chapter", 0, hasChildren)}

                        {/* Expanded content */}
                        {isChapterExpanded && (
                          <>
                            {/* Sections */}
                            {chapter.sections.map((section) => (
                              <div key={section.id} className="mb-1">
                                {renderModuleItem(section, "Section", 1)}

                                {/* Lessons in section */}
                                {section.lessons.map((lesson) => (
                                  <div key={lesson.id}>
                                    {renderModuleItem(lesson, "Lesson", 2)}
                                  </div>
                                ))}
                              </div>
                            ))}

                            {/* Direct lessons (without sections) */}
                            {chapter.directLessons.map((lesson) => (
                              <div key={lesson.id}>
                                {renderModuleItem(lesson, "Lesson", 1)}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div
                className={`p-4 border-t ${borderColor.primary} flex-shrink-0`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className={`text-sm ${textColor.secondary}`}>
                      {enrolledCourseDetails.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className={`text-sm ${textColor.secondary}`}>
                      Enrolled {formatDate(enrolledCourseDetails.created_on)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ListVideo className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className={`text-sm ${textColor.secondary}`}>
                      {totalModules} modules
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {moduleDetails && currentIndex != -1 ? (
              <>
                {/* Video Player Card */}
                <div
                  className={`rounded-xl overflow-hidden shadow-lg ${bgColor.primary} mb-6`}
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
                      ></iframe>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white opacity-50" />
                      <p className="text-white mt-4">Video not available</p>
                    </div>
                  )}

                  <div className="p-4 lg:p-6">
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
                          <span className={`text-sm ${textColor.muted}`}>
                            Module {currentIndex + 1} of {totalModules}
                          </span>
                        </div>
                        <h2
                          className={`text-lg lg:text-xl font-bold ${textColor.primary}`}
                        >
                          {moduleDetails.title}
                        </h2>
                      </div>

                      {/* Navigation Buttons */}
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
                              ? theme === "dark"
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                              : theme === "dark"
                              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className={`${textColor.secondary}`}>
                      {moduleDetails.description}
                    </p>
                  </div>
                </div>

                {/* Course Information Panel (Desktop) */}
                {showCourseInfo && (
                  <div
                    className={`hidden lg:block rounded-xl p-6 mb-6 ${borderColor.primary} border ${bgColor.primary} shadow-sm`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-lg font-bold ${textColor.primary}`}>
                        Course Information
                      </h3>
                      <button
                        onClick={() => setShowCourseInfo(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              theme === "dark"
                                ? "bg-blue-900/30"
                                : "bg-blue-100"
                            }`}
                          >
                            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h4 className={`font-bold ${textColor.primary}`}>
                            Learning Outcomes
                          </h4>
                        </div>
                        <p className={`text-sm ${textColor.secondary}`}>
                          {enrolledCourseDetails.learning_outcomes}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              theme === "dark"
                                ? "bg-green-900/30"
                                : "bg-green-100"
                            }`}
                          >
                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <h4 className={`font-bold ${textColor.primary}`}>
                            Target Audience
                          </h4>
                        </div>
                        <p className={`text-sm ${textColor.secondary}`}>
                          {enrolledCourseDetails.target_audience}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              theme === "dark"
                                ? "bg-purple-900/30"
                                : "bg-purple-100"
                            }`}
                          >
                            <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h4 className={`font-bold ${textColor.primary}`}>
                            Course Overview
                          </h4>
                        </div>
                        <p className={`text-sm ${textColor.secondary}`}>
                          {enrolledCourseDetails.curriculum_description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Panel (Desktop) */}
                {showFeedback && (
                  <div
                    className={`hidden lg:block rounded-xl p-6 mb-6 ${borderColor.primary} border shadow-sm`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-lg font-bold ${textColor.primary}`}>
                        Course Feedback
                      </h3>
                      <button
                        onClick={() => setShowFeedback(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <FeedbackForm
                      theme={theme}
                      courseId={Number(courseId)}
                      enrollmentId={1}
                    />
                  </div>
                )}

                {/* Mobile Quick Actions */}
                <div
                  className={`lg:hidden flex items-center justify-between mt-6 p-4 rounded-xl ${bgColor.secondary}`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className={`p-2 rounded-lg ${bgColor.primary} shadow-sm`}
                    >
                      <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                      <p className={`text-sm ${textColor.muted}`}>
                        Next Module
                      </p>
                      <p className={`font-medium ${textColor.primary}`}>
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
              </>
            ) : (
              <div
                className={`rounded-xl p-8 text-center ${bgColor.primary} shadow-sm`}
              >
                <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className={`text-lg font-bold ${textColor.primary} mb-2`}>
                  Welcome to the Course
                </h3>
                <p className={`${textColor.secondary} mb-6`}>
                  Open the menu to select your first module
                </p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Open Course Modules
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseDetails;
