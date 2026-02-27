import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import {
  addNewSubDomain,
  deleteSubDomainAPI,
  fetchAllSubDomainsAPI,
  updateSubDomainAPI,
} from "@/store/feature/admin";

const useSubDomainsList = (pageNo, pageSize, domainId) => {
  const dispatch = useDispatch();
  const { subdomainsDetails, loading, error } = useSelector((state) => state.admin);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const clearMessage = useCallback(() => {
    setActionMessage(null);
  }, []);

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

  const refetch = useCallback(() => {
    dispatch(
      fetchAllSubDomainsAPI({
        pageNo: 1,
        pageSize: 10,
        domainId: Number(domainId),
      })
    );
  }, [dispatch, domainId]);

  const addSubDomain = async (subDomainData) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(addNewSubDomain(subDomainData)).unwrap();
      setActionMessage({ type: "success", text: "Subdomain created successfully!" });
      refetch();
    } catch (err) {
      console.error("Failed to add subdomain:", err);
      setActionMessage({
        type: "error",
        text: "Failed to create subdomain.",
        details: err?.message || "Please try again.",
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSubDomain = async (subdomainId, data) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(updateSubDomainAPI({ subdomainId, data })).unwrap();
      setActionMessage({ type: "success", text: "Subdomain updated successfully!" });
      refetch();
    } catch (err) {
      console.error("Failed to update subdomain:", err);
      setActionMessage({
        type: "error",
        text: "Failed to update subdomain.",
        details: err?.message || "Please try again.",
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSubdomain = async (subdomainId) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(deleteSubDomainAPI(subdomainId)).unwrap();
      setActionMessage({ type: "success", text: "Subdomain deleted successfully!" });
      refetch();
    } catch (err) {
      console.error("Failed to delete subdomain:", err);
      setActionMessage({
        type: "error",
        text: "Failed to delete subdomain.",
        details: err?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    subdomainsDetails,
    loading,
    error,
    addSubDomain,
    updateSubDomain,
    deleteSubdomain,
    isSubmitting,
    actionMessage,
    clearMessage,
  };
};

export default useSubDomainsList;