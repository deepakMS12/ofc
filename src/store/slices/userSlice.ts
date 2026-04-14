import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from '../thunks/authThunks';

interface UserProfile {
  username: string;
  name: string;
  email?: string;
  pendingEmail?: string | null;
  pendingEmailRequestedAt?: string | null;
  lastPasswordChange?: string | null;
  lastEmailChange?: string | null;
  lastLogin?: string | null;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Safe localStorage access (handles SSR)
const getInitialUser = (): UserProfile | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

const initialState: UserState = {
  profile: getInitialUser(),
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.profile));
      }
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const p = action.payload.profile;
      if (p) {
        state.profile = {
          username: p.username,
          name: p.name,
          email: p.email,
          pendingEmail: p.pendingEmail ?? null,
          pendingEmailRequestedAt: p.pendingEmailRequestedAt ?? null,
          lastPasswordChange: p.lastPasswordChange ?? null,
          lastEmailChange: p.lastEmailChange ?? null,
          lastLogin: p.lastLogin ?? null,
        };
        localStorage.setItem('user', JSON.stringify(state.profile));
      }
    });
  },
});

export const { setUser, clearUser, updateUser, setUserLoading, setUserError } =
  userSlice.actions;

export default userSlice.reducer;

