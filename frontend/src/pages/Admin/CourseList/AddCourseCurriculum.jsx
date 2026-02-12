import React, { useState, useEffect } from "react";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import YouTubeUrlInput from "@/components/videoUrlValidator/YouTubeUrlInput";
import { Plus, Trash2, AlertCircle, FileVideo, Image } from "lucide-react";

const AddCourseCurriculum = ({ curriculums = [], setCurriculum = () => {} }) => {
  const [localCurriculums, setLocalCurriculums] = useState(curriculums);
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync with parent
  useEffect(() => {
    setLocalCurriculums(curriculums);
    // Initialize errors and touched state
    const initialErrors = {};
    const initialTouched = {};
    curriculums.forEach((_, index) => {
      initialErrors[index] = {};
      initialTouched[index] = {};
    });
    setFormErrors(initialErrors);
    setTouched(initialTouched);
  }, [curriculums]);

  // Validate a single curriculum
  const validateCurriculum = (curriculum, index) => {
    const errors = {};
    
    if (!curriculum.header_type?.trim()) {
      errors.header_type = "Header type is required";
    }
    
    if (!curriculum.sequence_no?.toString().trim()) {
      errors.sequence_no = "Sequence number is required";
    } else if (isNaN(curriculum.sequence_no) || curriculum.sequence_no < 1) {
      errors.sequence_no = "Sequence must be a positive number";
    }
    
    if (!curriculum.title?.trim()) {
      errors.title = "Title is required";
    } else if (curriculum.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    }
    
    if (!curriculum.description?.trim()) {
      errors.description = "Description is required";
    } else if (curriculum.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }
    
    if (!curriculum.video_url?.trim()) {
      errors.video_url = "Video URL is required";
    }
    
    if (!curriculum.thumbnail_file) {
      errors.thumbnail_file = "Thumbnail is required";
    }
    
    return errors;
  };

  // Validate all curriculums before adding another
  const validateAllCurriculums = () => {
    const allErrors = {};
    let hasErrors = false;
    
    localCurriculums.forEach((curriculum, index) => {
      const errors = validateCurriculum(curriculum, index);
      if (Object.keys(errors).length > 0) {
        allErrors[index] = errors;
        hasErrors = true;
      }
    });
    
    setFormErrors(allErrors);
    return !hasErrors;
  };

  // Handle field change
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...localCurriculums];
    updated[index][name] = value;
    setLocalCurriculums(updated);
    setCurriculum(updated);
    
    // Clear error when user starts typing
    if (formErrors[index]?.[name]) {
      setFormErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], [name]: '' }
      }));
    }
  };

  // Handle video URL change
  const handleVideoUrlChange = (index, e) => {
    const { value } = e.target;
    const updated = [...localCurriculums];
    updated[index].video_url = value;
    setLocalCurriculums(updated);
    setCurriculum(updated);
    
    // Clear error when user starts typing
    if (formErrors[index]?.video_url) {
      setFormErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], video_url: '' }
      }));
    }
  };

  // Handle thumbnail upload
  const handleThumbnailChange = (index, file) => {
    const updated = [...localCurriculums];
    updated[index].thumbnail_file = file;
    setLocalCurriculums(updated);
    setCurriculum(updated);
    
    // Clear error when thumbnail is uploaded
    if (formErrors[index]?.thumbnail_file) {
      setFormErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], thumbnail_file: '' }
      }));
    }
  };

  // Handle blur
  const handleBlur = (index, field) => {
    setTouched(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: true }
    }));
    
    const errors = validateCurriculum(localCurriculums[index], index);
    if (errors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], [field]: errors[field] }
      }));
    }
  };

  // Add new curriculum
  const handleAddCurriculum = () => {
    // Mark all fields as touched for existing curriculums
    const newTouched = { ...touched };
    localCurriculums.forEach((_, index) => {
      newTouched[index] = {
        header_type: true,
        sequence_no: true,
        title: true,
        description: true,
        video_url: true,
        thumbnail_file: true,
      };
    });
    setTouched(newTouched);
    
    if (!validateAllCurriculums()) {
      // Find first error and scroll to it
      for (let i = 0; i < localCurriculums.length; i++) {
        if (Object.keys(formErrors[i] || {}).length > 0) {
          const firstErrorField = Object.keys(formErrors[i])[0];
          const errorElement = document.querySelector(`[data-curriculum="${i}"][name="${firstErrorField}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
          break;
        }
      }
      return;
    }

    const newCurriculum = {
      header_type: "",
      sequence_no: localCurriculums.length + 1,
      title: "",
      description: "",
      video_url: "",
      thumbnail_file: null,
    };

    const updated = [...localCurriculums, newCurriculum];
    setLocalCurriculums(updated);
    setCurriculum(updated);
    
    // Initialize touched and errors for new curriculum
    setTouched(prev => ({ ...prev, [localCurriculums.length]: {} }));
    setFormErrors(prev => ({ ...prev, [localCurriculums.length]: {} }));
  };

  // Remove a curriculum
  const handleRemoveCurriculum = (index) => {
    if (localCurriculums.length <= 1) {
      return;
    }
    
    const updated = localCurriculums.filter((_, i) => i !== index);
    setLocalCurriculums(updated);
    setCurriculum(updated);
    
    // Remove errors and touched for removed index
    const newErrors = { ...formErrors };
    const newTouched = { ...touched };
    delete newErrors[index];
    delete newTouched[index];
    
    // Re-index remaining errors and touched
    const reindexedErrors = {};
    const reindexedTouched = {};
    updated.forEach((_, newIndex) => {
      reindexedErrors[newIndex] = newErrors[newIndex + (newIndex >= index ? 1 : 0)] || {};
      reindexedTouched[newIndex] = newTouched[newIndex + (newIndex >= index ? 1 : 0)] || {};
    });
    
    setFormErrors(reindexedErrors);
    setTouched(reindexedTouched);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Course Curriculum
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add chapters, sections, and lessons for your course
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {localCurriculums.length} item{localCurriculums.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Curriculum Items */}
      <div className="space-y-4">
        {localCurriculums.map((curriculum, index) => (
          <div
            key={index}
            data-curriculum-index={index}
            className="relative border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 space-y-5"
          >
            {/* Curriculum Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Curriculum Item #{index + 1}
                </h3>
              </div>
              
              {/* Remove Button */}
              {localCurriculums.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCurriculum(index)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  aria-label="Remove curriculum item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Error Summary */}
            {Object.keys(formErrors[index] || {}).length > 0 && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">
                      Please fix the following errors:
                    </p>
                    <ul className="text-sm text-red-600 dark:text-red-500 mt-1 list-disc list-inside">
                      {Object.entries(formErrors[index] || {}).map(([field, error]) => (
                        <li key={field}>
                          {field.replace('_', ' ')}: {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Header Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Header Type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  data-curriculum={index}
                  name="header_type"
                  value={curriculum.header_type}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={() => handleBlur(index, 'header_type')}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors[index]?.header_type && touched[index]?.header_type
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100
                  `}
                >
                  <option value="">Select Header Type</option>
                  <option value="Chapter">Chapter</option>
                  <option value="Section">Section</option>
                  <option value="Lesson">Lesson</option>
                </select>
                {formErrors[index]?.header_type && touched[index]?.header_type && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors[index].header_type}
                  </p>
                )}
              </div>

              {/* Sequence Number */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Sequence Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  data-curriculum={index}
                  type="number"
                  name="sequence_no"
                  value={curriculum.sequence_no}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={() => handleBlur(index, 'sequence_no')}
                  onWheel={(e) => e.target.blur()}
                  min="1"
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors[index]?.sequence_no && touched[index]?.sequence_no
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100
                  `}
                  placeholder="e.g., 1"
                />
                {formErrors[index]?.sequence_no && touched[index]?.sequence_no && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors[index].sequence_no}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Title
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  data-curriculum={index}
                  type="text"
                  name="title"
                  value={curriculum.title}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={() => handleBlur(index, 'title')}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors[index]?.title && touched[index]?.title
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  placeholder="Enter curriculum item title"
                />
                {formErrors[index]?.title && touched[index]?.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors[index].title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Description
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  data-curriculum={index}
                  name="description"
                  value={curriculum.description}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={() => handleBlur(index, 'description')}
                  rows={3}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm resize-none
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors[index]?.description && touched[index]?.description
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  placeholder="Describe what will be covered in this curriculum item..."
                />
                {formErrors[index]?.description && touched[index]?.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors[index].description}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 10 characters. Current: {curriculum.description?.length || 0}
                </p>
              </div>

              {/* Video URL */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <FileVideo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                    Video URL
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <YouTubeUrlInput
                  name="video_url"
                  value={curriculum.video_url}
                  onChange={(e) => handleVideoUrlChange(index, e)}
                  required={true}
                  helperText="Enter the YouTube video URL for this curriculum item"
                />
                {formErrors[index]?.video_url && touched[index]?.video_url && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors[index].video_url}
                  </p>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Image className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                    Thumbnail Image
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <FileUploaderWithPreview
                  imageFile={curriculum.thumbnail_file}
                  setImageFile={(file) => handleThumbnailChange(index, file)}
                  name="thumbnail_file"
                  label={`Upload thumbnail for "${curriculum.title || 'this item'}"`}
                  required={true}
                />
                {formErrors[index]?.thumbnail_file && touched[index]?.thumbnail_file && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors[index].thumbnail_file}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={handleAddCurriculum}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 
                   dark:hover:bg-indigo-600 text-white font-medium rounded-lg 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                   flex items-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          Add Another Curriculum Item
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Complete all required fields before adding another item
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Curriculum Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Total Items</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{localCurriculums.length}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Chapters</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {localCurriculums.filter(c => c.header_type === 'Chapter').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Sections</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {localCurriculums.filter(c => c.header_type === 'Section').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Lessons</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {localCurriculums.filter(c => c.header_type === 'Lesson').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseCurriculum;