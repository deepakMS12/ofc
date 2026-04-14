import apiClient from './client';

export interface Device {
  deviceId: string;
  alias?: string;
  status: 'online' | 'offline' | 'pending' | 'logout';
  messagesSent?: number;
  lastActive?: string;
  mobileNumber?: string;
  waUsername?: string;
  waStatus?: string;
  waNumber?: string;
  [key: string]: any;
}

export interface CreateDeviceRequest {
  alias?: string;
  mobileNumber?: string;
  deviceName?: string;
  [key: string]: any;
}

export interface CreateDeviceResponse {
  status: string;
  message: string;
  device: Device;
  qrCode?: string | null;
  connectionStatus?: string;
}

export interface QRCodeResponse {
  status: string;
  message?: string;
  qrCode?: string | null;
  timestamp?: string;
  connectionStatus?: string | { status?: string };
  connected?: boolean;
}

export interface ConnectionStatusResponse {
  status: string;
  connectionStatus: string; // Always a string: 'initializing' | 'qr_ready' | 'connecting' | 'connected' | 'disconnected' | 'error' | 'unknown'
  isReady?: boolean;
  databaseStatus?: string;
  error?: string;
  message?: string;
  cancelled?: boolean;
  inputMobile?: string;
  whatsappMobile?: string;
  [key: string]: any;
}

export interface DisconnectResponse {
  status: string;
  message: string;
  data?: {
    deviceId: string;
    action: 'disconnected' | 'deleted';
  };
}

export const devicesApi = {
  getDevices: async (): Promise<Device[]> => {
    const response = await apiClient.get<Device[]>('/web/device');
    return response.data;
  },

  getDevice: async (deviceId: string): Promise<Device> => {
    const response = await apiClient.get<Device>(`/web/device/${deviceId}`);
    return response.data;
  },

  registerDevice: async (data: CreateDeviceRequest): Promise<CreateDeviceResponse> => {
    const response = await apiClient.post<CreateDeviceResponse>('/web/device/register', {
      deviceName: data.alias || data.deviceName,
      mobileNumber: data.mobileNumber,
    });
    return response.data;
  },

  createDevice: async (data: CreateDeviceRequest): Promise<Device> => {
    // Alias for registerDevice for backward compatibility
    const result = await devicesApi.registerDevice(data);
    return result.device;
  },

  getQRCode: async (deviceId: string): Promise<QRCodeResponse> => {
    const response = await apiClient.get<QRCodeResponse>(`/web/device/${deviceId}/qr`);
    return response.data;
  },

  regenerateQR: async (deviceId: string): Promise<QRCodeResponse> => {
    const response = await apiClient.post<QRCodeResponse>(`/web/device/${deviceId}/regenerate-qr`);
    return response.data;
  },

  disconnectDevice: async (deviceId: string, type: 'disconnect' | 'delete' = 'disconnect'): Promise<DisconnectResponse> => {
    const response = await apiClient.post<DisconnectResponse>(`/web/device/${deviceId}/disconnect?type=${type}`);
    return response.data;
  },

  getConnectionStatus: async (deviceId: string): Promise<ConnectionStatusResponse> => {
    const response = await apiClient.get<ConnectionStatusResponse>(`/web/device/${deviceId}/status`);
    return response.data;
  },

  deleteDevice: async (deviceId: string): Promise<DisconnectResponse> => {
    // Use disconnect endpoint with type='delete' since backend handles delete through disconnect
    const response = await apiClient.post<DisconnectResponse>(`/web/device/${deviceId}/disconnect?type=delete`);
    return response.data;
  },
};

