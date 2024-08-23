"use client";

import { useRealTimeInventory } from "./useRealTimeInventory";
import { DataTable } from "@/app/inventory/data-table";
import { columns } from "@/app/inventory/columns";

export default function InventoryTable() {
  const { inventory, error } = useRealTimeInventory();

  if (error) {
    return <div>Error loading inventory: {error.message}</div>;
  }

  return <DataTable columns={columns} data={inventory} isMainPage={true} />;
}
