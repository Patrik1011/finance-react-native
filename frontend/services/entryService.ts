import { fetchClient } from '@/services/fetchClient';
import { Category } from './categoryService';

export interface Entry {
  id?: number;
  title?: string;
  amount?: number;
  categoryId?: number;
}

export interface Entries extends Entry {
  category?: Category;
}

export interface CategoryEntries {
  category: Category;
  entries: Entries[];
}

export async function getEntries(): Promise<Entries[]> {
  const entries = await fetchClient<Entries[]>('/entries');
  return entries;
}

export async function createEntry(entry: Entry): Promise<Entry> {
  return fetchClient<Category>('/entries', {
    method: 'POST',
    body: entry,
  });
}

export async function deleteEntry(id: number): Promise<void> {
  await fetchClient(`/entries/${id}`, { method: 'DELETE' });
}

export async function updateEntry(id: number, category: Entry): Promise<Entry> {
  return fetchClient<Entry>(`/entries/${id}`, {
    method: 'PUT',
    body: category,
  });
}

export async function getEntriesByCategory(
  categoryId: number,
): Promise<CategoryEntries> {
  const entries = await fetchClient<CategoryEntries>(`/entries/category/${categoryId}`);
  return entries;
}
