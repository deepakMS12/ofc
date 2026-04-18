import axios from "axios";

/** Base URL for the auth service (no trailing slash). Override with VITE_AUTH_API_BASE_URL. */
export const AUTH_V1_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL ?? "http://localhost:3002";

export type AuthV1LoginBody = {
  username: string;
  password: string;
  force: boolean;
};

/**
 * POST /api/v1/auth/login — separate from the legacy `apiClient` base URL.
 */
export async function postAuthV1Login(
  body: AuthV1LoginBody,
): Promise<unknown> {
  const { data } = await axios.post(
    `${AUTH_V1_BASE_URL}/api/v1/auth/login`,
    body,
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return data;
}
