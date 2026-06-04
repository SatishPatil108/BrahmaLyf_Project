import {
  fetchShowPracticeQuestionsAPI,
  fetchShowToolsQuestionsAPI,
} from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const useShowPracticeDetails = (courseId, weekNo) => {
  const dispatch = useDispatch();
  const { practiceDetails, toolsDetails, isLoading, error } = useSelector(
    (state) => state.user,
  );

  const taskQuestions = practiceDetails?.questions || [];
  const toolQuestions = toolsDetails?.questions || [];

  useEffect(() => {
    dispatch(fetchShowPracticeQuestionsAPI({ courseId, weekNo }));
    dispatch(fetchShowToolsQuestionsAPI({ courseId, weekNo }));
  }, [dispatch, courseId, weekNo]);

  return { taskQuestions, toolQuestions, isLoading, error };
};

export default useShowPracticeDetails;
