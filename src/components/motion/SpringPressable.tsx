import { useState, type PropsWithChildren } from 'react';
import { Animated, Platform, Pressable, type AccessibilityRole, type StyleProp, type ViewStyle } from 'react-native';

type Props = PropsWithChildren<{ onPress?: () => void; style?: StyleProp<ViewStyle>; contentStyle?: StyleProp<ViewStyle>; scaleTo?: number; accessibilityLabel?: string; accessibilityRole?: AccessibilityRole; disabled?: boolean }>;

export function SpringPressable({ children, onPress, style, contentStyle, scaleTo = 0.975, accessibilityLabel, accessibilityRole = 'button', disabled }: Props) {
  const [scale] = useState(() => new Animated.Value(1));
  const animate = (toValue: number) => Animated.spring(scale, { toValue, speed: 34, bounciness: 5, useNativeDriver: Platform.OS !== 'web' }).start();
  return <Animated.View style={[style, { transform: [{ scale }] }]}><Pressable accessibilityLabel={accessibilityLabel} accessibilityRole={accessibilityRole} disabled={disabled} onPress={onPress} onPressIn={() => animate(scaleTo)} onPressOut={() => animate(1)} style={[{ flex: 1 },contentStyle]}>{children}</Pressable></Animated.View>;
}
