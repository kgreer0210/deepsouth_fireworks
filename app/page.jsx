import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";
import SignoutButton from "@/components/ui/signOutButton";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <main className="flex flex-col justify-center items-center">
      <div className="flex flex-1 justify-center bg-slate-400 h-screen">
        <h1 className="text-2xl">Main Page</h1>
      </div>
      <div className="flex flex-1 justify-center bg-red-200 h-screen">
        <p>User is {data.user.email}</p>
      </div>
      <SignoutButton />
    </main>
  );
}
