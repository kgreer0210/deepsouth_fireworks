// inventoryData.js
import { createClient } from "@/utils/supabase/client";
import { logAction } from "@/app/data/auditLog";

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

  try {
    const { data: { user } } = await supabase.auth.getUser();
    await logAction(supabase, user?.id, 'inventory.deleted', { inventory_id: id });
  } catch (_) {}
}
