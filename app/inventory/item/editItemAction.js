"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logAction } from "@/app/data/auditLog";
import { getUserRole } from "@/app/data/userProfile";

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
  const { data: { user } } = await supabase.auth.getUser();
  const role = await getUserRole(supabase, user);
  if (role !== 'admin') return { success: false, message: 'Unauthorized' };

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

  try {
    const { data: { user } } = await supabase.auth.getUser();
    await logAction(supabase, user?.id, 'inventory.updated', {
      inventory_id: itemId,
      fields_changed: { name, category, quantity, price, case_weight: caseWeight, items_per_case: itemsPerCase, duration, container, video_url: videoURL, size, barcode, ex_number: exNumber, notes },
    });
  } catch (_) {}

  return { success: true, message: "Item updated successfully" };
}
