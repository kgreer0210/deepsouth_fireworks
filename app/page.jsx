import { columns } from "@/app/inventory/columns";
import { DataTable } from "@/app/inventory/data-table";
import { getInventory } from "./data/inventoryData";
import Overview from "@/components/overview/overview";

export default async function Home() {
  const data = await getInventory();
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <h1 className="text-2xl text-center font-bold mt-4">Inventory</h1>
      <div className="flex justify-center p-4">
        <Overview />
      </div>
      <div className="flex-1 p-4">
        <DataTable columns={columns} data={data} isMainPage={true} />
      </div>
    </div>
  );
}
