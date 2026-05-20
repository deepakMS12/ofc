/** Strip trailing slashes from a non-empty API base URL. */
export function normalizeApiBaseUrl(
  value: string | undefined,
  fallback = "",
): string {
  const raw =
    typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;
  return raw.replace(/\/$/, "");
}

export const NODE_API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_NODE_API_BASE,
);

/** Google reCAPTCHA v2 site key (public). Omit in local dev to skip the widget. */
export const RECAPTCHA_SITE_KEY =
  typeof import.meta.env.VITE_RECAPTCHA_SITE_KEY === "string"
    ? import.meta.env.VITE_RECAPTCHA_SITE_KEY.trim()
    : "";

export const isRecaptchaEnabled = RECAPTCHA_SITE_KEY.length > 0;
