"use client";

import { useEffect, useState } from "react";
import OverviewCard from "./overviewCard";
import {
  getTotalInventoryQuantity,
  getLowStockItems,
  getTotalInventoryValue,
  getUsedYtdQuantity,
  getUsedYtdValue,
} from "../../app/data/overviewData";

export default function Overview() {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [usedYtdQuantity, setUsedYtdQuantity] = useState(0);
  const [usedYtdValue, setUsedYtdValue] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const total = await getTotalInventoryQuantity();
      const totalValue = await getTotalInventoryValue();
      const lowStock = await getLowStockItems();
      const usedYtdQuantity = await getUsedYtdQuantity();
      const usedYtdValue = await getUsedYtdValue();
      setLowStockItems(lowStock.length);
      setTotalQuantity(total);
      setTotalValue(totalValue);
      setUsedYtdQuantity(usedYtdQuantity);
      setUsedYtdValue(usedYtdValue);
    }

    fetchData();
  }, []);

  return (
    <div className="flex gap-4">
      <OverviewCard
        title="Total Inventory"
        qty={totalQuantity}
        value={`$${totalValue}`}
        qtyDescription="Total Quantity"
        valueDescription="Total Value"
      />
      <OverviewCard
        title="Used YTD"
        qty={usedYtdQuantity}
        value={`$${usedYtdValue}`}
        qtyDescription="Total Used"
        valueDescription="Total Value"
      />
      <OverviewCard
        title="Low Stock (<10)"
        qty={lowStockItems}
        qtyDescription="Total Low Stock"
        isCentered
      />
    </div>
  );
}
