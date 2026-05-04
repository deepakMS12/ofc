import axios from "axios";
import { DEFAULT_URL_TO_PDF_API_BASE } from "@/components/converter/urlToPdfPayload";

const envBase = import.meta.env.VITE_URL_TO_PDF_API_BASE;
const baseURL =
  typeof envBase === "string" && envBase.trim() !== ""
    ? envBase.trim().replace(/\/$/, "")
    : DEFAULT_URL_TO_PDF_API_BASE;

/** localStorage key for the Bearer token used on `/home/converter` → doceditor requests. */
export const OFC_CONVERTER_AUTH_TOKEN_LS_KEY = "ofcConverterAuthToken";

function normalizeConverterAuthToken(raw: string | null): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withoutBearer = trimmed.replace(/^Bearer\s+/i, "").trim();
  return withoutBearer || null;
}

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

urlToPdfClient.interceptors.request.use((config) => {
  const token = normalizeConverterAuthToken(
    localStorage.getItem(OFC_CONVERTER_AUTH_TOKEN_LS_KEY),
  );
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default urlToPdfClient;
