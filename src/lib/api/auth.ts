import apiClient from './client';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserProfilePayload {
  username: string;
  name: string;
  email?: string;
  pendingEmail?: string | null;
  pendingEmailRequestedAt?: string | null;
  lastPasswordChange?: string | null;
  lastEmailChange?: string | null;
  lastLogin?: string | null;
}

export interface LoginResponse {
  status: string;
  message: string;
  redirect?: string;
  profile?: UserProfilePayload;
}

export interface SignupCredentials {
  username: string;
  fullName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  mobileNumber: string;
}

export interface SignupResponse {
  status: string;
  message: string;
  profile?: {
    username: string;
    name: string;
    email: string;
  };
}

export interface VerifyEmailRequest {
  token: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  current: string;
  password: string;
}

export interface ChangePasswordResponse {
  status: string;
  success: boolean;
  message: string;
  data?: {
    logout?: boolean;
  };
}

export interface DeleteAccountRequest {
  password: string;
}

export interface RequestEmailChangeResponse {
  status: string;
  message: string;
}

export interface ConfirmEmailChangeRequest {
  token: string;
  email: string;
  password: string;
}

export interface ProfileResponse {
  status: string;
  success?: boolean;
  data?: Partial<UserProfilePayload>;
}

export interface LoginActivityParams {
  channel?: 'all' | 'web' | 'api';
  days?: number;
  page?: number;
  limit?: number;
}

export interface LoginActivityEntry {
  id: string;
  channel: 'WEB' | 'API';
  username: string;
  email: string | null;
  ip: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILED';
  reason?: string | null;
  loggedAt: string | null;
}

export interface LoginActivityResponse {
  status: string;
  entries: LoginActivityEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

let inFlightProfileRequest: Promise<ProfileResponse> | null = null;

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/web/auth/login', credentials);
    return response.data;
  },

  signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/web/auth/signup', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/web/auth/logout');
  },

  forgotPassword: async (email: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post('/web/auth/forgot-password', { email });
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post('/web/auth/verify-email', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post('/web/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await apiClient.patch<ChangePasswordResponse>('/api/v1/ac/change/password', data);
    return response.data;
  },

  deleteAccount: async (data: DeleteAccountRequest): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post('/web/auth/delete-account', data);
    return response.data;
  },

  requestEmailChange: async (email: string): Promise<RequestEmailChangeResponse> => {
    const response = await apiClient.post<RequestEmailChangeResponse>('/web/auth/request-email-change', { email });
    return response.data;
  },

  confirmEmailChange: async (data: ConfirmEmailChangeRequest): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post('/web/auth/confirm-email-change', data);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    if (inFlightProfileRequest) {
      return inFlightProfileRequest;
    }
    inFlightProfileRequest = apiClient
      .get<ProfileResponse>('/api/v1/ac/profile')
      .then((response) => response.data)
      .finally(() => {
        inFlightProfileRequest = null;
      });
    return inFlightProfileRequest;
  },

  getLoginActivity: async (params: LoginActivityParams = {}): Promise<LoginActivityResponse> => {
    const response = await apiClient.get<LoginActivityResponse>('/api/v1/ac/activity', {
      params,
    });
    return response.data;
  },
};

