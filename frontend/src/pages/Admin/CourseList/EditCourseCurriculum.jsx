import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import YouTubeUrlInput from "@/components/videoUrlValidator/YouTubeUrlInput";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Hash,
  FileText,
  Video,
  Image,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const EditCourseCurriculum = ({
  curriculumDetails,
  onClose,
  isDrawerOpen,
  isEditing,
  onSubmit,
}) => {
  // local form state
  const [curriculumData, setCurriculumData] = useState({
    week_no: "",
    title: "",
    description: "",
    video_id: "",
    video_url: "",
    thumbnail_file: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (curriculumDetails) {
      setCurriculumData({
        week_no: curriculumDetails.week_no || "",
        title: curriculumDetails.title || "",
        description: curriculumDetails.description || "",
        video_id: curriculumDetails.video_id || "",
        video_url: curriculumDetails.video_url || "",
        thumbnail_file: curriculumDetails.thumbnail_url || null,
      });
    }

    // Reset errors and touched states
    setFormErrors({});
    setTouched({});
    setApiError(null);
  }, [curriculumDetails, isDrawerOpen]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumbnail_file") {
      setCurriculumData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setCurriculumData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (formErrors[name] && touched[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError(null);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    const value = curriculumData[field];
    let error = "";

    switch (field) {
      case "week_no":
        if (!value?.toString().trim()) error = "Week number is required";
        else if (isNaN(value) || value < 1 || value > 52)
          error = "Week number must be a positive number between 1 and 52";
        break;

      case "title":
        if (!value?.trim()) error = "Title is required";
        else if (value.trim().length < 3)
          error = "Title must be at least 3 characters";
        break;

      case "description":
        if (!value?.trim()) error = "Description is required";
        else if (value.trim().length < 10)
          error = "Description must be at least 10 characters";
        break;

      case "video_url":
        if (!value?.trim()) error = "Video URL is required";
        break;

      case "thumbnail_file":
        if (!isEditing && !value) error = "Thumbnail is required";
        break;
    }

    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!curriculumData.week_no?.toString().trim()) {
      errors.week_no = "Week number is required";
    } else if (
      isNaN(curriculumData.week_no) ||
      curriculumData.week_no < 1 ||
      curriculumData.week_no > 52
    ) {
      errors.week_no = "Week number must be a positive number between 1 and 52";
    }

    if (!curriculumData.title?.trim()) {
      errors.title = "Title is required";
    } else if (curriculumData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!curriculumData.description?.trim()) {
      errors.description = "Description is required";
    } else if (curriculumData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!curriculumData.video_url?.trim()) {
      errors.video_url = "Video URL is required";
    }

    if (!isEditing && !curriculumData.thumbnail_file) {
      errors.thumbnail_file = "Thumbnail is required";
    }

    return errors;
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allFields = ["week_no", "title", "description", "video_url"];
    if (!isEditing) {
      allFields.push("thumbnail_file");
    }

    const newTouched = {};
    allFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`,
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("week_no", curriculumData.week_no);
      formData.append("title", curriculumData.title.trim());
      formData.append("description", curriculumData.description.trim());
      formData.append("video_url", curriculumData.video_url.trim());

      if (isEditing) {
        formData.append("video_id", curriculumData.video_id);
      }

      if (curriculumData.thumbnail_file instanceof File) {
        formData.append("thumbnail_file", curriculumData.thumbnail_file);
      }

      await onSubmit(formData);

      // Clear form only on successful submission
      setCurriculumData({
        week_no: "",
        title: "",
        description: "",
        video_id: "",
        video_url: "",
        thumbnail_file: null,
      });
    } catch (err) {
      setApiError(
        err.message || "Failed to save curriculum. Please try again.",
      );
    }
  };

  const inputClass = (fieldName) => `
        w-full px-4 py-2.5 rounded-lg border text-sm
        focus:outline-none focus:ring-2 focus:ring-offset-0
        ${
          formErrors[fieldName] && touched[fieldName]
            ? "border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        }
        text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
    `;

  return (
    <CustomDrawer
      title={isEditing ? "Edit Curriculum Module" : "Add New Module"}
      isOpen={isDrawerOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Object.keys(formErrors).length === 0 ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                All fields valid
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                {Object.keys(formErrors).length} error(s) to fix
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <CustomButton onClick={onClose} variant="outline">
              Cancel
            </CustomButton>
            <CustomButton onClick={handleSubmit} variant="primary">
              {isEditing ? "Update Module" : "Add Module"}
            </CustomButton>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* API Error Display */}
        {apiError && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                  Failed to save module
                </p>
                <p className="text-sm text-red-600 dark:text-red-500">
                  {apiError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? "Edit Module" : "New Module"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isEditing
                ? "Update the curriculum module details"
                : "Add a new module to the curriculum"}
            </p>
          </div>
        </div>

        {/* Week Number */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Week Number <span className="text-red-500 ml-1">*</span>
            </div>
          </label>
          <select
            name="week_no"
            value={curriculumData.week_no || ""}
            onChange={handleInputChange}
            onBlur={() => handleBlur("week_no")}
            className={inputClass("week_no")}
            required
          >
            <option value="" disabled>
              Select a week
            </option>
            {[...Array(53)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Week {i + 1}
              </option>
            ))}
          </select>
          {formErrors.week_no && touched.week_no && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.week_no}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Module Title <span className="text-red-500 ml-1">*</span>
            </div>
          </label>
          <input
            type="text"
            name="title"
            value={curriculumData.title || ""}
            onChange={handleInputChange}
            onBlur={() => handleBlur("title")}
            className={inputClass("title")}
            required
            placeholder="e.g., Introduction to Mindfulness"
          />
          {formErrors.title && touched.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description <span className="text-red-500 ml-1">*</span>
            </div>
          </label>
          <textarea
            name="description"
            value={curriculumData.description || ""}
            onChange={handleInputChange}
            onBlur={() => handleBlur("description")}
            rows={4}
            className={inputClass("description") + " resize-none"}
            required
            placeholder="Describe what will be covered in this module..."
          />
          {formErrors.description && touched.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Minimum 10 characters. Current:{" "}
            {curriculumData.description?.length || 0}
          </p>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video URL <span className="text-red-500 ml-1">*</span>
            </div>
          </label>
          <YouTubeUrlInput
            name="video_url"
            value={curriculumData.video_url || ""}
            onChange={handleInputChange}
            required={true}
            helperText="Enter the YouTube URL for this module's video"
          />
          {formErrors.video_url && touched.video_url && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.video_url}
            </p>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Thumbnail Image
              {!isEditing && <span className="text-red-500 ml-1">*</span>}
              {isEditing && (
                <span className="text-gray-500 ml-1">(optional)</span>
              )}
            </div>
          </label>
          <FileUploaderWithPreview
            imageFile={
              typeof curriculumData.thumbnail_file === "object"
                ? curriculumData.thumbnail_file
                : null
            }
            imageUrl={
              typeof curriculumData.thumbnail_file === "string"
                ? curriculumData.thumbnail_file
                : null
            }
            setImageFile={(file) =>
              handleInputChange({
                target: { name: "thumbnail_file", files: [file] },
              })
            }
            name="thumbnail_file"
            label={
              isEditing
                ? "Update thumbnail image (optional)"
                : "Upload thumbnail image"
            }
            required={!isEditing}
          />
          {formErrors.thumbnail_file && touched.thumbnail_file && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.thumbnail_file}
            </p>
          )}
        </div>

        {/* Module Summary */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-16 border border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Module Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Week Number:
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {curriculumData.week_no || "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Title Length:
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {curriculumData.title?.length || 0} characters
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Description Length:
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {curriculumData.description?.length || 0} characters
              </span>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default EditCourseCurriculum;
