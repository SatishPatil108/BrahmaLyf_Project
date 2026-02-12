import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import { setDispatch, setNavigator } from "@/utils/navigation";
import { useDispatch } from "react-redux";

const AppRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setNavigator(navigate);
    setDispatch(dispatch);
  }, [navigate, dispatch]);
  return (
    <Routes>
      {/* User routes */}
      <Route path="/*" element={<UserRoutes />} />
      {/* Admin routes */}
      <Route path="admin/*" element={<AdminRoutes />} />
    </Routes>);
};

export default AppRoutes;