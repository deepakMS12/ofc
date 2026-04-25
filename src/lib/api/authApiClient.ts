import axios from "axios";

const baseURL = (
  import.meta.env.VITE_URL_TO_PDF_API_BASE 
).replace(/\/$/, "");

/** Axios instance for the auth service (`VITE_URL_TO_PDF_API_BASE`). */
export const authApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApiClient;
