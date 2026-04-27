import axios from "axios";

const baseURL = (
  import.meta.env.VITE_NODE_API_BASE 
).replace(/\/$/, "");


export const authApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApiClient;
