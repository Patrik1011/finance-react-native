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
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { ColorPicker } from 'react-native-color-picker';

type AddCategoryScreenRouteProp = RouteProp<RootStackParamList, 'AddCategory'>;

interface formData {
  title?: string;
  description?: string;
  color?: string;
}

export default function AddCategoryScreen() {
  const [formData, setFormData] = useState<formData>({
    title: '',
    description: '',
    color: '',
  });

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
      setFormData({ title: '', description: '', color: '' });

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
      <View className="mt-2 w-1/3">
        <Button onPress={() => setIsColorPickerVisible(true)}>
          <Text className="text-blue-500 border border-blue-500 p-2 rounded-lg">
            Pick a color
          </Text>
        </Button>
        <Modal
          visible={isColorPickerVisible}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-4 rounded-lg">
              <ColorPicker
                onColorSelected={(color) => {
                  setFormData({ ...formData, color: color });
                  setIsColorPickerVisible(false);
                }}
                style={{ height: 200, width: 200 }}
              />
              <Button onPress={() => setIsColorPickerVisible(false)}>
                <ButtonText>Close</ButtonText>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
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
