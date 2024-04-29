import OverviewCard from "./overviewCard";

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
        qty={totalInventoryQtyData}
        value={`${totalInventoryValueData}`}
        qtyDescription="Total Quantity"
        valueDescription="Total Value"
      />
      <OverviewCard
        title="Used YTD"
        qty={usedYtdQuantityData}
        value={`$${usedYtdValueData}`}
        qtyDescription="Total Used"
        valueDescription="Total Value"
      />
    </div>
  );
}
