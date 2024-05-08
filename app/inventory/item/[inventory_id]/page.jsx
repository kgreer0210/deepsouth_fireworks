import { createClient } from "@/utils/supabase/client";
import { IndividualItem } from "../individual-item";

async function getIndividualInventory(id) {
  const supabase = createClient();

  const { data: inventory, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("inventory_id", id);
  if (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
  return inventory;
}
export default async function IndividualItemPage({ params }) {
  const item = await getIndividualInventory(params.inventory_id);
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <IndividualItem item={item[0]} />
    </div>
  );
}
