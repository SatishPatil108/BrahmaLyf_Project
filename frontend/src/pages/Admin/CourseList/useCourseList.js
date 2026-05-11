import { fetchAllCoursesAPI } from "@/store/feature/admin";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useCourseList = (pageNo, pageSize) => {
  const dispatch = useDispatch();

  // Select state from Redux store
  const { coursesDetails, loading, error } = useSelector(
    (state) => state.admin,
  );

  useEffect(() => {
    dispatch(fetchAllCoursesAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  const refetch = useCallback(() => {
    dispatch(fetchAllCoursesAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return { coursesDetails, loading, error, refetch };
};

export default useCourseList;
