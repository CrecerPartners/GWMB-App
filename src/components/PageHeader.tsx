import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

export function PageHeader({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" hitSlop={10} onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={20} color={colors.ink} />
      </Pressable>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.balance} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, alignItems: 'center' },
  eyebrow: { color: colors.pinkDeep, fontSize: 9, fontFamily: fonts.bodyBold, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: colors.ink, fontSize: 14, fontFamily: fonts.headingBold, marginTop: 2 },
  balance: { width: 42 },
});
