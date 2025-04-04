import { Button, ButtonText } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Category, getCategories } from '@/services/categoryService';
import { Entry } from '@/services/entryService';
import { RootStackParamList } from '@/utils/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CategoryPickerModal from '@/components/ui/category-picker';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { addEntry, modifyEntry, removeEntry } from '@/redux/entrySlice';

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

  const dispatch: AppDispatch = useDispatch();
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
        await dispatch(
          modifyEntry({ id: editingEntry.id!, entry: formData }),
        ).unwrap();
        setEditingEntry(null);
      } else {
        await dispatch(addEntry(formData)).unwrap();
      }
      setFormData({});

      navigation.goBack();
    } catch (error) {
      console.error('Error creating/updating category', error);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    dispatch(removeEntry(id));
    navigation.goBack();
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
        {editingEntry ? 'Edit' : 'Create'} an entry
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
        placeholder="Select a category"
        selectedCategoryId={formData.categoryId}
        onSelectCategory={(categoryId) =>
          setFormData({ ...formData, categoryId })
        }
        onClose={() => setModalVisible(false)}
      />

      {editingEntry && (
        <TouchableOpacity
          className="mt-2 w-full"
          onPress={async () => await handleDeleteEntry(editingEntry?.id ?? 0)}
        >
          <Text className="text-center text-white bg-red-500 border border-red-500 p-2 rounded-lg">
            Delete
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
