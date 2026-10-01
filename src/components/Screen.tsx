import type { PropsWithChildren } from 'react';
import { Platform, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type Props = PropsWithChildren<ScrollViewProps & { scroll?: boolean }>;

export function Screen({ children, scroll = true, contentContainerStyle, ...props }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          {...props}
        >
          <View style={[styles.inner, Platform.OS === 'web' && styles.webInner]}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.scrollContent, styles.fill]}><View style={[styles.inner, styles.fill, Platform.OS === 'web' && styles.webInner]}>{children}</View></View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { width: '100%', alignItems: 'center', paddingTop: 10, paddingBottom: 32 },
  inner: { width: '92%', maxWidth: 520, minWidth: 0 },
  webInner: {
    width: '92%',
    maxWidth: 520,
    minWidth: 0,
  },
  fill: { flex: 1 },
});
