import {
  fetchAllCoursesAPI,
  fetchProgressToolsQuestionsAPI,
  postProgressToolsQuestionAPI,
  updateProgressToolsQuestionAPI,
  deleteProgressToolsQuestionAPI,
} from "@/store/feature/admin";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useProgressTaskDetails = (weekNo, dayNo) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // ✅ FIXED naming (Tools, not Task)
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isTaskEditing, setIsTaskEditing] = useState(false);

  const { progressToolsQuestions, coursesDetails, ptqLoading, ptqError } =
    useSelector((state) => state.admin);

  const clearMessage = useCallback(() => setActionMessage(null), []);

  // Fetch courses
  useEffect(() => {
    dispatch(fetchAllCoursesAPI({ pageNo: 1, pageSize: 10 }));
  }, [dispatch]);

  // Fetch questions
  useEffect(() => {
    if (weekNo && dayNo) {
      dispatch(fetchProgressToolsQuestionsAPI({ weekNo, dayNo }));
    }
  }, [dispatch, weekNo, dayNo]);

  const refetch = useCallback(() => {
    if (weekNo && dayNo) {
      dispatch(fetchProgressToolsQuestionsAPI({ weekNo, dayNo }));
    }
  }, [dispatch, weekNo, dayNo]);

  // ✅ Add
  const addQuestion = async (questionData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(postProgressToolsQuestionAPI(questionData)).unwrap();

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

  // ✅ Update
  const updateQuestion = async (questionId, questionData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        updateProgressToolsQuestionAPI({ questionId, questionData }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Question updated successfully",
      });

      setIsTaskDrawerOpen(false);
      setIsTaskEditing(false);
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

  // ✅ Delete
  const handleDeleteQuestion = async (questionId) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(deleteProgressToolsQuestionAPI(questionId)).unwrap();

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

  // ✅ Edit handler (accept question)
  const handleEditQuestion = (question) => {
    setIsTaskEditing(true);
    setIsTaskDrawerOpen(true);
    return question;
  };

  return {
    // Data
    progressToolsQuestions,
    coursesDetails,
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
    addQuestion,
    updateQuestion,
    handleDeleteQuestion,
    handleEditQuestion,
  };
};

export default useProgressTaskDetails;
