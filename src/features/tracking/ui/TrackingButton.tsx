import { useCallback, useRef, useState } from 'react';

import * as Location from 'expo-location';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Text } from '@/shared/ui/text';

import { calcDistanceKm } from '../lib/distance';

export interface TrackingResult {
  km: number;
  startedAt: string;
  endedAt: string;
}

interface TrackingButtonProps {
  onStop: (result: TrackingResult) => void;
}

export function TrackingButton({ onStop }: TrackingButtonProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentKm, setCurrentKm] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);

  const startedAtRef = useRef<string>('');
  const lastPositionRef = useRef<{ lat: number; lon: number } | null>(null);
  const totalKmRef = useRef(0);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const startTracking = useCallback(async () => {
    setIsRequesting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }

      startedAtRef.current = new Date().toISOString();
      totalKmRef.current = 0;
      lastPositionRef.current = null;
      setCurrentKm(0);
      setIsTracking(true);

      watchRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          if (lastPositionRef.current) {
            const delta = calcDistanceKm(
              lastPositionRef.current.lat,
              lastPositionRef.current.lon,
              latitude,
              longitude
            );
            totalKmRef.current += delta;
            setCurrentKm(totalKmRef.current);
          }
          lastPositionRef.current = { lat: latitude, lon: longitude };
        }
      );
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const stopTracking = useCallback(() => {
    watchRef.current?.remove();
    watchRef.current = null;
    setIsTracking(false);

    onStop({
      km: totalKmRef.current,
      startedAt: startedAtRef.current,
      endedAt: new Date().toISOString(),
    });
  }, [onStop]);

  if (isRequesting) {
    return (
      <View className="items-center gap-2">
        <ActivityIndicator size="large" />
        <Text className="text-sm text-gray-500">권한 확인 중...</Text>
      </View>
    );
  }

  if (isTracking) {
    return (
      <View className="items-center gap-3">
        <Text className="text-3xl font-bold text-primary">{currentKm.toFixed(2)} km</Text>
        <Pressable
          onPress={stopTracking}
          className="rounded-2xl bg-red-500 px-8 py-4 active:bg-red-600"
        >
          <Text className="text-lg font-bold text-white">라이딩 종료</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="items-center">
      <Pressable
        onPress={startTracking}
        className="rounded-2xl bg-primary px-8 py-4 active:bg-primary/90"
      >
        <Text className="text-lg font-bold text-white">라이딩 시작</Text>
      </Pressable>
    </View>
  );
}
