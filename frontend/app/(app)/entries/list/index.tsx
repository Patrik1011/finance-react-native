import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/utils/types/navigation';
import {
  CategoryEntries,
  Entries,
  getEntriesByCategory,
} from '@/services/entryService';
import { Category, getCategories } from '@/services/categoryService';
import CategoryPickerModal from '@/components/ui/category-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchEntries } from '@/redux/entrySlice';

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'List'>;

export default function EntryListScreen() {
  const [categoryEntries, setCategoryEntries] = useState<CategoryEntries>();
  const [formData, setFormData] = useState<{ categoryId?: number }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<ListScreenNavigationProp>();

  const dispatch: AppDispatch = useDispatch();
  const entries = useSelector((state: RootState) => state.entry.entries);

  const handleEditEntry = (updatedEntry: Entries) => {
    navigation.navigate('UpdateEntry', { updatedEntry });
  };

  const handleGetEntries = useCallback(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  const handleCreateEntry = () => {
    navigation.navigate('CreateEntry');
  };

  const handleGetCategories = async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Error getting categories', error);
    }
  };

  const handleGetEntriesByCategory = async (categoryId?: number) => {
    try {
      if (categoryId) {
        const categoryEntries = await getEntriesByCategory(categoryId);
        const entriesWithCategory = categoryEntries.entries.map((entry) => ({
          ...entry,
          category: categoryEntries.category,
        }));
        setCategoryEntries({
          ...categoryEntries,
          entries: entriesWithCategory,
        });
      } else {
        await handleGetEntries();
      }
    } catch (error) {
      console.error('Error getting entries', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetEntries();
      handleGetCategories();
    }, [handleGetEntries]),
  );

  useFocusEffect(
    useCallback(() => {
      handleGetEntriesByCategory(formData.categoryId);
    }, [formData.categoryId]),
  );

  const renderEntry = ({ item }: { item: Entries }) => (
    <View
      key={item.id}
      style={{ backgroundColor: item.category?.color }}
      className={`mt-2 py-2 px-4 rounded-lg flex-row justify-between items-center`}
    >
      <View>
        <Text className="text-gray-800">{item.title}</Text>
      </View>
      <View>
        <Text className="text-gray-800">{item.amount}</Text>
      </View>
      <View>
        <Text className="text-gray-800">{item.category?.title}</Text>
      </View>

      <View className="flex-row gap-x-2">
        <TouchableOpacity onPress={() => handleEditEntry(item)}>
          <Text className="text-white bg-green-500 border-green-500 py-2 px-3 rounded-lg">
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="px-4 mt-2">
      <Text className="text-gray-800 font-semibold text-xl underline">
        My Entries:
      </Text>

      <View>
        <Button
          className="px-3 my-2 bg-blue-300 rounded-xl"
          onPress={handleCreateEntry}
        >
          <ButtonText className="font-medium text-sm">+ Add Entry</ButtonText>
        </Button>
      </View>

      <View>
        <Text className="text-gray-800 font-semibold text-lg pb-2">
          Keep track of your expenses and income.
        </Text>
      </View>

      <View className="w-full pb-2">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="p-2 border border-gray-300 rounded bg-gray-100"
        >
          <Text>
            {formData.categoryId
              ? categories?.find((cat) => cat.id === formData.categoryId)?.title
              : 'Select a category'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={
          formData.categoryId && categoryEntries
            ? categoryEntries.entries
            : entries
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderEntry}
      />

      <CategoryPickerModal
        visible={modalVisible}
        categories={categories || []}
        placeholder="All"
        selectedCategoryId={formData.categoryId}
        onSelectCategory={(categoryId) =>
          setFormData({ ...formData, categoryId })
        }
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
