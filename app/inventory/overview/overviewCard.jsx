export default function OverviewCard({
  title,
  qty,
  value,
  qtyDescription,
  valueDescription,
  isCentered = false,
  Icon,
}) {
  return isCentered ? (
    <div className="p-6 bg-white rounded-lg shadow min-w-[300px]">
      <h3 className="text-sm font-medium text-muted-foreground flex justify-center">{title}</h3>
      <div className="flex justify-center">
        <p className="text-2xl font-bold">{qty}</p>
      </div>
      <div className="flex justify-center">
        <p className="text-sm text-muted-foreground">{qtyDescription}</p>
      </div>
    </div>
  ) : (
    <div className="p-6 bg-white rounded-lg shadow min-w-[300px]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="flex justify-between items-baseline">
        <p className="text-2xl font-bold">{qty}</p>
        <p className="text-2xl font-bold text-right">{value}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{qtyDescription}</p>
        <p className="text-sm text-muted-foreground">{valueDescription}</p>
      </div>
    </div>
  );
}
