import { createClient } from "@/utils/supabase/server";

const PAGE_SIZE = 1000;

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(amount) {
  return toNumber(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function currentYearDateRange() {
  const year = new Date().getFullYear();
  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`,
  };
}

async function fetchAllRows(buildQuery) {
  const rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await buildQuery().range(
      from,
      from + PAGE_SIZE - 1
    );
    if (error) {
      throw error;
    }

    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) {
      break;
    }
    from += PAGE_SIZE;
  }

  return rows;
}

export async function getOverviewStats(supabaseClient) {
  try {
    const supabase = supabaseClient ?? (await createClient());
    const { start, end } = currentYearDateRange();
    const [inventory, usedYtd] = await Promise.all([
      fetchAllRows(() => supabase.from("inventory").select("price, quantity")),
      fetchAllRows(() =>
        supabase
          .from("show_inventory")
          .select("quantity, total_price, shows!inner(date_of_show)")
          .gte("shows.date_of_show", start)
          .lte("shows.date_of_show", end)
      ),
    ]);

    const totalInventoryQty = inventory.reduce(
      (acc, row) => acc + toNumber(row.quantity),
      0
    );
    const totalInventoryValue = inventory.reduce(
      (acc, { price, quantity }) => acc + toNumber(price) * toNumber(quantity),
      0
    );
    const usedYtdQuantity = usedYtd.reduce(
      (acc, row) => acc + toNumber(row.quantity),
      0
    );
    const usedYtdValue = usedYtd.reduce(
      (acc, row) => acc + toNumber(row.total_price),
      0
    );

    return {
      totalInventoryQty,
      totalInventoryValue: formatCurrency(totalInventoryValue),
      usedYtdQuantity,
      usedYtdValue: formatCurrency(usedYtdValue),
    };
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    return {
      totalInventoryQty: 0,
      totalInventoryValue: formatCurrency(0),
      usedYtdQuantity: 0,
      usedYtdValue: formatCurrency(0),
    };
  }
}
