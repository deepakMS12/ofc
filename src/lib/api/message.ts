import apiClient from './client';

export interface SendTextMessageRequest {
  deviceId: string;
  mobileNumber: string;
  message: string;
}

export interface SendMediaMessageRequest {
  deviceId: string;
  mobileNumber: string;
  mediaUrl: string;
  caption?: string;
  mediaType?: 'image' | 'video' | 'document' | 'audio';
}

export interface MessageResponse {
  status: string;
  message: string;
  data?: {
    referenceID?: string;
    messageId?: string;
    recipient?: string;
    timestamp?: string;
  };
  messageId?: string; // Legacy support
  timestamp?: string; // Legacy support
  recipient?: string; // Legacy support
  usage?: {
    messagesToday?: number;
    mediaBytesToday?: number | string;
    mediaUnit?: string;
  };
  [key: string]: any;
}

export const messageApi = {
  sendText: async (data: SendTextMessageRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/web/message/send', data);
    return response.data;
  },

  sendMedia: async (data: SendMediaMessageRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/web/message/send-media', data);
    return response.data;
  },
};

