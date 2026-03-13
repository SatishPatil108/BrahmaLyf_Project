import React, { useEffect, useRef, useState } from "react";
import {
  Music,
  Plus,
  SquarePen,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Volume2,
  Globe,
} from "lucide-react";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import AudioUploaderWithPreview from "@/components/AudioFileUploaderPreview/AudioUploaderWithPreview";
import useMusicList from "./useMusicList";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";
import useDomainData from "../CourseList/useDomainData";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const MusicList = () => {
  const { pageNo, pageSize, setPageNo } = usePagination(1, 6);

  const {
    audiosDetails,
    loading,
    error,
    addMusic,
    updateMusicDetails,
    deleteMusic,
    isSubmitting,
    actionMessage,
    clearMessage,
  } = useMusicList(pageNo, pageSize);

  const musics = audiosDetails?.audios ?? [];

  const { domainsDetails } = useDomainData();
  const domains = domainsDetails?.domains ?? [];

  // Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSongId, setEditingSongId] = useState(null);
  const [errors, setErrors] = useState({});

  const [songName, setSongName] = useState("");
  const [songInfo, setSongInfo] = useState("");
  const [songCategory, setSongCategory] = useState("");
  const [songThumbnailFile, setSongThumbnailFile] = useState(null);
  const [songThumbnailUrl, setSongThumbnailUrl] = useState(null);
  const [songFile, setSongFile] = useState(null);
  const [songDuration, setSongDuration] = useState("");

  // Audio playback
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  // ── Audio playback ─────────────────────────────────────────────────────────

  const handlePlayPause = (filePath) => {
    const audioUrl = `${BASE_URL}${filePath}`;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setCurrentAudio(filePath);
      audioRef.current.onended = () => setCurrentAudio(null);
      return;
    }

    if (currentAudio === filePath) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      return;
    }

    audioRef.current.pause();
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play();
    setCurrentAudio(filePath);
    audioRef.current.onended = () => setCurrentAudio(null);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditingSongId(null);
    setSongName("");
    setSongInfo("");
    setSongCategory("");
    setSongThumbnailFile(null);
    setSongThumbnailUrl(null);
    setSongFile(null);
    setSongDuration("");
    setErrors({});
  };

  const openAddDrawer = () => {
    setIsEditing(false);
    setEditingSongId(null);
    setSongName("");
    setSongInfo("");
    setSongCategory("");
    setSongThumbnailFile(null);
    setSongThumbnailUrl(null);
    setSongFile(null);
    setSongDuration("");
    setErrors({});
    clearMessage();
    setIsDrawerOpen(true);
  };

  const handleEditSong = (music) => {
    setIsEditing(true);
    setEditingSongId(music.id);
    setSongName(music.music_title);
    setSongInfo(music.music_description);
    setSongCategory(music.domain_id);
    setSongThumbnailFile(null);
    setSongThumbnailUrl(music.music_thumbnail ?? null);
    setSongFile(null);
    setSongDuration("");
    setErrors({});
    clearMessage();
    setIsDrawerOpen(true);
  };

  const handleDeleteSong = async (id, title) => {
    if (!id) return;
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteMusic(id);
    }
  };

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateForm = () => {
    const newErrors = {};

    if (!songName.trim()) {
      newErrors.songName = "Song name is required.";
    }

    if (!songInfo.trim()) {
      newErrors.songInfo = "Song information is required.";
    } else if (songInfo.trim().length < 10) {
      newErrors.songInfo = "Song information must be at least 10 characters.";
    }

    if (!songCategory) {
      newErrors.songCategory = "Song category is required.";
    }

    if (!songThumbnailFile && !songThumbnailUrl) {
      newErrors.songThumbnail = "Song thumbnail is required.";
    }

    if (!songFile && !isEditing) {
      newErrors.songFile = "Song file is required.";
    }

    if (!songDuration) {
      newErrors.songFile = "Audio duration is still loading. Please wait.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("music_title", songName);
    formData.append("music_description", songInfo);
    formData.append("domain_id", songCategory);
    formData.append("music_duration", songDuration);

    if (songFile && typeof songFile === "object") {
      formData.append("music_file", songFile);
    }
    if (songThumbnailFile && typeof songThumbnailFile === "object") {
      formData.append("music_thumbnail", songThumbnailFile);
    }

    try {
      if (isEditing) {
        await updateMusicDetails(editingSongId, formData);
      } else {
        await addMusic(formData);
      }
      resetForm();
    } catch {}
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Music Library
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your music collection
              </p>
            </div>
          </div>

          <CustomButton
            onClick={openAddDrawer}
            variant="primary"
            className="relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300  cursor-pointer"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Song
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
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800" />
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Loading music library...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Please wait while we fetch your songs
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Music
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              {error.message ?? "An error occurred while loading music"}
            </p>
            <CustomButton
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </CustomButton>
          </div>
        )}

        {/* Music Grid */}
        {!loading && !error && musics.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 sm:gap-6">
              {musics.map((music) => (
                <div
                  key={music.id}
                  className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                    <img
                      src={`${BASE_URL}${music.music_thumbnail}`}
                      className="w-full h-full object-cover"
                      alt={music.music_title}
                    />
                    {/* Play/Pause Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <button
                        onClick={() => handlePlayPause(music.music_file)}
                        className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
                      >
                        {currentAudio === music.music_file &&
                        !audioRef.current?.paused ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                      </button>
                    </div>
                    {/* Duration Badge */}
                    {music.music_duration && (
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-xs font-medium text-white">
                        {music.music_duration}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2.5">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 flex-1">
                        {music.music_title}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEditSong(music)}
                          className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                          title="Edit song"
                        >
                          <SquarePen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSong(music.id, music.music_title)
                          }
                          disabled={isSubmitting}
                          className="p-1 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                          title="Delete song"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                      {music.music_description}
                    </p>
                    {/* Now Playing Indicator */}
                    {currentAudio === music.music_file &&
                      !audioRef.current?.paused && (
                        <div className="mt-2 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <div className="absolute -top-1 -right-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              </div>
                            </div>
                            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                              Now playing
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {audiosDetails.total_pages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={pageNo}
                  totalPages={audiosDetails.total_pages}
                  onPageChange={setPageNo}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && musics.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
            <Music className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Music Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first song to the library
            </p>
            <CustomButton
              onClick={openAddDrawer}
              variant="primary"
              className="relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300  cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Add first Song
            </CustomButton>
          </div>
        )}
      </div>

      {/* Add / Edit Song Drawer with Fade Animation */}
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={resetForm}
        title={isEditing ? "Edit Song" : "Add New Song"}
        subtitle={
          isEditing
            ? "Update song details below"
            : "Add a new song to your library"
        }
        className="transition-opacity duration-500 ease-in-out opacity-0 data-[open=true]:opacity-100"
        style={{
          transition: "opacity 500ms ease-in-out",
          opacity: isDrawerOpen ? 1 : 0,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Scrollable fields */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {/* Song Name */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Song Name *
              </label>
              <input
                type="text"
                value={songName}
                onChange={(e) => {
                  setSongName(e.target.value);
                  if (errors.songName)
                    setErrors((p) => ({ ...p, songName: null }));
                }}
                placeholder="e.g., Morning Meditation"
                className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100
                                    bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                                    transition-all duration-200
                                    ${
                                      errors.songName
                                        ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                                        : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                                    }`}
              />
              {errors.songName && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.songName}
                </p>
              )}
            </div>

            {/* Song Description */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Song Description *
              </label>
              <textarea
                rows={4}
                value={songInfo}
                onChange={(e) => {
                  setSongInfo(e.target.value);
                  if (errors.songInfo)
                    setErrors((p) => ({ ...p, songInfo: null }));
                }}
                placeholder="Describe your song (genre, mood, purpose...)"
                className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100
                                    bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                                    transition-all duration-200 resize-none
                                    ${
                                      errors.songInfo
                                        ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                                        : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                                    }`}
              />
              {errors.songInfo && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.songInfo}
                </p>
              )}
            </div>

            {/* Domain / Category */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Domain *
                </div>
              </label>
              <select
                value={songCategory ?? ""}
                onChange={(e) => {
                  setSongCategory(Number(e.target.value));
                  if (errors.songCategory)
                    setErrors((p) => ({ ...p, songCategory: null }));
                }}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2
                                    text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900
                                    ${
                                      errors.songCategory
                                        ? "border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500"
                                        : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                                    }`}
              >
                <option value="">Select Domain</option>
                {domains.map((d) => (
                  <option key={d.domain_id} value={d.domain_id}>
                    {d.domain_name}
                  </option>
                ))}
              </select>
              {errors.songCategory && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.songCategory}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Song Thumbnail *
              </label>
              <FileUploaderWithPreview
                key={isEditing ? editingSongId : "new"}
                imageFile={songThumbnailFile}
                imageUrl={songThumbnailUrl}
                setImageFile={(file) => {
                  setSongThumbnailFile(file);
                  if (errors.songThumbnail)
                    setErrors((p) => ({ ...p, songThumbnail: null }));
                }}
                className={
                  errors.songThumbnail
                    ? "border-red-300 dark:border-red-700"
                    : ""
                }
              />
              {errors.songThumbnail && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.songThumbnail}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Recommended: Square image, max 2MB
              </p>
            </div>

            {/* Audio File */}
            <div>
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                Song File {!isEditing && "*"}
              </label>
              <AudioUploaderWithPreview
                audioFile={songFile}
                setDuration={(duration) => setSongDuration(duration)}
                setAudioFile={(file) => {
                  setSongFile(file);
                  if (errors.songFile)
                    setErrors((p) => ({ ...p, songFile: null }));
                }}
                className={
                  errors.songFile ? "border-red-300 dark:border-red-700" : ""
                }
              />
              {errors.songFile && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.songFile}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {isEditing
                  ? "Leave empty to keep existing audio file"
                  : "Supported formats: MP3, WAV, M4A"}
              </p>
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errors.submit}
                </p>
              </div>
            )}
          </div>

          {/* Pinned footer — always visible, never scrolls away */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-end gap-3">
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !songDuration}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isEditing ? "Update Song" : "Create Song"}
                    </>
                  )}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </CustomDrawer>
    </div>
  );
};

export default MusicList;
