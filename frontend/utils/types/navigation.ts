import { Category } from '@/services/categoryService';

export type RootStackParamList = {
  List: undefined;
  AddCategory: { category: Category } | undefined;
};
