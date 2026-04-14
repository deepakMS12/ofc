import apiClient from './client';

export interface ApiKeyResponse {
  status: string;
  apiKey?: string;
  enabled?: boolean;
  createdAt?: string;
  message?: string;
}

export const apiKeyApi = {
  getApiKey: async (): Promise<ApiKeyResponse> => {
    const response = await apiClient.get<ApiKeyResponse>('/web/api-key');
    return response.data;
  },

  enableApiKey: async (): Promise<ApiKeyResponse> => {
    const response = await apiClient.post<ApiKeyResponse>('/web/api-key/enable');
    return response.data;
  },

  disableApiKey: async (): Promise<ApiKeyResponse> => {
    const response = await apiClient.post<ApiKeyResponse>('/web/api-key/disable');
    return response.data;
  },

  regenerateApiKey: async (): Promise<ApiKeyResponse> => {
    const response = await apiClient.post<ApiKeyResponse>('/web/api-key/regenerate');
    return response.data;
  },
};

