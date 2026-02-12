import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  enrollInCourseAPI,
  fetchCoachDetailsAPI,
  fetchCourseDetailsById,
  fetchCourseFeedbackById,
} from "@/store/feature/user";

import { toast } from 'react-toastify'

const useCourseDetailsPage = (videoId) => {
  const dispatch = useDispatch();
  const { coachDetails, courseDetails, isLoading, error, allCoursesFeedback } =
    useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  // Added `user` from redux state

  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState(""); // Inline message for login / success / error

  // Fetch coach details
  useEffect(() => {
    if (videoId && videoId !== "undefined") {
      dispatch(fetchCoachDetailsAPI(videoId));
    }
  }, [videoId, dispatch]);

  // Fetch course details
  useEffect(() => {
    if (coachDetails?.course_id) {
      dispatch(fetchCourseDetailsById(coachDetails.course_id));
    }
  }, [coachDetails, dispatch]);

  // Fetch all feedback for course
  useEffect(() => {
    if (courseDetails?.course_id) {
      dispatch(
        fetchCourseFeedbackById({
          courseId: courseDetails.course_id,
          pageNo: 1,
          pageSize: 10,
        })
      );
    }
  }, [courseDetails, dispatch]);

  // Enroll in course API call
  const enrollInCourse = async () => {
    if (!courseDetails?.course_id) return;
    try {
      setEnrolling(true);
      const res = await dispatch(enrollInCourseAPI(courseDetails.course_id)).unwrap();

      if (res?.data) {
        const { user_name, course_name } = res.data;
        toast.success(`🎉 Welcome ${user_name}! You have successfully enrolled in "${course_name}".`);
      } else {
        toast.success(res?.message || "Enrollment successful!");
      }
    } catch (err) {
      setMessage("Enrollment failed: " + (err?.message || "Unknown error"));
    } finally {
      setEnrolling(false);
    }
  };

  // Handle enroll with login check
  const handleEnroll = () => {
    if (!user) {
      confirm("You must be logged in first!");
      return;
    }
    setMessage(""); // Clear previous messages
    enrollInCourse();
  };
  return {
    coach: coachDetails,
    course: courseDetails,
    allCoursesFeedback,
    loading: isLoading,
    error,
    handleEnroll, // Only expose handleEnroll
    enrolling,
    message, // Inline message
  };
};

export default useCourseDetailsPage;
