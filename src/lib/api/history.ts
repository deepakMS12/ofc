import apiClient from './client';

export interface MessageHistory {
  id?: string; // Optional, generated on frontend if needed
  deviceId: string;
  mobileNumber: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  type: 'WEB' | 'API';
  content: 'Text' | 'Media';
  sentAt: string;
  [key: string]: any;
}

export interface HistoryListResponse {
  messages: MessageHistory[];
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: any;
}

export const historyApi = {
  list: async (params?: {
    dateRange?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<HistoryListResponse | MessageHistory[]> => {
    const response = await apiClient.get<HistoryListResponse | MessageHistory[]>('/web/history', {
      params,
    });
    return response.data;
  },

  get: async (id: string): Promise<MessageHistory> => {
    const response = await apiClient.get<MessageHistory>(`/web/history/${id}`);
    return response.data;
  },

  getGraph: async (params?: { dateRange?: string; type?: string }): Promise<{ labels: string[]; data: number[] }> => {
    const response = await apiClient.get<{ labels: string[]; data: number[] }>('/web/history/graph', {
      params,
    });
    return response.data;
  },
};

