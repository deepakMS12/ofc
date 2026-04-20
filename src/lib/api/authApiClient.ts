import axios from "axios";

const baseURL = (
  import.meta.env.VITE_AUTH_API_BASE_URL ?? "http://localhost:3002"
).replace(/\/$/, "");

/** Axios instance for the auth service (`VITE_AUTH_API_BASE_URL`). */
export const authApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApiClient;
