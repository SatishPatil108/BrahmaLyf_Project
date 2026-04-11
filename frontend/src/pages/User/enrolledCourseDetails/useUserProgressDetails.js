import { fetchUserProgressQuestionsAndOptionsAPI } from "@/store/feature/user";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const getDaysDifference = (submittedDate) => {
  if (!submittedDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const submitted = new Date(submittedDate);
  submitted.setHours(0, 0, 0, 0);
  return Math.floor((today - submitted) / (1000 * 60 * 60 * 24));
};

const useUserProgressDetails = (courseId) => {
  const dispatch = useDispatch();

  const [questions, setQuestions] = useState([]);

  const userProgressDetails = useSelector(
    (state) => state.user.userProgressDetails,
  );
  const isLoading = useSelector(
    (state) => state.user.userProgressDetails.loading,
  );
  const error = useSelector((state) => state.user.userProgressDetails.error);

  const { effectiveDay, effectiveWeek, submittedToday } = useMemo(() => {
    const { alreadySubmitted, lastSubmittedDate, dayNo, weekNo } =
      userProgressDetails ?? {};

    const diffDays = getDaysDifference(lastSubmittedDate);
    const submittedToday = !!(alreadySubmitted && diffDays === 0);

    if (alreadySubmitted && diffDays >= 1) {
      const nextDay = (dayNo || 1) + 1;
      const overflow = nextDay > 7;
      return {
        effectiveDay: overflow ? 1 : nextDay,
        effectiveWeek: overflow ? (weekNo || 1) + 1 : weekNo || 1,
        submittedToday,
      };
    }

    return {
      effectiveDay: dayNo || 1,
      effectiveWeek: weekNo || 1,
      submittedToday,
    };
  }, [userProgressDetails]);

  useEffect(() => {
    if (!courseId) return;

    const { alreadySubmitted, lastSubmittedDate } = userProgressDetails;

    if (alreadySubmitted && getDaysDifference(lastSubmittedDate) === 0) return;

    dispatch(
      fetchUserProgressQuestionsAndOptionsAPI({
        courseId,
        weekNo: effectiveWeek,
        dayNo: effectiveDay,
      }),
    )
      .unwrap()
      .then((payload) => {
        setQuestions(payload?.questions || []);
      })
      .catch(() => setQuestions([]));
  }, [courseId]);

  return {
    progressTrackingQuestionsDetails: userProgressDetails ?? {},
    questions,
    isLoading,
    error,
    effectiveWeek,
    effectiveDay,
    submittedToday,
  };
};

export default useUserProgressDetails;
