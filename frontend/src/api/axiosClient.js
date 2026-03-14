import axios from "axios";
import { navigateTo } from "@/utils/navigation";

// ======================================================
// AXIOS INSTANCE
// ======================================================
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 0, // ❗ disable timeout to avoid unwanted cancellations
  withCredentials: true,
});

// ======================================================
// REQUEST INTERCEPTOR
// - Adds Authorization token
// - Sets Content-Type safely
// ======================================================
axiosClient.interceptors.request.use(
  (config) => {
    console.log("Request config before interceptor:", config);
    let token = null;

    // Decide token source by tokenType
    if (config.tokenType === "admin") {
      token = localStorage.getItem("admin_token");
    } else {
      token =
        localStorage.getItem("user_token") ||
        sessionStorage.getItem("user_token");
    }

    // Attach Authorization header
    if (token) {
      config.headers.Authorization = token;
    }

    // Set JSON content-type only if NOT FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// RESPONSE INTERCEPTOR
// - Handle 401 globally
// ======================================================
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const tokenType = error?.config?.tokenType;
    console.log("token:", tokenType, error?.response, error);
    console.log("error:", error);
    console.log("status:", status);
    console.log("error response:", response);
    if (status === 401) {

      if (tokenType === "admin") {
        localStorage.removeItem("admin_token");
        navigateTo("/admin/login");
      } else {
        localStorage.removeItem("user_token");
        sessionStorage.removeItem("user_token");
        navigateTo("/login");
      }
    }

    return Promise.reject(error);
  }
);

// ======================================================
// MAIN REQUEST FUNCTION
// ======================================================
export const makeRequest = async ({
  service,
  method = "GET",
  data,
  params,
  tokenType = "user",
  pageNo,
  pageSize,
}) => {
  let finalUrl = service;
  try {

    // Pagination support
    if (pageNo != null && pageSize != null) {
      finalUrl = `${service}/${pageNo}/${pageSize}`;
    }

    const response = await axiosClient({
      url: finalUrl,
      method,
      data,
      params,
      tokenType, // custom config key
    });
    console.log("Response from API:", response);
    return response.data;
  } catch (error) {
    console.log("Error making request:", error);
    // throw error;
  }
};

// ======================================================
// HTTP METHODS ENUM
// ======================================================
export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};