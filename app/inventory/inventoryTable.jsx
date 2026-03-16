"use client";

import { useRealTimeInventory } from "./useRealTimeInventory";
import { DataTable } from "@/app/inventory/data-table";
import { createColumns } from "@/app/inventory/columns";

export default function InventoryTable({ userRole }) {
  const { inventory, error } = useRealTimeInventory();

  if (error) {
    return <div>Error loading inventory: {error.message}</div>;
  }

  return <DataTable columns={createColumns(userRole)} data={inventory} isMainPage={true} userRole={userRole} />;
}
