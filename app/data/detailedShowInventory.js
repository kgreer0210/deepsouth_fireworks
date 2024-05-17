// detailedShowInventory.js
import { createClient } from "@/utils/supabase/server";

export async function getShowInventoryDetails(showId) {
  const supabase = createClient();

  const { data: showInventoryDetails, error } = await supabase
    .from("show_firework_details")
    .select("*")
    .eq("show_id", showId);

  if (error) {
    console.error("Error fetching show summary:", error);
    return [];
  }

  return showInventoryDetails;
}
