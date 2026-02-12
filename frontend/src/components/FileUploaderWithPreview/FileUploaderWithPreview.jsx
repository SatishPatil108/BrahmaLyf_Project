import { useEffect, useState } from "react";

const FileUploaderWithPreview = ({ 
  imageFile = null, 
  setImageFile, 
  imageUrl = null,
  name = '',
  label = "Upload image",
  required = false,
  disabled = false
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;
  const [previewSrc, setPreviewSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  // Update preview when imageFile or imageUrl changes
  useEffect(() => {
    if (imageFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(imageFile.type)) {
        setError('Invalid file type. Please upload JPG, PNG, or GIF images.');
        setPreviewSrc(null);
        return;
      }

      // Validate file size (5MB max)
      if (imageFile.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        setPreviewSrc(null);
        return;
      }

      setError(null);
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewSrc(objectUrl);

      // Cleanup old blob URL to avoid memory leaks
      return () => URL.revokeObjectURL(objectUrl);
    } else if (imageUrl) {
      setError(null);
      setPreviewSrc(`${BASE_URL}${imageUrl}`);
    } else {
      setPreviewSrc(null);
      setError(null);
    }
  }, [imageFile, imageUrl, BASE_URL]);

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
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    } else {
      setError('Please drop a valid image file (JPG, PNG, GIF)');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleRemove = () => {
    setImageFile(null);
    setPreviewSrc(null);
    setError(null);
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
          {previewSrc && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium flex items-center gap-1"
              disabled={disabled}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          )}
        </div>
      )}

      {/* Upload Field */}
      <div className="relative">
        <label
          className={`
            flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer
            transition-all duration-300
            ${disabled 
              ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700' 
              : isDragging
                ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
            }
            bg-white dark:bg-gray-900
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={disabled ? undefined : handleDrop}
        >
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 mb-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-indigo-600 dark:text-indigo-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                {previewSrc ? "Change image" : "Upload image"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                JPG, PNG, GIF, WebP up to 5MB
              </p>
            </div>
          </div>

          <input
            type="file"
            name={name}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
            required={required && !previewSrc}
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <svg className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Preview Section */}
      {previewSrc && !error && (
        <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Image Preview
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {imageFile?.name || imageUrl?.split('/').pop() || "Selected image"}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <a 
              href={previewSrc} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 shadow-md"
            >
              <img
                src={previewSrc}
                alt="Preview"
                className="w-48 h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=Image&background=indigo&color=fff';
                  e.target.className = 'w-48 h-48 object-contain bg-gray-100 dark:bg-gray-800 p-4';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Click to view full size</span>
              </div>
            </a>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {imageFile && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {imageFile?.type?.split('/')[1]?.toUpperCase() || 'IMAGE'}
              </span>
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
          Supported formats: JPG, PNG, GIF, WebP. Maximum file size: 5MB. For best results, use images with a 1:1 aspect ratio.
        </p>
      </div>
    </div>
  );
};

export default FileUploaderWithPreview;