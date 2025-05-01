import { fetchClient } from '@/services/fetchClient';
import { Category } from './categoryService';
import { createAuthHeaders } from './common';

export interface Entry {
  id?: number;
  title?: string;
  amount?: number;
  categoryId?: number;
  image?: string;
  image_url?: string;
}

export interface Entries extends Entry {
  category?: Category;
}

export interface CategoryEntries {
  category: Category;
  entries: Entries[];
}

export async function getEntries(): Promise<Entries[]> {
  const headers = await createAuthHeaders();
  const entries = await fetchClient<Entries[]>('/entries', {
    headers,
  });
  return entries;
}

export async function createEntry(entry: Entry): Promise<Entry> {
  const headers = await createAuthHeaders();
  return fetchClient<Entry>('/entries', {
    method: 'POST',
    headers,
    body: entry,
  });
}

export async function deleteEntry(id: number): Promise<void> {
  const headers = await createAuthHeaders();
  await fetchClient(`/entries/${id}`, {
    method: 'DELETE',
    headers,
  });
}

export async function updateEntry(id: number, entry: Entry): Promise<Entry> {
  const headers = await createAuthHeaders();
  return fetchClient<Entry>(`/entries/${id}`, {
    method: 'PUT',
    headers,
    body: entry,
  });
}

export async function getEntriesByCategory(
  categoryId: number,
): Promise<CategoryEntries> {
  const headers = await createAuthHeaders();
  const entries = await fetchClient<CategoryEntries>(
    `/entries/category/${categoryId}`,
    {
      headers,
    },
  );
  return entries;
}
