import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "../utils/supabase/server";

async function getData() {
  const supabase = createClient();
  let { data: inventory, error } = await supabase.from("inventory").select("*");
  if (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
  return inventory;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
