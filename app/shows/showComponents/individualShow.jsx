// individualShow.jsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShowInventoryDataTable } from "./selectShowInventoryDataTable";
import { showInventoryColumns } from "./selectShowInventoryColumns";
import { ManageShowInventory } from "./ManageShowInventory";
import { Toaster } from "@/components/ui/toaster";

const supabase = createClient();

export default function IndividualShow({
  show,
  initialShowSummary,
  showInventory,
  inventoryData,
}) {
  const [showSummary, setShowSummary] = useState(initialShowSummary);
  const [showInventoryDetails, setShowInventoryDetails] =
    useState(showInventory);
  const [currentInventoryData, setInventoryData] = useState(inventoryData);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [manageInventoryDialogOpen, setManageInventoryDialogOpen] =
    useState(false);

  const fetchShowSummary = useCallback(async () => {
    const { data, error } = await supabase
      .from("show_summary")
      .select("*")
      .eq("show_id", show.show_id);
    if (error) {
      console.error("Error fetching show summary:", error);
    } else {
      setShowSummary(data);
    }
  }, [show.show_id]);

  const fetchShowInventory = useCallback(async () => {
    const { data, error } = await supabase
      .from("show_firework_details")
      .select("*")
      .eq("show_id", show.show_id);
    if (error) {
      console.error("Error fetching show inventory:", error);
    } else {
      setShowInventoryDetails(data);
    }
  }, [show.show_id]);

  const fetchInventory = useCallback(async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .gte("quantity", 1);
    if (error) {
      console.error("Error fetching inventory:", error);
    } else {
      setInventoryData(data);
    }
  }, []);

  const refreshAllData = useCallback(() => {
    fetchShowSummary();
    fetchShowInventory();
    fetchInventory();
  }, [fetchShowSummary, fetchShowInventory, fetchInventory]);

  useEffect(() => {
    const handlePayload = () => {
      refreshAllData();
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

    refreshAllData();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(showsChannel);
      supabase.removeChannel(showInventoryChannel);
    };
  }, [refreshAllData]);

  const handleAddItemDialogClose = () => {
    setAddItemDialogOpen(false);
    refreshAllData();
  };

  const handleManageInventoryDialogClose = useCallback(() => {
    setManageInventoryDialogOpen(false);
    refreshAllData();
  }, [refreshAllData]);

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
          <Dialog
            open={manageInventoryDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleManageInventoryDialogClose();
              } else {
                setManageInventoryDialogOpen(true);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setManageInventoryDialogOpen(true)}>
                Manage Inventory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>Manage Show Inventory</DialogTitle>
              </DialogHeader>
              <div className="p-6 pt-0">
                <ManageShowInventory
                  show={show}
                  onClose={handleManageInventoryDialogClose}
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button>Print</Button>
          <Button variant="destructive">Delete Show</Button>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-center mt-2">
          {showInventoryDetails.length > 0 ? (
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
          ) : (
            <p className="text-center text-xl text-gray-500">
              There are no items assigned to this show
            </p>
          )}
        </div>
        <div className="flex justify-center mt-2">
          <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setAddItemDialogOpen(true)}
              >
                Add Item to Show
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>Add Items to Show</DialogTitle>
                <DialogDescription>
                  Please select the fireworks you would like to add to this
                  show.
                </DialogDescription>
              </DialogHeader>
              <div className="p-6 pt-0">
                <ShowInventoryDataTable
                  columns={showInventoryColumns}
                  data={currentInventoryData}
                  show={show}
                  onClose={handleAddItemDialogClose}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Toaster />
      </div>
    </div>
  );
}
