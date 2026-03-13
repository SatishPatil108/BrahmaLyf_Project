import {
  deleteProgressTrackingQuestionAPI,
  fetchAllCoursesAPI,
  fetchProgressTrackingQuestionsAPI,
  postProgressTrackingQuestionAPI,
  updateProgressTrackingQuestionAPI,
} from "@/store/feature/admin";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const useProgressTrackingQuestionsDetails = (weekNo, dayNo) => {
  const dispatch = useDispatch();

  const {
    progressTrackingQuestionsDetails,
    coursesDetails,
    ptqLoading,
    ptqError,
  } = useSelector((state) => state.admin);

  // Fetch all courses on mount (for dropdown in form)
  useEffect(() => {
    dispatch(fetchAllCoursesAPI({ pageNo: 1, pageSize: 10 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProgressTrackingQuestionsAPI({ weekNo, dayNo }));
  }, [dispatch, weekNo, dayNo]);

  const refetch = useCallback(() => {
    dispatch(fetchProgressTrackingQuestionsAPI({ weekNo, dayNo }));
  }, [dispatch, weekNo, dayNo]);

  // --- Delete ---
  const deleteTrackingQuestion = (questionId) => {
    if (!window.confirm("Delete this question?")) return;
    const toastId = toast.loading("Deleting...");

    dispatch(deleteProgressTrackingQuestionAPI(questionId))
      .unwrap()
      .then(() => {
        toast.update(toastId, {
          render: "Deleted successfully 🎯",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        refetch(); // ✅ refresh list after delete
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
    coursesDetails,
    loading: ptqLoading,
    error: ptqError,
    deleteTrackingQuestion,
  };
};
export default useProgressTrackingQuestionsDetails;
