import { createClient } from "@/app/utils/supabase/client";
import { IndividualItem } from "@/components/component/individual-item";

async function getIndividualInventory(id) {
  const supabase = createClient();

  const { data: inventory, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("inventory_id", id);
  if (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
  return inventory;
}
export default async function IndividualItemPage({ params }) {
  const item = await getIndividualInventory(params.inventory_id);
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <IndividualItem
        nameOfItem={item[0].name}
        category={item[0].category}
        quantity={item[0].quantity}
        price={item[0].price}
        caseWeight={item[0].case_weight}
        itemsPerCase={item[0].items_per_case}
        duration={item[0].duration}
        container={item[0].container}
        barcode={item[0].barcode}
        videoUrl={item[0].video_url}
        exNumber={item[0].ex_number}
        size={item[0].size}
      />
    </div>
  );
}
