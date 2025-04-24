import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await dispatch(login({ email, password })).unwrap();
      // After successful login, redirect to the home page
      router.replace('/_app-layout');
    } catch (error) {
      // Error is already handled in the slice
      console.error('Login failed:', error);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-background-0">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-typography-900 mb-2 text-center">
          Welcome Back
        </Text>
        <Text className="text-typography-600 text-center">
          Please sign in to continue
        </Text>
      </View>

      {error && (
        <View className="mb-4 p-3 bg-error-100 rounded-lg">
          <Text className="text-error-700">{error}</Text>
        </View>
      )}

      <View>
          <Input className="bg-background-100 rounded-lg h-14">
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
              className="flex-1 p-4 text-base"
            />
          </Input>
        </View>

        <View className='mt-2'>
          <Input className="bg-background-100 rounded-lg h-14">
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              className="flex-1 p-4 text-base"
            />
          </Input>
        </View>

        <Button
          onPress={handleLogin}
          disabled={loading}
          className="bg-primary-500 rounded-lg mt-2"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ButtonText className="text-white font-medium">Sign In</ButtonText>
          )}
        </Button>

        <View className="flex-row justify-center mt-4">
          <Text className="text-typography-600">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
            <Text className="text-primary-600 font-medium">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}
