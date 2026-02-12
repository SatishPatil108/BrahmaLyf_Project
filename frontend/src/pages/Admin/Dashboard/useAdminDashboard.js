// useAdminDashboard.js
import { getAdminDashboardData } from "@/store/feature/admin";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export const useAdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminDashboardData());
  }, [dispatch]);

  return { dashboardData, loading, error };
};
