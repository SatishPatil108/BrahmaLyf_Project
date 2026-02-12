import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoursesCategoriesAPI } from "@/store/feature/user";

const useCategories = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { isLoading, error, domainsDetails } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchCoursesCategoriesAPI({ pageNo: 1, pageSize: 10 }));
  }, [dispatch]);

  return { 
    loading: isLoading, 
    error: error || null, 
    domainsDetails: domainsDetails || { domains: [] }, 
    selectedCategory, 
    setSelectedCategory 
  };
};

export default useCategories;