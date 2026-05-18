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
