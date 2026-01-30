import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import applicationReducer from './slices/applicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    applications: applicationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;