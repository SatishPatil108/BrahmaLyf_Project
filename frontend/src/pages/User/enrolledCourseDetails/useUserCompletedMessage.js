import {
  fetchUserCompletedMessageAPI,
  fetchUserProgressThemesAPI,
} from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useUserCompletedMessage = (courseId, weekNo, dayNo) => {
  const dispatch = useDispatch();

  const { CompletedMessageDetails, ThemeDetails } = useSelector(
    (state) => state.user,
  );

  const weeklyTheme = ThemeDetails?.themes || [];

  const completedMessage =
    CompletedMessageDetails?.messagesByDay?.[dayNo] || [];

  useEffect(() => {
    if (CompletedMessageDetails?.messagesByDay?.[dayNo]) return;
    dispatch(fetchUserCompletedMessageAPI({ courseId, weekNo, dayNo }));
  }, [dispatch, courseId, weekNo, dayNo]);

  useEffect(() => {
    dispatch(fetchUserProgressThemesAPI({ courseId, weekNo }));
  }, [dispatch, courseId, weekNo]);

  return { weeklyTheme, completedMessage };
};

export default useUserCompletedMessage;
