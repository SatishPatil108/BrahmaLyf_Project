import {
  deleteProgressTasksQuestionAPI,
  fetchAllCoursesAPI,
  fetchProgressTasksQuestionsAPI,
  postProgressTasksQuestionAPI,
  updateProgressTasksQuestionAPI,
} from "@/store/feature/admin";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// courseId is now received as a parameter
const useProgressTaskDetails = (courseId, weekNo, dayNo) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isTaskEditing, setIsTaskEditing] = useState(false);

  const { progressTasksQuestions, coursesDetails, ptqLoading, ptqError } =
    useSelector((state) => state.admin);

  const questions = progressTasksQuestions?.questions ?? [];
  const courses = coursesDetails?.courses || [];

  const clearMessage = useCallback(() => setActionMessage(null), []);

  // Fetch courses
  useEffect(() => {
    dispatch(fetchAllCoursesAPI({ pageNo: 1, pageSize: 10 }));
  }, [dispatch]);

  // Fetch questions based on courseId, weekNo, and dayNo
  useEffect(() => {
    if (courseId && weekNo && dayNo) {
      dispatch(
        fetchProgressTasksQuestionsAPI({
          courseId,
          weekNo,
          dayNo,
        }),
      );
    }
  }, [dispatch, courseId, weekNo, dayNo]);

  // Refetch helper
  const refetch = useCallback(() => {
    if (courseId && weekNo && dayNo) {
      dispatch(
        fetchProgressTasksQuestionsAPI({
          courseId,
          weekNo,
          dayNo,
        }),
      );
    }
  }, [dispatch, courseId, weekNo, dayNo]);

  useEffect(() => {
    if (!actionMessage) return;

    const timer = setTimeout(() => {
      setActionMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [actionMessage]);

  // Add Question
  const addQuestion = async (courseId, questionData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        postProgressTasksQuestionAPI({
          courseId,
          questionData,
        }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Question added successfully",
      });

      setIsTaskDrawerOpen(false);
      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to add question",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Question
  const updateQuestion = async (questionId, courseId, questionData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        updateProgressTasksQuestionAPI({
          questionId,
          courseId,
          questionData,
        }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Question updated successfully",
      });

      setIsTaskDrawerOpen(false);
      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to update question",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (questionId) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(deleteProgressTasksQuestionAPI(questionId)).unwrap();

      setActionMessage({
        type: "success",
        text: "Question deleted successfully",
      });

      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to delete question",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Question
  const handleEditQuestion = (question) => {
    setIsTaskEditing(true);
    setIsTaskDrawerOpen(true);
    return question;
  };

  return {
    // Data
    progressTasksQuestions,
    questions,
    coursesDetails,
    courses,
    ptqLoading,
    ptqError,

    // Status
    isSubmitting,
    actionMessage,
    clearMessage,

    // UI State
    isTaskDrawerOpen,
    setIsTaskDrawerOpen,
    isTaskEditing,
    setIsTaskEditing,

    // Actions
    refetch,
    addQuestion,
    updateQuestion,
    handleDeleteQuestion,
    handleEditQuestion,
  };
};

export default useProgressTaskDetails;
