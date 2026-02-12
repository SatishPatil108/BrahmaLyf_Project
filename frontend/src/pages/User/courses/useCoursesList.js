import { fetchCoursesCategoriesAPI } from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useCoursesList = (pageNo, pageSize) => {
  const dispatch = useDispatch();
  const { domainsDetails, isLoading, error } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchCoursesCategoriesAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);
  return { coursesDetails: domainsDetails, loading: isLoading, error };
};

export default useCoursesList;