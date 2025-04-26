import { Button, ButtonText } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Category } from '@/services/categoryService';
import { RootStackParamList } from '@/utils/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/tanstack-query/categories';

type AddCategoryScreenRouteProp = RouteProp<RootStackParamList, 'AddCategory'>;

interface formData {
  title?: string;
  description?: string;
  color?: string;
}

const predefinedColors = [
  { label: 'Brown', value: '#e7d8c9' },
  { label: 'Green', value: '#cdeac0' },
  { label: 'Blue', value: '#e2fdff' },
  { label: 'Yellow', value: '#fcefb4' },
  { label: 'Purple', value: '#e7c6ff' },
];

const getColorLabel = (colorValue: string) => {
  const color = predefinedColors.find((c) => c.value === colorValue);
  return color ? color.label : 'Select a color';
};

export default function AddCategoryScreen() {
  const [formData, setFormData] = useState<formData>({});
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute<AddCategoryScreenRouteProp>();

  // Use TanStack Query mutations
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();

  useEffect(() => {
    if (route.params?.category) {
      setEditingCategory(route.params.category);
      setFormData(route.params.category);
    }
  }, [route.params]);

  const handleCreateOrUpdateCategory = async () => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id!, category: formData },
        {
          onSuccess: () => {
            navigation.goBack();
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          navigation.goBack();
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <View className="px-4 mt-2">
      <Text className="text-gray-800 font-semibold text-xl pb-4">
        {editingCategory ? 'Edit category' : 'Enter a new category'}
      </Text>
      
      {error && (
        <View className="mb-4 p-2 bg-red-100 rounded">
          <Text className="text-red-600">Error: {error.message}</Text>
        </View>
      )}
      
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
            value={formData.description || ''}
            placeholder="description"
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
          />
        </View>
      </View>
      <View className="mt-2 w-full">
        <TouchableOpacity
          onPress={() => setIsColorPickerVisible(true)}
          className="p-2 bg-gray-200 rounded-lg"
        >
          <Text>{getColorLabel(formData.color || '')}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isColorPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-transparent">
          <View className="bg-white p-4 rounded-lg w-3/4">
            <Text className="text-gray-800 font-semibold">Choose a color</Text>
            <Picker
              selectedValue={formData.color}
              onValueChange={(value) =>
                setFormData({ ...formData, color: value })
              }
            >
              {predefinedColors.map((color) => (
                <Picker.Item
                  key={color.value}
                  label={color.label}
                  value={color.value}
                />
              ))}
            </Picker>
            <Button
              className="mt-4 p-2 bg-blue-300 rounded-lg"
              onPress={() => setIsColorPickerVisible(false)}
            >
              <ButtonText className="font-medium text-sm">Done</ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
      <View className="mt-2">
        <Button
          className="p-3 bg-blue-300 rounded-xl"
          onPress={handleCreateOrUpdateCategory}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <ButtonText className="font-medium text-sm">
              {editingCategory ? 'Edit' : 'Add'}
            </ButtonText>
          )}
        </Button>
      </View>
    </View>
  );
}