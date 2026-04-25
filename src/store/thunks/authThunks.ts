import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/auth';
import type { LoginCredentials, SignupCredentials, UserProfilePayload } from '@/lib/api/auth';
import { postAuthV1Login } from '@/lib/api/authV1Login';


/** POST /api/v1/auth/login with `force: true` (see `postAuthV1Login`). */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    const username = credentials.username.trim();
    const password = credentials.password;


    try {
      const response: any = await postAuthV1Login({
        username,
        password,
        force: false,
      });

      const responseData = response?.data ?? {};
      const token = responseData?.token;
      const success = responseData?.success !== false;
      const message =
        typeof responseData?.message === 'string' && responseData.message.trim().length > 0
          ? responseData.message
          : undefined;

      if (!success) {
        return rejectWithValue(message || 'Login failed. Please try again.');
      }

      if (!token) {
        return rejectWithValue('Invalid response: no token from server.');
      }

      return {
        token,
        profile: responseData,
        response: responseData,
        success,
        message,
      };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
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

