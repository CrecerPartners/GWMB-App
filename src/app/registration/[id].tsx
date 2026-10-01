import { Ionicons } from '@expo/vector-icons';
import { router as expoRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { CelebrationBurst } from '@/components/motion/Celebration';
import { FadeIn } from '@/components/motion/FadeIn';
import { eventById } from '@/data/events';
import { loadEventRegistration, registerForEvent, type EventRegistration } from '@/lib/event-store';
import { successFeedback } from '@/lib/feedback';
import { useAuth } from '@/providers/AuthProvider';
import { colors, fonts } from '@/theme';

const router = { replace: (href: string) => expoRouter.replace(href as never) };

export default function Registration() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = eventById[id] ?? eventById['product-manager'];
  const { user, profile, membership } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ registration: EventRegistration; cloud: boolean } | null>(null);
  const waitlist = event.bookingMode === 'waitlist';

  useEffect(() => {
    if (!user) return;
    loadEventRegistration(user.id, event.id).then(({ registration }) => {
      setName((current) => current || profile?.full_name || '');
      setEmail((current) => current || user.email || '');
      if (registration && registration.status !== 'cancelled') setResult({ registration, cloud: true });
    });
  }, [event.id, profile?.full_name, user]);

  async function submit() {
    setMessage(null);
    if (!user) { router.replace('/sign-in'); return; }
    if (event.access === 'Members Only' && membership?.status !== 'verified') { router.replace('/membership'); return; }
    if (name.trim().length < 2) { setMessage('Enter your full name.'); return; }
    if (!email.includes('@')) { setMessage('Enter a valid email address.'); return; }
    setSubmitting(true);
    const response = await registerForEvent({ userId: user.id, eventId: event.id, fullName: name.trim(), email: email.trim().toLowerCase(), learningGoal: goal.trim(), status: waitlist ? 'waitlisted' : 'registered' });
    setSubmitting(false);
    if (!response.ok) { setMessage('You already have an active registration for this event.'); return; }
    setResult({ registration: response.registration, cloud: response.cloud });
    void successFeedback();
  }

  if (!user) return <Screen><PageHeader title="Register"/><View style={styles.signedOut}><View style={styles.signedOutIcon}><Ionicons name="person-outline" size={28} color={colors.pinkDeep}/></View><Text style={styles.signedOutTitle}>Sign in to save your place</Text><Text style={styles.signedOutCopy}>Your registration, reminders and event updates stay linked to your GWMB account.</Text><Pressable onPress={() => router.replace('/sign-in')} style={styles.cta}><Text style={styles.ctaText}>Sign in to continue</Text><Ionicons name="arrow-forward" size={18} color="white"/></Pressable></View></Screen>;

  if (result) { const isWaitlisted = result.registration.status === 'waitlisted'; return <Screen><PageHeader title="Registration"/><CelebrationBurst visible title={isWaitlisted ? 'You’re on the list.' : 'Your place is confirmed!'} copy={isWaitlisted ? 'We’ll let you know as soon as a place becomes available.' : 'That’s one more brilliant room you’ve put yourself in.'}/><FadeIn delay={180}><View style={styles.eventSummary}><View style={styles.date}><Text style={styles.day}>{event.day}</Text><Text style={styles.month}>{event.month}</Text></View><View style={styles.summaryCopy}><Text style={styles.summaryTitle}>{event.title}</Text><Text style={styles.summaryMeta}>{event.dateShort} · {event.location}</Text></View></View>{!result.cloud ? <View style={styles.syncNote}><Ionicons name="phone-portrait-outline" size={17} color={colors.pinkDeep}/><Text style={styles.syncText}>Saved on this device. Run the event registration Supabase migration to enable cross-device sync.</Text></View> : null}<Pressable onPress={() => router.replace('/events?tab=my')} style={styles.cta}><Text style={styles.ctaText}>View My Events</Text><Ionicons name="arrow-forward" size={18} color="white"/></Pressable><Pressable onPress={() => router.replace(`/event/${event.id}`)} style={styles.secondary}><Text style={styles.secondaryText}>Back to event details</Text></Pressable></FadeIn></Screen>; }

  return <Screen><PageHeader title={waitlist ? 'Join Waitlist' : 'Register'}/><View style={styles.hero}><View style={styles.icon}><Ionicons name={waitlist ? 'time' : 'checkmark'} size={24} color="white"/></View><Text style={styles.kicker}>{waitlist ? 'BE NEXT IN LINE' : 'SAVE YOUR SPOT'}</Text><Text style={styles.title}>{event.title}</Text><Text style={styles.copy}>{waitlist ? 'Join the waitlist and we’ll contact you if a place becomes available.' : 'Confirm your details below. We’ll send joining information and reminders to your email.'}</Text></View><View style={styles.eventMeta}><Ionicons name="calendar-outline" size={18} color={colors.pinkDeep}/><Text style={styles.eventMetaText}>{event.date} · {event.location}</Text></View><Text style={styles.label}>FULL NAME</Text><TextInput value={name} onChangeText={setName} placeholder="Your full name" placeholderTextColor={colors.muted} style={styles.input}/><Text style={styles.label}>EMAIL ADDRESS</Text><TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" style={styles.input}/><Text style={styles.label}>WHAT DO YOU HOPE TO LEARN? · OPTIONAL</Text><TextInput value={goal} onChangeText={setGoal} placeholder="Share a short note" placeholderTextColor={colors.muted} multiline maxLength={1000} style={[styles.input,styles.notes]}/>{message ? <View style={styles.message}><Text style={styles.messageText}>{message}</Text></View> : null}<Pressable disabled={submitting} onPress={submit} style={[styles.cta, submitting && styles.disabled]}>{submitting ? <ActivityIndicator color="white"/> : <><Text style={styles.ctaText}>{waitlist ? 'Join the waitlist' : 'Complete registration'}</Text><Ionicons name="arrow-forward" size={18} color="white"/></>}</Pressable><Text style={styles.note}>Registration does not change or verify your GWMB membership status.</Text></Screen>;
}

const styles = StyleSheet.create({hero:{borderRadius:24,backgroundColor:colors.ink,padding:22,marginBottom:14},icon:{width:46,height:46,borderRadius:15,backgroundColor:colors.pink,alignItems:'center',justifyContent:'center'},kicker:{color:'#F5A4CA',fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:1.1,marginTop:25},title:{color:'white',fontSize:24,lineHeight:28,fontFamily:fonts.heading,marginTop:7},copy:{color:'#D2CBD0',fontSize:10,lineHeight:17,fontFamily:fonts.body,marginTop:8},eventMeta:{minHeight:54,borderRadius:16,backgroundColor:colors.pinkSoft,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:10},eventMetaText:{color:colors.ink,fontSize:9,lineHeight:14,fontFamily:fonts.bodyBold,flex:1},label:{color:colors.ink,fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:.7,marginBottom:7,marginTop:13},input:{height:54,borderRadius:16,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,paddingHorizontal:14,fontSize:11,fontFamily:fonts.body,color:colors.ink},notes:{height:105,paddingTop:15,textAlignVertical:'top'},message:{borderRadius:13,backgroundColor:'#FFF0F3',padding:11,marginTop:12},messageText:{color:'#A41449',fontSize:9,fontFamily:fonts.bodyMedium},cta:{minHeight:55,borderRadius:17,backgroundColor:colors.pinkDeep,paddingHorizontal:17,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:22},disabled:{opacity:.65},ctaText:{color:'white',fontSize:12,fontFamily:fonts.bodyBold},note:{fontSize:9,lineHeight:13,fontFamily:fonts.body,color:colors.muted,textAlign:'center',marginTop:12},signedOut:{marginTop:40,borderRadius:24,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,padding:22,alignItems:'center'},signedOutIcon:{width:64,height:64,borderRadius:22,backgroundColor:colors.pinkSoft,alignItems:'center',justifyContent:'center'},signedOutTitle:{color:colors.ink,fontSize:21,fontFamily:fonts.heading,textAlign:'center',marginTop:18},signedOutCopy:{color:colors.muted,fontSize:10,lineHeight:17,fontFamily:fonts.body,textAlign:'center',marginTop:7},successHero:{borderRadius:25,backgroundColor:colors.ink,padding:23,marginTop:5},successIcon:{width:54,height:54,borderRadius:18,backgroundColor:colors.pink,alignItems:'center',justifyContent:'center'},successKicker:{color:'#F4A7CA',fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:1.1,marginTop:25},successTitle:{color:'white',fontSize:27,lineHeight:31,fontFamily:fonts.heading,marginTop:7},successCopy:{color:'#D5CED1',fontSize:10,lineHeight:17,fontFamily:fonts.body,marginTop:8},eventSummary:{borderRadius:20,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,padding:13,flexDirection:'row',alignItems:'center',marginTop:14},date:{width:56,height:60,borderRadius:15,backgroundColor:colors.pinkSoft,alignItems:'center',justifyContent:'center'},day:{color:colors.pinkDeep,fontSize:22,fontFamily:fonts.heading},month:{color:colors.pinkDeep,fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:.8},summaryCopy:{flex:1,paddingLeft:12},summaryTitle:{color:colors.ink,fontSize:12,lineHeight:16,fontFamily:fonts.headingBold},summaryMeta:{color:colors.muted,fontSize:9,lineHeight:13,fontFamily:fonts.body,marginTop:5},syncNote:{borderRadius:15,backgroundColor:colors.pinkSoft,padding:12,flexDirection:'row',gap:9,alignItems:'center',marginTop:11},syncText:{color:colors.muted,fontSize:9,lineHeight:13,fontFamily:fonts.body,flex:1},secondary:{minHeight:48,alignItems:'center',justifyContent:'center'},secondaryText:{color:colors.pinkDeep,fontSize:10,fontFamily:fonts.bodyBold}});
