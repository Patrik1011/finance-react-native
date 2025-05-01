import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upgradeUser, downgradeUser } from '@/services/userService';
import { Role } from '@/utils/types/enums';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);

  const upgradeUserMutation = useMutation({
    mutationFn: upgradeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      Alert.alert('Success', 'Your account has been upgraded to Premium!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to upgrade account. Please try again.');
    }
  });

  const downgradeUserMutation = useMutation({
    mutationFn: downgradeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      Alert.alert('Success', 'Your account has been downgraded to Basic.');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to downgrade account. Please try again.');
    }
  });

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpgrade = () => {
    upgradeUserMutation.mutate();
  };

  const handleDowngrade = () => {
    Alert.alert(
      'Confirm Downgrade',
      'Are you sure you want to downgrade your account? You will lose access to premium features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Downgrade', 
          style: 'destructive',
          onPress: () => downgradeUserMutation.mutate()
        }
      ]
    );
  };

  return (
    <View className="flex-1 p-4 mt-20">
      <View className="mb-8">
        <Text className="text-2xl font-bold mb-4 text-typography-900">Profile</Text>
        {user && (
          <View className="mb-4">
            <Text className="text-base mb-2 text-black">Email: {user.email}</Text>
            <Text className="text-base mb-2 text-black">
              Account Type: {user.role === Role.PremiumUser ? 'Premium subscription' : 'Basic subscription'}
            </Text>
          </View>
        )}
      </View>

      <View className="gap-4">
        {user?.role === Role.PremiumUser ? (
          <Button
            onPress={handleDowngrade}
            disabled={downgradeUserMutation.isPending}
            className="bg-warning-500 rounded-lg"
          >
            <ButtonText className="text-white p-2">
              {downgradeUserMutation.isPending ? 'Processing...' : 'Downgrade to Basic'}
            </ButtonText>
          </Button>
        ) : (
          <Button
            onPress={handleUpgrade}
            disabled={upgradeUserMutation.isPending}
            className="bg-primary-500 rounded-lg"
          >
            <ButtonText className="text-white">
              {upgradeUserMutation.isPending ? 'Processing...' : 'Upgrade to Premium'}
            </ButtonText>
          </Button>
        )}

        <Button
          onPress={handleLogout}
          className="bg-error-500 rounded-lg"
        >
          <ButtonText className="text-white">Logout</ButtonText>
        </Button>
      </View>
    </View>
  );
}