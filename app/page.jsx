import { columns } from "@/app/inventory/columns";
import { DataTable } from "@/app/inventory/data-table";
import { createClient } from "@/app/utils/supabase/server";
import Sidebar from "@/components/sidebar";
import SignoutButton from "@/components/ui/signOutButton";
import { redirect } from "next/navigation";

//async function to validate user is logged in
async function validateUser() {
  const supabase = createClient();
  const user = supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
}

async function getData() {
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

export default async function Home() {
  await validateUser();
  const data = await getData();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <div className="flex-1 p-8">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
