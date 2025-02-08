import { StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '@/components/ui/SearchBar';
import { useState } from 'react';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  return (
      <View className='px-6 mt-20'>
        <Text className='text-black text-2xl'>Enter a new category</Text>
        <SearchBar
          className='px-6'
          value={search}
          onChange={setSearch}
        />
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