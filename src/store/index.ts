import { configureStore } from '@reduxjs/toolkit';
import { authReducer, userReducer, urlToPdfReducer } from './slices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    urlToPdf: urlToPdfReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

