import axios from "axios";
import { DEFAULT_URL_TO_PDF_API_BASE } from "@/components/converter/urlToPdfPayload";

const envBase = import.meta.env.VITE_URL_TO_PDF_API_BASE;
const baseURL =
  typeof envBase === "string" && envBase.trim() !== ""
    ? envBase.trim().replace(/\/$/, "")
    : DEFAULT_URL_TO_PDF_API_BASE;

/** Doceditor URL→PDF host — separate from the main app `apiClient` (no JWT). */
export const urlToPdfClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    "X-Client-Mode": "web",
  },
  timeout: 120_000,
});

export default urlToPdfClient;
