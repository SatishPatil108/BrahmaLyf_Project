import {
  deleteCompletedMessageAPI,
  fetchCompletedMessagesAPI,
  postCompletedMessageAPI,
  updateCompletedMessageAPI,
} from "@/store/feature/admin";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useCompletedMessage = (courseId, weekNo, dayNo) => {
  const dispatch = useDispatch();

  const { completedMessages, loading, error } = useSelector(
    (state) => state.admin,
  );

  const messages = completedMessages.messages || [];
  const completedMessage = messages[0] ?? null;


  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [messageActionMessage, setMessageActionMessage] = useState(null);

  const clearMessageActionMessage = () => setMessageActionMessage(null);

  useEffect(() => {
    if (courseId && weekNo && dayNo) {
      dispatch(fetchCompletedMessagesAPI({ courseId, weekNo, dayNo }));
    }
  }, [dispatch, courseId, weekNo, dayNo]);

  const refetch = useCallback(() => {
    if (courseId && weekNo && dayNo) {
      dispatch(fetchCompletedMessagesAPI({ courseId, weekNo, dayNo }));
    }
  }, [dispatch, courseId, weekNo, dayNo]);

  useEffect(() => {
    if (!messageActionMessage) return;
    const timer = setTimeout(() => setMessageActionMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [messageActionMessage]);

  const addCompletedMessage = async (courseId, messageData) => {
    setIsSubmittingMessage(true);
    try {
      await dispatch(
        postCompletedMessageAPI({ courseId, messageData }),
      ).unwrap();
      setMessageActionMessage({
        type: "success",
        text: "Message added successfully!",
      });
      refetch();
    } catch (err) {
      setMessageActionMessage({
        type: "error",
        text: "Failed to add message.",
        details: err?.message,
      });
      throw err;
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const updateCompletedMessage = async (messageId, courseId, messageData) => {
    setIsSubmittingMessage(true);
    try {
      await dispatch(
        updateCompletedMessageAPI({ messageId, courseId, messageData }),
      ).unwrap();
      setMessageActionMessage({
        type: "success",
        text: "Message updated successfully!",
      });
      refetch();
    } catch (err) {
      setMessageActionMessage({
        type: "error",
        text: "Failed to update message.",
        details: err?.message,
      });
      throw err;
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const deleteCompletedMessage = async (messageId) => {
    console.log("completedMessage:", completedMessage);
    setIsSubmittingMessage(true);
    try {
      await dispatch(deleteCompletedMessageAPI(messageId)).unwrap();
      setMessageActionMessage({
        type: "success",
        text: "Message deleted successfully!",
      });
      refetch();
    } catch (err) {
      setMessageActionMessage({
        type: "error",
        text: "Failed to delete message.",
        details: err?.message,
      });
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  return {
    completedMessage,
    isLoadingMessage: loading,
    isSubmittingMessage,
    messageActionMessage,
    clearMessageActionMessage,
    addCompletedMessage,
    updateCompletedMessage,
    deleteCompletedMessage,
  };
};

export default useCompletedMessage;
