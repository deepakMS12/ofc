/** Fixed session value for local demo login (no backend). */
export const DEMO_AUTH_TOKEN = "demo-token";

/** Secondary key so you can read `localStorage.getItem("demoToken")` in devtools. */
export const DEMO_TOKEN_STORAGE_KEY = "demoToken";

export function persistDemoAuthSession(token: string): void {
  localStorage.setItem("token", token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem(DEMO_TOKEN_STORAGE_KEY, token);
}

export function clearDemoAuthStorage(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem(DEMO_TOKEN_STORAGE_KEY);
}

/** True when user logged in via local demo (no real JWT) — API 401 must not force logout. */
export function isDemoAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("token") === DEMO_AUTH_TOKEN;
}
