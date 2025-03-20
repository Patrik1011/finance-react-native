import {configureStore} from '@reduxjs/toolkit';
import entryReducer from './entrySlice';
import { thunk } from 'redux-thunk';

const store = configureStore({
  reducer: {
    entry: entryReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch