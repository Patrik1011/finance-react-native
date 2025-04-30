import * as SecureStore from 'expo-secure-store';
import { login, logout, checkAuthState } from '@/redux/authSlice';
import { fetchClient } from '@/services/fetchClient';
import { Role } from '@/utils/types/enums';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';

jest.mock('expo-secure-store');
jest.mock('@/services/fetchClient');

describe('Auth operations', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = setupStore();
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const mockResponse = {
        accessToken: 'mock-token-12345',
        user: {
          id: 1,
          email: 'test@example.com',
          role: Role.User
        }
      };

      (fetchClient as jest.Mock).mockResolvedValueOnce(mockResponse);

      const resultAction = await store.dispatch(login(credentials));
      const result = unwrapResult(resultAction);

      expect(fetchClient).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'mock-token-12345');
      expect(result).toEqual(mockResponse);
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.user).toEqual(mockResponse.user);
      expect(store.getState().auth.accessToken).toBe(mockResponse.accessToken);
      expect(store.getState().auth.error).toBeNull();
    });

    it('should handle login failure correctly', async () => {
      const credentials = { email: 'test@example.com', password: 'wrongpassword' };
      const mockError = new Error('Invalid credentials');
      
      (fetchClient as jest.Mock).mockRejectedValueOnce(mockError);

      const resultAction = await store.dispatch(login(credentials));

      expect(resultAction.type).toBe('auth/login/rejected');
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.user).toBeNull();
      expect(store.getState().auth.accessToken).toBeNull();
      expect(store.getState().auth.error).toBe('Invalid credentials');
      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
    });

    it('should handle login with admin role correctly', async () => {
      const credentials = { email: 'admin@example.com', password: 'adminpass' };
      const mockResponse = {
        accessToken: 'admin-token-12345',
        user: {
          id: 2,
          email: 'admin@example.com',
          role: Role.Admin
        }
      };

      (fetchClient as jest.Mock).mockResolvedValueOnce(mockResponse);

      const resultAction = await store.dispatch(login(credentials));
      const result = unwrapResult(resultAction);

      expect(fetchClient).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'admin-token-12345');
      expect(result.user.role).toBe(Role.Admin);
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should successfully logout a user', async () => {
      const mockResponse = {
        accessToken: 'mock-token-12345',
        user: { id: 1, email: 'test@example.com', role: Role.User }
      };
      store = setupStore();
      store.dispatch({ 
        type: 'auth/login/fulfilled', 
        payload: mockResponse 
      });

      await store.dispatch(logout());

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.user).toBeNull();
      expect(store.getState().auth.accessToken).toBeNull();
    });

    it('should handle logout failure', async () => {
      const error = new Error('Logout failed');
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValueOnce(error);

      const resultAction = await store.dispatch(logout());

      expect(resultAction.type).toBe('auth/logout/rejected');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
    });
  });

  describe('checkAuthState', () => {
    it('should recognize authenticated user when token exists', async () => {
      const mockToken = 'existing-token-12345';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(mockToken);

      await store.dispatch(checkAuthState());

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('accessToken');
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.accessToken).toBe(mockToken);
    });

    it('should recognize unauthenticated user when token does not exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      await store.dispatch(checkAuthState());

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('accessToken');
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.accessToken).toBeNull();
    });
  });
});