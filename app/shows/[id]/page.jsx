// app/shows/[id]/page.js
import { DataTable } from "@/app/inventory/data-table";
import { columns } from "@/app/inventory/columns";
import { createClient } from "@/app/utils/supabase/client";
import IndiviualShowHeader from "@/app/shows/showComponents/individualShowHeader";
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
  const inventory = await getInventory();

  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <h1 className="text-2xl text-center font-bold mt-4">Inventory</h1>
      <div className="flex justify-center p-4">
        <IndiviualShowHeader show={show} />
      </div>
      <div className="flex-1 p-4">
        <DataTable columns={columns} data={inventory} />
      </div>
    </div>
  );
}
