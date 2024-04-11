// showData.js
import { createClient } from "@/app/utils/supabase/client";

export async function getInventory() {
  const supabase = createClient();

  const { data: inventory, error } = await supabase
    .from("inventory")
    .select("*");
  if (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
  return inventory;
}
