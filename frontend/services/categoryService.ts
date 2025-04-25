import { fetchClient } from '@/services/fetchClient';
import * as SecureStore from 'expo-secure-store';

export interface Category {
  id?: number;
  title?: string;
  description?: string;
  color?: string;
}

// Helper function to get the token from SecureStore
async function getAuthToken(): Promise<string | null> {
  // Get the token from SecureStore
  return await SecureStore.getItemAsync('accessToken');
}

// Create auth headers with the token
async function createAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCategories(): Promise<Category[]> {
  const headers = await createAuthHeaders();
  const categories = await fetchClient<Category[]>('/categories', {
    headers,
  });
  return categories;
}

export async function createCategory(category: Category): Promise<Category> {
  const headers = await createAuthHeaders();
  return fetchClient<Category>('/categories', {
    method: 'POST',
    headers,
    body: category,
  });
}

export async function deleteCategory(id: number): Promise<void> {
  const headers = await createAuthHeaders();
  await fetchClient(`/categories/${id}`, { 
    method: 'DELETE',
    headers,
  });
}

export async function updateCategory(
  id: number,
  category: Category,
): Promise<Category> {
  const headers = await createAuthHeaders();
  return fetchClient<Category>(`/categories/${id}`, {
    method: 'PUT',
    headers,
    body: category,
  });
}