import { configureStore } from '@reduxjs/toolkit';
import entryReducer from './entrySlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    entry: entryReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
