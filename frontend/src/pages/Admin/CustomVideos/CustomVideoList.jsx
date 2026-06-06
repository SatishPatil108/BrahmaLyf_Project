import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  Flame,
  Plus,
  X,
  ChevronDown,
  Video,
  Clapperboard,
} from "lucide-react";
import CustomDrawer from "@/components/CustomDrawer";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import YouTubeUrlInput from "@/components/videoUrlValidator/YouTubeUrlInput";
import usePagination from "@/hooks";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import { cleanHtml } from "@/components/RichTextEditor/cleanHtml";
import useCustomVideoList from "./useCustomVideoList";
import DailyShortCard from "../DailyShorts/DailyShortCard";

const CATEGORY_TYPE_LABELS = {
  1: "Technology",
  2: "Design",
  3: "Marketing",
};

// ── Stat Card ──
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg bg-${color}-100 dark:bg-${color}-900/20 flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  </div>
);

// ── Main CustomVideoList ──
const CustomVideoList = () => {
  const { pageNo, pageSize, setPageNo } = usePagination(1, 10);

  const {
    customVideosDetails,
    loading,
    error,
    addCustomVideo,
    updateCustomVideoDetails,
    deleteCustomVideo,
    isSubmitting,
    actionMessage,
    clearMessage,
  } = useCustomVideoList(pageNo, pageSize);

  const videos = customVideosDetails?.videos ?? [];

  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomId, setEditingCustomId] = useState(null);

  const [currentPlaying, setCurrentPlaying] = useState(null);

  const EMPTY_FORM = {
    title: "",
    customCategory: "",
    customVideoUrl: "",
    customThumbnailUrl: null,
    customThumbnailFile: null,
  };

  const [customData, setCustomData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setField = (field, value) => {
    setCustomData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const inputClass = (field) => `
    w-full px-3 py-2 rounded-lg border text-sm transition-colors
    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
    ${
      errors[field] && touched[field]
        ? "border-rose-300 bg-rose-50 dark:bg-rose-900/10"
        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    }
    text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
  `;

  const resetForm = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditingCustomId(null);
    setCustomData(EMPTY_FORM);
    setErrors({});
    setTouched({});
  };

  const openAddDrawer = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleEditCustom = (short) => {
    setIsEditing(true);
    setEditingCustomId(short.id);
    setCustomData({
      title: short.video_title ?? "",
      customCategory: short.category_id ? String(short.category_id) : "",
      customVideoUrl: short.video_file ?? "",
      customThumbnailUrl: short.video_thumbnail ?? null,
      customThumbnailFile: null,
    });
    setErrors({});
    setTouched({});
    setIsDrawerOpen(true);
  };

  const handleDeleteCustom = async (id, title) => {
    if (!id) return;
    if (window.confirm(`Delete "${title}"?`)) await deleteCustomVideo(id);
  };

  const validate = () => {
    const e = {};
    const plainTitle = cleanHtml(customData.title);
    if (!plainTitle.trim()) e.title = "Title is required";

    if (!customData.customCategory) e.customCategory = "Category is required";
    if (!customData.customVideoUrl.trim())
      e.customVideoUrl = "Video URL is required";
    if (!customData.customThumbnailFile && !customData.customThumbnailUrl)
      e.customThumbnail = "Thumbnail is required";

    setErrors(e);
    setTouched({
      title: true,
      customCategory: true,
      customVideoUrl: true,
      customThumbnail: true,
    });
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("video_title", customData.title);
    formData.append("category_id", Number(customData.customCategory));

    if (customData.customVideoUrl) {
      formData.append("video_file", customData.customVideoUrl);
    }

    if (customData.customThumbnailFile) {
      formData.append("video_thumbnail", customData.customThumbnailFile);
    }

    try {
      if (isEditing) await updateCustomVideoDetails(editingCustomId, formData);
      else await addCustomVideo(formData);
      resetForm();
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "Something went wrong. Try again.",
      }));
    }
  };

  const filteredVideos =
    activeCategoryId === "all"
      ? videos
      : videos.filter((v) => String(v.category_id) === activeCategoryId);

  const trendingCount = videos.filter((v) => v.is_trending).length;

  const formatViews = (arr) => {
    const total = arr.reduce((sum, v) => {
      const raw = (v.views || "0").toString();
      return (
        sum + parseFloat(raw.replace("K", "")) * (raw.includes("K") ? 1000 : 1)
      );
    }, 0);
    if (total >= 1e6) return `${(total / 1e6).toFixed(1)}M`;
    if (total >= 1e3) return `${(total / 1e3).toFixed(1)}K`;
    return String(total || 0);
  };

  const activeCategoryName =
    activeCategoryId === "all"
      ? "All"
      : (CATEGORY_TYPE_LABELS[activeCategoryId] ?? "All");

  // Build category filter tabs from CATEGORY_TYPE_LABELS
  const categoryFilters = [
    { id: "all", label: "All" },
    ...Object.entries(CATEGORY_TYPE_LABELS).map(([id, label]) => ({
      id,
      label,
    })),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Custom Videos
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {videos.length} video{videos.length !== 1 ? "s" : ""} · Manage
                your custom video collection
              </p>
            </div>
          </div>
          <CustomButton
            onClick={openAddDrawer}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Video
          </CustomButton>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
              actionMessage.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  actionMessage.type === "success"
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {actionMessage.text}
              </p>
              {actionMessage.details && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {actionMessage.details}
                </p>
              )}
            </div>
            <button
              onClick={clearMessage}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Videos"
            value={videos.length}
            icon={Clapperboard}
            color="indigo"
          />
          <StatCard
            label="Total Views"
            value={formatViews(videos)}
            icon={Eye}
            color="blue"
          />
          <StatCard
            label="Trending"
            value={trendingCount}
            icon={Flame}
            color="orange"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden w-full flex items-center justify-between px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm mb-3"
          >
            <span>
              Category:{" "}
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {activeCategoryName}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${mobileFilterOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`${mobileFilterOpen ? "flex" : "hidden"} sm:flex flex-wrap gap-2`}
          >
            {categoryFilters.map(({ id, label }) => {
              const isActive = activeCategoryId === id;
              const count =
                id === "all"
                  ? videos.length
                  : videos.filter((v) => String(v.category_id) === id).length;

              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveCategoryId(id);
                    setMobileFilterOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-indigo-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700" />
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Loading custom videos...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Please wait while we fetch your videos
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Videos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              {error.message ?? "An error occurred while loading videos"}
            </p>
            <CustomButton
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </CustomButton>
          </div>
        )}

        {/* Video Grid */}
        {!loading && !error && filteredVideos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredVideos.map((short) => (
              <DailyShortCard
                key={short.id}
                short={short}
                isPlaying={currentPlaying === short.id}
                onPlayPause={(id) =>
                  setCurrentPlaying((prev) => (prev === id ? null : id))
                }
                onEdit={handleEditCustom}
                onDelete={handleDeleteCustom}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredVideos.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
            <Video className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Custom Videos Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first custom video
            </p>
            <CustomButton
              onClick={openAddDrawer}
              variant="primary"
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Video
            </CustomButton>
          </div>
        )}

        {/* Pagination */}
        {!loading && (customVideosDetails?.total_pages ?? 0) > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from(
              { length: customVideosDetails.total_pages },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPageNo(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  pageNo === p
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={resetForm}
        title={isEditing ? "Edit Custom Video" : "Upload New Custom Video"}
      >
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customData.title}
                onChange={(e) => setField("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder="Enter video title"
                className={inputClass("title")}
              />
              {errors.title && touched.title && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={customData.customCategory}
                onChange={(e) => setField("customCategory", e.target.value)}
                onBlur={() => handleBlur("customCategory")}
                className={inputClass("customCategory")}
              >
                <option value="">Select a category</option>
                {Object.entries(CATEGORY_TYPE_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.customCategory && touched.customCategory && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.customCategory}
                </p>
              )}
            </div>

            {/* YouTube URL */}
            <div>
              <YouTubeUrlInput
                label="YouTube Video URL"
                name="customVideoUrl"
                value={customData.customVideoUrl}
                onChange={(e) => setField("customVideoUrl", e.target.value)}
                onBlur={() => handleBlur("customVideoUrl")}
                required
              />
              {errors.customVideoUrl && touched.customVideoUrl && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.customVideoUrl}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail <span className="text-rose-500">*</span>
              </label>
              <FileUploaderWithPreview
                key={isEditing ? editingCustomId : "new"}
                imageFile={customData.customThumbnailFile}
                imageUrl={customData.customThumbnailUrl}
                setImageFile={(file) => setField("customThumbnailFile", file)}
                name="customThumbnail"
                label="Upload thumbnail (9:16 recommended)"
              />
              {errors.customThumbnail && touched.customThumbnail && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.customThumbnail}
                </p>
              )}
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800">
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {errors.submit}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEditing ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {isEditing ? "Update Video" : "Upload Video"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </CustomDrawer>
    </div>
  );
};

export default CustomVideoList;
