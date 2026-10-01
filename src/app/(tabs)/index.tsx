import { Ionicons } from '@expo/vector-icons';
import { router as expoRouter, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { Screen } from '@/components/Screen';
import { AnimatedProgress } from '@/components/motion/AnimatedProgress';
import { FadeIn } from '@/components/motion/FadeIn';
import { SpringPressable } from '@/components/motion/SpringPressable';
import { courses } from '@/data/courses';
import { eventById, upcomingEvents } from '@/data/events';
import { opportunities } from '@/data/opportunities';
import { coursePercent, loadCourseProgress, type CourseProgress } from '@/lib/course-progress';
import { loadEventRegistrations, type EventRegistration } from '@/lib/event-store';
import { tapFeedback } from '@/lib/feedback';
import { eventCountdown, urgencyLabel } from '@/lib/time';
import { useAuth } from '@/providers/AuthProvider';
import { colors, fonts } from '@/theme';

const router = { push: (href: string) => expoRouter.push(href as never) };

const benefits = [
  ['Career', 'briefcase-outline'],
  ['Mentorship', 'people-outline'],
  ['Skills', 'play-circle-outline'],
  ['Money', 'wallet-outline'],
  ['Leadership', 'sparkles-outline'],
  ['Growth', 'trending-up-outline'],
  ['Sisterhood', 'heart-outline'],
  ['Opportunities', 'telescope-outline'],
] as const;

const communityPhotos = [
  require('../../../assets/media/community/member-01.png'),
  require('../../../assets/media/community/member-02.png'),
  require('../../../assets/media/community/member-03.png'),
  require('../../../assets/media/community/member-04.png'),
  require('../../../assets/media/community/member-05.png'),
  require('../../../assets/media/community/member-06.png'),
  require('../../../assets/media/community/member-07.png'),
  require('../../../assets/media/community/member-08.png'),
  require('../../../assets/media/community/member-09.png'),
  require('../../../assets/media/community/member-10.png'),
] as const;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { user, profile, membership } = useAuth();
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featureScroller = useRef<ScrollView>(null);
  const benefitsScroller = useRef<ScrollView>(null);
  const opportunitiesScroller = useRef<ScrollView>(null);
  const communityScroller = useRef<ScrollView>(null);
  const benefitsPosition = useRef(0);
  const opportunitiesPosition = useRef(0);
  const communityPosition = useRef(0);
  const benefitsPausedUntil = useRef(0);
  const opportunitiesPausedUntil = useRef(0);
  const communityPausedUntil = useRef(0);
  const cvCourse = courses['workplace-foundations'];
  const userId = user?.id;

  useFocusEffect(useCallback(() => {
    let active = true;
    if (!userId) { setCourseProgress(null); return () => { active = false; }; }
    loadCourseProgress(userId, cvCourse.id).then((result) => { if (active) setCourseProgress(result.progress); });
    return () => { active = false; };
  }, [cvCourse.id, userId]));

  useFocusEffect(useCallback(() => {
    let active = true;
    if (!userId) { setEventRegistrations([]); return () => { active = false; }; }
    loadEventRegistrations(userId).then((result) => { if (active) setEventRegistrations(result.registrations); });
    return () => { active = false; };
  }, [userId]));

  const cvPercent = coursePercent(courseProgress, cvCourse.lessons.length);
  const currentLessonIndex = Math.max(0, cvCourse.lessons.findIndex((item) => !courseProgress?.completed_lesson_ids.includes(item.id)));
  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Girlie';
  const initials = profile?.full_name?.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'GW';
  const isMember = membership?.status === 'verified';
  const nextRegistration = eventRegistrations.find((item) => item.status !== 'cancelled' && eventById[item.event_id]?.lifecycle === 'upcoming');
  const nextEvent = nextRegistration ? eventById[nextRegistration.event_id] : null;
  const soonestEvent = [...upcomingEvents].sort((a, b) => new Date(a.startsAt ?? 0).getTime() - new Date(b.startsAt ?? 0).getTime())[0];
  const heroWidth = Math.min(Math.max(width * 0.82, 286), 430);
  const heroGap = 12;

  const featureCards = useMemo(() => [
    {
      key: 'product', route: '/event/product-manager', label: 'LIVE CAREER SESSION', title: 'Could product management be your next move?',
      copy: 'An honest conversation with Adeola Adeyemi.', image: require('../../../assets/media/adeola-mentorship.png'), tone: '#E62B7F', action: 'Reserve your seat',
    },
    {
      key: 'course', route: '/course/workplace-foundations', label: courseProgress ? `${cvPercent}% COMPLETE` : 'START IN 42 MINUTES', title: 'Build a CV that makes people pause.',
      copy: courseProgress ? 'Your next lesson is ready when you are.' : 'Six practical lessons. One stronger application.', tone: '#111011', action: courseProgress ? 'Continue course' : 'Start learning',
    },
    {
      key: 'mentor', route: '/mentor/tosin-adeniran', label: 'MEET YOUR MENTORS', title: 'Build visibility with more intention.',
      copy: 'Meet Tosin Adeniran, Social Media Strategist.', image: require('../../../assets/media/tosin-mentor.png'), tone: '#A81455', action: 'Meet Tosin',
    },
  ], [courseProgress, cvPercent]);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (featuredIndex + 1) % featureCards.length;
      featureScroller.current?.scrollTo({ x: next * (heroWidth + heroGap), animated: true });
      setFeaturedIndex(next);
    }, 6000);
    return () => clearInterval(timer);
  }, [featureCards.length, featuredIndex, heroWidth]);

  useEffect(() => {
    const advance = (scroller: RefObject<ScrollView | null>, position: MutableRefObject<number>, pausedUntil: MutableRefObject<number>, count: number, step: number) => {
      if (Date.now() < pausedUntil.current) return;
      position.current = (position.current + 1) % count;
      scroller.current?.scrollTo({ x: position.current * step, animated: position.current !== 0 });
    };
    const benefitsTimer = setInterval(() => advance(benefitsScroller, benefitsPosition, benefitsPausedUntil, benefits.length, 121), 3000);
    const opportunitiesTimer = setInterval(() => advance(opportunitiesScroller, opportunitiesPosition, opportunitiesPausedUntil, opportunities.length, 228), 3900);
    const communityTimer = setInterval(() => advance(communityScroller, communityPosition, communityPausedUntil, communityPhotos.length, 116), 2500);
    return () => { clearInterval(benefitsTimer); clearInterval(opportunitiesTimer); clearInterval(communityTimer); };
  }, []);

  function pauseAutoScroll(target: MutableRefObject<number>) { target.current = Date.now() + 8000; }

  function updateFeatured(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const step = heroWidth + heroGap;
    setFeaturedIndex(Math.max(0, Math.min(featureCards.length - 1, Math.round(event.nativeEvent.contentOffset.x / step))));
  }

  return (
    <Screen>
      <FadeIn delay={40}><View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.dateLabel}>YOUR GWMB TODAY</Text>
          <Text numberOfLines={1} style={styles.greeting}>Hey, {firstName} <Text style={styles.wave}>✦</Text></Text>
          <Text style={styles.subGreeting}>{isMember ? 'Your next move is waiting.' : 'Come in. There’s something here for you.'}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} style={({ pressed }) => [styles.roundButton, pressed && styles.actionPressed]}>
            <Ionicons name="notifications-outline" size={20} color={colors.ink} />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable accessibilityLabel="Open profile" onPress={() => router.push('/profile')} style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}>
            {profile?.avatar_url ? <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage}/> : <Text style={styles.avatarText}>{initials}</Text>}
            {isMember ? <View style={styles.onlineDot}/> : null}
          </Pressable>
        </View>
      </View></FadeIn>

      {!user ? <Pressable onPress={() => router.push('/welcome')} style={styles.guestStrip}><View style={styles.guestIcon}><Ionicons name="sparkles" size={16} color={colors.pinkDeep}/></View><View style={styles.guestCopy}><Text style={styles.guestTitle}>Make GWMB yours</Text><Text style={styles.guestText}>Create an account to save courses, events and opportunities.</Text></View><Ionicons name="arrow-forward" size={17} color={colors.ink}/></Pressable> : null}

      <FadeIn delay={110}><View style={styles.featureHeading}>
        <View><Text style={styles.kicker}>PICKED FOR YOU</Text><Text style={styles.featureTitle}>What’s worth your time</Text></View>
        <Text style={styles.featureCount}>0{featuredIndex + 1} / 0{featureCards.length}</Text>
      </View>
      <ScrollView ref={featureScroller} horizontal decelerationRate="fast" snapToInterval={heroWidth + heroGap} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featureTrack} onMomentumScrollEnd={updateFeatured}>
        {featureCards.map((item, index) => <SpringPressable key={item.key} onPress={() => { void tapFeedback(); router.push(item.route); }} style={[styles.featureCard, { width: heroWidth, backgroundColor: item.tone }]} contentStyle={styles.featureContent}>
          {item.image ? <Image source={item.image} resizeMode="cover" style={styles.featureImage}/> : <View style={styles.typographicArt}><Text style={styles.artLetters}>CV</Text><View style={styles.artStar}><Ionicons name="sparkles" size={24} color="#FFD100"/></View></View>}
          <View style={styles.featureShade}/>
          <View style={styles.featureTop}><Text style={styles.featureLabel}>{item.label}</Text><View style={styles.featureNumber}><Text style={styles.featureNumberText}>0{index + 1}</Text></View></View>
          <View style={styles.featureBottom}><Text style={styles.featureCardTitle}>{item.title}</Text><Text style={styles.featureCopy}>{item.copy}</Text><View style={styles.featureAction}><Text style={styles.featureActionText}>{item.action}</Text><Ionicons name="arrow-forward" size={16} color={colors.ink}/></View></View>
        </SpringPressable>)}
      </ScrollView>
      <View style={styles.dots}>{featureCards.map((item, index) => <View key={item.key} style={[styles.paginationDot, index === featuredIndex && styles.paginationDotActive]}/>)}</View></FadeIn>

      <FadeIn delay={180}><View style={styles.sectionHead}><View><Text style={styles.kicker}>YOUR MOMENTUM</Text><Text style={styles.sectionTitle}>Keep moving forward</Text></View><Pressable onPress={() => router.push('/activity')}><Text style={styles.sectionLink}>My activity</Text></Pressable></View>
      <View style={styles.momentumRow}>
        <SpringPressable onPress={() => { void tapFeedback(); router.push('/course/workplace-foundations'); }} style={styles.progressCard} contentStyle={styles.momentumContent}>
          <View style={styles.progressTop}><View style={styles.progressRing}><Text style={styles.progressNumber}>{cvPercent}%</Text></View><Ionicons name="arrow-up-outline" size={18} color="white"/></View>
          <Text style={styles.progressEyebrow}>{cvPercent === 100 ? 'CERTIFICATE READY' : courseProgress ? `LESSON ${currentLessonIndex + 1} OF ${cvCourse.lessons.length}` : 'READY TO START'}</Text>
          <Text style={styles.progressTitle}>CV that gets noticed</Text>
          <AnimatedProgress value={Math.max(cvPercent, 4)} height={4} color={colors.pink} trackColor="#3B3739" style={styles.progressTrack}/>
        </SpringPressable>
        <SpringPressable onPress={() => { void tapFeedback(); router.push(nextEvent ? `/event/${nextEvent.id}` : '/events'); }} style={styles.nextMoveCard} contentStyle={styles.momentumContent}>
          <View style={styles.nextMoveIcon}><Ionicons name={nextEvent ? 'calendar' : 'calendar-outline'} size={21} color={colors.pinkDeep}/></View>
          <Text style={styles.nextMoveEyebrow}>{nextEvent ? 'YOU’RE IN' : 'HAPPENING SOON'}</Text>
          <Text numberOfLines={3} style={styles.nextMoveTitle}>{nextEvent?.title || soonestEvent.title}</Text>
          <Text style={styles.nextMoveMeta}>{eventCountdown((nextEvent || soonestEvent).startsAt) || nextEvent?.dateShort || soonestEvent.dateShort}</Text>
        </SpringPressable>
      </View></FadeIn>

      <FadeIn delay={250}><View style={styles.sectionHead}><View><Text style={styles.kicker}>MEMBERSHIP, UNPACKED</Text><Text style={styles.sectionTitle}>Explore your benefits</Text></View><Text style={styles.swipeLabel}>Swipe</Text></View>
      <ScrollView ref={benefitsScroller} horizontal decelerationRate="fast" snapToInterval={121} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.benefitsTrack} onScrollBeginDrag={() => pauseAutoScroll(benefitsPausedUntil)} onMomentumScrollEnd={(event) => { benefitsPosition.current = Math.round(event.nativeEvent.contentOffset.x / 121); }}>
        {benefits.map(([label, icon], index) => <Pressable key={label} onPress={() => { void tapFeedback(); if (label === 'Opportunities') router.push('/opportunities'); else router.push('/membership'); }} style={({ pressed }) => [styles.benefitCard, pressed && styles.benefitCardActive]}>
          {({ pressed }) => <><Text style={[styles.benefitIndex, pressed && styles.benefitOnPink]}>0{index + 1}</Text><View style={[styles.benefitIcon, pressed && styles.benefitIconActive]}><Ionicons name={icon} size={20} color={pressed ? colors.pinkDeep : colors.ink}/></View><Text style={[styles.benefitName, pressed && styles.benefitOnPink]}>{label}</Text><Ionicons name="arrow-forward" size={15} color={pressed ? 'white' : colors.muted}/></>}
        </Pressable>)}
      </ScrollView>
      <SpringPressable onPress={() => { void tapFeedback(); router.push('/membership'); }} style={styles.benefitsCta} contentStyle={styles.benefitsCtaContent}><View><Text style={styles.benefitsCtaLabel}>THE FULL GWMB EXPERIENCE</Text><Text style={styles.benefitsCtaTitle}>View full benefits</Text></View><View style={styles.whiteArrow}><Ionicons name="arrow-forward" size={17} color={colors.ink}/></View></SpringPressable></FadeIn>

      <FadeIn delay={320}><View style={styles.sectionHead}><View><Text style={styles.kicker}>CURATED FOR YOUR NEXT MOVE</Text><Text style={styles.sectionTitle}>Opportunities Corner</Text></View><Pressable onPress={() => router.push('/opportunities')}><Text style={styles.sectionLink}>See all</Text></Pressable></View>
      <ScrollView ref={opportunitiesScroller} horizontal decelerationRate="fast" snapToInterval={228} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.opportunityTrack} onScrollBeginDrag={() => pauseAutoScroll(opportunitiesPausedUntil)} onMomentumScrollEnd={(event) => { opportunitiesPosition.current = Math.round(event.nativeEvent.contentOffset.x / 228); }}>
        {opportunities.map((item, index) => <SpringPressable key={item.id} onPress={() => { void tapFeedback(); router.push(`/opportunity/${item.id}`); }} style={styles.opportunityCard} contentStyle={styles.opportunityContent}>
          <View style={styles.opportunityTop}><View style={[styles.brandMark, index === 1 && styles.brandMarkPink]}><Text style={[styles.brandInitials, index === 1 && styles.brandInitialsLight]}>{item.initials}</Text></View><View style={[styles.deadlinePill, urgencyLabel(item.deadlineAt) && styles.urgentPill]}><Text style={[styles.deadlineText, urgencyLabel(item.deadlineAt) && styles.urgentText]}>{urgencyLabel(item.deadlineAt) || item.deadline.replace('Closes ', '')}</Text></View></View>
          <Text style={styles.opportunityType}>{item.type.toUpperCase()}</Text>
          <Text numberOfLines={2} style={styles.opportunityTitle}>{item.title}</Text>
          <Text style={styles.opportunityOrg}>{item.org}</Text>
          <View style={styles.opportunityFooter}><Text style={styles.opportunityLocation}>{item.location}</Text><Ionicons name="arrow-forward" size={16} color={colors.pinkDeep}/></View>
        </SpringPressable>)}
      </ScrollView></FadeIn>

      <FadeIn delay={390}><View style={styles.communityCard}>
        <View style={styles.communityPatternOne}/><View style={styles.communityPatternTwo}/>
        <View style={styles.communityHeader}><View style={styles.communityIcon}><Ionicons name="people" size={22} color={colors.pinkDeep}/></View><Text style={styles.communityLive}>REAL WOMEN · REAL COMMUNITY</Text></View>
        <Text style={styles.communityTitle}>There’s room for you here.</Text>
        <Text style={styles.communityCopy}>Meet women learning, building and becoming—together.</Text>
        <ScrollView ref={communityScroller} horizontal decelerationRate="fast" snapToInterval={116} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.communityPhotoTrack} onScrollBeginDrag={() => pauseAutoScroll(communityPausedUntil)} onMomentumScrollEnd={(event) => { communityPosition.current = Math.round(event.nativeEvent.contentOffset.x / 116); }}>
          {communityPhotos.map((source,index)=><Pressable key={index} accessibilityLabel="Open the GWMB community" onPress={() => { void tapFeedback(); router.push('/community'); }} style={[styles.communityPhoto,index%3===1&&styles.communityPhotoRaised]}><Image source={source} resizeMode="cover" style={styles.communityImage}/><View style={styles.communityPhotoShade}/></Pressable>)}
        </ScrollView>
        <SpringPressable onPress={() => { void tapFeedback(); router.push('/community'); }} style={styles.communityButton} contentStyle={styles.communityButtonContent}><Text style={styles.communityButtonText}>Join the community</Text><View style={styles.communityButtonArrow}><Ionicons name="arrow-forward" size={16} color={colors.ink}/></View></SpringPressable>
      </View></FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginTop:4,marginBottom:20},
  headerCopy:{flex:1,minWidth:0},dateLabel:{color:colors.pinkDeep,fontSize:10,fontFamily:fonts.bodyBold,letterSpacing:1.2},
  greeting:{color:colors.ink,fontSize:28,lineHeight:33,fontFamily:fonts.heading,letterSpacing:-1.15,marginTop:4},wave:{color:colors.pink},
  subGreeting:{color:colors.muted,fontSize:10,fontFamily:fonts.body,marginTop:4},headerActions:{flexDirection:'row',gap:8},
  roundButton:{width:41,height:41,borderRadius:21,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},actionPressed:{backgroundColor:colors.pinkSoft},
  notificationDot:{position:'absolute',right:8,top:7,width:8,height:8,borderRadius:4,backgroundColor:colors.pink,borderWidth:2,borderColor:'white'},
  avatar:{width:41,height:41,borderRadius:21,backgroundColor:colors.ink,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'white'},avatarPressed:{backgroundColor:colors.pinkDeep,transform:[{scale:.97}]},avatarImage:{width:37,height:37,borderRadius:19},avatarText:{color:'white',fontSize:10,fontFamily:fonts.heading},onlineDot:{position:'absolute',right:-1,bottom:0,width:11,height:11,borderRadius:6,backgroundColor:colors.green,borderWidth:2,borderColor:'white'},
  guestStrip:{minHeight:76,borderRadius:19,backgroundColor:colors.pinkSoft,padding:12,flexDirection:'row',alignItems:'center',marginBottom:20},guestIcon:{width:42,height:42,borderRadius:14,backgroundColor:'white',alignItems:'center',justifyContent:'center'},guestCopy:{flex:1,paddingHorizontal:11},guestTitle:{fontSize:13,fontFamily:fonts.headingBold,color:colors.ink},guestText:{fontSize:10,lineHeight:15,fontFamily:fonts.body,color:colors.muted,marginTop:3},
  featureHeading:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginBottom:12},kicker:{color:colors.pinkDeep,fontSize:10,fontFamily:fonts.bodyBold,letterSpacing:1.05},featureTitle:{color:colors.ink,fontSize:20,fontFamily:fonts.heading,letterSpacing:-.75,marginTop:4},featureCount:{color:colors.muted,fontSize:10,fontFamily:fonts.bodyBold,letterSpacing:.7},
  featureTrack:{gap:12,paddingRight:20},featureCard:{height:360,borderRadius:27,overflow:'hidden'},featureContent:{padding:18},featurePressed:{transform:[{scale:.985}]},featureImage:{position:'absolute',width:'100%',height:'100%'},featureShade:{position:'absolute',top:0,right:0,bottom:0,left:0,backgroundColor:'rgba(0,0,0,.29)'},typographicArt:{position:'absolute',top:0,right:0,bottom:0,left:0,overflow:'hidden'},artLetters:{position:'absolute',right:-15,top:45,color:'rgba(255,255,255,.09)',fontSize:150,fontFamily:fonts.heading,letterSpacing:-14},artStar:{position:'absolute',right:28,top:28},featureTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},featureLabel:{color:'white',fontSize:10,fontFamily:fonts.bodyBold,letterSpacing:1.05},featureNumber:{width:35,height:35,borderRadius:18,backgroundColor:'rgba(255,255,255,.17)',alignItems:'center',justifyContent:'center'},featureNumberText:{color:'white',fontSize:10,fontFamily:fonts.headingBold},featureBottom:{marginTop:'auto'},featureCardTitle:{color:'white',fontSize:28,lineHeight:30,fontFamily:fonts.heading,letterSpacing:-1.15,maxWidth:330},featureCopy:{color:'rgba(255,255,255,.88)',fontSize:12,lineHeight:18,fontFamily:fonts.body,marginTop:8,maxWidth:285},featureAction:{alignSelf:'flex-start',minHeight:42,borderRadius:14,backgroundColor:'white',paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:18,marginTop:17},featureActionText:{color:colors.ink,fontSize:11,fontFamily:fonts.bodyBold},dots:{height:27,flexDirection:'row',alignItems:'center',gap:5},paginationDot:{width:5,height:5,borderRadius:3,backgroundColor:'#D4CFD2'},paginationDotActive:{width:22,backgroundColor:colors.pink},
  sectionHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginTop:24,marginBottom:12},sectionTitle:{color:colors.ink,fontSize:19,fontFamily:fonts.heading,letterSpacing:-.65,marginTop:4},sectionLink:{color:colors.pinkDeep,fontSize:11,fontFamily:fonts.bodyBold,paddingBottom:2},swipeLabel:{color:colors.muted,fontSize:10,fontFamily:fonts.bodySemibold,paddingBottom:2},
  momentumRow:{flexDirection:'row',gap:10},progressCard:{flex:1,minWidth:0,minHeight:202,borderRadius:23,backgroundColor:colors.ink,overflow:'hidden'},nextMoveCard:{flex:1,minWidth:0,minHeight:202,borderRadius:23,backgroundColor:colors.pinkSoft,borderWidth:1,borderColor:'#F6DCE8',overflow:'hidden'},momentumContent:{padding:15},cardPressed:{transform:[{translateY:-2}],opacity:.92},progressTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},progressRing:{width:53,height:53,borderRadius:27,borderWidth:5,borderColor:colors.pink,alignItems:'center',justifyContent:'center'},progressNumber:{color:'white',fontSize:11,fontFamily:fonts.headingBold},progressEyebrow:{color:'#F29BC3',fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:.7,marginTop:19},progressTitle:{color:'white',fontSize:14,lineHeight:18,fontFamily:fonts.headingBold,marginTop:5},progressTrack:{marginTop:'auto'},progressFill:{height:'100%',backgroundColor:colors.pink},nextMoveIcon:{width:43,height:43,borderRadius:14,backgroundColor:'white',alignItems:'center',justifyContent:'center'},nextMoveEyebrow:{color:colors.pinkDeep,fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:.7,marginTop:18},nextMoveTitle:{color:colors.ink,fontSize:13,lineHeight:17,fontFamily:fonts.headingBold,marginTop:5},nextMoveMeta:{color:colors.muted,fontSize:10,fontFamily:fonts.bodyBold,marginTop:'auto'},
  benefitsTrack:{gap:9,paddingRight:16},benefitCard:{width:112,height:142,borderRadius:21,backgroundColor:'#EEECEF',padding:13,borderWidth:1,borderColor:'#E7E3E5'},benefitCardActive:{backgroundColor:colors.pinkDeep,borderColor:colors.pinkDeep,transform:[{translateY:-3}]},benefitIndex:{position:'absolute',right:12,top:11,color:'#A8A1A5',fontSize:9,fontFamily:fonts.bodyBold},benefitIcon:{width:40,height:40,borderRadius:14,backgroundColor:'white',alignItems:'center',justifyContent:'center'},benefitIconActive:{backgroundColor:'white'},benefitName:{color:colors.ink,fontSize:11,lineHeight:14,fontFamily:fonts.headingBold,marginTop:'auto',marginBottom:8},benefitOnPink:{color:'white'},
  benefitsCta:{minHeight:70,borderRadius:19,backgroundColor:colors.ink,marginTop:11,overflow:'hidden'},benefitsCtaContent:{paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},benefitsCtaPressed:{backgroundColor:colors.pinkDark},benefitsCtaLabel:{color:'#C4BDC1',fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:.85},benefitsCtaTitle:{color:'white',fontSize:14,fontFamily:fonts.headingBold,marginTop:4},whiteArrow:{width:36,height:36,borderRadius:18,backgroundColor:'white',alignItems:'center',justifyContent:'center'},
  opportunityTrack:{gap:10,paddingRight:16},opportunityCard:{width:218,minHeight:224,borderRadius:23,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,overflow:'hidden'},opportunityContent:{padding:15},opportunityCardPressed:{borderColor:colors.pink,backgroundColor:colors.blush,transform:[{translateY:-2}]},opportunityTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},brandMark:{width:48,height:48,borderRadius:15,backgroundColor:colors.ink,alignItems:'center',justifyContent:'center'},brandMarkPink:{backgroundColor:colors.pinkDeep},brandInitials:{color:'white',fontSize:12,fontFamily:fonts.heading},brandInitialsLight:{color:'white'},deadlinePill:{borderRadius:999,backgroundColor:'#FFF0D8',paddingHorizontal:8,paddingVertical:6},urgentPill:{backgroundColor:colors.pinkDeep},deadlineText:{color:'#855900',fontSize:9,fontFamily:fonts.bodyBold},urgentText:{color:'white'},opportunityType:{color:colors.pinkDeep,fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:.85,marginTop:17},opportunityTitle:{color:colors.ink,fontSize:15,lineHeight:19,fontFamily:fonts.headingBold,marginTop:6},opportunityOrg:{color:colors.muted,fontSize:10,fontFamily:fonts.bodyMedium,marginTop:5},opportunityFooter:{marginTop:'auto',paddingTop:13,borderTopWidth:1,borderTopColor:colors.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},opportunityLocation:{color:colors.muted,fontSize:10,fontFamily:fonts.body},
  communityCard:{minHeight:475,borderRadius:26,backgroundColor:colors.pinkDeep,overflow:'hidden',marginTop:28,padding:20},communityPatternOne:{position:'absolute',width:190,height:190,borderRadius:95,borderWidth:36,borderColor:'rgba(255,255,255,.1)',right:-42,top:-57},communityPatternTwo:{position:'absolute',width:120,height:120,borderRadius:60,backgroundColor:'rgba(17,16,17,.18)',left:-38,bottom:-42},communityHeader:{flexDirection:'row',alignItems:'center',gap:10},communityIcon:{width:44,height:44,borderRadius:15,backgroundColor:'white',alignItems:'center',justifyContent:'center'},communityLive:{color:'#FFD2E5',fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:.9},communityTitle:{color:'white',fontSize:25,lineHeight:28,fontFamily:fonts.heading,letterSpacing:-.9,marginTop:20,maxWidth:310},communityCopy:{color:'rgba(255,255,255,.85)',fontSize:11,lineHeight:17,fontFamily:fonts.body,marginTop:7,maxWidth:320},communityPhotoTrack:{gap:8,paddingRight:16,marginTop:18,minHeight:154},communityPhoto:{width:108,height:140,borderRadius:18,overflow:'hidden',backgroundColor:'#7A0D3E'},communityPhotoRaised:{marginTop:12},communityImage:{width:'100%',height:'100%'},communityPhotoShade:{position:'absolute',top:0,right:0,bottom:0,left:0,backgroundColor:'rgba(17,16,17,.08)'},communityButton:{height:58,borderRadius:18,backgroundColor:colors.ink,overflow:'hidden',marginTop:20},communityButtonContent:{paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},communityButtonText:{color:'white',fontSize:12,fontFamily:fonts.bodyBold},communityButtonArrow:{width:34,height:34,borderRadius:17,backgroundColor:'white',alignItems:'center',justifyContent:'center'},
});
