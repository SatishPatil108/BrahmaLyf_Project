import {
  deleteProgressPracticeMessageAPI,
  fetchProgressPracticeMessagesAPI,
  postProgressPracticeMessageAPI,
  updateProgressPracticeMessageAPI,
} from "@/store/feature/admin";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useProgressMessageDetails = (courseId, weekNo) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [isMessageEditing, setIsMessageEditing] = useState(false);

  const { progressPracticeMessages, loading, error } = useSelector(
    (state) => state.admin,
  );

  const messages = progressPracticeMessages?.messages || [];

  const clearMessage = useCallback(() => setActionMessage(null), []);

  // Fetch questions based on courseId, weekNo, dayNo
  useEffect(() => {
    if (courseId && weekNo) {
      dispatch(
        fetchProgressPracticeMessagesAPI({
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
        fetchProgressPracticeMessagesAPI({
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
        postProgressPracticeMessageAPI({ courseId, messageData }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Message added successfully",
      });

      setIsMessageDrawerOpen(false);
      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to add message",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing message
  const updateMessage = async (messageId, courseId, messageData) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(
        updateProgressPracticeMessageAPI({
          messageId,
          courseId,
          messageData,
        }),
      ).unwrap();

      setActionMessage({
        type: "success",
        text: "Message updated successfully",
      });

      setIsMessageDrawerOpen(false);
      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to update message",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    setIsSubmitting(true);
    clearMessage();

    try {
      await dispatch(deleteProgressPracticeMessageAPI(messageId)).unwrap();

      setActionMessage({
        type: "success",
        text: "Message deleted successfully",
      });

      refetch();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to delete message",
        details: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    messages,
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

export default useProgressMessageDetails;
