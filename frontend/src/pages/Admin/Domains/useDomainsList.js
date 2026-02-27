import { addNewDomain, deleteDomainAPI, getAllDomains, updateDomainAPI } from "@/store/feature/admin";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDomainsList = (pageNo, pageSize) => {
  const dispatch = useDispatch();
  const { domainsDetails, loading, error } = useSelector((state) => state.admin);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const clearMessage = useCallback(() => {
    setActionMessage(null);
  }, []);

  useEffect(() => {
    dispatch(getAllDomains({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  const refetch = useCallback(() => {
    dispatch(getAllDomains({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  const addDomain = async (domainData) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(addNewDomain(domainData)).unwrap();
      setActionMessage({ type: "success", text: "Domain created successfully!" });
      refetch();
    } catch (err) {
      console.error("Failed to add domain:", err);
      setActionMessage({
        type: "error",
        text: "Failed to create domain.",
        details: err?.message || "Please try again.",
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDomain = async (domainId, domainData) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(updateDomainAPI({ domainId, domainData })).unwrap();
      setActionMessage({ type: "success", text: "Domain updated successfully!" });
      refetch();
    } catch (err) {
      console.error("Failed to update domain:", err);
      setActionMessage({
        type: "error",
        text: "Failed to update domain.",
        details: err?.message || "Please try again.",
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDomain = async (domainId) => {
    setIsSubmitting(true);
    clearMessage();
    try {
      await dispatch(deleteDomainAPI(domainId)).unwrap();
      setActionMessage({ type: "success", text: "Domain deleted successfully!" });
      refetch();
    } catch (err) {
      console.error("Failed to delete domain:", err);
      setActionMessage({
        type: "error",
        text: "Failed to delete domain.",
        details: err?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    domainsDetails,
    loading,
    error,
    addDomain,
    updateDomain,
    deleteDomain,
    isSubmitting,
    actionMessage,
    clearMessage,
  };
};

export default useDomainsList;