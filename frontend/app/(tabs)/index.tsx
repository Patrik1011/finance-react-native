import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from '@/components/ui/SearchBar';
import React, { useEffect, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';

import { Category, createCategory, deleteCategory, getCategories } from '@/services/categoryService';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>();

  const handleCreateCategory = async () => {
    try {
      await createCategory({ message: search });
      setSearch('');
      await handleGetCategories();
    } catch (error) {
      console.error('Error creating category', error);
    }
  }

  const handleGetCategories = async () => {
    try {
      const categories = await getCategories();
      console.log('categories', categories);
      setCategories(categories);
    } catch (error) {
      console.error('Error getting categories', error);
    }
  }

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
  }

  useEffect(() => {
    handleGetCategories();
  }, []);

  return (
    <View className='px-6 mt-20'>
      <Text className='text-gray-800 font-semibold text-xl'>Enter a new category</Text>
      <View className="flex-row items-center gap-x-2 mt-2">
        <View className='w-2/3'>
          <SearchBar
            className="flex-1 placeholder:bg-gray-200 rounded-lg"
            value={search}
            placeholder="Enter a category"
            onChange={setSearch}
          />
        </View>
        <View className='w-1/3'>
          <Button className="p-3 bg-blue-300 rounded-xl" onPress={handleCreateCategory}>
            <ButtonText className="font-medium text-sm">
              Add
            </ButtonText>
          </Button>
        </View>
      </View>

      <FlatList
        data={categories}
        className='mt-6'
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className='mt-2 py-2 px-4 bg-gray-200 rounded-lg flex-row justify-between items-center'>
            <Text className='text-gray-800'>{item.message}</Text>
            <TouchableOpacity onPress={async() => await handleDeleteCategory(item.id ?? 0)}>
              <Text className='text-white bg-red-500 border border-red-500 p-2 rounded-lg'>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

    </View>
  );
}