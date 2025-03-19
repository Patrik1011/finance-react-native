import { Button, ButtonText } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';
import {
  Category,
  getCategories,
} from '@/services/categoryService';
import { createEntry, Entry, updateEntry } from '@/services/entryService';
import { RootStackParamList } from '@/utils/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CategoryPickerModal from '@/components/ui/category-picker';

type UpdateEntryScreenRouteProp = RouteProp<RootStackParamList, 'UpdateEntry'>;

interface formData {
  title?: string;
  amount?: number;
  categoryId?: number;
}

export default function EntryCreateScreen() {
  const [formData, setFormData] = useState<formData>({});
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute<UpdateEntryScreenRouteProp>();

  const fetchCategories = async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Error getting categories', error);
    }
  };

  const handleCreateOrUpdateCategory = async () => {
    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id!, formData);
        setEditingEntry(null);
      } else {
        await createEntry(formData);
      }
      setFormData({});

      navigation.goBack();
    } catch (error) {
      console.error('Error creating/updating category', error);
    }
  };

  useEffect(() => {
    if (route.params?.updatedEntry) {
      setEditingEntry(route.params.updatedEntry);

      const formData = {
        title: route.params.updatedEntry.title,
        amount: route.params.updatedEntry.amount,
        categoryId: route.params.updatedEntry.category?.id,
      };

      setFormData(formData);
    }
  }, [route.params]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View className="px-4 mt-2">
      <Text className="text-gray-800 font-semibold text-xl">
        Enter a new entry
      </Text>
      <View className="flex gap-y-2">
        <View className="w-full">
          <SearchBar
            className="flex-1 placeholder:bg-gray-200 rounded-lg"
            value={formData.title || ''}
            placeholder="title"
            onChange={(value) => setFormData({ ...formData, title: value })}
          />
        </View>
        <View className="w-full">
          <SearchBar
            className="flex-1 placeholder:bg-gray-200 rounded-lg"
            value={formData.amount?.toString() || ''}
            placeholder="amount"
            onChange={(value) =>
              setFormData({ ...formData, amount: Number(value) })
            }
          />
        </View>
        <View className="w-full mt-0">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="p-2 border border-gray-300 rounded bg-gray-100"
          >
            <Text>
              {formData.categoryId
                ? categories?.find((cat) => cat.id === formData.categoryId)
                    ?.title
                : 'Select a category'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-2">
        <Button
          className="p-3 bg-blue-300 rounded-xl"
          onPress={handleCreateOrUpdateCategory}
        >
          <ButtonText className="font-medium text-sm">
            {editingEntry ? 'edit' : 'add'}
          </ButtonText>
        </Button>
      </View>

      <CategoryPickerModal
        visible={modalVisible}
        categories={categories || []}
        placeholder='Select a category'
        selectedCategoryId={formData.categoryId}
        onSelectCategory={(categoryId) =>
          setFormData({ ...formData, categoryId })
        }
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
