import { useAdminImagesQuery } from '@/tanstack-query/admin';
import React, { useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';

export default function AdminImagesScreen() {
  const { data, isLoading, isError, error } = useAdminImagesQuery();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-error-600 text-base text-center">Error: {(error as Error).message}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-typography-600 text-base text-center">No images found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-2.5 bg-background-50">
      <Text className="text-xl font-bold mb-4 text-center">All User Images</Text>
      
      {selectedImageUrl && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-10 justify-center items-center">
          <Pressable 
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/70" 
            onPress={() => setSelectedImageUrl(null)}
          />
          <View className="w-[90%] h-[70%] bg-white rounded-lg p-2.5 items-center justify-center">
            <Image 
              source={{ uri: selectedImageUrl }} 
              className="w-full h-[90%]"
              resizeMode="contain"
            />
            <Pressable 
              className="mt-2.5 py-2 px-5 bg-error-500 rounded"
              onPress={() => setSelectedImageUrl(null)}
            >
              <Text className="text-white font-bold">Close</Text>
            </Pressable>
          </View>
        </View>
      )}
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.entryId.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable 
            className="flex-1 m-1.5 rounded-lg overflow-hidden bg-white shadow-soft-1"
            onPress={() => setSelectedImageUrl(item.imageUrl)}
          >
            <Image 
              source={{ uri: item.imageUrl }} 
              className="w-full h-[150px] rounded-t-lg" 
              resizeMode="cover"
            />
            <Text className="p-2 text-xs text-center text-typography-500">Entry #{item.entryId}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}