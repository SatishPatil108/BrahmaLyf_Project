import {
  deleteProgressToolsQuestionAPI,
  fetchAllCoursesAPI,
  fetchProgressToolsQuestionsAPI,
  postProgressToolsQuestionAPI,
  updateProgressToolsQuestionAPI,
} from "@/store/feature/admin";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useProgressToolsDetails = (courseId, weekNo, dayNo) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // ✅ UI State
  const [isToolDrawerOpen, setIsToolDrawerOpen] = useState(false);
  const [isToolEditing, setIsToolEditing] = useState(false);

  const { progressToolsQuestions, coursesDetails, ptqLoading, ptqError } =
    useSelector((state) => state.admin);

  const tools = progressToolsQuestions?.tools ?? [];
  const courses = coursesDetails?.courses || [];

  const clearMessage = useCallback(() => setActionMessage(null), []);

  // ✅ Fetch courses
  useEffect(() => {
    dispatch(fetchAllCoursesAPI({ pageNo: 1, pageSize: 10 }));
  }, [dispatch]);

  // ✅ Fetch tools
  useEffect(() => {
    if (courseId && weekNo && dayNo) {
      dispatch(fetchProgressToolsQuestionsAPI({ courseId, weekNo, dayNo }));
    }
  }, [dispatch, courseId, weekNo, dayNo]);

  const refetch = useCallback(() => {
    if (courseId && weekNo && dayNo) {
      dispatch(fetchProgressToolsQuestionsAPI({ courseId, weekNo, dayNo }));
    }
  }, [dispatch, courseId, weekNo, dayNo]);

  useEffect(() => {
    if (!actionMessage) return;

    const timer = setTimeout(() => {
      setActionMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [actionMessage]);

  // ✅ Add Tool
  const addTool = async (courseId, questionData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        postProgressToolsQuestionAPI({ courseId, questionData }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Tool added successfully",
      });

      setIsToolDrawerOpen(false);
      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to add tool",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Update Tool
  const updateTool = async (tools_question_id, courseId, questionData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        updateProgressToolsQuestionAPI({
          tools_question_id,
          courseId,
          questionData,
        }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Tool updated successfully",
      });

      setIsToolDrawerOpen(false);
      setIsToolEditing(false);
      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to update tool",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete Tool
  const handleDeleteTool = async (tools_question_id) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        deleteProgressToolsQuestionAPI(tools_question_id),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Tool deleted successfully",
      });

      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to delete tool",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Edit handler
  const handleEditTool = (tool) => {
    setIsToolEditing(true);
    setIsToolDrawerOpen(true);
    return tool;
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
    isToolDrawerOpen,
    setIsToolDrawerOpen,
    isToolEditing,
    setIsToolEditing,

    // Actions
    addTool,
    updateTool,
    handleDeleteTool,
    handleEditTool,
  };
};

export default useProgressToolsDetails;
