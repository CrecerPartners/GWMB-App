import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';

import { colors } from '@/theme';
import { AuthProvider } from '@/providers/AuthProvider';
import { AuthDeepLinkHandler } from '@/components/AuthDeepLinkHandler';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold });
  if (!fontsLoaded && !fontError) return null;
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthDeepLinkHandler />
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="membership" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="course/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="event/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="events" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="registration/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="reset-password" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
