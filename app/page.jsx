import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InventoryTable from "@/app/inventory/inventoryTable";
import Overview from "@/app/inventory/overview/overview";
import { getOverviewStats } from "@/app/data/overviewData";
import { getUserRole } from "@/app/data/userProfile";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/login");
  }
  const userRole = await getUserRole(supabase, user);

  const {
    totalInventoryQty: totalInventoryQtyData,
    totalInventoryValue: totalInventoryValueData,
    usedYtdQuantity: usedYtdQuantityData,
    usedYtdValue: usedYtdValueData,
  } = await getOverviewStats(supabase);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <h1 className="text-3xl text-center font-bold mt-4">Inventory</h1>
      <div className="flex justify-center p-4">
        <Overview
          totalInventoryQtyData={totalInventoryQtyData}
          totalInventoryValueData={totalInventoryValueData}
          usedYtdQuantityData={usedYtdQuantityData}
          usedYtdValueData={usedYtdValueData}
        />
      </div>
      <div className="flex-1 p-4">
        <InventoryTable userRole={userRole} />
      </div>
    </div>
  );
}
