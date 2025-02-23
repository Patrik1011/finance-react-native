import { Button, ButtonText } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';
import {
  Category,
  createCategory,
  updateCategory,
} from '@/services/categoryService';
import { RootStackParamList } from '@/utils/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

type AddCategoryScreenRouteProp = RouteProp<RootStackParamList, 'AddCategory'>;

export default function AddCategoryScreen() {
  const [search, setSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const navigation = useNavigation();
  const route = useRoute<AddCategoryScreenRouteProp>();

  useEffect(() => {
    if (route.params?.category) {
      setEditingCategory(route.params.category);
      setSearch(route.params.category.name ?? '');
    }
  }, [route.params]);

  const handleCreateOrUpdateCategory = async () => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id!, { name: search });
        setEditingCategory(null);
      } else {
        await createCategory({ name: search });
      }
      setSearch('');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating/updating category', error);
    }
  };

  return (
    <View className="px-4 mt-2">
      <Text className="text-gray-800 font-semibold text-xl">
        Enter a new category
      </Text>
      <View className="flex-row items-center gap-x-2 mt-2">
        <View className="w-2/3">
          <SearchBar
            className="flex-1 placeholder:bg-gray-200 rounded-lg"
            value={search}
            placeholder="Enter a category"
            onChange={setSearch}
          />
        </View>
        <View className="w-1/3">
          <Button
            className="p-3 bg-blue-300 rounded-xl"
            onPress={handleCreateOrUpdateCategory}
          >
            <ButtonText className="font-medium text-sm">
              {editingCategory ? 'edit' : 'add'}
            </ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
