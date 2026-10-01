import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme';

const particles = [
  { x:-64,y:-48,color:'#FFD100',rotate:'-32deg' }, { x:-78,y:8,color:'#3E45E8',rotate:'24deg' },
  { x:-43,y:52,color:'#FF7A00',rotate:'-16deg' }, { x:57,y:-54,color:'#F8B9D5',rotate:'19deg' },
  { x:78,y:2,color:'#FFD100',rotate:'-28deg' }, { x:49,y:51,color:'#3E45E8',rotate:'35deg' },
] as const;

export function CelebrationBurst({ visible, title, copy }: { visible:boolean; title:string; copy:string }) {
  const[progress]=useState(()=>new Animated.Value(0));
  useEffect(()=>{if(!visible){progress.setValue(0);return;}Animated.spring(progress,{toValue:1,speed:12,bounciness:9,useNativeDriver:Platform.OS!=='web'}).start();},[progress,visible]);
  if(!visible)return null;
  return <Animated.View style={[styles.wrap,{opacity:progress,transform:[{scale:progress}]}]}>{particles.map((particle,index)=><Animated.View key={index} style={[styles.particle,{backgroundColor:particle.color,transform:[{translateX:progress.interpolate({inputRange:[0,1],outputRange:[0,particle.x]})},{translateY:progress.interpolate({inputRange:[0,1],outputRange:[0,particle.y]})},{rotate:particle.rotate}]}]}/>)}<View style={styles.icon}><Ionicons name="checkmark" size={24} color="white"/></View><Text style={styles.title}>{title}</Text><Text style={styles.copy}>{copy}</Text></Animated.View>;
}
const styles=StyleSheet.create({wrap:{position:'relative',minHeight:180,borderRadius:24,backgroundColor:colors.ink,alignItems:'center',justifyContent:'center',padding:22,overflow:'hidden',marginBottom:14},particle:{position:'absolute',width:9,height:20,borderRadius:3},icon:{width:51,height:51,borderRadius:18,backgroundColor:colors.pink,alignItems:'center',justifyContent:'center'},title:{color:'white',fontSize:20,fontFamily:fonts.heading,textAlign:'center',marginTop:13},copy:{color:'#D4CDD1',fontSize:9,lineHeight:14,fontFamily:fonts.body,textAlign:'center',marginTop:5,maxWidth:270}});
