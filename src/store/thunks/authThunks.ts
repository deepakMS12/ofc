import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/auth';
import type { LoginCredentials, SignupCredentials, UserProfilePayload } from '@/lib/api/auth';
import { postAuthV1Login } from '@/lib/api/authV1Login';


function extractTokenFromLoginResponse(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (typeof d.token === 'string') return d.token;
  if (typeof d.accessToken === 'string') return d.accessToken;
  if (typeof d.access_token === 'string') return d.access_token;
  const nested = d.data;
  if (nested && typeof nested === 'object') {
    const n = nested as Record<string, unknown>;
    if (typeof n.token === 'string') return n.token;
    if (typeof n.accessToken === 'string') return n.accessToken;
    if (typeof n.access_token === 'string') return n.access_token;
  }
  return null;
}

function extractProfileFromLoginResponse(
  data: unknown,
  username: string,
): UserProfilePayload {
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    const raw =
      (d.profile as UserProfilePayload | undefined) ||
      (d.user as UserProfilePayload | undefined) ||
      (typeof d.data === 'object' && d.data !== null
        ? ((d.data as Record<string, unknown>).profile as UserProfilePayload | undefined) ||
          ((d.data as Record<string, unknown>).user as UserProfilePayload | undefined)
        : undefined);
    if (raw && typeof raw === 'object' && 'username' in raw) {
      return {
        username: String(raw.username),
        name: String(raw.name ?? raw.username),
        email: raw.email != null ? String(raw.email) : undefined,
        pendingEmail: raw.pendingEmail ?? null,
        pendingEmailRequestedAt: raw.pendingEmailRequestedAt ?? null,
        lastPasswordChange: raw.lastPasswordChange ?? null,
        lastEmailChange: raw.lastEmailChange ?? null,
        lastLogin: raw.lastLogin != null ? String(raw.lastLogin) : new Date().toISOString(),
      };
    }
  }
  const displayName = username.includes('@') ? username.split('@')[0]! : username;
  return {
    username,
    name: displayName || 'User',
    email: username.includes('@') ? username : undefined,
    pendingEmail: null,
    pendingEmailRequestedAt: null,
    lastPasswordChange: null,
    lastEmailChange: null,
    lastLogin: new Date().toISOString(),
  };
}

function getLoginErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  const msg = err.response?.data?.message ?? err.message;
  if (typeof msg === 'string' && msg.length) return msg;
  return 'Sign in failed.';
}

/** POST /api/v1/auth/login with `force: true` (see `postAuthV1Login`). */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    const username = credentials.username.trim();
    const password = credentials.password;

    if (!username || !password) {
      return rejectWithValue('Enter email/username and password.');
    }

    try {
      const data = await postAuthV1Login({
        username,
        password,
        force: true,
      });
      const token = extractTokenFromLoginResponse(data);
      if (!token) {
        return rejectWithValue('Invalid response: no token from server.');
      }
      const profile = extractProfileFromLoginResponse(data, username);
      return { token, profile };
    } catch (error: unknown) {
      return rejectWithValue(getLoginErrorMessage(error));
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(credentials);
      if (response.status === 'success') {
        return response;
      }
      return rejectWithValue(response.message || 'Signup failed');
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Signup failed. Please try again.');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      if (response.status === 'success') {
        return response.message;
      }
      return rejectWithValue(response.message || 'Failed to send reset email');
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Unable to send reset email.');
    }
  }
);

