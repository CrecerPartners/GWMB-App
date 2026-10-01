import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

type Props = { value: number; height?: number; color?: string; trackColor?: string; style?: StyleProp<ViewStyle> };

export function AnimatedProgress({ value, height = 5, color = '#E62B7F', trackColor = '#E9E5E7', style }: Props) {
  const [progress] = useState(() => new Animated.Value(0));
  const safeValue = Math.max(0, Math.min(100, value));
  useEffect(() => { Animated.timing(progress, { toValue: safeValue, duration: 720, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(); }, [progress, safeValue]);
  return <Animated.View style={[styles.track, { height, backgroundColor: trackColor }, style]}><Animated.View style={[styles.fill, { backgroundColor: color, width: progress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}/></Animated.View>;
}
const styles = StyleSheet.create({ track:{width:'100%',borderRadius:999,overflow:'hidden'}, fill:{height:'100%',borderRadius:999} });
