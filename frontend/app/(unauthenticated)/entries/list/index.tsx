import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/utils/types/navigation';
import {
  deleteEntry,
  Entries,
  getEntries,
  getEntriesByCategory,
} from '@/services/entryService';
import { Category, getCategories } from '@/services/categoryService';
import CategoryPickerModal from '@/components/ui/category-picker';

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'List'>;

export default function EntryListScreen() {
  const [entries, setEntries] = useState<Entries[]>();
  const [formData, setFormData] = useState<{ categoryId?: number }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<ListScreenNavigationProp>();

  const handleEditEntry = (entry: Entries) => {
    navigation.navigate('CreateEntry', { entry });
  };

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

  const handleGetEntries = useCallback(async () => {
    try {
      const entries = await getEntries();
      setEntries(entries);
    } catch (error) {
      console.error('Error getting entries', error);
    }
  }, []);

  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteEntry(id);
      setTimeout(async () => {
        await handleGetEntries();
      }, 1000);
    } catch (error) {
      console.error('Error deleting entry', error);
    }
  };

  const handleGetEntriesByCategory = async (categoryId?: number) => {
    try {
      if (categoryId) {
        const entries = await getEntriesByCategory(categoryId);
        setEntries(entries);
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
    }
    , [formData.categoryId]),
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

      <View className="w-full mt-0">
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
        data={entries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
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
              <TouchableOpacity
                onPress={async () => await handleDeleteEntry(item.id ?? 0)}
              >
                <Text className="text-white bg-red-500 border border-red-500 p-2 rounded-lg">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      <CategoryPickerModal
        visible={modalVisible}
        categories={categories || []}
        selectedCategoryId={formData.categoryId}
        onSelectCategory={(categoryId) =>
          setFormData({ ...formData, categoryId })
        }
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
