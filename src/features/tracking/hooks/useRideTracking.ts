import { useCallback, useRef, useState } from 'react';

import * as Location from 'expo-location';

import { getDistanceMeters, requestLocationPermission } from '@/shared/lib/location';

type TrackingState = 'idle' | 'riding' | 'stopped';

export function useRideTracking() {
  const [state, setState] = useState<TrackingState>('idle');
  const [totalKm, setTotalKm] = useState(0);
  const [error, setError] = useState('');

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const lastPositionRef = useRef<{ lat: number; lon: number } | null>(null);
  const accumulatedRef = useRef(0);

  const start = useCallback(async () => {
    setError('');
    const granted = await requestLocationPermission();
    if (!granted) {
      setError('위치 권한이 필요합니다.');
      return;
    }

    lastPositionRef.current = null;
    accumulatedRef.current = 0;
    setTotalKm(0);
    setState('riding');

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 10, // 10m 이상 이동 시 업데이트
        timeInterval: 3000,
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        const prev = lastPositionRef.current;

        if (prev) {
          const meters = getDistanceMeters(prev.lat, prev.lon, latitude, longitude);
          // 노이즈 필터: 200m 이상 급변하면 무시
          if (meters < 200) {
            accumulatedRef.current += meters;
            setTotalKm(accumulatedRef.current / 1000);
          }
        }

        lastPositionRef.current = { lat: latitude, lon: longitude };
      }
    );
  }, []);

  const stop = useCallback((): number => {
    watchRef.current?.remove();
    watchRef.current = null;
    lastPositionRef.current = null;
    setState('stopped');
    return accumulatedRef.current / 1000;
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setTotalKm(0);
    accumulatedRef.current = 0;
    setError('');
  }, []);

  return { state, totalKm, error, start, stop, reset };
}
