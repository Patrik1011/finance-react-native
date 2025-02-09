import { Text, View } from 'react-native';
import { SearchBar } from '@/components/ui/SearchBar';
import React, { useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';

import {createCategory} from '@/services/categoryService';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  const handleCreateCategory = async () => {
    try {
      await createCategory({ message: search });
    } catch (error) {
      console.error('Error creating category', error);
    }
  }

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
    </View>
  );
}