import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoachesVideosAPI } from "@/store/feature/user";

const useCoachesInfoPage = (subdomainId, coachId) => {
  const [pageNo, setPageNo] = useState(1);

  const dispatch = useDispatch();
  const { videosDetails, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (subdomainId === undefined) subdomainId = 0;
    if (coachId === undefined) coachId = 0;

    dispatch(fetchCoachesVideosAPI({
      pageNo,
      pageSize: 9,
      subdomainId,
      coachId
    }));
  }, [subdomainId, coachId, dispatch,pageNo]);

  return {
    videosDetails,
    loading: isLoading,
    error,
    setPageNo,
  };
};

export default useCoachesInfoPage;
