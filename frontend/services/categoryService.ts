import { fetchClient } from '@/services/fetchClient';

export interface Category {
  id?: number;
  name?: string;
}

export async function getCategories(): Promise<Category[]> {
  return fetchClient<Category[]>('/category');
}

export async function createCategory(category: Category): Promise<Category> {
  return fetchClient<Category>('/category', {
    method: 'POST',
    body: category,
  });
}

export async function deleteCategory(id: number): Promise<void> {
  await fetchClient(`/category/${id}`, { method: 'DELETE' });
}

export async function updateCategory(
  id: number,
  category: Category,
): Promise<Category> {
  return fetchClient<Category>(`/category/${id}`, {
    method: 'PUT',
    body: category,
  });
}
