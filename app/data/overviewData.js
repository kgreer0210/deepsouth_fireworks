"use client";

import { createClient } from "@/app/utils/supabase/client";

const supabase = createClient();
export async function getTotalInventoryQuantity() {
  try {
    const { data, error } = await supabase.from("inventory").select("quantity");
    if (error) {
      console.error("Error fetching total quantity:", error);
      return 0; // Return 0 in case of an error
    }
    const totalQuantity = data.reduce(
      (acc, currVal) => acc + currVal.quantity,
      0
    );
    return totalQuantity;
  } catch (error) {
    console.error("Error fetching total quantity:", error);
    return 0; // Return 0 in case of an error
  }
}

export async function getTotalInventoryValue() {
  try {
    const { data, error } = await supabase
      .from("inventory")
      .select("price, quantity");
    if (error) {
      console.error("Error fetching total value:", error);
      return 0; // Return 0 in case of an error
    }
    const totalValue = data
      .reduce(
        (acc, { price, quantity }) => acc + price * (quantity || 0), // Make sure quantity is a number
        0
      )
      .toFixed(2) // Round to 2 decimals
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return totalValue;
  } catch (error) {
    console.error("Error fetching total value:", error);
    return 0; // Return 0 in case of an error
  }
}

export async function getUsedYtdQuantity() {
  try {
    const { data, error } = await supabase
      .from("show_inventory")
      .select("quantity");

    if (error) {
      console.error("Error fetching used ytd:", error);
      return 0; // Return 0 in case of an error
    }
    const usedYtdQuantity = data.reduce(
      (acc, currVal) => acc + currVal.quantity,
      0
    );
    return usedYtdQuantity;
  } catch (error) {
    console.error("Error fetching used ytd:", error);
    return 0; // Return 0 in case of an error
  }
}

export async function getUsedYtdValue() {
  try {
    const { data, error } = await supabase
      .from("show_inventory")
      .select("total_price");
    if (error) {
      console.error("Error fetching used ytd value:", error);
      return 0; // Return 0 in case of an error
    }
    const usedYtdValue = data
      .reduce((acc, currVal) => acc + currVal.total_price, 0)
      .toFixed(2) // Round to 2 decimals
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas;
    return usedYtdValue;
  } catch (error) {
    console.error("Error fetching used ytd value:", error);
    return 0; // Return 0 in case of an error
  }
}

export async function getLowStockItems() {
  try {
    const { data, error } = await supabase
      .from("inventory")
      .select("quantity")
      .lte("quantity", 10);
    if (error) {
      console.error("Error fetching low stock items:", error);
      return []; // Return an empty array in case of an error
    }
    return data;
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    return []; // Return an empty array in case of an error
  }
}
