import axios from "axios";

/**
 * Returns the base API URL based on environment.
 * - In Production (Vercel deployment): Uses VITE_API_URL if set, or defaults to relative '/api/v1'.
 *   This ensures requests stay on the same domain and leverage vercel.json rewrites.
 *   NEVER falls back to localhost in production.
 * - In Local Development: Uses VITE_API_URL if set, or defaults to 'http://localhost:8000/api/v1'.
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl;
  }
  if (import.meta.env.PROD) {
    return "/api/v1";
  }
  return "http://localhost:8000/api/v1";
};

export const API_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Outbound request interceptor attaching JWT authorization headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Inbound response interceptor to extract API envelope data structures
apiClient.interceptors.response.use(
  (response) => {
    // If backend envelope wraps it in {"success": true, "data": ...}
    const responseData = response.data;
    if (responseData && typeof responseData === "object" && "success" in responseData) {
      if (responseData.success) {
        return responseData.data;
      } else {
        const errorMsg = responseData.error?.message || "An API operation failed.";
        return Promise.reject(new Error(errorMsg));
      }
    }
    return responseData;
  },
  (error) => {
    // Parse backend formatted exception payloads
    const serverError = error.response?.data?.error;
    const errorMsg = serverError?.message || error.message || "Something went wrong.";
    return Promise.reject(new Error(errorMsg));
  }
);
