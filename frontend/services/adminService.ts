import { fetchClient } from '@/services/fetchClient';
import * as SecureStore from 'expo-secure-store';

export interface AdminImage {
  entryId: number;
  imageUrl: string;
}

async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('accessToken');
}

async function createAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAllImages(): Promise<AdminImage[]> {
  const headers = await createAuthHeaders();
  return fetchClient<AdminImage[]>('/admin/images', {
    headers,
  });
}
