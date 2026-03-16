// app/shows/[id]/page.js
import IndiviualShow from "@/app/shows/showComponents/individualShow";
import { getShowSummary } from "@/app/data/showSummary";
import { createClient } from "@/utils/supabase/server";
import { getShowInventoryDetails } from "@/app/data/detailedShowInventory";
import { getInventory } from "@/app/data/inventoryData";
import { getUserRole } from "@/app/data/userProfile";
import { redirect } from "next/navigation";

async function getShow(id) {
  const supabase = await createClient();
  const { data: show, error } = await supabase
    .from("shows")
    .select("*")
    .eq("show_id", id)
    .single();

  if (error) {
    console.error("Error fetching show:", error);
    return null;
  }
  return show;
}

export default async function ShowPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect('/login');
  const userRole = await getUserRole(supabase, user);

  const show = await getShow(id);
  const showSummary = await getShowSummary(id);
  const showInventory = await getShowInventoryDetails(id);
  const inventoryData = await getInventory();
  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <h1 className="text-3xl text-center font-bold mt-4">Show Details</h1>
      <div className="justify-center p-4">
        <IndiviualShow
          show={show}
          initialShowSummary={showSummary}
          showInventory={showInventory}
          inventoryData={inventoryData}
          userRole={userRole}
        />
      </div>
    </div>
  );
}
