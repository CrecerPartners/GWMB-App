import { supabase } from '@/lib/supabase';

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'successful' | 'unsuccessful';
export type OpportunityApplication = {
  id: string;
  user_id: string;
  opportunity_id: string;
  portfolio_url: string | null;
  motivation: string;
  status: ApplicationStatus;
  submitted_at: string;
  updated_at: string;
};

const savedKey = (userId?: string | null) => `gwmb-saved-opportunities:${userId ?? 'guest'}`;
const applicationsKey = (userId: string) => `gwmb-opportunity-applications:${userId}`;

function readJson<T>(key: string, fallback: T): T {
  try { const value = globalThis.localStorage?.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
}
function writeJson(key: string, value: unknown) {
  try { globalThis.localStorage?.setItem(key, JSON.stringify(value)); } catch { /* Device fallback is best effort. */ }
}

export async function loadSavedOpportunityIds(userId?: string | null) {
  const local = readJson<string[]>(savedKey(userId), []);
  if (!userId) return local;
  const { data, error } = await supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', userId);
  if (error) return local;
  const ids = (data ?? []).map((row) => row.opportunity_id as string);
  writeJson(savedKey(userId), ids);
  return ids;
}

export async function setOpportunitySaved(userId: string | null | undefined, opportunityId: string, saved: boolean) {
  const current = readJson<string[]>(savedKey(userId), []);
  const next = saved ? Array.from(new Set([...current, opportunityId])) : current.filter((id) => id !== opportunityId);
  writeJson(savedKey(userId), next);
  if (!userId) return;
  if (saved) await supabase.from('saved_opportunities').upsert({ user_id:userId, opportunity_id:opportunityId }, { onConflict:'user_id,opportunity_id' });
  else await supabase.from('saved_opportunities').delete().eq('user_id', userId).eq('opportunity_id', opportunityId);
}

export async function loadOpportunityApplications(userId: string) {
  const local = readJson<OpportunityApplication[]>(applicationsKey(userId), []);
  const { data, error } = await supabase.from('opportunity_applications').select('*').eq('user_id', userId).order('submitted_at', { ascending:false });
  if (error) return { applications:local, cloud:false };
  const applications = (data ?? []) as OpportunityApplication[];
  writeJson(applicationsKey(userId), applications);
  return { applications, cloud:true };
}

export async function submitOpportunityApplication(input:{userId:string;opportunityId:string;portfolioUrl:string;motivation:string}) {
  const existing = readJson<OpportunityApplication[]>(applicationsKey(input.userId), []);
  if (existing.some((item) => item.opportunity_id === input.opportunityId)) return { ok:false as const, duplicate:true as const, cloud:false };
  const now = new Date().toISOString();
  const payload = { user_id:input.userId, opportunity_id:input.opportunityId, portfolio_url:input.portfolioUrl || null, motivation:input.motivation, status:'submitted' as const, submitted_at:now, updated_at:now };
  const { data, error } = await supabase.from('opportunity_applications').insert(payload).select('*').single();
  if (!error && data) {
    const next = [data as OpportunityApplication, ...existing];
    writeJson(applicationsKey(input.userId), next);
    return { ok:true as const, duplicate:false as const, cloud:true, application:data as OpportunityApplication };
  }
  if (error?.code === '23505') return { ok:false as const, duplicate:true as const, cloud:true };
  const fallback:OpportunityApplication = { id:`local-${Date.now()}`, ...payload };
  writeJson(applicationsKey(input.userId), [fallback, ...existing]);
  return { ok:true as const, duplicate:false as const, cloud:false, application:fallback };
}
