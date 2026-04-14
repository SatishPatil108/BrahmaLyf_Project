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
    let token = null;
    const tokenType = config.tokenType;

    if (tokenType === "admin") {
      token = localStorage.getItem("admin_token");
    } else {
      token =
        localStorage.getItem("user_token") ||
        sessionStorage.getItem("user_token");
    }

    if (token) {
      token = token.replace(/^Bearer\s+/i, "").trim();
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ======================================================
// RESPONSE INTERCEPTOR
// - Handle 401 globally
// ======================================================
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const responseData = error?.response?.data; // ✅ This line was missing
    const tokenType = error?.config?.tokenType;
    const skipAuthRedirect = error?.config?.skipAuthRedirect;

    if (status === 401 && !skipAuthRedirect) {
      if (tokenType === "admin") {
        localStorage.removeItem("admin_token");
        // navigateTo("/admin/login");
      } else {
        localStorage.removeItem("user_token");
        sessionStorage.removeItem("user_token");

        if (responseData?.tokenExpired) {
          navigateTo("/login", { state: { reason: "session_expired" } });
        } else {
          navigateTo("/login");
        }
      }
    }

    return Promise.reject(error);
  },
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
  skipAuthRedirect = false,
}) => {
  let finalUrl = service;

  // Pagination support
  if (pageNo != null && pageSize != null) {
    finalUrl = `${service}/${pageNo}/${pageSize}`;
  }

  const response = await axiosClient({
    url: finalUrl,
    method,
    data,
    params,
    tokenType,
    skipAuthRedirect,
  });

  return response.data;
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
