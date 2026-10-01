import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '@/theme';

type Props = PropsWithChildren<{ eyebrow: string; title: string; description: string; showBack?: boolean }>;

export function AuthScreen({ eyebrow, title, description, showBack = true, children }: Props) {
  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.top}>{showBack ? <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.ink} /></Pressable> : <View />}<View style={styles.mark}><Text style={styles.markText}>GWMB</Text></View></View><View style={styles.intro}><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text></View>{children}</ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe:{flex:1,backgroundColor:colors.canvas},fill:{flex:1},content:{flexGrow:1,padding:20,paddingBottom:36},top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center'},mark:{minWidth:58,height:31,paddingHorizontal:9,borderRadius:10,backgroundColor:colors.ink,alignItems:'center',justifyContent:'center'},markText:{color:'white',fontSize:10,fontFamily:fonts.heading,letterSpacing:.6},intro:{marginTop:45,marginBottom:27},eyebrow:{color:colors.pinkDeep,fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:1.2,textTransform:'uppercase'},title:{color:colors.ink,fontSize:34,lineHeight:38,fontFamily:fonts.heading,letterSpacing:-1.4,marginTop:8},description:{color:colors.muted,fontSize:13,lineHeight:20,fontFamily:fonts.body,marginTop:11,maxWidth:330} });
