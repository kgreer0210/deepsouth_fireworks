import OverviewCard from "./overviewCard";
import { Package, TrendingDown } from "lucide-react";

export default function Overview({
  totalInventoryQtyData,
  totalInventoryValueData,
  usedYtdQuantityData,
  usedYtdValueData,
  lowStockItemsData,
}) {
  return (
    <div className="flex gap-4">
      <OverviewCard
        title="Total Inventory"
        qty={Number(totalInventoryQtyData).toLocaleString("en-US")}
        value={`$${totalInventoryValueData}`}
        qtyDescription="Total Quantity"
        valueDescription="Total Value"
        Icon={Package}
      />
      <OverviewCard
        title="Used YTD"
        qty={Number(usedYtdQuantityData).toLocaleString("en-US")}
        value={`$${usedYtdValueData}`}
        qtyDescription="Total Used"
        valueDescription="Total Value"
        Icon={TrendingDown}
      />
    </div>
  );
}
