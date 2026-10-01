import { useEffect, useState, type PropsWithChildren } from 'react';
import { Animated, Easing, Platform, type StyleProp, type ViewStyle } from 'react-native';

type Props = PropsWithChildren<{ delay?: number; distance?: number; style?: StyleProp<ViewStyle> }>;

export function FadeIn({ children, delay = 0, distance = 14, style }: Props) {
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(progress, { toValue: 1, duration: 430, delay, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' });
    animation.start();
    return () => animation.stop();
  }, [delay, progress]);
  return <Animated.View style={[style, { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] }]}>{children}</Animated.View>;
}
