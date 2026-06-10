import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMusicListAPI,
  fetchShortVideoListAPI,
  fetchUserDashboardDataAPI,
} from "@/store/feature/user";
import { createSelector } from "@reduxjs/toolkit";

export const useMusicListPage = (pageNo, pageSize, domainId) => {
  const dispatch = useDispatch();
  const { musicsDetails, isLoading, error } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    dispatch(fetchMusicListAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return { musicsDetails, loading: isLoading, error };
};

export const useDailyShort = (pageNo, pageSize, domainId) => {
  const dispatch = useDispatch();
  const { shortVideosDetails, isLoading, error } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    dispatch(fetchShortVideoListAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return { shortVideosDetails, loading: isLoading, error };
};
