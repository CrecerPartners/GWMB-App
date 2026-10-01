import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export async function tapFeedback(){if(Platform.OS==='web')return;await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);}
export async function successFeedback(){if(Platform.OS==='web')return;await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);}
