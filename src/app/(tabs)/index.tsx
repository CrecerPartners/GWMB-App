import { Ionicons } from '@expo/vector-icons';
import { router as expoRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors, fonts, radius } from '@/theme';
import { useAuth } from '@/providers/AuthProvider';
import { courses } from '@/data/courses';
import { coursePercent, loadCourseProgress, type CourseProgress } from '@/lib/course-progress';
import { eventById } from '@/data/events';
import { loadEventRegistrations, type EventRegistration } from '@/lib/event-store';

const router = { push: (href: string) => expoRouter.push(href as never) };

const benefits = [
  ['Career', 'briefcase-outline'],
  ['Mentorship', 'people-outline'],
  ['Skills', 'play-circle-outline'],
  ['Money', 'wallet-outline'],
  ['Leadership', 'sparkles-outline'],
  ['Personal Growth', 'locate-outline'],
  ['Sisterhood', 'heart-outline'],
  ['Opportunities', 'telescope-outline'],
] as const;

export default function HomeScreen() {
  const { user, profile, membership } = useAuth();
  const [courseProgress,setCourseProgress]=useState<CourseProgress|null>(null);
  const [eventRegistrations,setEventRegistrations]=useState<EventRegistration[]>([]);
  const cvCourse=courses['workplace-foundations'];
  const userId=user?.id;
  useFocusEffect(useCallback(()=>{let active=true;if(!userId){setCourseProgress(null);return()=>{active=false};}loadCourseProgress(userId,cvCourse.id).then(result=>{if(active)setCourseProgress(result.progress)});return()=>{active=false};},[cvCourse.id,userId]));
  useFocusEffect(useCallback(()=>{let active=true;if(!userId){setEventRegistrations([]);return()=>{active=false};}loadEventRegistrations(userId).then(result=>{if(active)setEventRegistrations(result.registrations)});return()=>{active=false};},[userId]));
  const cvPercent=coursePercent(courseProgress,cvCourse.lessons.length);
  const currentLessonIndex=Math.max(0,cvCourse.lessons.findIndex(item=>!courseProgress?.completed_lesson_ids.includes(item.id)));
  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Girlie';
  const initials = profile?.full_name?.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'GW';
  const membershipLabel = membership?.status === 'verified' ? `Active Member${profile?.city_club ? ` · ${profile.city_club}` : ''}` : user ? 'Guest account · Membership not verified' : 'Guest access · Create an account to save progress';
  const nextRegistration=eventRegistrations.find(item=>item.status!=='cancelled'&&eventById[item.event_id]?.lifecycle==='upcoming');
  const nextEvent=nextRegistration?eventById[nextRegistration.event_id]:null;
  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.greeting}>Hi, {firstName} 👋🏾</Text>
          <View style={styles.status}><View style={[styles.dot, membership?.status !== 'verified' && styles.guestDot]} /><Text numberOfLines={1} style={styles.statusText}>{membershipLabel}</Text></View>
          {!user ? <Pressable onPress={() => router.push('/welcome')} style={styles.accountCta}><Text style={styles.accountCtaText}>Sign in or create account</Text><Ionicons name="arrow-forward" size={13} color={colors.pinkDeep} /></Pressable> : null}
        </View>
        <View style={styles.headerActions}>
          <Pressable accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={21} color={colors.ink} />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable accessibilityLabel="Open profile" onPress={() => router.push('/profile')} style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}>
            {profile?.avatar_url?<Image source={{uri:profile.avatar_url}} style={styles.headerAvatarImage}/>:<Text style={styles.avatarText}>{initials}</Text>}{membership?.status === 'verified' ? <View style={styles.onlineDot} /> : null}
          </Pressable>
        </View>
      </View>

      {nextEvent && nextRegistration ? <><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Your next event</Text><Pressable onPress={() => router.push('/events?tab=my')}><Text style={styles.pinkLink}>My Events</Text></Pressable></View><Pressable onPress={() => router.push(`/event/${nextEvent.id}`)} style={({pressed})=>[styles.myEvent,pressed&&styles.myEventPressed]}><View style={[styles.myEventDate,{backgroundColor:nextEvent.tone}]}><Text style={styles.myEventDay}>{nextEvent.day}</Text><Text style={styles.myEventMonth}>{nextEvent.month}</Text></View><View style={styles.myEventBody}><View style={styles.myEventStatus}><Ionicons name={nextRegistration.status==='waitlisted'?'time':'checkmark'} size={10} color="#087553"/><Text style={styles.myEventStatusText}>{nextRegistration.status==='waitlisted'?'Waitlisted':'Registered'}</Text></View><Text style={styles.myEventTitle}>{nextEvent.title}</Text><Text style={styles.myEventMeta}>{nextEvent.dateShort} · {nextEvent.location}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted}/></Pressable></> : null}

      <View style={styles.benefitsPanel}>
        <View style={styles.benefitsHeading}><View><Text style={styles.eyebrow}>Your membership</Text><Text style={styles.sectionTitle}>Explore your benefits</Text></View><Text style={styles.swipe}>Swipe →</Text></View>
        <ScrollView horizontal style={styles.benefitsScroller} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.benefitsRow}>
          {benefits.map(([label, iconName]) => <Pressable key={label} accessibilityRole="button" onPress={() => label === 'Opportunities' ? router.push('/opportunities') : router.push('/membership')} style={({ pressed }) => [styles.benefitCard, pressed && styles.benefitCardPressed]}>{({ pressed }) => <><View style={[styles.benefitIcon, pressed && styles.benefitIconPressed]}><Ionicons name={iconName} size={18} color={pressed ? colors.pinkDeep : colors.ink}/></View><Text style={[styles.benefitTitle, pressed && styles.lightText]}>{label}</Text><Text style={[styles.benefitLink, pressed && styles.lightMuted]}>Explore</Text><View style={styles.cardOrbit}/></>}</Pressable>)}
        </ScrollView>
        <Pressable onPress={() => router.push('/membership')} style={({ pressed }) => [styles.fullBenefits, pressed && styles.fullBenefitsPressed]}><View><Text style={styles.fullBenefitsOverline}>All seven core benefits</Text><Text style={styles.fullBenefitsTitle}>View Full Benefits</Text></View><Ionicons name="arrow-forward" size={17} color="white"/></Pressable>
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>For you today</Text><View style={styles.progressBadge}><Text style={styles.progressBadgeText}>{cvPercent===100?'Completed':courseProgress?'In progress':'Open access'}</Text></View></View>
      <Pressable onPress={() => router.push('/course/workplace-foundations')} style={styles.dailyHero}>
        <View style={styles.heroOrbit}/><View style={styles.heroBadge}><Text style={styles.heroBadgeText}>{courseProgress?`Course · ${cvPercent}% complete`:'Open access course'}</Text></View><Text style={styles.dailyTitle}>Build a CV that gets noticed.</Text><Text style={styles.dailyCopy}>{cvPercent===100?'Your certificate is ready.':courseProgress?`Continue with lesson ${currentLessonIndex+1}: ${cvCourse.lessons[currentLessonIndex]?.title}.`:'Six practical lessons that help you present your experience clearly.'}</Text><View style={styles.dailyTrack}><View style={[styles.dailyProgress,{width:`${cvPercent}%`}]} /></View><View style={styles.continueButton}><Text style={styles.continueText}>{cvPercent===100?'View certificate':courseProgress?'Continue learning':'View course'}</Text><Ionicons name="arrow-forward" size={17} color={colors.ink}/></View>
      </Pressable>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Picked for you</Text><Pressable onPress={() => router.push('/grow')}><Text style={styles.pinkLink}>See all</Text></Pressable></View>
      <View style={styles.pickedRow}>
        <Pressable onPress={() => router.push('/event/product-manager')} style={({ pressed }) => [styles.pickedCard, pressed && styles.pickedCardPressed]}>
          <Image source={require('../../../assets/media/adeola-mentorship.png')} resizeMode="cover" style={styles.pickedImage}/>
          <View style={styles.pickedBody}><View style={styles.openBadge}><Text style={styles.openBadgeText}>Open Access</Text></View><Text numberOfLines={3} style={styles.pickedTitle}>Should you become a Product Manager?</Text><Text style={styles.pickedMeta}>Live session · Thu 16</Text></View>
        </Pressable>
        <Pressable onPress={() => router.push('/mentor/tosin-adeniran')} style={({ pressed }) => [styles.pickedCard, pressed && styles.pickedCardPressed]}>
          <Image source={require('../../../assets/media/tosin-mentor.png')} resizeMode="cover" style={styles.pickedImage}/>
          <View style={styles.pickedBody}><View style={styles.memberBadge}><Text style={styles.memberBadgeText}>{user ? 'Members Only' : 'Preview'}</Text></View><Text numberOfLines={3} style={styles.pickedTitle}>Meet our Board of Mentors</Text><Text style={styles.pickedMeta}>Mentorship · 4 min read</Text></View>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Coming up</Text><Pressable onPress={() => router.push('/events')}><Text style={styles.pinkLink}>View all</Text></Pressable></View>
      <Pressable onPress={() => router.push('/event/product-manager')} style={styles.eventCard}>
        <View style={styles.eventDate}><Text style={styles.eventDay}>16</Text><Text style={styles.eventMonth}>APR</Text></View>
        <View style={styles.eventBody}><Text style={styles.eventTag}>CAREER MENTORSHIP</Text><Text style={styles.eventTitle}>Should You Become a Product Manager?</Text><Text style={styles.eventMeta}>7:30 PM · Google Meet</Text></View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  headerCopy: { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 },
  eyebrow: { color: colors.pinkDeep, fontSize: 8, fontFamily: fonts.bodyBold, letterSpacing: 1.15, textTransform: 'uppercase', marginBottom: 5 },
  greeting: { color: colors.ink, fontSize: 23, lineHeight: 28, fontFamily: fonts.heading, letterSpacing: -.9 },
  status: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green, marginRight: 6 },
  guestDot: { backgroundColor: colors.orange },
  statusText: { color: colors.muted, fontSize: 10, fontFamily: fonts.body, flexShrink: 1 },
  accountCta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 9, paddingVertical: 4 },
  accountCtaText: { color: colors.pinkDeep, fontSize: 10, fontFamily: fonts.bodyBold },
  headerActions: { width: 90, flexShrink: 0, flexDirection: 'row', gap: 8 },
  iconButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', right: 8, top: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.pink, borderWidth: 2, borderColor: colors.surface },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.surface, elevation: 2 },
  avatarPressed: { backgroundColor: colors.pinkDeep, transform: [{ scale: 0.97 }] },
  avatarText: { color: 'white', fontSize: 10, fontFamily: fonts.heading },
  headerAvatarImage:{width:36,height:36,borderRadius:18},
  onlineDot: { position: 'absolute', right: -1, bottom: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.green, borderWidth: 2, borderColor: colors.surface },
  benefitsPanel: { borderRadius: 22, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: 14, overflow: 'hidden' },
  benefitsHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, marginBottom: 12 },
  sectionTitle: { color: colors.ink, fontSize: 16, fontFamily: fonts.heading, letterSpacing: -.45 },
  swipe: { color: colors.muted, fontSize: 8, fontFamily: fonts.bodySemibold, marginBottom: 2 },
  pinkLink: { color: colors.pinkDeep, fontSize: 11, fontFamily: fonts.bodyBold },
  benefitsRow: { gap: 9, paddingRight: 4 },
  benefitsScroller: { width: '100%', flexGrow: 0 },
  benefitCard: { width: 98, height: 118, borderRadius: 18, backgroundColor: '#ECEAEC', padding: 11, justifyContent: 'flex-end', borderWidth: 1, borderColor: '#E5E2E4', overflow: 'hidden' },
  benefitCardPressed: { backgroundColor: colors.pinkDeep, borderColor: colors.pinkDeep, transform: [{ translateY: -2 }] },
  benefitIcon: { position: 'absolute', zIndex: 2, top: 10, left: 10, width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,.76)', alignItems: 'center', justifyContent: 'center' },
  benefitIconPressed: { backgroundColor: 'white' },
  benefitTitle: { zIndex: 2, color: colors.ink, fontSize: 10, lineHeight: 13, fontFamily: fonts.heading },
  benefitLink: { zIndex: 2, color: colors.muted, fontSize: 7, fontFamily: fonts.body, marginTop: 4 },
  cardOrbit: { position: 'absolute', right: -21, top: -25, width: 66, height: 66, borderRadius: 33, borderWidth: 14, borderColor: 'rgba(255,255,255,.34)' },
  lightText: { color: 'white' },
  lightMuted: { color: 'rgba(255,255,255,.72)' },
  fullBenefits: { marginTop: 11, minHeight: 54, borderRadius: 14, backgroundColor: colors.ink, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fullBenefitsPressed: { backgroundColor: colors.pinkDark },
  fullBenefitsOverline: { color: '#D6CBD0', fontSize: 7, fontFamily: fonts.body, letterSpacing: .1 },
  fullBenefitsTitle: { color: 'white', fontSize: 10, fontFamily: fonts.heading, marginTop: 3 },
  progressBadge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: '#E4F7EF' },
  progressBadgeText: { color: '#087553', fontSize: 8, fontFamily: fonts.bodyBold },
  dailyHero: { minHeight: 247, borderRadius: 23, backgroundColor: '#ED3C91', padding: 20, overflow: 'hidden' },
  heroOrbit: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 30, borderColor: 'rgba(179,18,91,.22)', right: -45, bottom: -68 },
  heroBadge: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: 'rgba(155,13,78,.28)', paddingHorizontal: 10, paddingVertical: 6 },
  heroBadgeText: { color: 'white', fontSize: 8, fontFamily: fonts.bodyBold },
  dailyTitle: { color: 'white', fontSize: 24, lineHeight: 27, fontFamily: fonts.heading, letterSpacing: -.9, maxWidth: 270, marginTop: 18 },
  dailyCopy: { color: 'white', fontSize: 11, lineHeight: 16, fontFamily: fonts.body, maxWidth: 270, marginTop: 8 },
  dailyTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,.34)', marginTop: 18, overflow: 'hidden' },
  dailyProgress: { width: '62%', height: '100%', borderRadius: 3, backgroundColor: 'white' },
  continueButton: { width: 150, minHeight: 42, borderRadius: 13, backgroundColor: 'white', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  continueText: { color: colors.ink, fontSize: 10, fontFamily: fonts.bodyBold },
  pickedRow: { flexDirection: 'row', gap: 10 },
  pickedCard: { flex: 1, minWidth: 0, borderRadius: 19, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, overflow: 'hidden' },
  pickedCardPressed: { borderColor: colors.pink, transform: [{ translateY: -2 }] },
  pickedImage: { width: '100%', height: 118, backgroundColor: '#EAE7E9' },
  pickedBody: { padding: 12 },
  openBadge: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: '#E4F7EF', paddingHorizontal: 8, paddingVertical: 5 },
  openBadgeText: { color: '#087553', fontSize: 7, fontFamily: fonts.bodyBold },
  memberBadge: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: colors.pinkSoft, paddingHorizontal: 8, paddingVertical: 5 },
  memberBadgeText: { color: colors.pinkDeep, fontSize: 7, fontFamily: fonts.bodyBold },
  pickedTitle: { minHeight: 48, color: colors.ink, fontSize: 12, lineHeight: 16, fontFamily: fonts.headingBold, marginTop: 9 },
  pickedMeta: { color: colors.muted, fontSize: 8, fontFamily: fonts.body, marginTop: 7 },
  myEvent:{minHeight:108,borderRadius:20,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,padding:12,flexDirection:'row',alignItems:'center'},
  myEventPressed:{borderColor:colors.pink,transform:[{translateY:-2}]},
  myEventDate:{width:66,alignSelf:'stretch',borderRadius:17,alignItems:'center',justifyContent:'center'},
  myEventDay:{color:'white',fontSize:24,fontFamily:fonts.heading},myEventMonth:{color:'white',fontSize:8,fontFamily:fonts.bodyBold,letterSpacing:1},
  myEventBody:{flex:1,paddingHorizontal:12},myEventStatus:{alignSelf:'flex-start',borderRadius:999,backgroundColor:'#E7F7F0',paddingHorizontal:7,paddingVertical:4,flexDirection:'row',alignItems:'center',gap:4},myEventStatusText:{color:'#087553',fontSize:7,fontFamily:fonts.bodyBold},myEventTitle:{color:colors.ink,fontSize:12,lineHeight:16,fontFamily:fonts.headingBold,marginTop:6},myEventMeta:{color:colors.muted,fontSize:8,fontFamily:fonts.body,marginTop:4},
  courseCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, overflow: 'hidden' },
  courseArt: { minHeight: 145, backgroundColor: colors.pinkDeep, padding: 18, justifyContent: 'space-between' },
courseArtSmall: { color: '#FFD3E7', fontSize: 8, fontFamily: fonts.bodyBold, letterSpacing: 1.3 },
  courseArtTitle: { color: 'white', fontSize: 26, lineHeight: 27, fontFamily: fonts.heading, letterSpacing: -1 },
  courseBody: { padding: 15 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  courseLabel: { color: colors.pinkDeep, fontSize: 8, fontFamily: fonts.bodyBold, letterSpacing: 0.7 },
  progressText: { color: colors.muted, fontSize: 10, fontFamily: fonts.bodyBold },
  courseTitle: { color: colors.ink, fontSize: 15, fontFamily: fonts.heading, marginTop: 8 },
  track: { height: 5, borderRadius: 3, backgroundColor: colors.line, marginTop: 12, overflow: 'hidden' },
  progress: { width: '40%', height: '100%', borderRadius: 3, backgroundColor: colors.pink },
  eventCard: { minHeight: 106, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: 13, flexDirection: 'row', alignItems: 'center' },
  eventDate: { width: 64, alignSelf: 'stretch', borderRadius: radius.md, backgroundColor: colors.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  eventDay: { color: colors.pinkDeep, fontSize: 25, fontFamily: fonts.heading },
  eventMonth: { color: colors.pinkDeep, fontSize: 9, fontFamily: fonts.bodyBold, letterSpacing: 1 },
  eventBody: { flex: 1, paddingHorizontal: 13 },
  eventTag: { color: colors.pinkDeep, fontSize: 8, fontFamily: fonts.bodyBold, letterSpacing: 0.8 },
  eventTitle: { color: colors.ink, fontSize: 13, lineHeight: 17, fontFamily: fonts.heading, marginTop: 5 },
  eventMeta: { color: colors.muted, fontSize: 10, marginTop: 7 },
});
