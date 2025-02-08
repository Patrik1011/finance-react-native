import { StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '@/components/ui/SearchBar';
import React, { useState } from 'react';
import {Button, ButtonText } from '@/components/ui/button';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

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
          <Button className="p-3 bg-blue-300 rounded-xl">
            <ButtonText className="font-medium text-sm">
              Add
            </ButtonText>
          </Button>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});