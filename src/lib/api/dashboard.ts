import apiClient from './client';

export interface DashboardStats {
  totalDevices: number;
  totalMessagesToday: number;
  totalMediaSizeToday: number;
  totalApiCallsToday: number;
  totalMessagesSent?: number; // Total messages sent (all time)
}

export interface PlanDetails {
  planAvailable: boolean;
  planName: string;
  daysRemaining?: number;
  [key: string]: any;
}

export const dashboardApi = {
  getStats: async (params?: { dateRange?: string }): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/web/dashboard/stats', { params });
    return response.data;
  },

  getDevices: async () => {
    const response = await apiClient.get('/web/dashboard/devices');
    return response.data;
  },

  getPlan: async (): Promise<PlanDetails> => {
    const response = await apiClient.get<PlanDetails>('/web/dashboard/plan');
    return response.data;
  },
};

