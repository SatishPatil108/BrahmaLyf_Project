import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    fetchCourseDetailsAPI,
    updateCourseAPI,
    deleteCourseAPI,
    addCurriculumItemAPI,
    updateCurriculumItemAPI,
    deleteCurriculumItemAPI,
} from "@/store/feature/admin";

export const useCourseDetails = (courseId) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Local state for drawer visibility
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCurriculumEditing, setIsCurriculumEditing] = useState(false);
    const [isCurriculumDrawerOpen, setIsCurriculumDrawerOpen] = useState(false);
    const [curriculumDetails, setCurriculumDetails] = useState(null);

    // Select course details state from Redux store
    const { courseDetails, loading, error } = useSelector(
        (state) => state.admin
    );

    // Fetch course details on component mount or when courseId changes
    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetailsAPI(courseId));
        }
    }, [dispatch, courseId]);

    // --- Handlers ---
    const handleDelete = (courseId) => {

        if (window.confirm("Are you sure you want to delete this course?")) {
            const toastId = toast.loading("Deleting course...");

            dispatch(deleteCourseAPI(courseId))
                .unwrap()
                .then(() => {
                    toast.update(toastId, {
                        render: "Course deleted successfully 🎯",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    navigate("/admin/courses");
                })
                .catch(() => {
                    toast.update(toastId, {
                        render: "Failed to delete course ❌",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                });
        }
    };

    const handleEdit = () => setIsDrawerOpen(true);

    const handleFormSubmit = (formData) => {
        const toastId = toast.loading("Updating course...");

        dispatch(updateCourseAPI({ courseId, courseData: formData }))
            .unwrap()
            .then(() => {
                toast.update(toastId, {
                    render: "Course updated successfully 🎉",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
                setIsDrawerOpen(false);
            })
            .catch((err) => {
                console.error(err)
                toast.update(toastId, {
                    render: err || "Failed to update course ❌",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            });
    };

    const handleCurriculumDelete = (curriculumId) => {
        if (window.confirm("Are you sure you want to delete this curriculum item?")) {
            const toastId = toast.loading("Deleting curriculum item...");

            dispatch(deleteCurriculumItemAPI({ courseId, curriculumId }))
                .unwrap()
                .then(() => {
                    toast.update(toastId, {
                        render: "Curriculum item deleted successfully 🎯",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                })
                .catch(() => {
                    toast.update(toastId, {
                        render: "Failed to delete curriculum item ❌",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                });
        }
    };

    const handleCurriculumEdit = (curriculumId) => {
        const curriculumItem = courseDetails.curriculum_outline.find(
            (item) => item.id === curriculumId
        );

        const videoItem = courseDetails.videos.find(
            (item) => item.curriculum_outline_id === curriculumId
        );

        setCurriculumDetails({
            ...curriculumItem,
            ...videoItem,
            video_id: videoItem?.id || null,
            id: curriculumId,
        });
        setIsCurriculumEditing(true);
        setIsCurriculumDrawerOpen(true);
    };
    const handleCurriculumFormSubmit = (formData) => {
        if (isCurriculumEditing) {
            const toastId = toast.loading("Updating curriculum item...");

            dispatch(updateCurriculumItemAPI({ curriculumId: curriculumDetails.id, curriculumData: formData }))
                .unwrap()
                .then(() => {
                    toast.update(toastId, {
                        render: "Curriculum item updated successfully 🎉",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    setIsCurriculumEditing(false);
                    setIsCurriculumDrawerOpen(false);
                    setCurriculumDetails(null);
                })
                .catch((err) => {
                    toast.update(toastId, {
                        render: err || "Failed to update curriculum item ❌",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                });
        }
        else {
            const toastId = toast.loading("Adding curriculum item...");

            dispatch(addCurriculumItemAPI({ courseId, curriculumData: formData }))
                .unwrap()
                .then(() => {
                    toast.update(toastId, {
                        render: "Curriculum item added successfully 🎉",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    setIsCurriculumEditing(false);
                    setIsCurriculumDrawerOpen(false);
                    setCurriculumDetails(null);
                })
                .catch((err) => {
                    toast.update(toastId, {
                        render: err || "Failed to add curriculum item ❌",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                });
        }
    };


    return {
        courseDetails,
        curriculumDetails,
        loading,
        error,
        isDrawerOpen,
        isCurriculumDrawerOpen,
        isCurriculumEditing,
        setCurriculumDetails,
        handleEdit,
        handleCurriculumEdit,
        handleFormSubmit,
        handleCurriculumFormSubmit,
        handleDelete,
        handleCurriculumDelete,
        setIsDrawerOpen,
        setIsCurriculumDrawerOpen,
        setIsCurriculumEditing,
    };
};

export default useCourseDetails;