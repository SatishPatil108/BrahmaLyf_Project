import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCoursesFeedbackAPI, fetchCoursesCategoriesAPI, fetchFAQsAPI, fetchMusicListAPI, fetchUserDashboardDataAPI, searchAPI } from "@/store/feature/user";


const useHomepage = () => {
   const dispatch = useDispatch();
  const { dashboardData, isLoading, isSpin, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchUserDashboardDataAPI());
  }, [dispatch]);


  return { dashboardData, loading: isLoading, isSpin, error };
};
export const useFAQPage = (pageNo, pageSize) => {
  const dispatch = useDispatch();
  const { FAQsDetails, isLoading, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchFAQsAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return {
    FAQsDetails,
    loading: isLoading,
    error
  };
};

export const useFeedback = (pageNo, pageSize) => {

  const dispatch = useDispatch();
  const { allCoursesFeedback, isLoading, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchAllCoursesFeedbackAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);
  return { allCoursesFeedback, loading: isLoading, error };
};
export const useMusicListPage = (pageNo, pageSize) => {

  const dispatch = useDispatch();
  const { musicsDetails, isLoading, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchMusicListAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);
  return { musicsDetails, loading: isLoading, error };
};
export default useHomepage;
