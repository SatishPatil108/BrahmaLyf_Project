import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  BookOpen, 
  Users, 
  Target, 
  Clock, 
  Video, 
  User,
  Globe,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import CustomDrawer from "@/components/CustomDrawer";
import CustomButton from "@/components/CustomButton";
import useDomainData from "./useDomainData";
import { fetchCoachesDropdownAPI } from "@/store/feature/admin";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import YouTubeUrlInput from "@/components/videoUrlValidator/YouTubeUrlInput";

const EditCourse = ({ courseDetails, isDrawerOpen, onClose, onSubmit }) => {
  const { domainsDetails, subdomainsDetails, fetchSubdomains } = useDomainData();
  const domains = domainsDetails.domains || [];
  const subdomains = subdomainsDetails.subdomains || [];
  const coachesList = useSelector((state) => state.admin.coachesList || []);
  const dispatch = useDispatch();

  // Local form state
  const [courseData, setCourseData] = useState({});
  const [introVideoData, setIntroVideoData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState(null);

  // Load data on drawer open
  useEffect(() => {
    if (courseDetails && isDrawerOpen) {
      dispatch(fetchCoachesDropdownAPI());
      fetchSubdomains(courseDetails?.intro_video?.domain_id);

      setCourseData({
        course_name: courseDetails?.course_name || "",
        target_audience: courseDetails?.target_audience || "",
        learning_outcomes: courseDetails?.learning_outcomes || "",
        curriculum_description: courseDetails?.curriculum_description || "",
        coach_id: courseDetails?.coach_id || "",
        durationHours: String(parseInt(courseDetails?.duration?.split(" ")[0]) || ""),
        durationMinutes: String(parseInt(courseDetails?.duration?.split(" ")[1]) || ""),
      });

      setIntroVideoData({
        video_id: courseDetails?.intro_video?.id || "",
        domain_id: courseDetails?.intro_video?.domain_id || "",
        subdomain_id: courseDetails?.intro_video?.subdomain_id || "",
        title: courseDetails?.intro_video?.title || "",
        description: courseDetails?.intro_video?.description || "",
        video_url: courseDetails?.intro_video?.video_url || "",
        thumbnail_file: courseDetails?.intro_video?.thumbnail_url || null,
      });

      // Reset errors and touched states
      setFormErrors({});
      setTouched({});
      setApiError(null);
    }
  }, [courseDetails, isDrawerOpen, dispatch, fetchSubdomains]);

  // Handle course field changes
  const handleCourseDataChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name] && touched[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError(null);
  };

  // Handle intro video field changes
  const handleIntroVideoDataChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "thumbnail_file") {
      setIntroVideoData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setIntroVideoData((prev) => ({ ...prev, [name]: value }));
    }

    // Fetch subdomains when domain changes
    if (name === "domain_id") {
      fetchSubdomains(value);
      setIntroVideoData((prev) => ({ ...prev, subdomain_id: "" }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name] && touched[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError(null);
  };

  const handleBlur = (field, section = 'course') => {
    setTouched(prev => ({ ...prev, [section === 'intro' ? `intro_${field}` : field]: true }));
    validateField(field, section);
  };

  const validateField = (field, section = 'course') => {
    const value = section === 'intro' ? introVideoData[field] : courseData[field];
    let error = '';

    switch (field) {
      case 'course_name':
        if (!value?.trim()) error = "Course name is required";
        else if (value.trim().length < 3) error = "Course name must be at least 3 characters";
        break;
        
      case 'coach_id':
        if (!value) error = "Please select a coach";
        break;
        
      case 'target_audience':
        if (!value?.trim()) error = "Target audience is required";
        break;
        
      case 'learning_outcomes':
        if (!value?.trim()) error = "Learning outcomes are required";
        break;
        
      case 'curriculum_description':
        if (!value?.trim()) error = "Curriculum description is required";
        else if (value.trim().length < 20) error = "Please provide a more detailed description (minimum 20 characters)";
        break;
        
      case 'durationHours':
        if (!value?.toString().trim()) error = "Hours are required";
        else if (isNaN(value) || parseInt(value) < 0) error = "Please enter a valid number";
        break;
        
      case 'durationMinutes':
        if (!value?.toString().trim()) error = "Minutes are required";
        else if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 59) error = "Please enter a valid number between 0-59";
        break;
        
      case 'domain_id':
        if (!value) error = "Please select a domain";
        break;
        
      case 'subdomain_id':
        if (!value) error = "Please select a subdomain";
        break;
        
      case 'title':
        if (!value?.trim()) error = "Video title is required";
        break;
        
      case 'description':
        if (!value?.trim()) error = "Video description is required";
        break;
        
      case 'video_url':
        if (!value?.trim()) error = "Video URL is required";
        break;
    }

    if (error) {
      setFormErrors(prev => ({ ...prev, [section === 'intro' ? `intro_${field}` : field]: error }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Course data validation
    if (!courseData.course_name?.trim()) {
      errors.course_name = "Course name is required";
    }
    
    if (!courseData.coach_id) {
      errors.coach_id = "Please select a coach";
    }
    
    if (!courseData.target_audience?.trim()) {
      errors.target_audience = "Target audience is required";
    }
    
    if (!courseData.learning_outcomes?.trim()) {
      errors.learning_outcomes = "Learning outcomes are required";
    }
    
    if (!courseData.curriculum_description?.trim()) {
      errors.curriculum_description = "Curriculum description is required";
    } else if (courseData.curriculum_description.trim().length < 20) {
      errors.curriculum_description = "Please provide a more detailed description (minimum 20 characters)";
    }
    
    if (!courseData.durationHours?.toString().trim()) {
      errors.durationHours = "Hours are required";
    } else if (isNaN(courseData.durationHours) || parseInt(courseData.durationHours) < 0) {
      errors.durationHours = "Please enter a valid number";
    }
    
    if (!courseData.durationMinutes?.toString().trim()) {
      errors.durationMinutes = "Minutes are required";
    } else if (isNaN(courseData.durationMinutes) || parseInt(courseData.durationMinutes) < 0 || parseInt(courseData.durationMinutes) > 59) {
      errors.durationMinutes = "Please enter a valid number between 0-59";
    }
    
    // Intro video validation
    if (!introVideoData.domain_id) {
      errors.intro_domain_id = "Please select a domain";
    }
    
    if (!introVideoData.subdomain_id) {
      errors.intro_subdomain_id = "Please select a subdomain";
    }
    
    if (!introVideoData.title?.trim()) {
      errors.intro_title = "Video title is required";
    }
    
    if (!introVideoData.description?.trim()) {
      errors.intro_description = "Video description is required";
    }
    
    if (!introVideoData.video_url?.trim()) {
      errors.intro_video_url = "Video URL is required";
    }
    
    return errors;
  };

  // ✅ Save handler
  const handleSave = async () => {
    // Mark all fields as touched
    const allFields = [
      'course_name', 'coach_id', 'target_audience', 'learning_outcomes',
      'curriculum_description', 'durationHours', 'durationMinutes',
      'domain_id', 'subdomain_id', 'title', 'description', 'video_url'
    ];
    
    const newTouched = {};
    allFields.forEach(field => {
      if (field.includes('intro_')) {
        newTouched[field] = true;
      } else {
        newTouched[field] = true;
      }
    });
    setTouched(newTouched);
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField.replace('intro_', '')}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    const formData = new FormData();

    // --- Append Course Info ---
    formData.append("course_name", courseData.course_name.trim());
    formData.append("target_audience", courseData.target_audience.trim());
    formData.append("learning_outcomes", courseData.learning_outcomes.trim());
    formData.append("curriculum_description", courseData.curriculum_description.trim());
    formData.append("coach_id", courseData.coach_id);
    formData.append("duration", `${courseData.durationHours || 0}h ${courseData.durationMinutes || 0}m`);

    // --- Append Intro Video Info ---
    formData.append("video_id", introVideoData.video_id);
    formData.append("domain_id", introVideoData.domain_id);
    formData.append("subdomain_id", introVideoData.subdomain_id);
    formData.append("title", introVideoData.title.trim());
    formData.append("description", introVideoData.description.trim());
    formData.append("video_url", introVideoData.video_url.trim());

    if (introVideoData.thumbnail_file instanceof File) {
      formData.append("thumbnail_file", introVideoData.thumbnail_file);
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setApiError(err.message || "Failed to update course. Please try again.");
    }
  };

  const inputClass = (fieldName) => `
    w-full px-4 py-2.5 rounded-lg border text-sm
    focus:outline-none focus:ring-2 focus:ring-offset-0
    ${formErrors[fieldName] && touched[fieldName]
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
    }
    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  return (
    <CustomDrawer
      isOpen={isDrawerOpen}
      onClose={onClose}
      title="Edit Course"
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
            <CustomButton
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={handleSave}
              variant="primary"
            >
              Save Changes
            </CustomButton>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* API Error Display */}
        {apiError && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                  Failed to update course
                </p>
                <p className="text-sm text-red-600 dark:text-red-500">
                  {apiError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Course Info Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Course Information
            </h3>
          </div>

          {/* Domain & Subdomain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Domain <span className="text-red-500 ml-1">*</span>
                </div>
              </label>
              <select
                name="domain_id"
                value={introVideoData?.domain_id || ""}
                onChange={handleIntroVideoDataChange}
                onBlur={() => handleBlur('domain_id', 'intro')}
                className={inputClass('intro_domain_id')}
                required
              >
                <option value="">Select Domain</option>
                {domains.map((domain) => (
                  <option key={domain.domain_id} value={domain.domain_id}>
                    {domain.domain_name}
                  </option>
                ))}
              </select>
              {formErrors.intro_domain_id && touched.intro_domain_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {formErrors.intro_domain_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Subdomain <span className="text-red-500 ml-1">*</span>
                </div>
              </label>
              <select
                name="subdomain_id"
                value={introVideoData?.subdomain_id || ""}
                onChange={handleIntroVideoDataChange}
                onBlur={() => handleBlur('subdomain_id', 'intro')}
                className={inputClass('intro_subdomain_id')}
                required
                disabled={!introVideoData.domain_id || subdomains.length === 0}
              >
                <option value="">Select Subdomain</option>
                {subdomains.length > 0 ? (
                  subdomains.map((sub) => (
                    <option key={sub.subdomain_id} value={sub.subdomain_id}>
                      {sub.subdomain_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No subdomains available
                  </option>
                )}
              </select>
              {formErrors.intro_subdomain_id && touched.intro_subdomain_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {formErrors.intro_subdomain_id}
                </p>
              )}
              {!introVideoData.domain_id && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select a domain first to see available subdomains
                </p>
              )}
            </div>
          </div>

          {/* Coach */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Assign Coach <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            <select
              name="coach_id"
              value={courseData.coach_id || ""}
              onChange={handleCourseDataChange}
              onBlur={() => handleBlur('coach_id')}
              className={inputClass('coach_id')}
              required
            >
              <option value="">Select Coach</option>
              {coachesList.map((coach) => {
                const id = coach.id ?? coach.coach_id ?? coach._id;
                const name = coach.name ?? coach.full_name ?? coach.coach_name ?? "Unknown";
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
            {formErrors.coach_id && touched.coach_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.coach_id}
              </p>
            )}
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Course Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="course_name"
              value={courseData.course_name || ""}
              onChange={handleCourseDataChange}
              onBlur={() => handleBlur('course_name')}
              className={inputClass('course_name')}
              required
              placeholder="e.g., Advanced Mindfulness Meditation"
            />
            {formErrors.course_name && touched.course_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.course_name}
              </p>
            )}
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Target Audience <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            <textarea
              name="target_audience"
              value={courseData.target_audience || ""}
              onChange={handleCourseDataChange}
              onBlur={() => handleBlur('target_audience')}
              rows={3}
              className={inputClass('target_audience') + " resize-none"}
              required
              placeholder="Who is this course designed for?"
            />
            {formErrors.target_audience && touched.target_audience && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.target_audience}
              </p>
            )}
          </div>

          {/* Learning Outcomes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Learning Outcomes <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            <textarea
              name="learning_outcomes"
              value={courseData.learning_outcomes || ""}
              onChange={handleCourseDataChange}
              onBlur={() => handleBlur('learning_outcomes')}
              rows={3}
              className={inputClass('learning_outcomes') + " resize-none"}
              required
              placeholder="What will students learn from this course?"
            />
            {formErrors.learning_outcomes && touched.learning_outcomes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.learning_outcomes}
              </p>
            )}
          </div>

          {/* Curriculum Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Course Overview <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            <textarea
              name="curriculum_description"
              value={courseData.curriculum_description || ""}
              onChange={handleCourseDataChange}
              onBlur={() => handleBlur('curriculum_description')}
              rows={4}
              className={inputClass('curriculum_description') + " resize-none"}
              required
              placeholder="Provide a detailed overview of the course curriculum..."
            />
            {formErrors.curriculum_description && touched.curriculum_description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.curriculum_description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Minimum 20 characters. Current: {courseData.curriculum_description?.length || 0}
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Course Duration <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Hours
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  min={0}
                  max={999}
                  name="durationHours"
                  value={courseData.durationHours || ""}
                  onChange={handleCourseDataChange}
                  onBlur={() => handleBlur('durationHours')}
                  className={inputClass('durationHours')}
                  placeholder="e.g., 10"
                  required
                />
                {formErrors.durationHours && touched.durationHours && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.durationHours}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Minutes
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  min={0}
                  max={59}
                  name="durationMinutes"
                  value={courseData.durationMinutes || ""}
                  onChange={handleCourseDataChange}
                  onBlur={() => handleBlur('durationMinutes')}
                  className={inputClass('durationMinutes')}
                  placeholder="e.g., 30"
                  required
                />
                {formErrors.durationMinutes && touched.durationMinutes && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.durationMinutes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Intro Video Section */}
        <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Introduction Video
            </h3>
          </div>

          {/* Video Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Video Title <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={introVideoData.title || ""}
              onChange={handleIntroVideoDataChange}
              onBlur={() => handleBlur('title', 'intro')}
              className={inputClass('intro_title')}
              required
              placeholder="e.g., Course Introduction & Overview"
            />
            {formErrors.intro_title && touched.intro_title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.intro_title}
              </p>
            )}
          </div>

          {/* Video Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Video Description <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={introVideoData.description || ""}
              onChange={handleIntroVideoDataChange}
              onBlur={() => handleBlur('description', 'intro')}
              rows={3}
              className={inputClass('intro_description') + " resize-none"}
              required
              placeholder="Briefly describe what this introduction video covers..."
            />
            {formErrors.intro_description && touched.intro_description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.intro_description}
              </p>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Video URL <span className="text-red-500 ml-1">*</span>
            </label>
            <YouTubeUrlInput
              name="video_url"
              value={introVideoData.video_url || ""}
              onChange={handleIntroVideoDataChange}
              required={true}
              helperText="Enter the YouTube URL for your course introduction video"
            />
            {formErrors.intro_video_url && touched.intro_video_url && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.intro_video_url}
              </p>
            )}
          </div>

          {/* Video Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Video Thumbnail
            </label>
            <FileUploaderWithPreview
              imageFile={typeof introVideoData.thumbnail_file === "object" ? introVideoData.thumbnail_file : null}
              imageUrl={typeof introVideoData.thumbnail_file === "string" ? introVideoData.thumbnail_file : null}
              setImageFile={(file) =>
                handleIntroVideoDataChange({ target: { name: "thumbnail_file", files: [file] } })
              }
              name="thumbnail_file"
              label="Upload or update the video thumbnail"
            />
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default EditCourse;