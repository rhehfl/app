import React from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';

interface AddWhiskyPhotoProps {
  imageUri: string | null;
  onImageSelect: (uri: string) => void;
}

export function AddWhiskyPhoto({
  imageUri,
  onImageSelect,
}: AddWhiskyPhotoProps) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 올리려면 앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onImageSelect(result.assets[0].uri);
    }
  };

  return (
    <View className="items-center w-full mb-8">
      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={0.8}
        className={`w-40 h-40 rounded-3xl overflow-hidden bg-muted/30 items-center justify-center ${!imageUri ? 'border-2 border-dashed border-muted-foreground/30' : ''}`}
      >
        {imageUri ? (
          <>
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 w-full h-8 bg-black/40 items-center justify-center">
              <Text className="text-white text-xs font-medium">사진 변경</Text>
            </View>
          </>
        ) : (
          <View className="items-center gap-2">
            <View className="w-12 h-12 rounded-full bg-muted items-center justify-center">
              <Camera size={24} className="text-muted-foreground" />
            </View>
            <Text className="text-sm font-medium text-muted-foreground">
              사진 추가
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
