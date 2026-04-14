import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/auth';
import type { LoginCredentials, SignupCredentials, UserProfilePayload } from '@/lib/api/auth';
import { DEMO_AUTH_TOKEN } from '@/lib/demoAuth';

/** Local demo login — no API request. Any non-empty email/username and password are accepted. */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    const username = credentials.username.trim();
    const password = credentials.password;

    if (!username || !password) {
      return rejectWithValue('Enter email/username and password.');
    }

    const displayName = username.includes('@') ? username.split('@')[0]! : username;
    const profile: UserProfilePayload = {
      username,
      name: displayName || 'User',
      email: username.includes('@') ? username : undefined,
      pendingEmail: null,
      pendingEmailRequestedAt: null,
      lastPasswordChange: null,
      lastEmailChange: null,
      lastLogin: new Date().toISOString(),
    };

    return {
      token: DEMO_AUTH_TOKEN,
      profile,
    };
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

