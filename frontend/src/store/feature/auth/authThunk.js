import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "./authApi";

// User login
export const loginUserAPI = createAsyncThunk(
  "auth/loginUserAPI",
  async ({ email, password, rememberMe }, thunkAPI) => {
    try {
      const response = await authAPI.loginUser({ email, password, rememberMe });
      return {
        data: response.data,
        rememberMe
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// user registration
export const registerUserAPI = createAsyncThunk(
  "auth/registerUserAPI",
  async (credentials, thunkAPI) => {
    try {
      const response = await authAPI.registerUser(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// user update

export const updateProfileAPI = createAsyncThunk(
  "auth/updateProfileApi",
  async (formData, thunkAPI) => {
    try {
      const response = await authAPI.updateProfile(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  });

// Admin login
export const adminLoginAPI = createAsyncThunk(
  "auth/adminLoginAPI",
  async (credentials, thunkAPI) => {
    try {
      const response = await authAPI.adminLogin(credentials);

      if (response?.data?.token) {

        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("admin_info", JSON.stringify(response.data));
      }

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendOtpAPI = createAsyncThunk(
  "auth/user/sent-otp",
  async (email, thunkAPI) => {
    try {
      const response = await authAPI.sendOtp(email);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
)
export const sendOtpForForgotPasswordAPI = createAsyncThunk(
  "auth/forgot-password/send-otp",
  async (email, thunkAPI) => {
    try {
      const response = await authAPI.sendOtpForForgotPassword(email);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const verifyOtpAPI = createAsyncThunk(
  "auth/user/verify-otp",
  async (otp, thunkAPI) => {
    try {
      const response = await authAPI.verifyOtp(otp);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const verifyOtpForForgotPasswordAPI = createAsyncThunk(
  "auth/forgot-password/verify-otp",
  async (data, thunkAPI) => {
    try {
      const response = await authAPI.verifyOtpForForgotPassword(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const changePasswordAPI = createAsyncThunk(
  "auth/user/change-password",
  async (data, thunkAPI) => {
    try {
      const response = await authAPI.changePassword(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const changePasswordForForgotPasswordAPI = createAsyncThunk(
  "auth/forgot-password/change-password",
  async (data, thunkAPI) => {
    try {
      const response = await authAPI.changePasswordForForgotPassword(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);