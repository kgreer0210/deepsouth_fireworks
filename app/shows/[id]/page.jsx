// app/shows/[id]/page.js
import IndiviualShowHeader from "@/app/shows/showComponents/individualShowHeader";
import { getShowSummary } from "@/app/data/showSummary";
import { createClient } from "@/utils/supabase/server";
import { getShowInventoryDetails } from "@/app/data/detailedShowInventory";
import { getInventory } from "@/app/data/inventoryData";

async function getShow(id) {
  const supabase = createClient();
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
  const show = await getShow(params.id);
  const showSummary = await getShowSummary(params.id);
  const showInventory = await getShowInventoryDetails(params.id);
  const inventoryData = await getInventory();
  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <h1 className="text-2xl text-center font-bold mt-4">Inventory</h1>
      <div className="justify-center p-4">
        <IndiviualShowHeader
          show={show}
          initialShowSummary={showSummary}
          showInventory={showInventory}
          inventoryData={inventoryData}
        />
      </div>
    </div>
  );
}
