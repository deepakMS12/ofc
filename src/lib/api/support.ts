import apiClient from './client';

export type SupportCategory =
  | 'general_question'
  | 'technical_support'
  | 'billing_issue'
  | 'feature_request'
  | 'report_abuse'
  | 'api_request'
  | 'bug_report'
  | 'account_related'
  | 'billing_related'
  | 'other';

export const SUPPORT_CATEGORY_OPTIONS: ReadonlyArray<{
  value: SupportCategory;
  label: string;
}> = [
  { value: 'general_question', label: 'General Question' },
  { value: 'technical_support', label: 'Technical Support' },
  { value: 'billing_issue', label: 'Billing Issue' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'report_abuse', label: 'Report Abuse' },
  { value: 'api_request', label: 'API Request' },
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'account_related', label: 'Account Related' },
  { value: 'billing_related', label: 'Billing Related' },
  { value: 'other', label: 'Other' },
] as const;

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
