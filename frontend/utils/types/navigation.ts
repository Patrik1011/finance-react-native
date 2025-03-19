import { Category } from '@/services/categoryService';
import { Entries, Entry } from '@/services/entryService';

export type RootStackParamList = {
  List: undefined;
  AddCategory: { category: Category } | undefined;
  CreateEntry: { entry: Entries | Entry } | undefined;
};
