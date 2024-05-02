// showData.js
import { createClient } from "@/utils/supabase/client";

export async function getShows() {
  const supabase = createClient();

  const { data: shows, error } = await supabase.from("shows").select("*");
  if (error) {
    console.error("Error fetching shows:", error);
    return [];
  }
  return shows;
}
