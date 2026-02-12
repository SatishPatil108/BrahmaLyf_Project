import { useState, useEffect } from "react";
import { Youtube, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

const extractVideoId = (url) => {
  if (!url) return null;

  try {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
  } catch {
    return null;
  }

  return null;
};

const YouTubeUrlInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  helperText = "Paste a YouTube video URL to preview"
}) => {
  const [inputValue, setInputValue] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Update inputValue when value changes
  useEffect(() => {
    if (!value) {
      setInputValue("");
      setVideoId(null);
      setIsValid(false);
      return;
    }

    // If parent sends embed URL, extract ID and show original URL
    if (value.includes("youtube.com/embed/")) {
      const id = extractVideoId(value);
      if (id) {
        setVideoId(id);
        setIsValid(true);
        // Show a user-friendly URL format
        setInputValue(`https://youtube.com/watch?v=${id}`);
      }
    } else {
      setInputValue(value);
      const id = extractVideoId(value);
      if (id) {
        setVideoId(id);
        setIsValid(true);
      }
    }
  }, [value]);

  const validateYouTubeUrl = (url) => {
    if (!url) {
      return { valid: false, error: "" };
    }

    const id = extractVideoId(url);
    if (!id) {
      return { 
        valid: false, 
        error: "Please enter a valid YouTube URL. Supported formats: youtu.be/VIDEO_ID, youtube.com/watch?v=VIDEO_ID" 
      };
    }

    if (id.length !== 11) {
      return { 
        valid: false, 
        error: "Invalid YouTube video ID format" 
      };
    }

    return { valid: true, error: "" };
  };

  const handleInputChange = (e) => {
    const url = e.target.value.trim();
    setInputValue(url);
    setIsTouched(true);

    const { valid, error } = validateYouTubeUrl(url);
    const id = extractVideoId(url);

    if (!valid) {
      setError(error);
      setVideoId(null);
      setIsValid(false);
      
      // Still pass original input upwards
      onChange({
        target: { name, value: url }
      });
      return;
    }

    setError("");
    setVideoId(id);
    setIsValid(true);

    // Generate embed URL for backend storage
    const embedUrl = `https://www.youtube.com/embed/${id}`;
    onChange({
      target: { name, value: embedUrl }
    });
  };

  const handleBlur = () => {
    if (inputValue) {
      setIsTouched(true);
      const { valid, error } = validateYouTubeUrl(inputValue);
      if (!valid) {
        setError(error);
      }
    }
  };

  const handleClear = () => {
    setInputValue("");
    setVideoId(null);
    setError("");
    setIsValid(false);
    setIsTouched(false);
    onChange({
      target: { name, value: "" }
    });
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {isValid && videoId && (
            <a
              href={`https://youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Open in YouTube
            </a>
          )}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <div className="flex items-center">
          <div className="absolute left-3 text-red-600 dark:text-red-400">
            <Youtube className="w-5 h-5" />
          </div>
          <input
            type="url"
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required={required}
            disabled={disabled}
            placeholder="https://youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
            className={`
              w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${disabled 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-700'
                : error && isTouched
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                  : isValid
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
              }
              text-gray-900 dark:text-gray-100
            `}
          />
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear input"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Validation Status */}
        {inputValue && (
          <div className="flex items-center gap-2 mt-2">
            {isValid ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Valid YouTube URL</span>
              </div>
            ) : error && isTouched ? (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}

      {/* Video Preview */}
      {videoId && isValid && (
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Video Preview
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Live preview • Click play to test
            </span>
          </div>
          
          <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-black">
            <iframe
              className="w-full h-64"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
              title="YouTube video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                YouTube
              </span>
            </div>
          </div>

          {/* Video Info */}
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview only
            </span>
            <span>Video ID: <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{videoId}</code></span>
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          Supported URL Formats
        </h5>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            • https://youtube.com/watch?v=dQw4w9WgXcQ
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            • https://youtu.be/dQw4w9WgXcQ
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            • https://youtube.com/shorts/VIDEO_ID
          </p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeUrlInput;