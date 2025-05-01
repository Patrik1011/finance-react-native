import { fetchClient } from '@/services/fetchClient';
import { createAuthHeaders } from './common';
import { Role } from '@/utils/types/enums';

export interface User {
  id: number;
  email: string;
  role: Role;
}

export async function upgradeUser(): Promise<User> {
  const headers = await createAuthHeaders();
  return fetchClient<User>('/users/upgrade', {
    method: 'POST',
    headers,
  });
}

export async function downgradeUser(): Promise<User> {
  const headers = await createAuthHeaders();
  return fetchClient<User>('/users/downgrade', {
    method: 'POST',
    headers,
  });
}

export async function getCurrentUser(): Promise<User> {
  const headers = await createAuthHeaders();
  return fetchClient<User>('/users/me', {
    headers,
  });
}
