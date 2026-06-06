import {
  deleteCustomVideosAPI,
  updateCustomVideosAPI,
  fetchAllCustomVideosAPI,
  postCustomVideoAPI,
} from "@/store/feature/admin";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useCustomVideoList = (pageNo, pageSize) => {
  const dispatch = useDispatch();
  const { customVideosDetails, loading, error } = useSelector(
    (state) => state.admin,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const clearMessage = useCallback(() => {
    setActionMessage(null);
  }, []);

  useEffect(() => {
    dispatch(fetchAllCustomVideosAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  const refetch = useCallback(() => {
    dispatch(fetchAllCustomVideosAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  useEffect(() => {
    if (!actionMessage) return;

    const timer = setTimeout(() => {
      setActionMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [actionMessage]);

  const addCustomVideo = async (payload) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(postCustomVideoAPI(payload)).unwrap();
      setActionMessage({
        type: "success",
        text: "New Custom Video is added successfully!",
      });
      refetch();
    } catch (err) {
      console.error("Failed to add custom video:", err);
      setActionMessage({
        type: "error",
        text: "Failed to add custom video.",
        details: err?.message || "Please try again.",
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCustomVideoDetails = async (customVideoId, customVideoData) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(
        updateCustomVideosAPI({ customVideoId, customVideoData }),
      ).unwrap();
      setActionMessage({
        type: "success",
        text: "Custom Video is updated successfully!",
      });
      refetch();
    } catch (err) {
      console.error("Failed to update custom video:", err);
      setActionMessage({
        type: "error",
        text: "Failed to update custom video.",
        details: err?.message || "Please try again.",
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCustomVideo = async (customVideoId) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(deleteCustomVideosAPI(customVideoId)).unwrap();
      setActionMessage({
        type: "success",
        text: "Custom Video is deleted successfully!",
      });
      refetch();
    } catch (err) {
      console.error("Failed to delete custom video:", err);
      setActionMessage({
        type: "error",
        text: "Failed to delete custom video.",
        details: err?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    customVideosDetails,
    loading,
    error,
    addCustomVideo,
    updateCustomVideoDetails,
    deleteCustomVideo,
    isSubmitting,
    actionMessage,
    clearMessage,
  };
};

export default useCustomVideoList;
