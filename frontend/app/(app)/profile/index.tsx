import React from 'react';
import { View, Text } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { AppDispatch } from '@/redux/store';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl mb-4 text-typography-900">Profile</Text>
      <Button
        onPress={handleLogout}
        className="bg-error-500 p-3 rounded-lg mt-2"
      >
        <ButtonText className="text-white">Logout</ButtonText>
      </Button>
    </View>
  );
}
