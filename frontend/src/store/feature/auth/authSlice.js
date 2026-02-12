import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserAPI,
  registerUserAPI,
  adminLoginAPI,
  updateProfileAPI
} from "./authThunk";

//
// ----------- Load User (Supports Remember Me) -----------
//

// Read user_info from localStorage OR sessionStorage
const storedUserInfo =
  localStorage.getItem("user_info") ||
  sessionStorage.getItem("user_info");

const storedUserToken =
  localStorage.getItem("user_token") ||
  sessionStorage.getItem("user_token");

const storedUserAuthFlag =
  localStorage.getItem("isUserAuthenticated") === "true" ||
  sessionStorage.getItem("isUserAuthenticated") === "true";

const parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

//
// ----------- Load Admin (Always LocalStorage) -----------
//
const storedAdminInfo = localStorage.getItem("admin_info");
const storedAdminToken = localStorage.getItem("admin_token");
const storedAdminAuthFlag = localStorage.getItem("isAdminAuthenticated") === "true";

const parsedAdminInfo = storedAdminInfo ? JSON.parse(storedAdminInfo) : null;

//
// ------------ Initial State With Loaded Values -----------
//
const initialState = {
  // User
  user: storedUserAuthFlag ? parsedUserInfo : null,
  userToken: storedUserAuthFlag ? storedUserToken : null,
  isUserAuthenticated: storedUserAuthFlag,
  userLoginSuccess: false,
  registerSuccess: false,

  // Admin
  admin: storedAdminAuthFlag ? parsedAdminInfo : null,
  adminToken: storedAdminAuthFlag ? storedAdminToken : null,
  isAdminAuthenticated: storedAdminAuthFlag,
  adminLoginSuccess:
    storedAdminAuthFlag && parsedAdminInfo && storedAdminToken ? true : false,

  // Common
  isLoading: false,
  error: null,
};

//
// ------------------ Slice -------------------
//
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    resetFlags: (state) => {},

    logoutUser: (state) => {
      state.user = null;
      state.userToken = null;
      state.isUserAuthenticated = false;
      state.userLoginSuccess = false;

      // Remove from both storage types
      localStorage.removeItem("user_info");
      localStorage.removeItem("user_token");
      localStorage.removeItem("isUserAuthenticated");

      sessionStorage.removeItem("user_info");
      sessionStorage.removeItem("user_token");
      sessionStorage.removeItem("isUserAuthenticated");
    },

    logoutAdmin: (state) => {
      state.admin = null;
      state.adminToken = null;
      state.isAdminAuthenticated = false;
      state.adminLoginSuccess = false;

      localStorage.removeItem("admin_info");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("isAdminAuthenticated");
    },
  },

  extraReducers: (builder) => {
    builder
      // ----------------- User Login -----------------
      .addCase(loginUserAPI.pending, (state) => {
        state.userLoginSuccess = false;
      })
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        const { data, rememberMe } = action.payload;

        if (data?.token) {
          state.isUserAuthenticated = true;
          state.userLoginSuccess = true;
          state.user = data;
          state.userToken = data.token;

          // ------------------ STORAGE LOGIC ------------------
          if (rememberMe) {
            // Store in localStorage
            localStorage.setItem("user_info", JSON.stringify(data));
            localStorage.setItem("user_token", data.token);
            localStorage.setItem("isUserAuthenticated", "true");

            // Clear sessionStorage
            sessionStorage.removeItem("user_info");
            sessionStorage.removeItem("user_token");
            sessionStorage.removeItem("isUserAuthenticated");
          } else {
            // Store in sessionStorage
            sessionStorage.setItem("user_info", JSON.stringify(data));
            sessionStorage.setItem("user_token", data.token);
            sessionStorage.setItem("isUserAuthenticated", "true");

            // Clear localStorage
            localStorage.removeItem("user_info");
            localStorage.removeItem("user_token");
            localStorage.removeItem("isUserAuthenticated");
          }
          // -----------------------------------------------------

          state.error = null;
        } else {
          state.isUserAuthenticated = false;
          state.userLoginSuccess = false;
          state.error = action.payload?.message || "User login failed";
        }
      })
      .addCase(loginUserAPI.rejected, (state) => {
        state.userLoginSuccess = false;
        state.isUserAuthenticated = false;
      })

      // ----------------- User Register -----------------
      .addCase(registerUserAPI.pending, (state) => {
        state.registerSuccess = false;
      })
      .addCase(registerUserAPI.fulfilled, (state, action) => {
        const res = action.payload;

        if (res?.response_code === 1 || res?.data?.id) {
          state.registerSuccess = true;
          state.user = res.data || null;
          state.error = null;
        } else {
          state.registerSuccess = false;
          state.error = res?.message || "Registration failed";
        }
      })

      // ----------------- Update Profile -----------------
      .addCase(updateProfileAPI.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };

        // Save updated user in whichever storage user is logged into
        if (localStorage.getItem("user_token")) {
          localStorage.setItem("user_info", JSON.stringify(state.user));
        } else {
          sessionStorage.setItem("user_info", JSON.stringify(state.user));
        }
      })

      // ----------------- Admin Login -----------------
      .addCase(adminLoginAPI.pending, (state) => {
        state.adminLoginSuccess = false;
      })
      .addCase(adminLoginAPI.fulfilled, (state, action) => {
        const res = action.payload;

        if (res?.data?.token) {
          state.isAdminAuthenticated = true;
          state.adminLoginSuccess = true;
          state.admin = res.data;
          state.adminToken = res.data.token;

          localStorage.setItem("admin_info", JSON.stringify(res.data));
          localStorage.setItem("admin_token", res.data.token);
          localStorage.setItem("isAdminAuthenticated", "true");

          state.error = null;
        } else {
          state.isAdminAuthenticated = false;
          state.adminLoginSuccess = false;
          state.error = res?.message || "Admin login failed";
        }
      })
      // -------- Global Matchers --------
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.payload === "Network Error"
              ? "Please check internet connection"
              : action.payload || action.error.message;
        }
      );
  },
});

export const {
  clearError,
  resetFlags,
  logoutUser,
  logoutAdmin
} = authSlice.actions;

export default authSlice.reducer;