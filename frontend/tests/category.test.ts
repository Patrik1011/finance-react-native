import * as SecureStore from 'expo-secure-store';

import { fetchClient } from '@/services/fetchClient';
import { createCategory } from '@/services/categoryService';

jest.mock('expo-secure-store');
jest.mock('@/services/fetchClient');

describe('categoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      // Arrange
      const mockToken = 'mock-token';
      const mockCategory = { 
        title: 'Groceries', 
        description: 'Food and household items', 
        color: '#00FF00' 
      };
      
      const expectedResponse = { 
        id: 1, 
        ...mockCategory 
      };
      
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
      (fetchClient as jest.Mock).mockResolvedValue(expectedResponse);
      
      const result = await createCategory(mockCategory);
      
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('accessToken');
      expect(fetchClient).toHaveBeenCalledWith('/categories', {
        method: 'POST',
        headers: { Authorization: `Bearer ${mockToken}` },
        body: mockCategory,
      });
      expect(result).toEqual(expectedResponse);
        });
        
        it('should call the API with empty auth header when token is not available', async () => {
      const mockCategory = { 
        title: 'Entertainment', 
        description: 'Movies, games, etc', 
        color: '#FF0000' 
      };
      
      const expectedResponse = { 
        id: 2, 
        ...mockCategory 
      };
      
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      (fetchClient as jest.Mock).mockResolvedValue(expectedResponse);
      
      const result = await createCategory(mockCategory);
      
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('accessToken');
      expect(fetchClient).toHaveBeenCalledWith('/categories', {
        method: 'POST',
        headers: {},
        body: mockCategory,
      });
      expect(result).toEqual(expectedResponse);
        });
        
        it('should propagate error from the fetch client', async () => {
      const mockCategory = { title: 'Error Category' };
      const mockError = new Error('API Error');
      
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('token');
      (fetchClient as jest.Mock).mockRejectedValue(mockError);

      await expect(createCategory(mockCategory)).rejects.toThrow('API Error');
        });
        
        it('should handle empty category data correctly', async () => {
      const mockCategory = {};
      const expectedResponse = { id: 3 };
      
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('token');
      (fetchClient as jest.Mock).mockResolvedValue(expectedResponse);
      
      const result = await createCategory(mockCategory);
      
      expect(fetchClient).toHaveBeenCalledWith('/categories', {
        method: 'POST',
        headers: { Authorization: `Bearer token` },
        body: {},
      });
      expect(result).toEqual(expectedResponse);
        });
        
        it('should handle errors when accessing secure storage', async () => {
      const mockCategory = { title: 'Test' };
      const storageError = new Error('Storage access error');
      
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(storageError);
      
      await expect(createCategory(mockCategory)).rejects.toThrow('Storage access error');
      expect(fetchClient).not.toHaveBeenCalled();
        });
    });
  });