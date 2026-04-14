import apiClient from './client';

export interface ApiDocumentation {
  title?: string;
  description?: string;
  endpoints?: Array<{
    method: string;
    path: string;
    description?: string;
    parameters?: any;
    example?: any;
  }>;
  [key: string]: any;
}

export const docApi = {
  get: async (): Promise<ApiDocumentation> => {
    const response = await apiClient.get<ApiDocumentation>('/web/doc');
    return response.data;
  },
};

