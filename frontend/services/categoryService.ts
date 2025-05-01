import { fetchClient } from '@/services/fetchClient';
import { createAuthHeaders } from './common';

export interface Category {
  id?: number;
  title?: string;
  description?: string;
  color?: string;
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
