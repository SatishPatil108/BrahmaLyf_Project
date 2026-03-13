import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  Users,
  Clock,
  SquarePen,
  Trash2,
  Calendar,
  Target,
  ListChecks,
  Video,
  Plus,
  AlertCircle,
  Eye,
  ChevronRight,
  FileVideo,
  Tag,
  BadgeQuestionMarkIcon,
  List,
  Play,
  FileText,
  Award,
  Sparkles,
  ArrowRight,
  CalendarDays,
  Bookmark,
  GraduationCap,
} from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import EditCourse from "./EditCourse";
import EditCourseCurriculum from "./EditCourseCurriculum";
import useCourseDetails from "./useCourseDetails";
import CustomButton from "@/components/CustomButton";
import ProgressTasksQuestionDetails from "../ProgressTasksTracking/ProgressTasksQuestionDetails";
import ProgressToolsQuestionDetails from "../ProgressToolsQuestion/ProgressToolsQuestionDetails";
import CustomDrawer from "@/components/CustomDrawer";

// Enhanced color configuration
const COLORS = {
  primary: {
    light: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
    dark: {
      bg: "bg-indigo-900/20",
      text: "text-indigo-400",
      border: "border-indigo-800",
    },
    icon: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-600 via-purple-600 to-pink-500",
  },
  danger: {
    light: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    dark: {
      bg: "bg-red-900/20",
      text: "text-red-400",
      border: "border-red-800",
    },
    icon: "text-red-600 dark:text-red-400",
  },
  success: {
    light: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    dark: {
      bg: "bg-green-900/20",
      text: "text-green-400",
      border: "border-green-800",
    },
    icon: "text-green-600 dark:text-green-400",
  },
  warning: {
    light: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    dark: {
      bg: "bg-yellow-900/20",
      text: "text-yellow-400",
      border: "border-yellow-800",
    },
    icon: "text-yellow-600 dark:text-yellow-400",
  },
  info: {
    light: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    dark: {
      bg: "bg-blue-900/20",
      text: "text-blue-400",
      border: "border-blue-800",
    },
    icon: "text-blue-600 dark:text-blue-400",
  },
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const {
    courseDetails,
    curriculumDetails,
    loading,
    error,
    isDrawerOpen,
    isCurriculumDrawerOpen,
    isCurriculumEditing,
    setCurriculumDetails,
    handleEdit,
    handleCurriculumEdit,
    handleFormSubmit,
    handleCurriculumFormSubmit,
    handleDelete,
    handleCurriculumDelete,
    setIsDrawerOpen,
    setIsCurriculumDrawerOpen,
    setIsCurriculumEditing,
  } = useCourseDetails(courseId);

  const [isTasksDrawerOpen, setIsTasksDrawerOpen] = useState(false);
  const [isToolsDrawerOpen, setIsToolsDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [activeProgressTab, setActiveProgressTab] = useState("tasks");
  const [hoveredModule, setHoveredModule] = useState(null);

  const openTasksDrawer = () => setIsTasksDrawerOpen(true);
  const closeTasksDrawer = () => setIsTasksDrawerOpen(false);
  const openToolsDrawer = () => setIsToolsDrawerOpen(true);
  const closeToolsDrawer = () => setIsToolsDrawerOpen(false);

  const handleViewDetails = (item) => {
    setDrawerItem(item);
    setIsDetailDrawerOpen(true);
  };

  const closeDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setTimeout(() => setDrawerItem(null), 300);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Failed to Load Course
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          {error.message || "An error occurred while loading course details"}
        </p>
        <CustomButton
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </CustomButton>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Course Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The requested course could not be found
        </p>
      </div>
    );
  }

  const {
    course_name,
    target_audience,
    learning_outcomes,
    curriculum_description,
    duration,
    curriculum_outline = [],
    created_on,
    intro_video,
    videos = [],
    domain_name,
    subdomain_name,
    coach_name,
    coach_email,
  } = courseDetails;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Course Header - Enhanced */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -ml-24 -mb-24" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 opacity-80" />
                <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {domain_name || "Course"}
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {course_name}
                </h1>
                {subdomain_name && (
                  <p className="text-lg opacity-90 mt-1">{subdomain_name}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(created_on)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
                {coach_name && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Coach: {coach_name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CustomButton
                onClick={handleEdit}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 text-white"
              >
                <SquarePen className="w-4 h-4 mr-2" />
                Edit Course
              </CustomButton>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this course? This action cannot be undone.",
                    )
                  ) {
                    handleDelete(courseId);
                  }
                }}
                className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all duration-300 border border-red-400/30 backdrop-blur-sm"
                aria-label="Delete course"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards with enhanced design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                title="Target Audience"
                icon={<Users className="w-5 h-5" />}
                content={target_audience}
                color="info"
              />
              <InfoCard
                title="Learning Outcomes"
                icon={<Award className="w-5 h-5" />}
                content={learning_outcomes}
                color="success"
              />
            </div>

            {/* Course Overview */}
            <Section
              title="Course Overview"
              content={curriculum_description}
              icon={<BookOpen className="w-5 h-5" />}
            />

            {/* Intro Video with enhanced design */}
            {intro_video && (
              <div className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Introduction Video
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Welcome and course introduction
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {intro_video.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {intro_video.description}
                    </p>
                  </div>

                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <VideoPlayer
                      videoUrl={intro_video.video_url}
                      thumbnailUrl={intro_video.thumbnail_url}
                      title={intro_video.title}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Curriculum Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                      <ListChecks className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Curriculum Outline
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {curriculum_outline.length} modules • Complete learning
                        path
                      </p>
                    </div>
                  </div>

                  <CustomButton
                    onClick={() => {
                      setIsCurriculumDrawerOpen(true);
                      setIsCurriculumEditing(false);
                    }}
                    variant="primary"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </CustomButton>
                </div>
              </div>

              {/* Enhanced Module List */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {curriculum_outline.length > 0 ? (
                  curriculum_outline.map((item, index) => {
                    const relatedVideos = videos.filter(
                      (vid) => vid.curriculum_outline_id === item.id,
                    );
                    const isHovered = hoveredModule === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleViewDetails(item)}
                        onMouseEnter={() => setHoveredModule(item.id)}
                        onMouseLeave={() => setHoveredModule(null)}
                        className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/20 dark:hover:to-purple-950/20"
                      >
                        {/* Animated gradient border on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
                        </div>

                        <div className="relative px-6 py-5">
                          <div className="flex items-center justify-between">
                            {/* Left section with enhanced visuals */}
                            <div className="flex items-center gap-5 flex-1">
                              {/* Module number with enhanced styling */}
                              <div className="relative">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    isHovered
                                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transform scale-110"
                                      : "bg-gray-100 dark:bg-gray-800"
                                  }`}
                                >
                                  <span
                                    className={`text-lg font-bold transition-all duration-300 ${
                                      isHovered
                                        ? "text-white"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}
                                  >
                                    {index + 1}
                                  </span>
                                </div>
                                {isHovered && (
                                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl opacity-50 blur-md -z-10" />
                                )}
                              </div>

                              {/* Module info with enhanced typography */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3
                                    className={`text-lg font-semibold transition-colors duration-300 ${
                                      isHovered
                                        ? "text-indigo-700 dark:text-indigo-400"
                                        : "text-gray-900 dark:text-gray-100"
                                    }`}
                                  >
                                    {item.title}
                                  </h3>
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                                    Week {item.week_no}
                                  </span>
                                </div>

                                {/* Module metadata with icons */}
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <FileVideo className="w-4 h-4" />
                                    <span>
                                      {relatedVideos.length} video
                                      {relatedVideos.length !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                  {item.description && (
                                    <div className="flex items-center gap-1">
                                      <FileText className="w-4 h-4" />
                                      <span className="line-clamp-1">
                                        {item.description.substring(0, 60)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action buttons with enhanced hover effects */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCurriculumEdit(item.id);
                                }}
                                className={`p-2 rounded-lg transition-all duration-300 ${
                                  isHovered
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-4"
                                } hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400`}
                              >
                                <SquarePen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this module?",
                                    )
                                  ) {
                                    handleCurriculumDelete(item.id);
                                  }
                                }}
                                className={`p-2 rounded-lg transition-all duration-300 ${
                                  isHovered
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-4"
                                } hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-600 dark:hover:text-red-400`}
                              >
                                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                              </button>
                              <ArrowRight
                                className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
                                  isHovered
                                    ? "translate-x-1 text-indigo-500"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No Curriculum Added Yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Start building your course by adding modules, lessons, and
                      resources
                    </p>
                    <CustomButton
                      onClick={() => {
                        setIsCurriculumDrawerOpen(true);
                        setIsCurriculumEditing(false);
                      }}
                      variant="primary"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Module
                    </CustomButton>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Detail Drawer */}
            <CustomDrawer
              isOpen={isDetailDrawerOpen}
              onClose={closeDetailDrawer}
              title={drawerItem?.title || "Module Details"}
              width="700px"
            >
              {drawerItem &&
                (() => {
                  const relatedVideos = videos.filter(
                    (vid) => vid.curriculum_outline_id === drawerItem.id,
                  );
                  return (
                    <div className="space-y-8">
                      {/* Header with gradient */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 -m-6 p-6 rounded-t-2xl">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {drawerItem.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                                <CalendarDays className="w-4 h-4" />
                                Week {drawerItem.week_no}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Module ID: {drawerItem.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-2 space-y-6">
                        {/* Description Card */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-3">
                            <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              Module Description
                            </h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {drawerItem.description ||
                              "No description provided"}
                          </p>
                        </div>

                        {/* Videos Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Video className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                Module Videos ({relatedVideos.length})
                              </h4>
                            </div>
                            {relatedVideos.length > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {relatedVideos.length} video
                                {relatedVideos.length !== 1 ? "s" : ""}{" "}
                                available
                              </span>
                            )}
                          </div>

                          {relatedVideos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {relatedVideos.map((video, idx) => (
                                <div
                                  key={video.id}
                                  className="group/video space-y-3"
                                >
                                  <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                    <VideoPlayer
                                      videoUrl={video.video_url}
                                      thumbnailUrl={video.thumbnail_url}
                                      title={video.title}
                                      showControls={false}
                                      className="rounded-xl"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <Play className="w-12 h-12 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                      {video.title}
                                    </p>
                                    {video.description && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {video.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                              <FileVideo className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                No videos attached to this module yet
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <CustomButton
                            onClick={() => {
                              closeDetailDrawer();
                              handleCurriculumEdit(drawerItem.id);
                            }}
                            variant="primary"
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                          >
                            <SquarePen className="w-4 h-4 mr-2" />
                            Edit Module
                          </CustomButton>
                          <CustomButton
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this module?",
                                )
                              ) {
                                handleCurriculumDelete(drawerItem.id);
                                closeDetailDrawer();
                              }
                            }}
                            variant="outline"
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Module
                          </CustomButton>
                        </div>
                      </div>
                    </div>
                  );
                })()}
            </CustomDrawer>
          </div>

          {/* Right Column - Sidebar (Keep existing but enhance slightly) */}
          <div className="space-y-6">
            {/* Course Stats - Enhanced */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Course Statistics
                </h3>
              </div>
              <div className="space-y-3">
                <StatItem label="Modules" value={curriculum_outline.length} />
                <StatItem label="Total Videos" value={videos.length} />
                <StatItem label="Duration" value={duration} />
                <StatItem label="Created" value={formatDate(created_on)} />
              </div>
            </div>

            {/* Coach Info - Enhanced */}
            {coach_name && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Course Coach
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {coach_name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {coach_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {coach_email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions - Keep existing */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <CustomButton
                  onClick={handleEdit}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <SquarePen className="w-4 h-4 mr-2" />
                  Edit Course Details
                </CustomButton>
                <CustomButton
                  onClick={() => {
                    setIsCurriculumDrawerOpen(true);
                    setIsCurriculumEditing(false);
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Module
                </CustomButton>
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview Course
                </button>
              </div>
            </div>

            {/* Progress Tasks & Tools Tabbed Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setActiveProgressTab("tasks")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeProgressTab === "tasks"
                      ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10"
                      : "text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Progress Tasks
                  </span>
                </button>
                <button
                  onClick={() => setActiveProgressTab("tools")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeProgressTab === "tools"
                      ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10"
                      : "text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <BadgeQuestionMarkIcon className="w-4 h-4" />
                    Progress Tools
                  </span>
                </button>
              </div>

              {activeProgressTab === "tasks" ? (
                <div className="p-5">
                  <div className="text-center py-8">
                    <ListChecks className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Progress Tasks Manager
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Manage tasks for progress tracking across weeks and days
                    </p>
                    <CustomButton
                      onClick={openTasksDrawer}
                      variant="primary"
                      className="mx-auto"
                    >
                      <List className="w-4 h-4 mr-2" />
                      Open Tasks Manager
                    </CustomButton>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="text-center py-8">
                    <BadgeQuestionMarkIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Progress Tools Manager
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Manage questions for progress tracking across weeks and
                      days
                    </p>
                    <CustomButton
                      onClick={openToolsDrawer}
                      variant="primary"
                      className="mx-auto"
                    >
                      <List className="w-4 h-4 mr-2" />
                      Open Tools Manager
                    </CustomButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawers */}
        {isDrawerOpen && (
          <EditCourse
            courseDetails={courseDetails}
            onClose={() => setIsDrawerOpen(false)}
            isDrawerOpen={isDrawerOpen}
            onSubmit={handleFormSubmit}
          />
        )}

        {isCurriculumDrawerOpen && (
          <EditCourseCurriculum
            curriculumDetails={curriculumDetails}
            onClose={() => {
              setIsCurriculumDrawerOpen(false);
              setIsCurriculumEditing(false);
              setCurriculumDetails(null);
            }}
            isDrawerOpen={isCurriculumDrawerOpen}
            isEditing={isCurriculumEditing}
            onSubmit={handleCurriculumFormSubmit}
          />
        )}

        {isTasksDrawerOpen && (
          <ProgressTasksQuestionDetails
            isOpen={isTasksDrawerOpen}
            onClose={closeTasksDrawer}
            drawerOnly={true}
          />
        )}

        {isToolsDrawerOpen && (
          <ProgressToolsQuestionDetails
            isOpen={isToolsDrawerOpen}
            onClose={closeToolsDrawer}
            drawerOnly={true}
          />
        )}
      </div>
    </div>
  );
};

// Helper Components
const InfoCard = ({ title, icon, content, color = "info" }) => {
  return (
    <div
      className={`rounded-xl p-5 border transition-all duration-300 hover:shadow-lg
      ${COLORS[color].light.bg} ${COLORS[color].light.border}
      dark:${COLORS[color].dark.bg} dark:${COLORS[color].dark.border}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`${COLORS[color].icon}`}>{icon}</div>
        <h3
          className={`text-lg font-semibold
          ${COLORS[color].light.text} dark:${COLORS[color].dark.text}`}
        >
          {title}
        </h3>
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
};

const Section = ({ title, content, icon }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="text-white">{icon}</div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
    </div>
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  </div>
);

const StatItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    <span className="font-semibold text-gray-900 dark:text-gray-100">
      {value}
    </span>
  </div>
);

export default CourseDetails;
