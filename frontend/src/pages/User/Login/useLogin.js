import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loginUserAPI } from "@/store/feature/auth";
import { clearError, resetFlags } from "@/store/feature/auth/authSlice";
import { clearUserError } from "@/store/feature/user/userSlice";

const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, userLoginSuccess } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const firstRender = useRef(true);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUserAPI({ email, password, rememberMe }));
  };

  // Success redirect
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (userLoginSuccess) {
      toast.success("Login successful ✅", {
        position: "top-center",
        autoClose: 1500,
      });

      setTimeout(() => {
        dispatch(clearUserError());
        dispatch(resetFlags());
        navigate("/my-courses");
      }, 1500);
    }
  }, [userLoginSuccess, navigate, dispatch]);

  // Show errors
  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [error]);

  return {
    email,
    password,
    rememberMe,
    loading: isLoading,
    error,
    setEmail,
    setPassword,
    setRememberMe,
    handleLogin,
  };
};

export default useLogin;