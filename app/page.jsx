import { columns } from "@/app/inventory/columns";
import { DataTable } from "@/app/inventory/data-table";
import { createClient } from "@/app/utils/supabase/server";
import Sidebar from "@/components/sidebar";
import { redirect } from "next/navigation";
import { getInventory } from "./data/inventoryData";
//async function to validate user is logged in
async function validateUser() {
  const supabase = createClient();
  const user = supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
}

export default async function Home() {
  await validateUser();
  const data = await getInventory();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Overview section</h1>
        </div>
        <div className="flex-1 p-4">
          <DataTable columns={columns} data={data} isMainPage={true} />
        </div>
      </div>
    </div>
  );
}
