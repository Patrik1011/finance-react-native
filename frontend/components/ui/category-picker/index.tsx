import React from 'react';
import { Modal, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, ButtonText } from '@/components/ui/button';
import { Category } from '@/services/categoryService';

interface CategoryPickerModalProps {
  visible: boolean;
  categories: Category[];
  selectedCategoryId?: number;
  onSelectCategory: (categoryId: number) => void;
  onClose: () => void;
}

const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  visible,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
        <View className="w-4/5 bg-white rounded-lg p-5">
          <Text className="text-lg mb-2">Select a category</Text>
          <Picker
            selectedValue={selectedCategoryId?.toString() || ''}
            onValueChange={(value: string) => onSelectCategory(Number(value))}
          >
            <Picker.Item label="Select a category" value="" enabled={false} />
            {categories.map((category) => (
              <Picker.Item
                key={category.id}
                label={category.title!}
                value={category.id!.toString()}
              />
            ))}
          </Picker>
          <Button className="mt-4 bg-blue-300 rounded-xl" onPress={onClose}>
            <ButtonText className="font-medium text-sm">Done</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryPickerModal;