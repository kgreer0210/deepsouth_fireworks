// inventoryData.js
import { createClient } from "@/utils/supabase/client";

export async function getInventory() {
  const supabase = createClient();

  const { data: inventory, error } = await supabase
    .from("inventory")
    .select("*")
    .gte("quantity", 1);
  if (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
  return inventory;
}

export async function deleteInventory(id) {
  const supabase = createClient();

  const { error } = await supabase
    .from("inventory")
    .delete()
    .eq("inventory_id", id);

  if (error) {
    console.error("Error deleting inventory item:", error);
    return;
  }
}
