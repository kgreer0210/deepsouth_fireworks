import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/app/data/userProfile';
import { redirect } from 'next/navigation';
import ShowsPageClient from './showsPageClient';

export default async function ShowsPage() {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect('/login');
  const userRole = await getUserRole(supabase, user);
  return <ShowsPageClient userRole={userRole} />;
}
