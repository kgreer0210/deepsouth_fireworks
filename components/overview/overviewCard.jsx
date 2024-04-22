export default function OverviewCard({
  title,
  qty,
  value,
  qtyDescription,
  valueDescription,
  isCentered = false,
}) {
  return isCentered ? (
    <div className="p-4 bg-white rounded-lg shadow min-w-[300px]">
      <h1 className="font-bold flex justify-center">{title}</h1>
      <div className="flex justify-center">
        <p>{qty}</p>
      </div>
      <div className="flex justify-center">
        <p className="text-sm text-gray-500">{qtyDescription}</p>
      </div>
    </div>
  ) : (
    <div className="p-4 bg-white rounded-lg shadow min-w-[300px]">
      <h1 className="font-bold">{title}</h1>
      <div className="flex justify-between">
        <p>{qty}</p>
        <p className="text-left">{value}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500">{qtyDescription}</p>
        <p className="text-sm text-gray-500">{valueDescription}</p>
      </div>
    </div>
  );
}
