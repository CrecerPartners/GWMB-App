import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { colors, fonts } from '@/theme';

const focusAreas = ['Social media strategy', 'Building professional visibility', 'Career positioning', 'Growing with intention'];

export default function MentorDetail() {
  return (
    <Screen>
      <PageHeader title="Meet a mentor" eyebrow="Board of Mentors" />
      <View style={styles.media}>
        <Image source={require('../../../assets/media/tosin-mentor.png')} resizeMode="cover" style={styles.image}/>
        <View style={styles.mediaShade}/>
        <View style={styles.mediaCopy}><Text style={styles.tag}>GWMB BOARD OF MENTORS</Text><Text style={styles.mediaTitle}>Tosin Adeniran</Text><Text style={styles.mediaRole}>Social Media Strategy</Text></View>
      </View>
      <Text style={styles.title}>Meet Tosin</Text>
      <Text style={styles.copy}>Get practical perspective from a mentor helping young women build visibility, communicate their value and approach their careers with clarity.</Text>
      <Text style={styles.sectionTitle}>What you can learn</Text>
      <View style={styles.focusList}>{focusAreas.map(item => <View key={item} style={styles.focusItem}><View style={styles.check}><Ionicons name="checkmark" size={14} color="white"/></View><Text style={styles.focusText}>{item}</Text></View>)}</View>
      <View style={styles.note}><Ionicons name="information-circle-outline" size={19} color={colors.pinkDeep}/><Text style={styles.noteText}>Mentor availability and one-to-one sessions may have separate application requirements.</Text></View>
      <Pressable style={styles.cta}><Text style={styles.ctaText}>Explore mentorship</Text><Ionicons name="arrow-forward" size={18} color="white"/></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  media:{height:310,borderRadius:24,overflow:'hidden',backgroundColor:colors.ink},
  image:{width:'100%',height:'100%'},
  mediaShade:{position:'absolute',top:0,right:0,bottom:0,left:0,backgroundColor:'rgba(0,0,0,.22)'},
  mediaCopy:{position:'absolute',left:20,right:20,bottom:20},
  tag:{color:'#FFD3E7',fontSize:9,fontFamily:fonts.bodyBold,letterSpacing:1.1},
  mediaTitle:{color:'white',fontSize:29,lineHeight:33,fontFamily:fonts.heading,marginTop:7},
  mediaRole:{color:'white',fontSize:11,fontFamily:fonts.bodyMedium,marginTop:4},
  title:{color:colors.ink,fontSize:24,fontFamily:fonts.heading,letterSpacing:-.7,marginTop:24},
  copy:{color:colors.muted,fontSize:12,lineHeight:19,fontFamily:fonts.body,marginTop:8},
  sectionTitle:{color:colors.ink,fontSize:17,fontFamily:fonts.headingBold,marginTop:27,marginBottom:10},
  focusList:{gap:9},
  focusItem:{minHeight:50,borderRadius:16,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,paddingHorizontal:13,flexDirection:'row',alignItems:'center'},
  check:{width:27,height:27,borderRadius:9,backgroundColor:colors.pink,alignItems:'center',justifyContent:'center'},
  focusText:{color:colors.ink,fontSize:11,fontFamily:fonts.bodyBold,marginLeft:11},
  note:{borderRadius:16,backgroundColor:colors.pinkSoft,padding:14,flexDirection:'row',alignItems:'flex-start',gap:10,marginTop:16},
  noteText:{flex:1,color:colors.muted,fontSize:10,lineHeight:16,fontFamily:fonts.body},
  cta:{minHeight:54,borderRadius:16,backgroundColor:colors.pinkDeep,paddingHorizontal:17,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20},
  ctaText:{color:'white',fontSize:12,fontFamily:fonts.bodyBold},
});
