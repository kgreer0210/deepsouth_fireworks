// showInventoryData.js
import { createClient } from "@/utils/supabase/server";

export async function getShowSummary(showId) {
  const supabase = createClient();

  const { data: showSummary, error } = await supabase
    .from("show_summary")
    .select("*")
    .eq("show_id", showId);

  if (error) {
    console.error("Error fetching show summary:", error);
    return [];
  }

  return showSummary;
}
