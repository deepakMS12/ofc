import axios from "axios";

const baseURL = (
  import.meta.env.VITE_NODE_API_BASE 
).replace(/\/$/, "");


 const authApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

authApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);





export default authApiClient;
