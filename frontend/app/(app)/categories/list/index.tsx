import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { Button, ButtonText } from '@/components/ui/button';

import { Category } from '@/services/categoryService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/utils/types/navigation';
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from '@/tanstack-query/categories';

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'List'>;

export default function ListScreen() {
  const navigation = useNavigation<ListScreenNavigationProp>();

  const { data: categories, isLoading, isError, error } = useCategoriesQuery();
  const deleteMutation = useDeleteCategoryMutation();

  const handleEditCategory = (category: Category) => {
    navigation.navigate('AddCategory', { category });
  };

  const handleCreateCategory = () => {
    navigation.navigate('AddCategory');
  };

  const handleDeleteCategory = (id: number) => {
    deleteMutation.mutate(id);
  };

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

      <View>
        <Text className="text-gray-800 font-semibold text-lg">
          Create categories so you can organize your entries better.
        </Text>
      </View>

      {isLoading && (
        <View className="py-4 flex items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {isError && (
        <View className="py-4">
          <Text className="text-red-500">
            Error loading categories: {error?.message}
          </Text>
        </View>
      )}

      <FlatList
        data={categories}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View
            style={{ backgroundColor: item.color }}
            className={`mt-2 py-2 px-4 rounded-lg flex-row justify-between items-center`}
          >
            <Text className="text-gray-800">{item.title}</Text>
            <Text className="text-gray-800">{item.description}</Text>
            <View className="flex-row gap-x-2">
              <TouchableOpacity onPress={() => handleEditCategory(item)}>
                <Text className="text-white bg-green-500 border-green-500 py-2 px-3 rounded-lg">
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteCategory(item.id ?? 0)}
                disabled={deleteMutation.isPending}
              >
                <Text className="text-white bg-red-500 border border-red-500 p-2 rounded-lg">
                  {deleteMutation.isPending &&
                  item.id === deleteMutation.variables
                    ? 'Deleting...'
                    : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
