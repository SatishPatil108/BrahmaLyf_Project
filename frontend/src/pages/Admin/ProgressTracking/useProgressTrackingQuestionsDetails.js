import {
    deleteProgressTrackingQuestionAPI,
    fetchProgressTrackingQuestionsAPI,
    postProgressTrackingQuestionAPI,
    updateProgressTrackingQuestionAPI,
} from "@/store/feature/admin";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const useProgressTrackingQuestionsDetails = (courseId) => {
    const dispatch = useDispatch();

    // --- Drawer State ---
    const [isProgressTrackingQuestionsDrawerOpen, setIsProgressTrackingQuestionsDrawerOpen] = useState(false);
    const [isProgressTrackingQuestionsEditing, setIsProgressTrackingQuestionsEditing] = useState(false);
    const [trackingQuestionsDetails, setTrackingQuestionsDetails] = useState(null);

    const { progressTrackingQuestionsDetails, ptqLoading, ptqError } = useSelector(
        (state) => state.admin
    );

    // ✅ Fetch using courseId
    useEffect(() => {
        if (courseId) {
            dispatch(fetchProgressTrackingQuestionsAPI({ courseId }));
        }
    }, [dispatch, courseId]);

    // --- Edit ---
    const handleTrackingQuestionEdit = (questionId, questionData) => {
        const questionItem = progressTrackingQuestionsDetails?.questions?.find(
            (item) => item.id === questionId
        );

        setTrackingQuestionsDetails({
            ...questionItem,
            ...questionData,
        });

        setIsProgressTrackingQuestionsEditing(true);
        setIsProgressTrackingQuestionsDrawerOpen(true);
    };

    // --- Submit ---
    const handleTrackingQuestionFormSubmit = (questionData) => {
        if (isProgressTrackingQuestionsEditing) {
            const toastId = toast.loading("Updating question...");

            dispatch(
                updateProgressTrackingQuestionAPI({
                    questionId: trackingQuestionsDetails.id,
                    questionData,
                })
            )
                .unwrap()
                .then(() => {
                    toast.update(toastId, {
                        render: "Updated successfully 🎉",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });

                    setIsProgressTrackingQuestionsEditing(false);
                    setIsProgressTrackingQuestionsDrawerOpen(false);
                    setTrackingQuestionsDetails(null);
                })
                .catch((err) => {
                    toast.update(toastId, {
                        render: err || "Update failed ❌",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                });
        } else {
            const toastId = toast.loading("Adding question...");

            dispatch(
                postProgressTrackingQuestionAPI({
                    courseId, // ✅ important
                    questionData,
                })
            )
                .unwrap()
                .then(() => {
                    toast.update(toastId, {
                        render: "Added successfully 🎉",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });

                    setIsProgressTrackingQuestionsEditing(false);
                    setIsProgressTrackingQuestionsDrawerOpen(false);
                    setTrackingQuestionsDetails(null);
                })
                .catch((err) => {
                    toast.update(toastId, {
                        render: err || "Add failed ❌",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                });
        }
    };

    // --- Delete ---
    const deleteTrackingQuestion = (questionId) => {
        if (!window.confirm("Delete this question?")) return;

        const toastId = toast.loading("Deleting...");

        dispatch(deleteProgressTrackingQuestionAPI({ questionId }))
            .unwrap()
            .then(() => {
                toast.update(toastId, {
                    render: "Deleted successfully 🎯",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            })
            .catch(() => {
                toast.update(toastId, {
                    render: "Delete failed ❌",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            });
    };

    return {
        progressTrackingQuestionsDetails,
        trackingQuestionsDetails,
        loading: ptqLoading,
        error: ptqError,

        isProgressTrackingQuestionsDrawerOpen,
        isProgressTrackingQuestionsEditing,

        setTrackingQuestionsDetails,
        setIsProgressTrackingQuestionsEditing,
        setIsProgressTrackingQuestionsDrawerOpen,

        handleTrackingQuestionEdit,
        handleTrackingQuestionFormSubmit,
        deleteTrackingQuestion,
    };
};

export default useProgressTrackingQuestionsDetails;