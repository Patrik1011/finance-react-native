import { Category } from '@/services/categoryService';
import { Entries } from '@/services/entryService';

export type RootStackParamList = {
  List: undefined;
  AddCategory: { category: Category } | undefined;
  CreateEntry: undefined;
  UpdateEntry: { updatedEntry: Entries };
};
