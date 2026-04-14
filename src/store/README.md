# Redux Store Structure

This project uses Redux Toolkit for state management.

## Structure

```
src/store/
├── index.ts              # Store configuration and root reducer
├── hooks.ts              # Typed hooks for useSelector and useDispatch
├── slices/
│   ├── authSlice.ts      # Authentication state (login, logout, token)
│   └── userSlice.ts      # User profile state
└── thunks/
    └── authThunks.ts     # Async actions for authentication
```

## Usage

### Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, logout } from '@/store/slices/authSlice';
import { setUser, clearUser } from '@/store/slices/userSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.user);

  const handleLogin = () => {
    dispatch(loginStart());
    // ... handle login logic
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
  };
}
```

### Using Async Thunks

```typescript
import { useAppDispatch } from '@/store/hooks';
import { loginUser, signupUser, forgotPassword } from '@/store/thunks/authThunks';

function MyComponent() {
  const dispatch = useAppDispatch();

  const handleLogin = async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      // Handle success
      if (result.profile) {
        dispatch(setUser(result.profile));
      }
    } catch (error) {
      // Handle error
      console.error('Login failed:', error);
    }
  };
}
```

## Available Actions

### Auth Slice
- `loginStart()` - Start login process
- `loginSuccess({ token })` - Login successful
- `loginFailure(error)` - Login failed
- `logout()` - Logout user
- `clearError()` - Clear error message
- `setAuthenticated(boolean)` - Set authentication state

### User Slice
- `setUser(profile)` - Set user profile
- `clearUser()` - Clear user profile
- `updateUser(partialProfile)` - Update user profile
- `setUserLoading(boolean)` - Set loading state
- `setUserError(error)` - Set error message

### Async Thunks
- `loginUser(credentials)` - Login user (async)
- `signupUser(credentials)` - Signup user (async)
- `forgotPassword(email)` - Send password reset email (async)

## State Structure

### Auth State
```typescript
{
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}
```

### User State
```typescript
{
  profile: {
    username: string;
    name: string;
    email: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}
```

