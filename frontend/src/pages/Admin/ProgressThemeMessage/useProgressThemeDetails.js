import {
  postProgressPracticeThemesAPI,
  fetchProgressPracticeThemesAPI,
  updateProgressPracticeThemesAPI,
  deleteProgressPracticeThemesAPI,
} from "@/store/feature/admin";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useProgressThemeDetails = (courseId, weekNo) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [isMessageEditing, setIsMessageEditing] = useState(false);

  const { progressPracticeThemes, loading, error } = useSelector(
    (state) => state.admin,
  );

  const themes = progressPracticeThemes?.themes || [];

  const clearMessage = useCallback(() => setActionMessage(null), []);

  // Fetch questions based on courseId, weekNo, dayNo
  useEffect(() => {
    if (courseId && weekNo) {
      dispatch(
        fetchProgressPracticeThemesAPI({
          courseId,
          weekNo,
        }),
      );
    }
  }, [dispatch, courseId, weekNo]);

  // Refetch helper
  const refetch = useCallback(() => {
    if (courseId && weekNo) {
      dispatch(
        fetchProgressPracticeThemesAPI({
          courseId,
          weekNo,
        }),
      );
    }
  }, [dispatch, courseId, weekNo]);

  useEffect(() => {
    if (!actionMessage) return;

    const timer = setTimeout(() => {
      setActionMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [actionMessage]);

  // Add new message
  const addMessage = async (courseId, messageData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        postProgressPracticeThemesAPI({ courseId, themeData: messageData }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Theme added successfully",
      });

      setIsMessageDrawerOpen(false);
      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to add theme",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing theme
  const updateMessage = async (themeId, courseId, themeData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        updateProgressPracticeThemesAPI({
          themeId,
          courseId,
          themeData,
        }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Theme updated successfully",
      });

      setIsMessageDrawerOpen(false);
      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to update theme",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete theme
  const handleDeleteMessage = async (themeId) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(deleteProgressPracticeThemesAPI(themeId)).unwrap();

      setActionMessage({
        type: "success",
        text: "Theme deleted successfully",
      });

      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to delete theme",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    themes,
    loading,
    error,
    isSubmitting,
    actionMessage,
    clearMessage,
    addMessage,
    updateMessage,
    handleDeleteMessage,
    refetch,
  };
};

export default useProgressThemeDetails;
