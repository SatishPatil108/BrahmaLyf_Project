import { useState } from "react";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import YouTubeUrlInput from "@/components/videoUrlValidator/YouTubeUrlInput";
import { 
  BookOpen, 
  Users, 
  Target, 
  ListChecks, 
  Clock, 
  Video, 
  User,
  Globe,
  Layers
} from "lucide-react";

const AddCourseInfo = ({
  courseData = {},
  setCourseData = () => { },
  coaches = [],
  loadingCoaches = false,
  domains = [],
  subdomains = [],
  fetchSubdomains = () => { },
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedData = {
      ...courseData,
      [name]: files ? files[0] : value,
    };
    setCourseData(updatedData);
    
    // Clear error when user starts typing
    if (errors[name] && touched[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDomainChange = (e) => {
    const domainId = Number(e.target.value);
    const updatedData = { ...courseData, domain: domainId, subdomain: "" };
    setCourseData(updatedData);
    fetchSubdomains(domainId);
    
    // Clear errors for domain and subdomain
    setErrors(prev => ({ ...prev, domain: '', subdomain: '' }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, courseData[field]);
  };

  const validateField = (field, value) => {
    const fieldErrors = {};
    
    switch (field) {
      case 'courseName':
        if (!value?.trim()) {
          fieldErrors.courseName = "Course name is required";
        } else if (value.trim().length < 3) {
          fieldErrors.courseName = "Course name must be at least 3 characters";
        }
        break;
        
      case 'targetedAudience':
        if (!value?.trim()) {
          fieldErrors.targetedAudience = "Targeted audience is required";
        }
        break;
        
      case 'learningOutcome':
        if (!value?.trim()) {
          fieldErrors.learningOutcome = "Learning outcome is required";
        }
        break;
        
      case 'curriculumDesc':
        if (!value?.trim()) {
          fieldErrors.curriculumDesc = "Curriculum description is required";
        } else if (value.trim().length < 20) {
          fieldErrors.curriculumDesc = "Please provide a more detailed curriculum description (minimum 20 characters)";
        }
        break;
        
      case 'domain':
        if (!value) {
          fieldErrors.domain = "Please select a domain";
        }
        break;
        
      case 'subdomain':
        if (!value) {
          fieldErrors.subdomain = "Please select a subdomain";
        }
        break;
        
      case 'coachId':
        if (!value) {
          fieldErrors.coachId = "Please select a coach";
        }
        break;
        
      case 'videoTitle':
        if (!value?.trim()) {
          fieldErrors.videoTitle = "Video title is required";
        }
        break;
        
      case 'videoDesc':
        if (!value?.trim()) {
          fieldErrors.videoDesc = "Video description is required";
        }
        break;
        
      case 'videoUrl':
        if (!value?.trim()) {
          fieldErrors.videoUrl = "Video URL is required";
        }
        break;
        
      case 'courseDurationHours':
      case 'courseDurationMinutes':
        if (value !== undefined && (isNaN(value) || value < 0)) {
          fieldErrors[field] = "Please enter a valid number";
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, ...fieldErrors }));
  };

  const validateForm = () => {
    const requiredFields = [
      'courseName', 'targetedAudience', 'learningOutcome', 
      'curriculumDesc', 'domain', 'subdomain', 'coachId',
      'videoTitle', 'videoDesc', 'videoUrl'
    ];
    
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!courseData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    
    // Additional validations
    if (courseData.courseName && courseData.courseName.trim().length < 3) {
      newErrors.courseName = "Course name must be at least 3 characters";
    }
    
    if (courseData.curriculumDesc && courseData.curriculumDesc.trim().length < 20) {
      newErrors.curriculumDesc = "Curriculum description must be at least 20 characters";
    }
    
    if (!courseData.videoThumbnail) {
      newErrors.videoThumbnail = "Video thumbnail is required";
    }
    
    setErrors(newErrors);
    setTouched(Object.keys(newErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (fieldName) => `
    w-full px-4 py-2.5 rounded-lg border text-sm
    focus:outline-none focus:ring-2 focus:ring-offset-0
    ${errors[fieldName] && touched[fieldName]
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
    }
    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create New Course
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Fill in the course details below. All fields marked with * are required.
        </p>
      </div>

      {/* Course Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Course Information
          </h2>
        </div>

        {/* Domain & Subdomain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Domain <span className="text-red-500">*</span>
              </div>
            </label>
            <select
              name="domain"
              value={courseData.domain ?? ""}
              onChange={handleDomainChange}
              onBlur={() => handleBlur('domain')}
              required
              className={inputClass('domain')}
            >
              <option value="">Select Domain</option>
              {domains.map((d) => (
                <option key={d.domain_id} value={d.domain_id}>
                  {d.domain_name}
                </option>
              ))}
            </select>
            {errors.domain && touched.domain && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.domain}
              </p>
            )}
          </div>

          {/* Subdomain */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Subdomain <span className="text-red-500">*</span>
              </div>
            </label>
            <select
              name="subdomain"
              value={courseData.subdomain ?? ""}
              onChange={handleChange}
              onBlur={() => handleBlur('subdomain')}
              disabled={!courseData.domain || subdomains.length === 0}
              required
              className={inputClass('subdomain')}
            >
              <option value="">Select Subdomain</option>
              {subdomains
                .filter((sub) => sub.domain_id === Number(courseData.domain))
                .map((sub) => (
                  <option key={sub.subdomain_id} value={sub.subdomain_id}>
                    {sub.subdomain_name}
                  </option>
                ))}
            </select>
            {errors.subdomain && touched.subdomain && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.subdomain}
              </p>
            )}
            {!courseData.domain && (
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
              Coach <span className="text-red-500">*</span>
            </div>
          </label>
          <select
            name="coachId"
            value={courseData.coachId ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlur('coachId')}
            required
            disabled={loadingCoaches}
            className={inputClass('coachId')}
          >
            <option value="">Select Coach</option>
            {coaches.map((coach) => {
              const id = coach.id ?? coach.coach_id ?? coach._id;
              const name = coach.name ?? coach.full_name ?? coach.coach_name ?? "Unknown";
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
          {errors.coachId && touched.coachId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.coachId}
            </p>
          )}
          {loadingCoaches && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Loading coaches...
            </p>
          )}
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Course Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="courseName"
            value={courseData.courseName ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlur('courseName')}
            required
            className={inputClass('courseName')}
            placeholder="e.g., Advanced Mindfulness Meditation"
          />
          {errors.courseName && touched.courseName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.courseName}
            </p>
          )}
        </div>

        {/* Targeted Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Targeted Audience <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="text"
            name="targetedAudience"
            value={courseData.targetedAudience ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlur('targetedAudience')}
            required
            className={inputClass('targetedAudience')}
            placeholder="e.g., Beginners, Working Professionals, Students"
          />
          {errors.targetedAudience && touched.targetedAudience && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.targetedAudience}
            </p>
          )}
        </div>

        {/* Learning Outcome */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Learning Outcomes <span className="text-red-500">*</span>
            </div>
          </label>
          <textarea
            name="learningOutcome"
            value={courseData.learningOutcome ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlur('learningOutcome')}
            required
            rows={3}
            className={inputClass('learningOutcome') + " resize-none"}
            placeholder="What will students learn from this course?"
          />
          {errors.learningOutcome && touched.learningOutcome && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.learningOutcome}
            </p>
          )}
        </div>

        {/* Curriculum Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Curriculum Description <span className="text-red-500">*</span>
            </div>
          </label>
          <textarea
            name="curriculumDesc"
            value={courseData.curriculumDesc ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlur('curriculumDesc')}
            required
            rows={4}
            className={inputClass('curriculumDesc') + " resize-none"}
            placeholder="Provide a detailed overview of the course curriculum..."
          />
          {errors.curriculumDesc && touched.curriculumDesc && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.curriculumDesc}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Minimum 20 characters. Current: {courseData.curriculumDesc?.length || 0}
          </p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Course Duration <span className="text-red-500">*</span>
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
                name="courseDurationHours"
                value={courseData.courseDurationHours ?? ""}
                onChange={handleChange}
                onBlur={() => handleBlur('courseDurationHours')}
                required
                className={inputClass('courseDurationHours')}
                placeholder="e.g., 10"
              />
              {errors.courseDurationHours && touched.courseDurationHours && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.courseDurationHours}
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
                name="courseDurationMinutes"
                value={courseData.courseDurationMinutes ?? ""}
                onChange={handleChange}
                onBlur={() => handleBlur('courseDurationMinutes')}
                required
                className={inputClass('courseDurationMinutes')}
                placeholder="e.g., 30"
              />
              {errors.courseDurationMinutes && touched.courseDurationMinutes && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.courseDurationMinutes}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Intro Video Section */}
      <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Course Introduction Video
          </h2>
        </div>

        {/* Video Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Video Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="videoTitle"
            value={courseData.videoTitle ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlur('videoTitle')}
            required
            className={inputClass('videoTitle')}
            placeholder="e.g., Course Introduction & Overview"
          />
          {errors.videoTitle && touched.videoTitle && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.videoTitle}
            </p>
          )}
        </div>

        {/* Video Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Video Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="videoDesc"
            value={courseData.videoDesc ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlur('videoDesc')}
            required
            rows={3}
            className={inputClass('videoDesc') + " resize-none"}
            placeholder="Briefly describe what this introduction video covers..."
          />
          {errors.videoDesc && touched.videoDesc && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.videoDesc}
            </p>
          )}
        </div>

        {/* Video URL */}
        <div>
          <YouTubeUrlInput
            label="Video URL"
            name="videoUrl"
            value={courseData.videoUrl ?? ""}
            onChange={handleChange}
            required={true}
            helperText="Enter the YouTube URL for your course introduction video"
          />
          {errors.videoUrl && touched.videoUrl && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.videoUrl}
            </p>
          )}
        </div>

        {/* Video Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Video Thumbnail <span className="text-red-500">*</span>
          </label>
          <FileUploaderWithPreview
            imageFile={courseData.videoThumbnail}
            setImageFile={(file) =>
              setCourseData({ ...courseData, videoThumbnail: file })
            }
            name="videoThumbnail"
            label="Upload thumbnail for the introduction video"
            required={true}
          />
          {errors.videoThumbnail && touched.videoThumbnail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.videoThumbnail}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Form Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Required fields completed:</span>
            <span className={`font-medium ${Object.keys(errors).length === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {Object.keys(errors).length === 0 ? 'All good' : `${Object.keys(errors).length} error(s)`}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Fields with errors:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {Object.keys(errors).filter(key => errors[key]).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseInfo;