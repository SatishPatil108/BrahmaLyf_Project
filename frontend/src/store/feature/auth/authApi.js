// authApi.js
import { makeRequest, API_METHODS } from "../../../api/axiosClient";

export const loginUser = async (credentials) => {
  return await makeRequest({
    service: "user/auth/login",
    method: API_METHODS.POST,
    data: credentials,
    authRequired: false,
  });
};

export const registerUser = async (credentials) => {
  return await makeRequest({
    service: "user/registration",
    method: API_METHODS.POST,
    data: credentials,
    authRequired: false,
  });
};

export const updateProfile = async (formData) => {
  return await makeRequest({
    service: `user/auth/Profile`,
    method: API_METHODS.PUT,
    data: formData,
    authRequired: true,
  });
};
export const sendOtp = async (email) => {
  return await makeRequest({
    service: `user/auth/send-otp`,
    method: API_METHODS.POST,
    data: { email },
    authRequired: true,
  });
};
export const sendOtpForForgotPassword = async (email) => {
  return await makeRequest({
    service: `auth/forgot-password/send-otp`,
    method: API_METHODS.POST,
    data: { email },
    authRequired: true,
  });
};
export const verifyOtp = async (otp) => {
  return await makeRequest({
    service: `user/auth/verify-otp`,
    method: API_METHODS.POST,
    data: { otp },
    authRequired: true,
  });
};
export const verifyOtpForForgotPassword = async (data) => {
  return await makeRequest({
    service: `auth/forgot-password/verify-otp`,
    method: API_METHODS.POST,
    data,
    authRequired: true,
  });
};

export const changePassword = async (data) => {
  return await makeRequest({
    service: `user/auth/reset-password`,
    method: API_METHODS.POST,
    data,
    authRequired: true,
  });
};
export const changePasswordForForgotPassword = async (data) => {
  return await makeRequest({
    service: `auth/forgot-password/reset-password`,
    method: API_METHODS.POST,
    data,
    authRequired: true,
  });
};

//admin login api
export const adminLogin = async (credentials) => {
  return await makeRequest({
    service: "admin/auth/login",
    method: API_METHODS.POST,
    data: credentials,
    authRequired: false,
  });
};