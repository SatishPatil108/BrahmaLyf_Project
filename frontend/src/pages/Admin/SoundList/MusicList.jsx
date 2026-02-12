import React, { useEffect, useRef, useState } from 'react';
import { Music, Plus, SquarePen, Trash2, Play, Pause, AlertCircle, CheckCircle, Loader2, Volume2 } from 'lucide-react';
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import FileUploaderWithPreview from '@/components/FileUploaderWithPreview/FileUploaderWithPreview';
import AudioUploaderWithPreview from '@/components/AudioFileUploaderPreview/AudioUploaderWithPreview';
import useMusicList from './useMusicList';
import usePagination from '@/hooks';
import Pagination from '@/components/Pagination/Pagination';

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// Color configuration
const COLORS = {
  primary: {
    light: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    dark: { bg: "bg-indigo-900/20", text: "text-indigo-400", border: "border-indigo-800" },
    icon: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-600 to-purple-600"
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
  }
};

const MusicList = () => {
    const {
        pageNo,
        pageSize,
        setPageNo,
        setPageSize
    } = usePagination(1, 6);

    const { 
        audiosDetails, 
        loading, 
        error, 
        addMusic, 
        updateMusicDetails, 
        deleteMusic,
        isSubmitting,
        actionMessage,
        clearMessage
    } = useMusicList(pageNo, pageSize);

    const musics = audiosDetails.audios;

    const [musicDetails, setMusicDetails] = useState({
        songName: '',
        songInfo: '',
        songThumbnail: null,
        songFile: null
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [errors, setErrors] = useState({});
    const audioRef = useRef(null);

    // Handle play/pause
    const handlePlayPause = (filePath) => {
        const audioUrl = `${BASE_URL}${filePath}`;

        // If no audio exists yet
        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.play();
            setCurrentAudio(filePath);

            audioRef.current.onended = () => setCurrentAudio(null);
            return;
        }

        // If clicking same song → toggle pause / play
        if (currentAudio === filePath) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
            return;
        }

        // Switching to a new audio
        audioRef.current.pause();
        audioRef.current = new Audio(audioUrl);
        audioRef.current.play();
        setCurrentAudio(filePath);

        audioRef.current.onended = () => setCurrentAudio(null);
    };

    const handleChange = (e) => {
        setMusicDetails({ ...musicDetails, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const handleAddSongs = () => {
        setIsDrawerOpen(true);
        setIsEditing(false);
        setMusicDetails({
            songName: '',
            songInfo: '',
            songThumbnail: null,
            songFile: null
        });
        setErrors({});
        clearMessage();
    };

    const handleEditSong = (music) => {
        setIsEditing(true);
        setMusicDetails({
            songId: music.id,
            songName: music.music_title,
            songInfo: music.music_description,
            songThumbnail: music.music_thumbnail,
            songFile: null
        });
        setIsDrawerOpen(true);
        setErrors({});
        clearMessage();
    };

    const handleDeleteSong = async (id, title) => {
        if (!id) return;
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            await deleteMusic(id);
        }
    };

    const resetForm = () => {
        setIsDrawerOpen(false);
        setIsEditing(false);
        setMusicDetails({
            songName: '',
            songInfo: '',
            songThumbnail: null,
            songFile: null
        });
        setErrors({});
        clearMessage();
    };

    const validateForm = () => {
        const newErrors = {};

        // Music List Name
        if (!musicDetails.songName.trim()) {
            newErrors.songName = "Song name is required.";
        }

        // Music Info
        if (!musicDetails.songInfo.trim()) {
            newErrors.songInfo = "Song information is required.";
        } else if (musicDetails.songInfo.trim().length < 10) {
            newErrors.songInfo = "Song information must be at least 10 characters.";
        }

        // Music Thumbnail
        if (!musicDetails.songThumbnail) {
            newErrors.songThumbnail = "Song thumbnail is required.";
        }

        // Music File
        if (!musicDetails.songFile && !isEditing) {
            newErrors.songFile = "Song file is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 💾 Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessage();
        
        if (!validateForm()) return;

        try {
            const formData = new FormData();
            formData.append("music_title", musicDetails.songName);
            formData.append("music_description", musicDetails.songInfo);

            if (musicDetails.songFile && typeof musicDetails.songFile === "object") {
                formData.append("music_file", musicDetails.songFile);
            }
            if (musicDetails.songThumbnail && typeof musicDetails.songThumbnail === "object") {
                formData.append("music_thumbnail", musicDetails.songThumbnail);
            }

            if (isEditing) {
                await updateMusicDetails(musicDetails.songId, formData);
            } else {
                await addMusic(formData);
            }
            
            resetForm();
        } catch (error) {
            console.error(error);
        }
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
                        onClick={handleAddSongs}
                        variant="primary"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Song
                    </CustomButton>
                </div>

                {/* Action Message */}
                {actionMessage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        actionMessage.type === 'success' 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                        {actionMessage.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                        <div className="flex-1">
                            <p className={`font-medium ${
                                actionMessage.type === 'success' 
                                    ? 'text-green-700 dark:text-green-400' 
                                    : 'text-red-700 dark:text-red-400'
                            }`}>
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
                            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
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
                            {error.message || "An error occurred while loading music"}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {musics.map((music) => (
                                <div
                                    key={music.id}
                                    className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
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
                                                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
                                            >
                                                {currentAudio === music.music_file && !audioRef.current?.paused ? (
                                                    <Pause className="w-6 h-6 text-white" />
                                                ) : (
                                                    <Play className="w-6 h-6 text-white ml-0.5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {music.music_title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditSong(music)}
                                                    className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                                                    title="Edit song"
                                                >
                                                    <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSong(music.id, music.music_title)}
                                                    disabled={isSubmitting}
                                                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                                                    title="Delete song"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {music.music_description}
                                        </p>

                                        {/* Audio Playing Indicator */}
                                        {currentAudio === music.music_file && !audioRef.current?.paused && (
                                            <div className="mt-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                        <div className="absolute -top-1 -right-1">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                        Now playing
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
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
                            onClick={handleAddSongs}
                            variant="primary"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Song
                        </CustomButton>
                    </div>
                )}
            </div>

            {/* Add/Edit Song Drawer */}
            <CustomDrawer
                isOpen={isDrawerOpen}
                onClose={resetForm}
                title={isEditing ? "Edit Song" : "Add New Song"}
                subtitle={isEditing ? "Update song details below" : "Add a new song to your library"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Song Name */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                            Song Name *
                        </label>
                        <input
                            type="text"
                            name="songName"
                            value={musicDetails.songName}
                            onChange={handleChange}
                            placeholder="e.g., Morning Meditation"
                            className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                                placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                                ${errors.songName
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

                    {/* Song Info */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                            Song Description *
                        </label>
                        <textarea
                            name="songInfo"
                            rows={4}
                            value={musicDetails.songInfo}
                            onChange={handleChange}
                            placeholder="Describe your song (genre, mood, purpose...)"
                            className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                                placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 resize-none
                                ${errors.songInfo
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

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                            Song Thumbnail *
                        </label>
                        <FileUploaderWithPreview
                            key={isEditing ? musicDetails.songId : "new"}
                            imageFile={typeof musicDetails.songThumbnail === "object" ? musicDetails.songThumbnail : null}
                            imageUrl={typeof musicDetails.songThumbnail === "string" ? musicDetails.songThumbnail : null}
                            setImageFile={(file) => {
                                setMusicDetails(prev => ({ ...prev, songThumbnail: file }));
                                if (errors.songThumbnail) setErrors(prev => ({ ...prev, songThumbnail: null }));
                            }}
                            className={`${errors.songThumbnail ? 'border-red-300 dark:border-red-700' : ''}`}
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

                    {/* Audio File Upload */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
                            Song File {!isEditing && "*"}
                        </label>
                        <AudioUploaderWithPreview
                            audioFile={musicDetails.songFile}
                            setAudioFile={(file) => {
                                setMusicDetails(prev => ({ ...prev, songFile: file }));
                                if (errors.songFile) setErrors(prev => ({ ...prev, songFile: null }));
                            }}
                            className={`${errors.songFile ? 'border-red-300 dark:border-red-700' : ''}`}
                        />
                        {errors.songFile && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {errors.songFile}
                            </p>
                        )}
                        {isEditing && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Leave empty to keep existing audio file
                            </p>
                        )}
                        {!isEditing && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Supported formats: MP3, WAV, M4A
                            </p>
                        )}
                    </div>

                    {/* Form submission errors */}
                    {errors.submit && (
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {errors.submit}
                            </p>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="sticky bottom-0 pt-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 -mx-4 px-4">
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
                                disabled={isSubmitting}
                                className="min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        {isEditing ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        {isEditing ? 'Update Song' : 'Create Song'}
                                    </>
                                )}
                            </CustomButton>
                        </div>
                    </div>
                </form>
            </CustomDrawer>
        </div>
    );
};

export default MusicList;