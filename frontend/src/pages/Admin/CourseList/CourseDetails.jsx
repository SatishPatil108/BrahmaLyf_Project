import React from "react";
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
  Tag
} from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import EditCourse from "./EditCourse";
import EditCourseCurriculum from "./EditCourseCurriculum";
import useCourseDetails from "./useCourseDetails";
import CustomButton from "@/components/CustomButton";

// Color configuration for consistent theming
const COLORS = {
  primary: {
    light: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    dark: { bg: "bg-indigo-900/20", text: "text-indigo-400", border: "border-indigo-800" },
    icon: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-600 via-purple-600 to-pink-500"
  },
  danger: {
    light: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    dark: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-800" },
    icon: "text-red-600 dark:text-red-400"
  },
  success: {
    light: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    dark: { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-800" },
    icon: "text-green-600 dark:text-green-400"
  },
  warning: {
    light: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    dark: { bg: "bg-yellow-900/20", text: "text-yellow-400", border: "border-yellow-800" },
    icon: "text-yellow-600 dark:text-yellow-400"
  },
  info: {
    light: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    dark: { bg: "bg-blue-900/20", text: "text-blue-400", border: "border-blue-800" },
    icon: "text-blue-600 dark:text-blue-400"
  }
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
    // --- Loading State ---
  if (loading && !isDrawerOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Loading course details...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          This may take a moment
        </p>
      </div>
    );
  }

  // --- Error State ---
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

  // --- Not Found ---
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

  // --- Extract Details ---
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
    coach_email
  } = courseDetails;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- Course Header --- */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 opacity-80" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  {domain_name || 'Course'}
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{course_name}</h1>
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

            {/* --- Action Buttons --- */}
            <div className="flex items-center gap-3">
              <CustomButton
                onClick={handleEdit}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              >
                <SquarePen className="w-4 h-4 mr-2" />
                Edit Course
              </CustomButton>

              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
                    handleDelete(courseId);
                  }
                }}
                className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-colors border border-red-400/30"
                aria-label="Delete course"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Target Audience & Learning Outcomes Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                title="Target Audience"
                icon={<Users className="w-5 h-5" />}
                content={target_audience}
                color="info"
              />
              <InfoCard
                title="Learning Outcomes"
                icon={<Target className="w-5 h-5" />}
                content={learning_outcomes}
                color="success"
              />
            </div>

            {/* Overview Section */}
            <Section
              title="Course Overview"
              content={curriculum_description}
              icon={<BookOpen className="w-5 h-5" />}
            />

            {/* Intro Video */}
            {intro_video && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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

                  <div className="rounded-lg overflow-hidden">
                    <VideoPlayer
                      videoUrl={intro_video.video_url}
                      thumbnailUrl={intro_video.thumbnail_url}
                      title={intro_video.title}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum Outline */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <ListChecks className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Curriculum Outline
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {curriculum_outline.length} modules • Complete learning path
                    </p>
                  </div>
                </div>

                <CustomButton
                  onClick={() => {
                    setIsCurriculumDrawerOpen(true);
                    setIsCurriculumEditing(false);
                  }}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Module
                </CustomButton>
              </div>

              {/* Curriculum List */}
              <div className="space-y-4">
                {curriculum_outline.length > 0 ? (
                  curriculum_outline.map((item, index) => {
                    const relatedVideos = videos.filter(
                      (vid) => vid.curriculum_outline_id === item.id
                    );

                    return (
                      <div
                        key={item.id}
                        className="group border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-900"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-gray-700 dark:text-gray-300">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                  {item.header_type}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Sequence: {item.sequence_no}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCurriculumEdit(item.id)}
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                              aria-label="Edit module"
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this module?")) {
                                  handleCurriculumDelete(item.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                              aria-label="Delete module"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {item.description}
                        </p>

                        {/* Videos */}
                        {relatedVideos.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <FileVideo className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Videos ({relatedVideos.length})
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {relatedVideos.map((video) => (
                                <div key={video.id} className="space-y-2">
                                  <VideoPlayer
                                    videoUrl={video.video_url}
                                    thumbnailUrl={video.thumbnail_url}
                                    title={video.title}
                                    showControls={false}
                                    className="rounded-lg"
                                  />
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {video.title}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Module ID: {item.id}</span>
                          <button
                            onClick={() => handleCurriculumEdit(item.id)}
                            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                          >
                            View details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
                    <ListChecks className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No Curriculum Added
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Start building your course by adding modules
                    </p>
                    <CustomButton
                      onClick={() => {
                        setIsCurriculumDrawerOpen(true);
                        setIsCurriculumEditing(false);
                      }}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Module
                    </CustomButton>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Course Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Modules</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {curriculum_outline.length}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Total Videos</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {videos.length}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {duration}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatDate(created_on)}
                  </span>
                </div>
              </div>
            </div>

            {/* Coach Info */}
            {coach_name && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Course Coach
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {coach_name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {coach_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {coach_email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
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
      </div>
    </div>
  );
};

// --- Subcomponents ---
const InfoCard = ({ title, icon, content, color = "info" }) => {
  return (
    <div className={`rounded-xl p-5 border transition-colors duration-300
      ${COLORS[color].light.bg} ${COLORS[color].light.border}
      dark:${COLORS[color].dark.bg} dark:${COLORS[color].dark.border}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`${COLORS[color].icon}`}>
          {icon}
        </div>
        <h3 className={`text-lg font-semibold
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
  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-indigo-600 dark:text-indigo-400">
        {icon}
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

export default CourseDetails;