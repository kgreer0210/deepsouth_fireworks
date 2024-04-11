// showData.js
import { createClient } from "@/app/utils/supabase/client";

export async function getShowInventory() {
  const supabase = createClient();

  const { data: showInventory, error } = await supabase
    .from("show_inventory")
    .select("*");
  if (error) {
    console.error("Error fetching shows:", error);
    return [];
  }
  return showInventory;
}
