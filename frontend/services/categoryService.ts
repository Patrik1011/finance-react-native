import { fetchClient } from '@/services/fetchClient';

export interface Category {
  id?: number;
  title?: string;
  description?: string;
  color?: string;
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchClient<Category[]>('/categories');
  return categories;
}

export async function createCategory(category: Category): Promise<Category> {
  return fetchClient<Category>('/categories', {
    method: 'POST',
    body: category,
  });
}

export async function deleteCategory(id: number): Promise<void> {
  await fetchClient(`/categories/${id}`, { method: 'DELETE' });
}

export async function updateCategory(
  id: number,
  category: Category,
): Promise<Category> {
  return fetchClient<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: category,
  });
}
