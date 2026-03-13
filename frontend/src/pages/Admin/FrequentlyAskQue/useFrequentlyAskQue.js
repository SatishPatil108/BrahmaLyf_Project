import { fetchFAQsAPI } from "@/store/feature/admin";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useFrequentlyAskQue = (pageNo , pageSize ) => {
  const dispatch = useDispatch();
  const { faqsDetails, loading, error } = useSelector((state) => state.admin);
  console.log("FAQs Details:", faqsDetails);
  
  useEffect(() => {
    dispatch(fetchFAQsAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  return { faqsDetails, loading, error };
};

export default useFrequentlyAskQue;
