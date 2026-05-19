import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, type ProfileResponse, type UserProfilePayload } from '@/lib/api/auth';
import type { RootState } from '@/store';

export type UserProfileState = {
  username: string;
  name: string;
  email?: string;
  pendingEmail?: string | null;
  pendingEmailRequestedAt?: string | null;
  lastPasswordChange?: string | null;
  lastEmailChange?: string | null;
  lastLogin?: string | null;
};

function readCachedUser(): UserProfileState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as UserProfileState) : null;
  } catch {
    return null;
  }
}

export function mapProfileToUser(
  data: Partial<UserProfilePayload>,
  cached?: UserProfileState | null,
): UserProfileState {
  return {
    username: data.username || cached?.username || '',
    name: data.name || cached?.name || '',
    email: data.email || cached?.email,
    pendingEmail: data.pendingEmail ?? cached?.pendingEmail ?? null,
    pendingEmailRequestedAt:
      data.pendingEmailRequestedAt ?? cached?.pendingEmailRequestedAt ?? null,
    lastPasswordChange: data.lastPasswordChange ?? cached?.lastPasswordChange ?? null,
    lastEmailChange: data.lastEmailChange ?? cached?.lastEmailChange ?? null,
    lastLogin: data.lastLogin ?? cached?.lastLogin ?? null,
  };
}

export function isProfileResponseOk(response: ProfileResponse): boolean {
  if (response.success && response.data) return true;
  if (response.status === 'success' && response.data) return true;
  return Boolean(response.data?.username || response.data?.name);
}

/** Load account profile from GET /api/v1/ac/profile (used on app shell mount). */
export const fetchUserProfile = createAsyncThunk<
  UserProfileState,
  void,
  { state: RootState; rejectValue: string }
>('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getProfile();
    const cached = readCachedUser();

    if (!isProfileResponseOk(response) || !response.data) {
      if (cached?.username || cached?.name) {
        return cached;
      }
      return rejectWithValue('Failed to load profile');
    }

    return mapProfileToUser(response.data, cached);
  } catch {
    const cached = readCachedUser();
    if (cached?.username || cached?.name) {
      return cached;
    }
    return rejectWithValue('Failed to load profile');
  }
});
