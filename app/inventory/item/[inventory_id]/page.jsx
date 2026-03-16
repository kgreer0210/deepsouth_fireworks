import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "@/app/data/userProfile";
import { redirect } from "next/navigation";
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
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect('/login');
  const userRole = await getUserRole(supabase, user);

  const item = await getIndividualInventory(params.inventory_id);
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <IndividualItem item={item[0]} userRole={userRole} />
    </div>
  );
}
