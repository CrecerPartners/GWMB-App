import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Animated, Platform, StyleSheet, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tapFeedback } from '@/lib/feedback';
import { colors, fonts } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function AnimatedTabIcon({ color, focused, name, focusedName, showDot }: { color: ColorValue; focused: boolean; name: IconName; focusedName?: IconName; showDot?: boolean }) {
  const [progress] = useState(() => new Animated.Value(focused ? 1 : 0));

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      speed: 24,
      bounciness: 7,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [focused, progress]);

  return <Animated.View style={[styles.iconShell, { transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [1, -2] }) }, { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }] }]}>
    <Animated.View style={[styles.activePill, { opacity: progress, transform: [{ scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [.72, 1] }) }] }]}/>
    <Ionicons name={focused && focusedName ? focusedName : name} color={color} size={21} />
    {showDot ? <View style={[styles.updateDot, focused && styles.updateDotFocused]}/> : null}
  </Animated.View>;
}

const icon = (name: IconName, focusedName?: IconName, showDot = false) =>
  function TabIcon({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
    void size;
    return <AnimatedTabIcon color={color} focused={focused} name={name} focusedName={focusedName} showDot={showDot}/>;
  };

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenListeners={{ tabPress: () => { void tapFeedback(); } }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.pinkDeep,
        tabBarInactiveTintColor: '#746D71',
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: { paddingTop: 5 },
        tabBarLabelStyle: { fontSize: 10, lineHeight: 13, fontFamily: fonts.bodySemibold, marginTop: 2 },
        tabBarStyle: {
          height: 64 + Math.max(insets.bottom, 8),
          paddingTop: 5,
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 12,
          shadowColor: '#2B1922',
          shadowOpacity: .08,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: -5 },
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen name="grow" options={{ title: 'Grow', tabBarIcon: icon('trending-up-outline', 'trending-up') }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: icon('people-outline', 'people') }} />
      <Tabs.Screen name="opportunities" options={{ title: 'Opportunities', tabBarIcon: icon('briefcase-outline', 'briefcase', true) }} />
      <Tabs.Screen name="profile" options={{ title: 'My GWMB', tabBarIcon: icon('sparkles-outline', 'sparkles') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconShell: {
    width: 44,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    width: 44,
    height: 31,
    borderRadius: 12,
    backgroundColor: colors.pinkSoft,
  },
  updateDot: {
    position: 'absolute',
    right: 7,
    top: 3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.pink,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  updateDotFocused: {
    borderColor: colors.pinkSoft,
  },
});
