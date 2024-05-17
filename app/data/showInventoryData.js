// showInventoryData.js
import { createClient } from "@/utils/supabase/server";

export async function getShowInventory(showId) {
  const supabase = createClient();

  const { data: showInventory, error } = await supabase
    .from("show_inventory")
    .select("*")
    .eq("show_id", showId);

  if (error) {
    console.error("Error fetching show inventory:", error);
    return [];
  }

  return showInventory;
}
