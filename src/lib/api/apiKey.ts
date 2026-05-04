import authApiClient from "./authApiClient";


type ApiStatus = "A" | "D";

type ApiKeyServerPayload = {
  key?: string;
  status?: ApiStatus;
  ips?: string;
  lifetime?: string;
  timestamp?: {
    time?: string;
    date?: string;
    ago?: string;
  };
};

type ApiKeyServerResponse = {
  status: string;
  success?: boolean;
  message?: string;
  data?: ApiKeyServerPayload;
};

export interface ApiKeyResponse {
  status: string;
  success: boolean;
  message?: string;
  apiKey?: string;
  enabled?: boolean;
  apiStatus?: ApiStatus;
  createdAt?: string;
  lifetime?: string;
  ips?: string;
}

const API_KEY_ROUTES = {
  check: "/api/v1/check",
  regenerate: "/api/v1/regenerate",
  enable: "/api/v1/status/1",
  disable: "/api/v1/status/0",
} as const;

function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) return undefined;
  const normalized = token.replace(/^Bearer\s+/i, "").trim();
  return normalized ? { Authorization: `Bearer ${normalized}` } : undefined;
}

function toCreatedAt(timestamp?: ApiKeyServerPayload["timestamp"]): string | undefined {
  if (!timestamp) return undefined;
  const date = timestamp.date?.trim();
  const time = timestamp.time?.trim();
  if (date && time) return `${date} ${time}`;
  return date || time || timestamp.ago?.trim() || undefined;
}

function normalizeResponse(payload: ApiKeyServerResponse): ApiKeyResponse {
  const apiStatus = payload.data?.status;
  return {
    status: payload.status,
    success: payload.success !== false && payload.status !== "error",
    message: payload.message,
    apiKey: payload.data?.key,
    enabled: apiStatus ? apiStatus === "A" : undefined,
    apiStatus,
    createdAt: toCreatedAt(payload.data?.timestamp),
    lifetime: payload.data?.lifetime,
    ips: payload.data?.ips,
  };
}

async function authorizedPatch(path: string): Promise<ApiKeyResponse> {
  const response = await authApiClient.patch<ApiKeyServerResponse>(
    path,
    undefined,
    { headers: getAuthHeader() },
  );
  return normalizeResponse(response.data);
}

export const apiKeyApi = {
  getApiKey: async (): Promise<ApiKeyResponse> => {
    const response = await authApiClient.get<ApiKeyServerResponse>(
      API_KEY_ROUTES.check,
      { headers: getAuthHeader() },
    );
    return normalizeResponse(response.data);
  },

  enableApiKey: async (): Promise<ApiKeyResponse> => authorizedPatch(API_KEY_ROUTES.enable),

  disableApiKey: async (): Promise<ApiKeyResponse> => authorizedPatch(API_KEY_ROUTES.disable),

  regenerateApiKey: async (): Promise<ApiKeyResponse> =>
    authorizedPatch(API_KEY_ROUTES.regenerate),
};

