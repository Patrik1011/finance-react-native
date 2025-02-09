import {fetchClient} from '@/services/fetchClient';

export interface Category {
  message?: string;
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
  return fetchClient<void>(`/category/${id}`, {
    method: 'DELETE',
  });
}