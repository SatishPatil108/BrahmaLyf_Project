// coachProfile.js

import { fetchCoachProfileAPI } from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useCoachProfile = (coachId) => {
  const dispatch = useDispatch();
  const { coachProfile, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (coachId) {
      dispatch(fetchCoachProfileAPI(coachId));
    }
  }, [coachId, dispatch]);

  return { coachProfile, loading, error };
};

export default useCoachProfile;
