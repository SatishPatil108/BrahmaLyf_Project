import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  addNewSubDomain,
  deleteSubDomainAPI,
  fetchAllSubDomainsAPI,
  updateSubDomainAPI,
} from "@/store/feature/admin";

const useSubDomainsList = (pageNo, pageSize, domainId) => {
  const dispatch = useDispatch();
  const { subdomainsDetails, loading, error } = useSelector((state) => state.admin);
   useEffect(() => {
    if (domainId && !isNaN(domainId)) {
      dispatch(
        fetchAllSubDomainsAPI({
          pageNo,
          pageSize,
          domainId: Number(domainId),
        })
      );
    }
  }, [domainId, dispatch, pageNo, pageSize]);

  const addSubDomain = (subDomainData) => {
    dispatch(addNewSubDomain(subDomainData))
      .unwrap()
      .then(() => {
        dispatch(
          fetchAllSubDomainsAPI({
            pageNo: 1,
            pageSize: 10,
            domainId: Number(domainId),
          })
        );
      })
      .catch((err) => {
        console.error("Failed to add domain:", err);
      });
  };

  const updateSubDomain = (subdomainId, data) => {
    dispatch(updateSubDomainAPI({ subdomainId, data }))
      .unwrap()
      .then(() => {
        dispatch(fetchAllSubDomainsAPI({
          pageNo: 1,
          pageSize: 10,
          domainId: Number(domainId),
        }));
      })
      .catch((err) => {
        console.error("Failed to update subdomain:", err);
      });
  };



  const deleteSubdomain = (subdomainId) => {
    dispatch(deleteSubDomainAPI(subdomainId))
      .unwrap()
      .then(() => {
        dispatch(
          fetchAllSubDomainsAPI({
            pageNo: 1,
            pageSize: 10,
            domainId: Number(domainId),
          })
        );
      })
      .catch((err) => {
        console.error("Failed to delete subdomain:", err);
      });
  };

  return { subdomainsDetails, loading, error, addSubDomain, updateSubDomain, deleteSubdomain };
};

export default useSubDomainsList;