import {
  fetchUserProgressQuestionsAndOptionsAPI,
  fetchUserResponseAPI,
} from "@/store/feature/user";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useUserProgressDetails = (courseId) => {
  const dispatch = useDispatch();

  const [weekData, setWeekData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // ✅ All selectors use correct slice shape from your actual initialState
  const error = useSelector((state) => state.user.userProgressDetails?.error);
  const submittedQuestions = useSelector(
    (state) => state.user.userProgressDetails.submittedQuestions,
  );
  const completedDays = useSelector(
    (state) => state.user.userProgressDetails.completedDays,
  );
  const currentDayIndex = useSelector(
    (state) => state.user.userProgressDetails.currentDayIndex,
  );
  const alreadySubmitted = useSelector(
    (state) => state.user.userProgressDetails.alreadySubmitted,
  );
  const submittedAnswers = useSelector(
    (state) => state.user.userProgressDetails.submittedAnswers,
  );

  // ✅ weekNo from Redux — used to detect cron-driven week changes
  const reduxWeekNo = useSelector(
    (state) => state.user.userProgressDetails.weekNo,
  );

  // ✅ Ref holds previous weekNo — avoids re-fetch on first mount
  const prevWeekNoRef = useRef(null);
  // ✅ Tracks whether initial fetch has happened
  const hasMountedRef = useRef(false);

  const fetchQuestions = useCallback(async () => {
    if (!courseId) return;

    setIsFetching(true);
    try {
      const payload = await dispatch(
        fetchUserProgressQuestionsAndOptionsAPI({ courseId }),
      ).unwrap();

      // ✅ Consistent with your slice's fulfilled case check
      if (payload?.alreadySubmitted) {
        setWeekData(null);
      } else {
        setWeekData({
          alreadySubmitted: false,
          week_no: payload?.week_no,
          total_days: payload?.total_days,
          data: payload?.data ?? [],
          submittedAnswers: payload?.submittedAnswers || {},
        });
      }
    } catch {
      setWeekData(null);
    } finally {
      setIsFetching(false);
    }
  }, [courseId, dispatch]);

  // ✅ Initial fetch on mount / courseId change
  useEffect(() => {
    hasMountedRef.current = false; // reset on courseId change
    prevWeekNoRef.current = null;
    fetchQuestions().then(() => {
      hasMountedRef.current = true;
    });
  }, [fetchQuestions]);

  // ✅ Re-fetch when cron changes weekNo in Redux
  // Guard: skip until initial fetch is done + skip if weekNo didn't actually change
  useEffect(() => {
    if (!hasMountedRef.current) return;               // still on first load
    if (prevWeekNoRef.current === null) {              // capture initial weekNo
      prevWeekNoRef.current = reduxWeekNo;
      return;
    }
    if (reduxWeekNo !== prevWeekNoRef.current) {
      prevWeekNoRef.current = reduxWeekNo;
      fetchQuestions();                                // 🔄 week rolled over
    }
  }, [reduxWeekNo, fetchQuestions]);

  // ✅ Re-validate on tab focus (free freshness)
  useEffect(() => {
    if (!courseId) return;
    const handleFocus = () => fetchQuestions();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [courseId, fetchQuestions]);

  // ✅ Fetch user responses separately (read-only, no loading state conflict)
  useEffect(() => {
    if (!courseId) return;
    dispatch(fetchUserResponseAPI({ courseId }));
  }, [courseId, dispatch]);

  return {
    weekData,
    isLoading: isFetching,
    error,
    submittedToday: alreadySubmitted,
    submittedQuestions,
    submittedAnswers,
    completedDays,
    currentDayIndex,
  };
};

export default useUserProgressDetails;