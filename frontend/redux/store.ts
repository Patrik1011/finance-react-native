import { configureStore } from '@reduxjs/toolkit';
import entryReducer from './entrySlice';

const store = configureStore({
  reducer: {
    entry: entryReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Add any serializable check options if needed
      },
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;