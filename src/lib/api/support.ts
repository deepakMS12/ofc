import apiClient from './client';

export type SupportCategory =
  | 'api_request'
  | 'bug_report'
  | 'account_related'
  | 'billing_related'
  | 'feature_request'
  | 'other';

export interface SupportTicketRequest {
  category: SupportCategory;
  subject: string;
  message: string;
  attachments?: File[];
}

export interface SupportTicketResponse {
  success: boolean;
  ticketId?: string;
  message: string;
}

export const supportApi = {
  submitTicket: async (data: SupportTicketRequest): Promise<SupportTicketResponse> => {
    const form = new FormData();
    form.append('category', data.category);
    form.append('subject', data.subject);
    form.append('message', data.message);
    data.attachments?.forEach((file) => form.append('attachments', file));

    const response = await apiClient.post<SupportTicketResponse>('/web/support/ticket', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
