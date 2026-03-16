import { createClient } from '@/utils/supabase/server';

export async function getUserRole(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return data?.role ?? 'viewer';
}
