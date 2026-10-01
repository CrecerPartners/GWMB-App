import { Ionicons } from '@expo/vector-icons';
import { router as expoRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthField } from '@/components/AuthField';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { loadVerificationRequest, submitVerificationRequest } from '@/lib/account';
import { useAuth } from '@/providers/AuthProvider';
import { colors, fonts } from '@/theme';
import type { MembershipVerificationRequest } from '@/types/database';

const router = { replace: (href: string) => expoRouter.replace(href as never) };

export default function VerifyMembership() {
  const { user, membership, refreshAccount } = useAuth();
  const [request, setRequest] = useState<MembershipVerificationRequest | null>(null);
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(Boolean(user));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadVerificationRequest(user.id).then((record) => {
      setRequest(record); setEmail((value) => value || record?.membership_email || user.email || ''); setPhone((value) => value || record?.phone || ''); setMemberId((value) => value || record?.member_identifier || ''); setLoading(false);
    }).catch((error: Error) => { setMessage(error.message); setLoading(false); });
  }, [user]);

  async function submit() {
    setMessage(null);
    if (!user) { router.replace('/sign-in'); return; }
    if (!email.includes('@') || phone.trim().length < 7) { setMessage('Enter the membership email and phone number connected to your record.'); return; }
    setSubmitting(true);
    try {
      const record = await submitVerificationRequest({ userId:user.id, email:email.trim().toLowerCase(), phone:phone.trim(), memberIdentifier:memberId.trim(), resubmit:request?.status === 'rejected' });
      setRequest(record); await refreshAccount();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'We could not submit your verification request.'); }
    finally { setSubmitting(false); }
  }

  if (!user) return <Screen><PageHeader title="Verify Membership"/><View style={styles.gate}><Ionicons name="person-outline" size={30} color={colors.pinkDeep}/><Text style={styles.gateTitle}>Sign in to verify membership</Text><Text style={styles.gateCopy}>Verification must be securely linked to your GWMB account.</Text><Pressable onPress={() => router.replace('/sign-in')} style={styles.cta}><Text style={styles.ctaText}>Sign in</Text></Pressable></View></Screen>;
  if (loading) return <Screen scroll={false}><View style={styles.loading}><ActivityIndicator color={colors.pinkDeep}/></View></Screen>;
  if (membership?.status === 'verified') return <Screen><PageHeader title="My Membership"/><View style={styles.verified}><View style={styles.verifiedIcon}><Ionicons name="checkmark" size={30} color="white"/></View><Text style={styles.verifiedKicker}>MEMBERSHIP VERIFIED</Text><Text style={styles.verifiedTitle}>You’re officially a GWMB girlie.</Text><Text style={styles.verifiedCopy}>Your members-only access is active across learning, events, mentorship and opportunities.</Text></View></Screen>;
  if (request && request.status !== 'rejected') return <Screen><PageHeader title="Verification status"/><View style={styles.pending}><View style={styles.pendingIcon}><Ionicons name={request.status === 'approved' ? 'checkmark' : 'hourglass-outline'} size={27} color="white"/></View><Text style={styles.pendingKicker}>{request.status === 'approved' ? 'MATCH APPROVED' : 'REVIEW IN PROGRESS'}</Text><Text style={styles.pendingTitle}>{request.status === 'approved' ? 'Your details matched.' : 'Your request is with GWMB.'}</Text><Text style={styles.pendingCopy}>{request.status === 'approved' ? 'Membership access will appear once the GWMB membership record is activated.' : 'The team will compare your details with the official membership system. You do not need to apply again.'}</Text></View><View style={styles.summary}><View><Text style={styles.summaryLabel}>MEMBERSHIP EMAIL</Text><Text style={styles.summaryValue}>{request.membership_email}</Text></View><View style={styles.summaryDivider}/><View><Text style={styles.summaryLabel}>SUBMITTED</Text><Text style={styles.summaryValue}>{new Date(request.submitted_at).toLocaleDateString()}</Text></View></View></Screen>;

  return <Screen><PageHeader title="Verify Membership"/><Text style={styles.title}>{request?.status === 'rejected' ? 'Update your membership details' : 'Already a GWMB member?'}</Text><Text style={styles.copy}>{request?.status === 'rejected' ? 'The previous details could not be matched. Review them carefully and submit again.' : 'Enter details that match the official GWMB membership system. A matching name alone is not enough.'}</Text>{request?.review_note ? <View style={styles.reviewNote}><Text style={styles.reviewLabel}>GWMB REVIEW NOTE</Text><Text style={styles.reviewText}>{request.review_note}</Text></View> : null}<View style={styles.form}><AuthField label="Membership email" value={email} onChangeText={setEmail} placeholder="Email used for membership" keyboardType="email-address"/><AuthField label="Phone number" value={phone} onChangeText={setPhone} placeholder="Verified membership phone" keyboardType="phone-pad"/><AuthField label="Member ID · Optional" value={memberId} onChangeText={setMemberId} placeholder="e.g. GWMB-2026-0012"/></View><View style={styles.note}><Ionicons name="shield-checkmark-outline" size={19} color={colors.pinkDeep}/><Text style={styles.noteText}>Your request may remain pending while GWMB reviews your record. Access unlocks only after a successful match.</Text></View>{message ? <View style={styles.error}><Text style={styles.errorText}>{message}</Text></View> : null}<Pressable disabled={submitting} onPress={submit} style={[styles.cta,submitting&&styles.disabled]}>{submitting ? <ActivityIndicator color="white"/> : <Text style={styles.ctaText}>{request?.status === 'rejected' ? 'Resubmit for verification' : 'Submit for verification'}</Text>}</Pressable></Screen>;
}

const styles=StyleSheet.create({loading:{flex:1,alignItems:'center',justifyContent:'center'},title:{color:colors.ink,fontSize:24,lineHeight:29,fontFamily:fonts.heading,marginTop:8},copy:{color:colors.muted,fontSize:11,lineHeight:18,fontFamily:fonts.body,marginTop:8},form:{marginTop:20,borderRadius:21,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,padding:15},note:{borderRadius:16,backgroundColor:colors.pinkSoft,padding:14,flexDirection:'row',gap:9,alignItems:'center',marginTop:13},noteText:{color:colors.muted,fontSize:9,lineHeight:15,fontFamily:fonts.body,flex:1},cta:{height:53,borderRadius:16,backgroundColor:colors.pinkDeep,alignItems:'center',justifyContent:'center',marginTop:14},disabled:{opacity:.65},ctaText:{color:'white',fontSize:11,fontFamily:fonts.bodyBold},error:{borderRadius:14,backgroundColor:'#FFF0F3',padding:12,marginTop:12},errorText:{color:'#A41449',fontSize:9,lineHeight:14,fontFamily:fonts.bodyMedium},reviewNote:{borderRadius:16,backgroundColor:'#FFF3DA',padding:14,marginTop:14},reviewLabel:{color:'#875B00',fontSize:7,fontFamily:fonts.bodyBold,letterSpacing:.8},reviewText:{color:'#6A5424',fontSize:9,lineHeight:15,fontFamily:fonts.body,marginTop:5},gate:{borderRadius:23,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,padding:23,alignItems:'center',marginTop:30},gateTitle:{color:colors.ink,fontSize:20,fontFamily:fonts.heading,textAlign:'center',marginTop:16},gateCopy:{color:colors.muted,fontSize:10,lineHeight:16,fontFamily:fonts.body,textAlign:'center',marginTop:7},pending:{borderRadius:25,backgroundColor:colors.ink,padding:23},pendingIcon:{width:54,height:54,borderRadius:18,backgroundColor:colors.pink,alignItems:'center',justifyContent:'center'},pendingKicker:{color:'#F3A5CA',fontSize:7,fontFamily:fonts.bodyBold,letterSpacing:1,marginTop:23},pendingTitle:{color:'white',fontSize:25,lineHeight:29,fontFamily:fonts.heading,marginTop:7},pendingCopy:{color:'#D6CFD3',fontSize:10,lineHeight:17,fontFamily:fonts.body,marginTop:7},summary:{borderRadius:19,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,padding:16,gap:12,marginTop:13},summaryDivider:{height:1,backgroundColor:colors.line},summaryLabel:{color:colors.pinkDeep,fontSize:7,fontFamily:fonts.bodyBold,letterSpacing:.8},summaryValue:{color:colors.ink,fontSize:10,fontFamily:fonts.bodyBold,marginTop:4},verified:{borderRadius:25,backgroundColor:colors.ink,padding:24},verifiedIcon:{width:56,height:56,borderRadius:19,backgroundColor:'#087553',alignItems:'center',justifyContent:'center'},verifiedKicker:{color:'#A8E8D2',fontSize:7,fontFamily:fonts.bodyBold,letterSpacing:1,marginTop:24},verifiedTitle:{color:'white',fontSize:25,lineHeight:29,fontFamily:fonts.heading,marginTop:7},verifiedCopy:{color:'#D6CFD3',fontSize:10,lineHeight:17,fontFamily:fonts.body,marginTop:7}});
