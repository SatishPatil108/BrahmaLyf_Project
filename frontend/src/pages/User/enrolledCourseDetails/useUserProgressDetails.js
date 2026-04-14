import { fetchUserProgressQuestionsAndOptionsAPI } from "@/store/feature/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useUserProgressDetails = (courseId) => {
  const dispatch = useDispatch();

  const [weekData, setWeekData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const error = useSelector((state) => state.user.userProgressDetails?.error);

  // ✅ Read persistent state from Redux
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

  const submittedAnswers = weekData?.submittedAnswers || {};

  console.log(submittedAnswers);

  useEffect(() => {
    if (!courseId) return;

    setIsFetching(true);

    dispatch(fetchUserProgressQuestionsAndOptionsAPI({ courseId }))
      .unwrap()
      .then((payload) => {
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
      })
      .catch(() => setWeekData(null))
      .finally(() => setIsFetching(false));
  }, [courseId]);

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
