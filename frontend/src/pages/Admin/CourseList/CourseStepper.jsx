import React, { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import CustomButton from "@/components/CustomButton";
import AddCourseInfo from "./AddCourseInfo";
import AddCourseCurriculum from "./AddCourseCurriculum";
import useDomainData from "./useDomainData";
import { addNewCourseAPI } from "@/store/feature/admin";

const steps = ["Course Information", "Curriculum Setup"];

const CourseStepper = ({ onClose, coaches = [], coachesLoading = false }) => {
  const dispatch = useDispatch();
  const { domainsDetails, subdomainsDetails, fetchSubdomains } = useDomainData();

  const domains = domainsDetails.domains || [];
  const subdomains = subdomainsDetails.subdomains || [];
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [courseData, setCourseData] = useState({
    domain: "",
    subdomain: "",
    coachId: "",
    courseName: "",
    targetedAudience: "",
    learningOutcome: "",
    curriculumDesc: "",
    courseDurationHours: "",
    courseDurationMinutes: "",
    videoTitle: "",
    videoDesc: "",
    videoUrl: "",
    videoThumbnail: null,
  });

  const [curriculums, setCurriculums] = useState([
    {
      header_type: "",
      sequence_no: "1",
      title: "",
      description: "",
      video_url: "",
      thumbnail_file: null,
    },
  ]);

  // Validate step 1 (course information)
  const validateStep1 = () => {
    const errors = {};
    
    if (!courseData.domain) {
      errors.domain = "Domain is required";
    }
    
    if (!courseData.subdomain) {
      errors.subdomain = "Subdomain is required";
    }
    
    if (!courseData.coachId?.trim()) {
      errors.coachId = "Coach is required";
    }
    
    if (!courseData.courseName?.trim()) {
      errors.courseName = "Course name is required";
    } else if (courseData.courseName.trim().length < 3) {
      errors.courseName = "Course name must be at least 3 characters";
    }
    
    if (!courseData.targetedAudience?.trim()) {
      errors.targetedAudience = "Target audience is required";
    }
    
    if (!courseData.learningOutcome?.trim()) {
      errors.learningOutcome = "Learning outcome is required";
    }
    
    if (!courseData.curriculumDesc?.trim()) {
      errors.curriculumDesc = "Curriculum description is required";
    } else if (courseData.curriculumDesc.trim().length < 20) {
      errors.curriculumDesc = "Please provide a more detailed curriculum description (minimum 20 characters)";
    }
    
    if (!courseData.courseDurationHours?.toString().trim()) {
      errors.courseDurationHours = "Course duration hours are required";
    } else if (isNaN(courseData.courseDurationHours) || parseInt(courseData.courseDurationHours) < 0) {
      errors.courseDurationHours = "Please enter a valid number";
    }
    
    if (!courseData.courseDurationMinutes?.toString().trim()) {
      errors.courseDurationMinutes = "Course duration minutes are required";
    } else if (isNaN(courseData.courseDurationMinutes) || parseInt(courseData.courseDurationMinutes) < 0 || parseInt(courseData.courseDurationMinutes) > 59) {
      errors.courseDurationMinutes = "Please enter a valid number between 0-59";
    }
    
    if (!courseData.videoTitle?.trim()) {
      errors.videoTitle = "Video title is required";
    }
    
    if (!courseData.videoDesc?.trim()) {
      errors.videoDesc = "Video description is required";
    }
    
    if (!courseData.videoUrl?.trim()) {
      errors.videoUrl = "Video URL is required";
    }
    
    if (!courseData.videoThumbnail) {
      errors.videoThumbnail = "Video thumbnail is required";
    }
    
    return errors;
  };

  // Validate step 2 (curriculum)
  const validateStep2 = () => {
    const errors = {};
    
    curriculums.forEach((curriculum, index) => {
      const curriculumErrors = {};
      
      if (!curriculum.header_type?.trim()) {
        curriculumErrors.header_type = "Header type is required";
      }
      
      if (!curriculum.sequence_no?.toString().trim()) {
        curriculumErrors.sequence_no = "Sequence number is required";
      } else if (isNaN(curriculum.sequence_no) || curriculum.sequence_no < 1) {
        curriculumErrors.sequence_no = "Sequence must be a positive number";
      }
      
      if (!curriculum.title?.trim()) {
        curriculumErrors.title = "Title is required";
      } else if (curriculum.title.trim().length < 3) {
        curriculumErrors.title = "Title must be at least 3 characters";
      }
      
      if (!curriculum.description?.trim()) {
        curriculumErrors.description = "Description is required";
      } else if (curriculum.description.trim().length < 10) {
        curriculumErrors.description = "Description must be at least 10 characters";
      }
      
      if (!curriculum.video_url?.trim()) {
        curriculumErrors.video_url = "Video URL is required";
      }
      
      if (!curriculum.thumbnail_file) {
        curriculumErrors.thumbnail_file = "Thumbnail is required";
      }
      
      if (Object.keys(curriculumErrors).length > 0) {
        errors[index] = curriculumErrors;
      }
    });
    
    return errors;
  };

  const handleNext = async () => {
    setApiError(null);
    
    if (activeStep === 0) {
      const errors = validateStep1();
      if (Object.keys(errors).length > 0) {
        setFormErrors({ step1: errors });
        
        // Scroll to first error
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
        return;
      }
      
      // Clear step 1 errors and proceed
      setFormErrors({});
    }
    
    if (activeStep === 1) {
      const errors = validateStep2();
      if (Object.keys(errors).length > 0) {
        setFormErrors({ step2: errors });
        
        // Scroll to first curriculum with errors
        const firstErrorIndex = Object.keys(errors)[0];
        const errorElement = document.querySelector(`[data-curriculum-index="${firstErrorIndex}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      // Submit the form
      try {
        setIsSubmitting(true);
        
        const formData = new FormData();
        
        // Add course data
        Object.entries(courseData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
        
        // Add curriculum data
        curriculums.forEach((item, i) => {
          Object.entries(item).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(`curriculums[${i}][${key}]`, value);
            }
          });
        });
        
        await dispatch(addNewCourseAPI(formData)).unwrap();
        onClose();
      } catch (err) {
        setApiError(err.message || "Failed to create course. Please try again.");
        
        // Scroll to error
        const errorElement = document.getElementById('api-error-display');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } finally {
        setIsSubmitting(false);
      }
      
      return;
    }
    
    // Move to next step
    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setApiError(null);
    setActiveStep((s) => Math.max(0, s - 1));
  };

  const getStepCompletion = () => {
    if (activeStep === 0) {
      const errors = validateStep1();
      return Object.keys(errors).length === 0;
    }
    if (activeStep === 1) {
      const errors = validateStep2();
      return Object.keys(errors).length === 0;
    }
    return false;
  };

  return (
    <div className="w-full space-y-8">
      {/* Stepper Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create New Course
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {activeStep + 1} of {steps.length}
          </div>
        </div>
        
        {/* Stepper Progress */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-500 -translate-y-1/2 transition-all duration-300"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {/* Step Indicators */}
          <div className="relative flex justify-between">
            {steps.map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center relative z-10
                    transition-all duration-300
                    ${index < activeStep 
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg'
                      : index === activeStep
                      ? 'bg-white dark:bg-gray-900 border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {index < activeStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`
                    text-xs font-medium
                    ${index <= activeStep
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-500'
                    }
                  `}>
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Error Display */}
      {apiError && (
        <div id="api-error-display" className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                Failed to create course
              </p>
              <p className="text-sm text-red-600 dark:text-red-500">
                {apiError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="space-y-6">
        {activeStep === 0 ? (
          <AddCourseInfo
            courseData={courseData}
            setCourseData={setCourseData}
            coaches={coaches}
            loadingCoaches={coachesLoading}
            domains={domains}
            subdomains={subdomains}
            fetchSubdomains={fetchSubdomains}
          />
        ) : (
          <AddCourseCurriculum
            curriculums={curriculums}
            setCurriculum={setCurriculums}
          />
        )}
      </div>

      {/* Step Completion Status */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStepCompletion() ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  All required fields completed
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  Please complete all required fields
                </span>
              </>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {activeStep === 0 && `${Object.keys(validateStep1()).length} errors remaining`}
            {activeStep === 1 && `${Object.keys(validateStep2()).length} curriculum items need attention`}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {activeStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to {steps[activeStep - 1]}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <CustomButton
            onClick={onClose}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          
          <CustomButton
            onClick={handleNext}
            variant="primary"
            disabled={isSubmitting}
            loading={activeStep === 1 && isSubmitting}
            className="flex items-center gap-2"
          >
            {activeStep === steps.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Create Course
              </>
            ) : (
              <>
                {steps[activeStep + 1]}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </CustomButton>
        </div>
      </div>

      {/* Step Instructions */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-1">
          {activeStep === 0 ? "Course Information" : "Curriculum Setup"}
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-500">
          {activeStep === 0 
            ? "Fill in all the basic course information. Make sure to provide clear descriptions and select the appropriate domain and coach."
            : "Add modules, chapters, and lessons to structure your course. Each curriculum item should have a video and thumbnail."
          }
        </p>
      </div>
    </div>
  );
};

export default CourseStepper;