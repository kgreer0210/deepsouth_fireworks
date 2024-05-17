"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const supabase = createClient();

export default function IndiviualShowHeader({
  show,
  initialShowSummary,
  showInventory,
}) {
  const [showSummary, setShowSummary] = useState(initialShowSummary);
  const [showInventoryDetails, setShowInventoryDetails] =
    useState(showInventory);

  useEffect(() => {
    const showId = show.show_id;

    const fetchShowSummary = async () => {
      const { data, error } = await supabase
        .from("show_summary")
        .select("*")
        .eq("show_id", showId);
      if (error) {
        console.error("Error fetching show summary:", error);
      } else {
        setShowSummary(data);
      }
    };

    const fetchShowInventory = async () => {
      const { data, error } = await supabase
        .from("show_firework_details")
        .select("*")
        .eq("show_id", showId);
      if (error) {
        console.error("Error fetching show inventory:", error);
      } else {
        setShowInventoryDetails(data);
      }
    };

    const handlePayload = () => {
      fetchShowSummary();
    };

    const inventoryChannel = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        handlePayload
      )
      .subscribe();

    const showsChannel = supabase
      .channel("shows-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shows" },
        handlePayload
      )
      .subscribe();

    const showInventoryChannel = supabase
      .channel("show_inventory-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "show_inventory" },
        handlePayload
      )
      .subscribe();

    fetchShowSummary();
    fetchShowInventory();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(showsChannel);
      supabase.removeChannel(showInventoryChannel);
    };
  }, [show.show_id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold max-w-72">
          Inventory Assigned to {show.name}
        </h2>
        <div className="w-[30%] max-w-72 m-4">
          <p>
            ${showSummary.length > 0 ? showSummary[0].total_cost : 0} of $
            {showSummary.length > 0 ? showSummary[0].budget : 0} has been used
          </p>
          <Progress
            value={
              showSummary.length > 0
                ? (showSummary[0].total_cost / showSummary[0].budget) * 100
                : 0
            }
          />
        </div>
        <div className="flex space-x-4">
          <Button>Print</Button>
          <Button variant="destructive">Delete Show</Button>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between mt-2">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Firework
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {showInventoryDetails.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.firework_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.total_price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
