import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { adminLoginAPI } from "@/store/feature/auth"; // your admin login thunk
import { clearError, resetFlags } from "@/store/feature/auth/authSlice";

const useLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Use the correct flag from slice
  const { isLoading, error, adminLoginSuccess } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePass, setTogglePass] = useState(true)
  const firstRender = useRef(true);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(adminLoginAPI({ email, password }));
  };

  // Success redirect
  useEffect(() => {
    if (firstRender.current) {
      dispatch(clearError());
      firstRender.current = false;
      return;
    }
    if (adminLoginSuccess) {
      toast.success("Login successful ✅", {
        position: "top-center",
        autoClose: 1500,
      });
      setTimeout(() => {
        navigate("/admin/dashboard"); // redirect to admin dashboard
        // dispatch(resetFlags());
      }, 1500);
    }
  }, [adminLoginSuccess, navigate, dispatch]);

  // Show errors
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [error]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    togglePass,
    setTogglePass,
    loading: isLoading,
    error,
    handleLogin,
    loginSuccess: adminLoginSuccess,
  };
};

export default useLoginPage;
