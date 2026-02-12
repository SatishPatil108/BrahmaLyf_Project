import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubdomainsDetailsAPI } from "@/store/feature/user";

const useSubCategoriesPage = (domain_id, pageNo, pageSize) => {
  const dispatch = useDispatch();
  const { subdomainsDetails, isLoading, error } = useSelector(state => state.user);

  useEffect(() => {
    if (!domain_id || domain_id === "undefined") return;
    dispatch(fetchSubdomainsDetailsAPI({ pageNo, pageSize, domainId: domain_id }));
  }, [domain_id, dispatch, pageNo, pageSize]);

  const subCats = subdomainsDetails[domain_id];
  
  return {
    subdomainsDetails: subCats,
    loading: isLoading,
    error,
  };
};

export default useSubCategoriesPage;
