import * as SecureStore from 'expo-secure-store';

export async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('accessToken');
}

export async function createAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}