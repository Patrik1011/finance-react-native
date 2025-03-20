import { Button, ButtonText } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';
import {
  Category,
  createCategory,
  updateCategory,
} from '@/services/categoryService';
import { RootStackParamList } from '@/utils/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type AddCategoryScreenRouteProp = RouteProp<RootStackParamList, 'AddCategory'>;

interface formData {
  title?: string;
  description?: string;
  color?: string;
}

const predefinedColors = [
  { label: 'Red', value: '#FF0000' },
  { label: 'Green', value: '#00FF00' },
  { label: 'Blue', value: '#0000FF' },
  { label: 'Yellow', value: '#FFFF00' },
  { label: 'Purple', value: '#800080' },
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

  useEffect(() => {
    if (route.params?.category) {
      setEditingCategory(route.params.category);
      setFormData(route.params.category);
    }
  }, [route.params]);

  const handleCreateOrUpdateCategory = async () => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id!, formData);
        setEditingCategory(null);
      } else {
        await createCategory(formData);
      }
      setFormData({});

      navigation.goBack();
    } catch (error) {
      console.error('Error creating/updating category', error);
    }
  };

  return (
    <View className="px-4 mt-2">
      <Text className="text-gray-800 font-semibold text-xl">
        Enter a new category
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
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-4 rounded-lg w-3/4">
            <Text className="text-gray-800 font-semibold">Choose a color</Text>
            <Picker
              selectedValue={formData.color}
              onValueChange={(value) => setFormData({ ...formData, color: value })}
            >
              {predefinedColors.map((color) => (
                <Picker.Item key={color.value} label={color.label} value={color.value} />
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
        >
          <ButtonText className="font-medium text-sm">
            {editingCategory ? 'edit' : 'add'}
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}