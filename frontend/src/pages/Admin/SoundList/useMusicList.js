import {
    fetchAllMusicsAPI,
    postMusicAPI,
    updateMusicAPI,
    deleteMusicAPI,
} from "@/store/feature/admin";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useMusicList = (pageNo, pageSize) => {
    const dispatch = useDispatch();
    const { audiosDetails, loading, error } = useSelector((state) => state.admin);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const clearMessage = useCallback(() => {
        setActionMessage(null);
    }, []);

    useEffect(() => {
        dispatch(fetchAllMusicsAPI({ pageNo, pageSize }));
    }, [dispatch, pageNo, pageSize]);

    const refetch = useCallback(() => {
        dispatch(fetchAllMusicsAPI({ pageNo, pageSize }));
    }, [dispatch, pageNo, pageSize]);

    const addMusic = async (formData) => {
        setIsSubmitting(true);
        clearMessage();
        try {
            await dispatch(postMusicAPI(formData)).unwrap();
            setActionMessage({ type: "success", text: "New music added successfully!" });
            refetch();
        } catch (err) {
            console.error("Failed to add music:", err);
            setActionMessage({
                type: "error",
                text: "Failed to add music.",
                details: err?.message || "Please try again.",
            });
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateMusicDetails = async (musicId, musicData) => {
        setIsSubmitting(true);
        clearMessage();
        try {
            await dispatch(updateMusicAPI({ musicId, musicData })).unwrap();
            setActionMessage({ type: "success", text: "Music updated successfully!" });
            refetch();
        } catch (err) {
            console.error("Failed to update music:", err);
            setActionMessage({
                type: "error",
                text: "Failed to update music.",
                details: err?.message || "Please try again.",
            });
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteMusic = async (musicId) => {
        setIsSubmitting(true);
        clearMessage();
        try {
            await dispatch(deleteMusicAPI(musicId)).unwrap();
            setActionMessage({ type: "success", text: "Music deleted successfully!" });
            refetch();
        } catch (err) {
            console.error("Failed to delete music:", err);
            setActionMessage({
                type: "error",
                text: "Failed to delete music.",
                details: err?.message || "Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        audiosDetails,
        loading,
        error,
        addMusic,
        updateMusicDetails,
        deleteMusic,
        isSubmitting,
        actionMessage,
        clearMessage,
    };
};

export default useMusicList;