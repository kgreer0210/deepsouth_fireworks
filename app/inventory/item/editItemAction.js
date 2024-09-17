"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function editItemServer(formData, itemId) {
  const name = formData.get("name");
  const category = formData.get("category");
  const quantity = formData.get("quantity");
  const price = formData.get("price");
  const caseWeight = formData.get("case_weight");
  const itemsPerCase = formData.get("items_per_case");
  const duration = formData.get("duration");
  const container = formData.get("container");
  const videoURL = formData.get("video_url");
  const size = formData.get("size");
  const barcode = formData.get("barcode");
  const exNumber = formData.get("ex_number");
  const notes = formData.get("notes");

  const supabase = createClient();
  const { error } = await supabase
    .from("inventory")
    .update({
      name: name,
      category: category,
      quantity: quantity,
      price: price,
      case_weight: caseWeight,
      items_per_case: itemsPerCase,
      duration: duration,
      container: container,
      video_url: videoURL,
      size: size,
      barcode: barcode,
      ex_number: exNumber,
      notes: notes,
    })
    .eq("inventory_id", itemId);

  revalidatePath(`/inventory/item/${itemId}`);

  if (error) {
    return { success: false, message: "Failed to update item" };
  }
  return { success: true, message: "Item updated successfully" };
}
