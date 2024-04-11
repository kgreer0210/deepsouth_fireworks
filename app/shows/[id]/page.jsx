// app/shows/[id]/page.js
import { DataTable } from "@/app/inventory/data-table";
import { columns } from "@/app/inventory/columns";
import { createClient } from "@/app/utils/supabase/client";
import Sidebar from "@/components/sidebar";
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <IndiviualShowHeader show={show} />
          <div className="py-8">
            <div className="">
              <DataTable columns={columns} data={inventory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
