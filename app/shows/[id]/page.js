// app/shows/[id]/page.js
import { DataTable } from "@/app/inventory/data-table";
import { columns } from "@/app/inventory/columns";
import { createClient } from "@/app/utils/supabase/client";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/sidebar";

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
async function getInventoryData() {
  const supabase = createClient();
  const { data: inventory, error } = await supabase
    .from("inventory")
    .select("*");
  if (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
  return inventory;
}

export default async function ShowPage({ params }) {
  const show = await getShow(params.id);
  const inventory = await getInventoryData();

  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="container mx-auto py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Inventory Assigned to {show.name}
            </h2>
            <Progress value={25} className="w-[30%]" />
            <div className="flex space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Print
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Delete Show
              </button>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between mt-2">
              <h1>List of Items in Show Here</h1>
            </div>
          </div>
        </div>
        <div className="py-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <DataTable columns={columns} data={inventory} />
          </div>
        </div>
      </div>
    </div>
  );
}
