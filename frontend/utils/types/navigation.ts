import { Category } from '@/services/categoryService';
import { Entry } from '@/services/entryService';

export type RootStackParamList = {
  List: undefined;
  AddCategory: { category: Category } | undefined;
  CreateEntry: {entry: Entry} | undefined;
};
