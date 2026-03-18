import { fetchUserNotesAPI } from "@/store/feature/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useUserNotes = (pageNo , pageSize ) => {
  const dispatch = useDispatch();
  const { userNotesDetails, loading, error } = useSelector((state) => state.user);
  
  useEffect(() => {
    dispatch(fetchUserNotesAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return { userNotesDetails, loading, error };
};

export default useUserNotes;
