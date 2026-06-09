import {
  fetchUserProgressQuestionsAndOptionsAPI,
  fetchUserResponseAPI,
} from "@/store/feature/user";

import { useEffect, useRef, useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

const EMPTY_OBJECT = {};

const useUserProgressDetails = (courseId) => {
  const dispatch = useDispatch();

  const [weekData, setWeekData] = useState(null);

  const [isFetching, setIsFetching] = useState(true);

  // ✅ COURSE-SCOPED STATE
  const courseState = useSelector(
    (state) => state.user.userProgressDetails.byCourse?.[courseId],
  );

  // ✅ SAFE DEFAULTS
  const error = courseState?.error || null;

  const submittedQuestions = courseState?.submittedQuestions || EMPTY_OBJECT;

  const completedDays = courseState?.completedDays || EMPTY_OBJECT;

  const currentDayIndex = courseState?.currentDayIndex || 0;

  const alreadySubmitted = courseState?.alreadySubmitted || false;

  const submittedAnswers = courseState?.submittedAnswers || EMPTY_OBJECT;

  const reduxWeekNo = courseState?.weekNo || null;

  // refs
  const prevWeekNoRef = useRef(null);

  const hasMountedRef = useRef(false);

  // =========================================
  // FETCH QUESTIONS
  // =========================================

  const fetchQuestions = useCallback(async () => {
    if (!courseId) {
      setWeekData(null);
      return;
    }

    setIsFetching(true);

    try {
      const payload = await dispatch(
        fetchUserProgressQuestionsAndOptionsAPI({
          courseId,
        }),
      ).unwrap();

      setWeekData({
        alreadySubmitted: payload?.alreadySubmitted || false,

        week_no: payload?.week_no || 1,

        total_days: payload?.total_days || 0,

        data: Array.isArray(payload?.data) ? payload.data : [],

        submission: payload?.submission || null,

        submittedAnswers: payload?.submittedAnswers || {},
      });
    } catch (err) {
      console.error("fetchQuestions error:", err);

      setWeekData({
        alreadySubmitted: false,
        week_no: 1,
        total_days: 0,
        data: [],
        submission: null,
        submittedAnswers: {},
      });
    } finally {
      setIsFetching(false);
    }
  }, [courseId, dispatch]);

  // =========================================
  // INITIAL FETCH
  // =========================================

  useEffect(() => {
    setWeekData(null);

    hasMountedRef.current = false;

    prevWeekNoRef.current = null;

    fetchQuestions().then(() => {
      hasMountedRef.current = true;
    });
  }, [fetchQuestions]);

  // =========================================
  // REFETCH WHEN WEEK CHANGES
  // =========================================

  useEffect(() => {
    if (!hasMountedRef.current) return;

    if (prevWeekNoRef.current === null) {
      prevWeekNoRef.current = reduxWeekNo;

      return;
    }

    if (reduxWeekNo !== prevWeekNoRef.current) {
      prevWeekNoRef.current = reduxWeekNo;

      fetchQuestions();
    }
  }, [reduxWeekNo, fetchQuestions]);

  // =========================================
  // WINDOW FOCUS REFRESH
  // =========================================

  useEffect(() => {
    if (!courseId) return;

    const handleFocus = () => fetchQuestions();

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [courseId, fetchQuestions]);

  // =========================================
  // FETCH USER RESPONSES
  // =========================================

  useEffect(() => {
    if (!courseId) return;

    dispatch(
      fetchUserResponseAPI({
        courseId,
      }),
    );
  }, [courseId, dispatch]);

  return {
    weekData: weekData
      ? {
          ...weekData,
          submittedQuestions,
          submittedAnswers,
          completedDays,
          currentDayIndex,
        }
      : null,
    isLoading: isFetching,
    error,
    submittedToday: alreadySubmitted,
  };
};

export default useUserProgressDetails;
