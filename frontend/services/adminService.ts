import { fetchClient } from '@/services/fetchClient';
import { createAuthHeaders } from './common';

export interface AdminImage {
  entryId: number;
  imageUrl: string;
}

export async function getAllImages(): Promise<AdminImage[]> {
  const headers = await createAuthHeaders();
  return fetchClient<AdminImage[]>('/admin/images', {
    headers,
  });
}
