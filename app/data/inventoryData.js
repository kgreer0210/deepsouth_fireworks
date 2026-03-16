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

  // Check role before deleting
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
      console.error('Unauthorized: only admins can delete inventory');
      return;
    }
  }

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
