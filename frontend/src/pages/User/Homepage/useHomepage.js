import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCoursesFeedbackAPI, fetchCoursesCategoriesAPI, fetchFAQsAPI, fetchMusicListAPI, fetchUserDashboardDataAPI, searchAPI } from "@/store/feature/user";
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
 

const EMPTY_MUSICS = { musics: [] };

export const useMusicListPage = (pageNo, pageSize, domainId) => {
  const dispatch = useDispatch();

  const cacheKey = domainId ?? "all";

  const selectMusicsForDomain = useMemo(
    () =>
      createSelector(
        (state) => state.user.musicsDetails,
        (musicsDetails) => musicsDetails[cacheKey] ?? EMPTY_MUSICS
      ),
    [cacheKey]
  );

  const musicsDetails = useSelector(selectMusicsForDomain);
  const isLoading = useSelector((state) => state.user.isLoading);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(fetchMusicListAPI({ pageNo, pageSize, domainId }));
  }, [dispatch, pageNo, pageSize, domainId]);

  return { musicsDetails, loading: isLoading, error };
};


export default useHomepage;
