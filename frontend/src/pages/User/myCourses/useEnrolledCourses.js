// src/pages/User/enrolledCourses/useEnrolledCourses.js
import { fetchMyCoursesAPI } from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useEnrolledCourses = (pageNo, pageSize) => {
  const dispatch = useDispatch();
  const { myCoursesDetails, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMyCoursesAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return { myCoursesDetails, isLoading, error };
};

export default useEnrolledCourses;
