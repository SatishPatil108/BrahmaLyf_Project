import { fetchFAQsAPI } from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useFAQPage = (pageNo, pageSize) => {
  const dispatch = useDispatch();
  const { FAQsDetails, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchFAQsAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return {
    FAQsDetails,
    loading: isLoading,
    error,
  };
};
