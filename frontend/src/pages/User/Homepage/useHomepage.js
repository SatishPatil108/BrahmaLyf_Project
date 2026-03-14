import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCoursesFeedbackAPI, fetchCoursesCategoriesAPI, fetchFAQsAPI, fetchMusicListAPI, fetchShortVideoListAPI, fetchUserDashboardDataAPI, searchAPI } from "@/store/feature/user";
import { createSelector } from "@reduxjs/toolkit";


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

export default useHomepage;


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


export const useMusicListPage = (pageNo, pageSize, domainId) => {
  const dispatch = useDispatch();
  const { musicsDetails, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMusicListAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return { musicsDetails, loading: isLoading, error };
};



export const useDailyShort = (pageNo, pageSize, domainId) => {
  const dispatch = useDispatch();
  const { shortVideosDetails, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchShortVideoListAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return { shortVideosDetails, loading: isLoading, error };

}

