import React, { useState, useEffect, useRef } from 'react';

import { X } from 'lucide-react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
} from 'react-native';

interface FlavorAddModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, score: number) => void;
  categoryName: string;
  color: string;
}

export function FlavorAddModal({
  visible,
  onClose,
  onSave,
  categoryName,
  color,
}: FlavorAddModalProps) {
  const [name, setName] = useState('');
  const [score, setScore] = useState(5);

  const sliderWidthRef = useRef(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    if (visible) {
      setName('');
      setScore(5);
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleGesture(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleGesture(evt.nativeEvent.locationX),
    }),
  ).current;

  const handleGesture = (x: number) => {
    const width = sliderWidthRef.current;
    if (width === 0) return;

    let percentage = x / width;
    percentage = Math.max(0, Math.min(1, percentage));

    const newScore = 1 + (10 - 1) * percentage;
    setScore(Math.round(newScore));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), score);
    onClose();
  };

  // 슬라이더 UI 계산
  // 현재 점수가 전체의 몇 % 위치인지 (1점=0%, 10점=100%)
  const scorePercentage = (score - 1) / 9;
  const knobSize = 28; // 손잡이 크기

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="bg-background rounded-t-3xl p-6 pb-10 shadow-2xl">
          {/* 헤더 */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-foreground">
              {categoryName} 요소 추가
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} className="text-muted-foreground" />
            </TouchableOpacity>
          </View>

          {/* 1. 이름 입력 */}
          <Text className="text-sm font-medium text-muted-foreground mb-2">
            어떤 느낌인가요?
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="예: 스모키, 바닐라, 짠맛 등"
            placeholderTextColor="#a1a1aa"
            className="bg-muted/50 p-4 rounded-xl text-lg text-foreground mb-6 border border-border/50"
            autoFocus={visible}
            onSubmitEditing={handleSave}
          />

          {/* 2. 강도(점수) 선택 - 드래그 슬라이더 */}
          <View className="mb-8">
            <View className="flex-row justify-between items-end mb-3">
              <Text className="text-sm font-medium text-muted-foreground">
                강도 선택
              </Text>
              <Text className="text-2xl font-extrabold" style={{ color }}>
                {score}
              </Text>
            </View>

            {/* 🎚️ 슬라이더 컨테이너 (터치 영역) */}
            <View
              className="h-12 justify-center" // 터치 영역을 높게 잡아서 조작하기 쉽게 함
              {...panResponder.panHandlers}
              onLayout={(e) => {
                // 실제 너비 측정 후 저장
                sliderWidthRef.current = e.nativeEvent.layout.width;
                setSliderWidth(e.nativeEvent.layout.width); // 리렌더링 트리거
              }}
            >
              {/* 배경 트랙 (회색 바) */}
              <View className="h-2 bg-muted rounded-full overflow-hidden">
                {/* 채워진 트랙 (색상 바) */}
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${scorePercentage * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </View>

              {sliderWidth > 0 && (
                <View
                  className="absolute bg-background rounded-full border-[3px] shadow-sm z-10"
                  style={{
                    width: knobSize,
                    height: knobSize,
                    borderColor: color,
                    left: sliderWidth * scorePercentage - knobSize / 2,
                  }}
                />
              )}
            </View>

            <View className="flex-row justify-between px-1 mt-1">
              <Text className="text-xs text-muted-foreground font-bold">1</Text>
              <Text className="text-xs text-muted-foreground font-bold">
                10
              </Text>
            </View>
          </View>

          {/* 저장 버튼 */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!name.trim()}
            className={`w-full py-4 rounded-xl items-center justify-center ${
              name.trim() ? 'bg-foreground' : 'bg-muted'
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-background font-bold text-lg">추가하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
