import type { Session, User } from '@supabase/supabase-js';
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Membership, Profile } from '@/types/database';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  membership: Membership | null;
  loading: boolean;
  accountError: string | null;
  refreshAccount: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState<string | null>(null);

  const loadAccount = useCallback(async (userId?: string) => {
    if (!userId) {
      setProfile(null);
      setMembership(null);
      setAccountError(null);
      return;
    }
    const [profileResult, membershipResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('memberships').select('*').eq('user_id', userId).maybeSingle(),
    ]);
    const error = profileResult.error ?? membershipResult.error;
    if (error) { setAccountError(error.message); return; }
    setProfile(profileResult.data as Profile | null);
    setMembership(membershipResult.data as Membership | null);
    setAccountError(null);
  }, []);

  const refreshAccount = useCallback(async () => loadAccount(session?.user.id), [loadAccount, session?.user.id]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await loadAccount(data.session?.user.id);
      if (mounted) setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadAccount(nextSession?.user.id);
      setLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [loadAccount]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ session, user: session?.user ?? null, profile, membership, loading, accountError, refreshAccount, signOut }), [accountError, loading, membership, profile, refreshAccount, session, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
