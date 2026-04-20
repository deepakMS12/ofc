import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/auth';
import type { LoginCredentials, SignupCredentials, UserProfilePayload } from '@/lib/api/auth';
import { postAuthV1Login } from '@/lib/api/authV1Login';


type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord | null {
  return value && typeof value === 'object' ? (value as AnyRecord) : null;
}

function pickFirstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  }
  return undefined;
}

function normalizeToken(rawToken: string): string {
  return rawToken.replace(/^Bearer\s+/i, '').trim();
}

function decodeJwtPayload(token: string): AnyRecord | null {
  const segments = token.split('.');
  if (segments.length < 2) return null;
  const base64 = segments[1]!.replace(/-/g, '+').replace(/_/g, '/');
  const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
  try {
    const binary = atob(padded);
    try {
      // Fast path for ASCII payloads.
      return asRecord(JSON.parse(binary));
    } catch {
      // UTF-8 fallback for non-ASCII payloads.
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const text = new TextDecoder().decode(bytes);
      return asRecord(JSON.parse(text));
    }
  } catch {
    return null;
  }
}

function extractTokenFromLoginResponse(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (typeof d.token === 'string') return normalizeToken(d.token);
  if (typeof d.accessToken === 'string') return normalizeToken(d.accessToken);
  if (typeof d.access_token === 'string') return normalizeToken(d.access_token);
  const nested = d.data;
  if (nested && typeof nested === 'object') {
    const n = nested as Record<string, unknown>;
    if (typeof n.token === 'string') return normalizeToken(n.token);
    if (typeof n.accessToken === 'string') return normalizeToken(n.accessToken);
    if (typeof n.access_token === 'string') return normalizeToken(n.access_token);
  }
  return null;
}

function extractProfileFromLoginResponse(
  data: unknown,
  username: string,
  token: string,
): UserProfilePayload {
  const root = asRecord(data);
  const nested = asRecord(root?.data);
  const profile =
    asRecord(root?.profile) ??
    asRecord(root?.user) ??
    asRecord(nested?.profile) ??
    asRecord(nested?.user);
  const claims = decodeJwtPayload(token);
  const claimsProfile = asRecord(claims?.profile);
  const claimsUid = pickFirstString(claims?.uID, claims?.uid, claims?.userId);
  const claimsName = pickFirstString(
    claimsProfile?.name,
    claimsProfile?.fullName,
    claimsProfile?.displayName,
  );
  const claimsEmail = pickFirstString(claimsProfile?.email);

  // When JWT carries profile claims, trust claims over sparse response fields.
  if (claimsUid || claimsName || claimsEmail) {
    const tokenUsername = claimsUid ?? username;
    return {
      username: tokenUsername,
      name:
        claimsName ??
        (tokenUsername.includes('@') ? tokenUsername.split('@')[0] : tokenUsername) ??
        'User',
      email: claimsEmail ?? (tokenUsername.includes('@') ? tokenUsername : undefined),
      pendingEmail: (profile?.pendingEmail as string | null | undefined) ?? null,
      pendingEmailRequestedAt:
        (profile?.pendingEmailRequestedAt as string | null | undefined) ?? null,
      lastPasswordChange: (profile?.lastPasswordChange as string | null | undefined) ?? null,
      lastEmailChange: (profile?.lastEmailChange as string | null | undefined) ?? null,
      lastLogin:
        pickFirstString(
          profile?.lastLogin,
          claims?.iat != null ? new Date(Number(claims.iat) * 1000).toISOString() : undefined,
        ) ?? new Date().toISOString(),
    };
  }

  const resolvedUsername =
    pickFirstString(
      profile?.username,
      profile?.userName,
      root?.uID,
      nested?.uID,
      claims?.uID,
      username,
    ) ?? 'user';

  const displayName =
    pickFirstString(
      claimsProfile?.name,
      claimsProfile?.fullName,
      claimsProfile?.displayName,
      profile?.name,
      profile?.fullName,
      profile?.displayName,
      resolvedUsername.includes('@') ? resolvedUsername.split('@')[0] : resolvedUsername,
    ) ?? 'User';

  const email = pickFirstString(
    claimsProfile?.email,
    profile?.email,
    resolvedUsername.includes('@') ? resolvedUsername : undefined,
  );

  return {
    username: resolvedUsername,
    name: displayName,
    email,
    pendingEmail: (profile?.pendingEmail as string | null | undefined) ?? null,
    pendingEmailRequestedAt:
      (profile?.pendingEmailRequestedAt as string | null | undefined) ?? null,
    lastPasswordChange: (profile?.lastPasswordChange as string | null | undefined) ?? null,
    lastEmailChange: (profile?.lastEmailChange as string | null | undefined) ?? null,
    lastLogin:
      pickFirstString(profile?.lastLogin, claims?.iat != null ? new Date(Number(claims.iat) * 1000).toISOString() : undefined) ??
      new Date().toISOString(),
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
        force: false,
      });
      const token = extractTokenFromLoginResponse(data);
      if (!token) {
        return rejectWithValue('Invalid response: no token from server.');
      }
      const profile = extractProfileFromLoginResponse(data, username, token);
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

