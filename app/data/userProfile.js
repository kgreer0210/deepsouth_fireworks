export async function getUserRole(supabase, user = null) {
  const resolvedUser = user ?? (await supabase.auth.getUser()).data?.user;
  if (!resolvedUser) return 'viewer';
  const { data } = await supabase.from('profiles').select('role').eq('id', resolvedUser.id).single();
  return data?.role?.toLowerCase() ?? 'viewer';
}
