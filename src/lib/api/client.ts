import axios from "axios";
import { clearDemoAuthStorage, isDemoAuthSession } from "@/lib/demoAuth";
import { getGlobalToast } from "@/contexts/ToastContext";

const API_BASE_URL = "http://localhost:3002/"; //"https://wa-connect.apisite.in/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Dynamically get token from localStorage for each request
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error, "=====start errror")
    // Handle CORS errors specifically
    if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error" ||
      (error.response === undefined && error.request)
    ) {
      const isCorsError = !error.response && error.request;
      const errorMessage = isCorsError
        ? `CORS Error: The backend server at ${API_BASE_URL} is not configured to accept requests from this origin. Please configure CORS on your backend to allow requests from ${window.location.origin}`
        : "Network Error: Unable to connect to server. Please check if the backend is running and accessible.";

      console.error("Network/CORS Error:", {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        isCorsError,
      });

      return Promise.reject(new Error(errorMessage));
    }

    // Handle CORS preflight failures (status 0 or no response)
    if (error.response?.status === 0 || (!error.response && error.request)) {
      return Promise.reject(
        new Error(
          `CORS Error: Backend at ${API_BASE_URL} does not allow requests from ${window.location.origin}. Please configure CORS on your backend server.`
        )
      );
    }

    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      const isAuthAttempt = requestUrl.includes("/web/auth/login");
      const shouldLogout = error.response?.data?.data?.logout === true;
      const sessionExpiredMessage =
        error.response?.data?.message || "Your session has expired. Please login again.";

      if (!isAuthAttempt && typeof window !== "undefined") {
        // If backend explicitly asks logout, enforce logout for all sessions.
        if (shouldLogout) {
          const showToast = getGlobalToast();
          if (showToast) {
            showToast(sessionExpiredMessage, "error");
          }
          clearDemoAuthStorage();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("keepSignedIn");
          sessionStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Local demo token is not valid on the server — APIs return 401; do not log out.
        if (isDemoAuthSession()) {
          return Promise.reject(error);
        }
        clearDemoAuthStorage();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("keepSignedIn");
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
