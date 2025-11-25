import { useEffect, useState } from "react";

const AudioUploaderWithPreview = ({
    audioFile = null,
    setDuration,
    setAudioFile,
    name = "",
    className = ""
}) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

    const [previewSrc, setPreviewSrc] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Generate preview URL for audio
    useEffect(() => {
        if (audioFile) {
            if (typeof audioFile === "object") {
                const objectUrl = URL.createObjectURL(audioFile);
                setPreviewSrc(objectUrl);

                return () => URL.revokeObjectURL(objectUrl);
            } if (typeof audioFile === "string") {
                setPreviewSrc(`${BASE_URL}${audioFile}`);
            }
        } else {
            setPreviewSrc(null);
        }
    }, [audioFile, BASE_URL]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            handleFileSelect(file);
        }
    };

    const handleFileSelect = (file) => {
        setAudioFile(file);

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            const audio = new Audio();
            audio.src = objectUrl;

            audio.addEventListener("loadedmetadata", () => {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60)
                    .toString()
                    .padStart(2, '0');
                setDuration(`${minutes}:${seconds}`);
                URL.revokeObjectURL(objectUrl);
            });
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Field */}
            <div className="relative">
                <label
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                        ${isDragging 
                            ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                        }
                        bg-white dark:bg-gray-900`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 mb-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <svg 
                                className="w-6 h-6 text-indigo-600 dark:text-indigo-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" 
                                />
                            </svg>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                {audioFile ? "Change audio file" : "Upload audio file"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Drag & drop or click to browse
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                MP3, WAV, AAC formats
                            </p>
                        </div>
                    </div>

                    <input
                        type="file"
                        name={name}
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleFileSelect(file);
                        }}
                    />
                </label>
            </div>

            {/* Preview Section */}
            {previewSrc && (
                <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Selected Audio
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {audioFile?.name || audioFile.split("/").pop()}
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-full max-w-md">
                            <audio
                                controls
                                src={previewSrc}
                                className="w-full h-12 rounded-lg [&::-webkit-media-controls-panel]:bg-gray-100 dark:[&::-webkit-media-controls-panel]:bg-gray-800"
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                        
                        <div className="flex items-center justify-center w-full">
                            <button
                                type="button"
                                onClick={() => {
                                    setAudioFile(null);
                                    setDuration("");
                                }}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove Audio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Helper Text */}
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                    Supported formats: MP3, WAV, AAC. Maximum file size: 25MB. For best results, use high-quality audio files.
                </p>
            </div>
        </div>
    );
};

export default AudioUploaderWithPreview;