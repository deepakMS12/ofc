import apiClient from './client';

export interface UploadResponse {
  status: string;
  url: string;
  fileUid: string;
  fileName: string;
  mimeType: string;
  size: number;
  expiresAt?: string;
  expiryOption?: string;
}

export interface UploadedFile {
  fileUid: string;
  fileName: string;
  storedFileName?: string;
  size: number;
  uploadedAt?: string | null;
  expiresAt?: string | null;
  url: string;
  mimeType?: string;
}

export const uploadApi = {
  uploadFile: async (
    file: File,
    expiry: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expiry', expiry);

    const response = await apiClient.post<UploadResponse>('/web/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  listFiles: async (): Promise<UploadedFile[]> => {
    const response = await apiClient.get<{ status: string; files: UploadedFile[] }>('/web/upload');
    return response.data.files || [];
  },

  deleteFile: async (fileUid: string): Promise<void> => {
    await apiClient.delete(`/web/upload/${encodeURIComponent(fileUid)}`);
  },
};

