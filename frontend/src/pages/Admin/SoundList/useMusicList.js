import {
    fetchAllMusicsAPI,
    postMusicAPI,
    updateMusicAPI,
    deleteMusicAPI
} from "@/store/feature/admin";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const useMusicList = (pageNo, pageSize) => {
    const dispatch = useDispatch();
    const { audiosDetails, loading, error } = useSelector((state) => state.admin);

    // Fetch music list
    useEffect(() => {
        dispatch(fetchAllMusicsAPI({ pageNo, pageSize }));
    }, [dispatch, pageNo, pageSize]);

    // ADD MUSIC
    const addMusic = (formData) => {
        const toastId = toast.loading("Adding new music...");

        dispatch(postMusicAPI(formData))
            .unwrap()
            .then(() => {
                toast.update(toastId, {
                    render: "New music added successfully 🎉",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            })
            .catch((err) => {
                console.error(err);
                toast.update(toastId, {
                    render: err?.message || "Failed to add music!",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            });
    };

    // UPDATE MUSIC
    const updateMusicDetails = (musicId, musicData) => {
        const toastId = toast.loading("Updating music data...");

        dispatch(updateMusicAPI({ musicId, musicData }))
            .unwrap()
            .then(() => {
                toast.update(toastId, {
                    render: "Music data updated successfully 🎉",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            })
            .catch((err) => {
                console.error("Failed to update music:", err);
                toast.update(toastId, {
                    render: err?.message || "Failed to update music!",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            });
    };

    // DELETE MUSIC
    const deleteMusic = (musicId) => {
        const toastId = toast.loading("Deleting music data...");

        dispatch(deleteMusicAPI(musicId))
            .unwrap()
            .then(() => {
                toast.update(toastId, {
                    render: "Music deleted successfully 🎉",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
                dispatch(fetchAllMusicsAPI({ pageNo, pageSize }));
            })
            .catch((err) => {
                console.error("Failed to delete music:", err);
                toast.update(toastId, {
                    render: err?.message || "Failed to delete music!",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            });
    };

    return { audiosDetails, loading, error, addMusic, updateMusicDetails, deleteMusic };
};

export default useMusicList;
