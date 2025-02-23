import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';

import {
  Category,
  deleteCategory,
  getCategories,
} from '@/services/categoryService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/utils/types/navigation';

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'List'>;

export default function ListScreen() {
  const [categories, setCategories] = useState<Category[]>();
  const navigation = useNavigation<ListScreenNavigationProp>();

  const handleEditCategory = (category: Category) => {
    navigation.navigate('AddCategory', { category });
  };

  const handleCreateCategory = () => {
    navigation.navigate('AddCategory');
  };

  const handleGetCategories = useCallback(async () => {
    try {
      const categories = await getCategories();
      console.log('categories re-rendering', categories);
      setCategories(categories);
    } catch (error) {
      console.error('Error getting categories', error);
    }
  }, []);

  const handleDeleteCategory = async (id: number) => {
    try {
      console.log('deleting category', id);
      await deleteCategory(id);
      setTimeout(async () => {
        await handleGetCategories();
      }, 1000);
    } catch (error) {
      console.error('Error deleting category', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetCategories();
    }, [handleGetCategories]),
  );

  return (
    <View className="px-4 mt-2">
      <Text className="text-gray-800 font-semibold text-xl underline">
        My categories:
      </Text>

      <View>
        <Button
          className="px-3 my-2 bg-blue-300 rounded-xl"
          onPress={handleCreateCategory}
        >
          <ButtonText className="font-medium text-sm">
            + Add Category
          </ButtonText>
        </Button>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="mt-2 py-2 px-4 bg-gray-200 rounded-lg flex-row justify-between items-center">
            <Text className="text-gray-800">{item.name}</Text>
            <View className="flex-row gap-x-2">
              <TouchableOpacity onPress={() => handleEditCategory(item)}>
                <Text className="text-white bg-green-500 border-green-500 py-2 px-3 rounded-lg">
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => await handleDeleteCategory(item.id ?? 0)}
              >
                <Text className="text-white bg-red-500 border border-red-500 p-2 rounded-lg">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
