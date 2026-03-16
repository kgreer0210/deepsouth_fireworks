export async function getUserRole(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'viewer';
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return data?.role ?? 'viewer';
}
