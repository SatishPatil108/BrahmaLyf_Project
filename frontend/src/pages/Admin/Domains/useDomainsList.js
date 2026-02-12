import { addNewDomain, deleteDomainAPI, getAllDomains, updateDomainAPI } from "@/store/feature/admin";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDomainsList = (pageNo, pageSize) => {
  const dispatch = useDispatch();

  const { domainsDetails, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllDomains({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  const addDomain = (domainData) => {
    dispatch(addNewDomain(domainData))
      .unwrap()
      .then(() => {
        dispatch(getAllDomains(pageNo, pageSize));
      })
      .catch((err) => {
        console.error("Failed to add domain:", err);
      });
  };

  const updateDomain = (domainId, domainData) => {
    dispatch(updateDomainAPI({
      domainId: domainId,
      domainData: domainData
    }))
      .unwrap()
      .then(() => {
      })
      .catch(err => console.error("Failed to update domain:", err));
  };

  const deleteDomain = (domainId) => {
    dispatch(deleteDomainAPI(domainId))
      .unwrap()
      .then(() => {
        dispatch(getAllDomains(pageNo, pageSize));
      })
      .catch((err) => console.error("Failed to delete domain:", err));
  };

  return { domainsDetails, loading, error, addDomain, updateDomain, deleteDomain };
};

export default useDomainsList;