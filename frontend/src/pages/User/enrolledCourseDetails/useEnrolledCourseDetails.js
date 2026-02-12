import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEnrolledCourseDetailsAPI,
  fetchModuleDetailsAPI,
} from "@/store/feature/user/userThunk";
import { clearEnrolledCourseDetails } from "@/store/feature/user/userSlice";

const useEnrolledCourseDetails = (courseId) => {
  const dispatch = useDispatch();
  const { enrolledCourseDetails, moduleDetails, isLoading, error } =
    useSelector((state) => state.user);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // Fetch course details
  useEffect(() => {
    if (courseId) {
      // setSelectedModuleId(null);
      dispatch(clearEnrolledCourseDetails());
      dispatch(fetchEnrolledCourseDetailsAPI(courseId));
    }
  }, [dispatch, courseId]);

  // Set initial selected module when course details load
  useEffect(() => {
    if (enrolledCourseDetails?.modules?.length > 0 && !selectedModuleId) {
      const firstModuleId = enrolledCourseDetails.modules[0].id;
      setSelectedModuleId(firstModuleId);
    }
  }, [enrolledCourseDetails, selectedModuleId]);

  // Fetch module details when selected module changes
  useEffect(() => {
    if (selectedModuleId) {
      dispatch(fetchModuleDetailsAPI(selectedModuleId));
    }
  }, [dispatch, selectedModuleId]);

  // Get current module index for navigation
  const getCurrentModuleIndex = () => {
    if (!enrolledCourseDetails?.modules || !selectedModuleId) return -1;
    return enrolledCourseDetails.modules.findIndex(
      (module) => module.id === selectedModuleId
    );
  };

  const currentIndex = getCurrentModuleIndex();

  const goToPreviousModule = () => {
    if (currentIndex > 0) {
      const prevModule = enrolledCourseDetails.modules[currentIndex - 1];
      setSelectedModuleId(prevModule.id);
    }
  };

  const goToNextModule = () => {
    if (currentIndex < enrolledCourseDetails.modules.length - 1) {
      const nextModule = enrolledCourseDetails.modules[currentIndex + 1];
      setSelectedModuleId(nextModule.id);
    }
  };

  return {
    enrolledCourseDetails,
    moduleDetails,
    isLoading,
    error,
    selectedModuleId,
    setSelectedModuleId,
    currentIndex,
    totalModules: enrolledCourseDetails?.modules?.length || 0,
    goToPreviousModule,
    goToNextModule,
    hasPrevModule: currentIndex > 0,
    hasNextModule: currentIndex < enrolledCourseDetails?.modules?.length - 1,
  };
};

export default useEnrolledCourseDetails;
