import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

async function handleAuthUrl(url: string) {
  const [beforeHash, hash = ''] = url.split('#');
  const query = beforeHash.includes('?') ? beforeHash.split('?')[1] : '';
  const params = new URLSearchParams([query, hash].filter(Boolean).join('&'));
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const type = params.get('type');

  if (!accessToken || !refreshToken) return;
  const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (error) return;
  router.replace(type === 'recovery' ? '/reset-password' : '/');
}

export function AuthDeepLinkHandler() {
  useEffect(() => {
    void Linking.getInitialURL().then(url => { if (url) void handleAuthUrl(url); });
    const listener = Linking.addEventListener('url', ({ url }) => { void handleAuthUrl(url); });
    return () => listener.remove();
  }, []);
  return null;
}
