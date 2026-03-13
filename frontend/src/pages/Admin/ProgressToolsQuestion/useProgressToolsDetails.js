import {
  deleteProgressToolsQuestionAPI,
  fetchAllCoursesAPI,
  fetchProgressToolsQuestionsAPI,
  postProgressToolsQuestionAPI,
  updateProgressToolsQuestionAPI,
} from "@/store/feature/admin";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useProgressToolsDetails = (weekNo, dayNo) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // ✅ UI State
  const [isToolDrawerOpen, setIsToolDrawerOpen] = useState(false);
  const [isToolEditing, setIsToolEditing] = useState(false);

  const { progressToolsQuestions, coursesDetails, ptqLoading, ptqError } =
    useSelector((state) => state.admin);

  const tools = progressToolsQuestions?.tools ?? [];
  console.log("Tools : ", tools);

  const clearMessage = useCallback(() => setActionMessage(null), []);

  // ✅ Fetch courses
  useEffect(() => {
    dispatch(fetchAllCoursesAPI({ pageNo: 1, pageSize: 10 }));
  }, [dispatch]);

  // ✅ Fetch tools
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

  // ✅ Add Tool
  const addTool = async (toolData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(postProgressToolsQuestionAPI(toolData)).unwrap();

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
  const updateTool = async (toolsQuestionId, toolData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        updateProgressToolsQuestionAPI({
          toolsQuestionId,
          toolData,
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
  const handleDeleteTool = async (toolsQuestionId) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(deleteProgressToolsQuestionAPI(toolsQuestionId)).unwrap();

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
