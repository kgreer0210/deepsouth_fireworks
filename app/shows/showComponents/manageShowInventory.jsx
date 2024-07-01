"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function ManageShowInventory({ show, onClose }) {
  const [showInventory, setShowInventory] = useState([]);
  const [quantityChanges, setQuantityChanges] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchShowInventory();
  }, [show.show_id]);

  const fetchShowInventory = async () => {
    const { data, error } = await supabase
      .from("show_firework_details")
      .select("*")
      .eq("show_id", show.show_id);

    if (error) {
      console.error("Error fetching show inventory:", error);
      toast({
        title: "Error",
        description: "Failed to fetch show inventory.",
        variant: "destructive",
      });
    } else {
      setShowInventory(data);
    }
  };

  const handleQuantityChange = (inventoryId, value) => {
    setQuantityChanges((prev) => ({
      ...prev,
      [inventoryId]: Math.max(0, parseInt(value) || 0),
    }));
  };

  const handleUpdateInventory = async () => {
    try {
      setIsUpdating(true);
      let hasErrors = false;

      for (const [inventoryId, newQuantity] of Object.entries(
        quantityChanges
      )) {
        try {
          if (newQuantity === 0) {
            const { error } = await supabase
              .from("show_inventory")
              .delete()
              .eq("show_id", show.show_id)
              .eq("inventory_id", inventoryId);

            if (error) throw error;
          } else {
            const { error } = await supabase.rpc("update_show_inventory", {
              p_inventory_id: parseInt(inventoryId),
              p_new_quantity: newQuantity,
              p_show_id: show.show_id,
            });

            if (error) throw error;
          }

          toast({
            title: "Success",
            description: `Updated inventory item ${inventoryId}`,
          });
        } catch (error) {
          console.error(`Error updating item ${inventoryId}:`, error);
          toast({
            title: "Error",
            description: `Failed to update inventory item ${inventoryId}. ${error.message}`,
            variant: "destructive",
          });
          hasErrors = true;
        }
      }
    } catch (error) {
      console.error("Unexpected error in handleUpdateInventory:", error);
    } finally {
      setIsUpdating(false);
      onClose();
      setQuantityChanges({});
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <h2 className="text-2xl font-bold mb-4">Manage Show Inventory</h2>
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Current Quantity</TableHead>
              <TableHead>New Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showInventory.map((item) => (
              <TableRow key={item.inventory_id}>
                <TableCell>{item.firework_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={quantityChanges[item.inventory_id] ?? item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.inventory_id, e.target.value)
                    }
                    className="w-20"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleUpdateInventory} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Inventory"}
        </Button>
      </div>
    </div>
  );
}
