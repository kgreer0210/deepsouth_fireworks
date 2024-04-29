import { columns } from "@/app/inventory/columns";
import { DataTable } from "@/app/inventory/data-table";
import { getInventory } from "@/app/data/inventoryData";
import {
  getTotalInventoryQuantity,
  getTotalInventoryValue,
  getUsedYtdQuantity,
  getUsedYtdValue,
} from "@/app/data/overviewData";
import Overview from "@/app/inventory/overview/overview";

export default async function Home() {
  const inventoryData = await getInventory();
  const totalInventoryQtyData = await getTotalInventoryQuantity();
  const totalInventoryValueData = await getTotalInventoryValue();
  const usedYtdQuantityData = await getUsedYtdQuantity();
  const usedYtdValueData = await getUsedYtdValue();
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <h1 className="text-2xl text-center font-bold mt-4">Inventory</h1>
      <div className="flex justify-center p-4">
        <Overview
          totalInventoryQtyData={totalInventoryQtyData}
          totalInventoryValueData={totalInventoryValueData}
          usedYtdQuantityData={usedYtdQuantityData}
          usedYtdValueData={usedYtdValueData}
        />
      </div>
      <div className="flex-1 p-4">
        <DataTable columns={columns} data={inventoryData} isMainPage={true} />
      </div>
    </div>
  );
}
