import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDomains, fetchAllSubDomainsAPI } from "@/store/feature/admin";

 const useDomainData = () => {
  const dispatch = useDispatch();
  const { loading, error, domainsDetails, subdomainsDetails } = useSelector(
    (state) => state.admin
  );

  // Fetch all domains on mount
  useEffect(() => {
    dispatch(getAllDomains({ pageNo:1, pageSize:"*" }));
  }, [dispatch]);

  // Fetch subdomains based on selected domain
  const fetchSubdomains = useCallback(
    async (domainId) => {
      if (!domainId) return;
      try {
        await dispatch(fetchAllSubDomainsAPI({ domainId })).unwrap();
      } catch (err) {
        console.error("Failed to fetch subdomains:", err);
      }
    },
    [dispatch]
  );

  return { loading, error, domainsDetails, subdomainsDetails, fetchSubdomains };
};

export default useDomainData;