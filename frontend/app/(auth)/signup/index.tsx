import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { fetchClient } from '@/services/fetchClient';
import { Role } from '@/utils/types/enums';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const validateForm = () => {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.trim()) return "Email is required";
    if (!username.trim()) return "Username is required";
    if (!password.trim()) return "Password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    
    return null;
  };

  const handleSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const signupData = {
        firstName,
        lastName,
        email,
        username,
        password,
        role: Role.User 
      };

      await fetchClient('/auth/signup', {
        method: 'POST',
        body: signupData,
      });
      
      // On successful signup, navigate to login screen
      router.replace('/(auth)/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center px-6 py-10 bg-background-0">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-typography-900 mb-2 text-center">
            Create Account
          </Text>
          <Text className="text-typography-600 text-center">
            Fill in your details to get started
          </Text>
        </View>

        {error && (
          <View className="mb-4 p-3 bg-error-100 rounded-lg">
            <Text className="text-error-700">{error}</Text>
          </View>
        )}

        <View className="space-y-3">
          
        <View>
            <Input className="bg-background-100 rounded-lg h-14">
              <InputField
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#9CA3AF"
                className="flex-1 p-4 text-base"
              />
            </Input>
          </View>

          <View className="mt-2">
            <Input className="bg-background-100 rounded-lg h-14">
              <InputField
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#9CA3AF"
                className="flex-1 p-4 text-base"
              />
            </Input>
          </View>

          <View className="mt-2">
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

          <View className="mt-2">
            <Input className="bg-background-100 rounded-lg h-14">
              <InputField
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
                className="flex-1 p-4 text-base"
              />
            </Input>
          </View>

          <View className="mt-2">
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

          <View className="mt-2">
            <Input className="bg-background-100 rounded-lg h-14">
              <InputField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
                className="flex-1 p-4 text-base"
              />
            </Input>
          </View>

          <Button
            onPress={handleSignup}
            disabled={loading}
            className="bg-primary-500 rounded-lg mt-2"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ButtonText className="text-white font-medium">Create Account</ButtonText>
            )}
          </Button>

          <View className="flex-row justify-center mt-4">
            <Text className="text-typography-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text className="text-primary-600 font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}