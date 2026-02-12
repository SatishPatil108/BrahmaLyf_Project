import { fetchAllCoachesAPI } from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const useGetAllCoaches = (pageNo = 1, pageSize = 10) => {
  const dispatch = useDispatch();
  const { coachesDetails, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllCoachesAPI({ pageNo, pageSize })); 
  }, [dispatch, pageNo, pageSize]);

  return { coachesDetails, isLoading, error };
};

export default useGetAllCoaches;
