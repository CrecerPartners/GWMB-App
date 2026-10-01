import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { colors, fonts } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const icon = (name: IconName, focusedName?: IconName) =>
  function TabIcon({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
    return <Ionicons name={focused && focusedName ? focusedName : name} color={color} size={size} />;
  };

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.pinkDeep,
        tabBarInactiveTintColor: '#918A8E',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 9, fontFamily: fonts.bodySemibold, marginBottom: 3 },
        tabBarStyle: { height: 72, paddingTop: 8, backgroundColor: colors.surface, borderTopColor: colors.line },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen name="grow" options={{ title: 'Grow', tabBarIcon: icon('trending-up-outline', 'trending-up') }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: icon('people-outline', 'people') }} />
      <Tabs.Screen name="opportunities" options={{ title: 'Opportunities', tabBarIcon: icon('briefcase-outline', 'briefcase') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person-outline', 'person') }} />
    </Tabs>
  );
}
