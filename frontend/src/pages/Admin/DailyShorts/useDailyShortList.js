import {
    addNewShortVideoAPI,
    fetchAllShortVideosAPI,
    updateShortVideoAPI,
    deleteShortVideoAPI
} from '@/store/feature/admin'
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

const useDailyShortList = (pageNo, pageSize) => {
    const dispatch = useDispatch();
    const { shortVideosDetails, loading, error } = useSelector((state) => state.admin);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const clearMessage = useCallback(() => {
        setActionMessage(null);
    }, []);

    useEffect(() => {
        dispatch(fetchAllShortVideosAPI({ pageNo, pageSize }));
    }, [dispatch, pageNo, pageSize]);

    const refetch = useCallback(() => {
        dispatch(fetchAllShortVideosAPI({ pageNo, pageSize }));
    }, [dispatch, pageNo, pageSize]);

    const addVideo = async (formData) => {
        setIsSubmitting(true);
        clearMessage();
        try {
            await dispatch(addNewShortVideoAPI(formData)).unwrap();
            setActionMessage({ type: "success", text: "New Short Video is added successfully!" });
            refetch();
        } catch (err) {
            console.error("Failed to add short video:", err);
            setActionMessage({
                type: "error",
                text: "Failed to add short video.",
                details: err?.message || "Please try again.",
            });
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateShortVideoDetails = async (shortVideoId, shortVideoData) => {
        setIsSubmitting(true);
        clearMessage();
        try {
            await dispatch(updateShortVideoAPI({ shortVideoId, shortVideoData })).unwrap();
            setActionMessage({ type: "success", text: "Short Video is updated successfully!" });
            refetch();
        } catch (err) {
            console.error("Failed to update short video:", err);
            setActionMessage({
                type: "error",
                text: "Failed to update short video.",
                details: err?.message || "Please try again.",
            });
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteShortVideo = async (shortVideoId) => {
        setIsSubmitting(true);
        clearMessage();
        try {
            await dispatch(deleteShortVideoAPI(shortVideoId)).unwrap();
            setActionMessage({ type: "success", text: "Short Video is deleted successfully!" });
            refetch();
        } catch (err) {
            console.error("Failed to delete short video:", err);
            setActionMessage({
                type: "error",
                text: "Failed to delete short video.",
                details: err?.message || "Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return {
        shortVideosDetails,
        loading,
        error,
        addVideo,
        updateShortVideoDetails,
        deleteShortVideo,
        isSubmitting,
        actionMessage,
        clearMessage,
    };

}

export default useDailyShortList