// individualShow.jsx

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ShowInventoryDataTable } from "./selectShowInventoryDataTable";
import { showInventoryColumns } from "./selectShowInventoryColumns";
import { ManageShowInventory } from "./manageShowInventory";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import PrintableShowDetails from "./PrintableShowDetails";

const supabase = createClient();

export default function IndividualShow({
  show,
  initialShowSummary,
  showInventory,
  inventoryData,
}) {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(initialShowSummary);
  const [showInventoryDetails, setShowInventoryDetails] =
    useState(showInventory);
  const [currentInventoryData, setInventoryData] = useState(inventoryData);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [manageInventoryDialogOpen, setManageInventoryDialogOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const printableRef = useRef();

  const handlePrint = useCallback(() => {
    const printContent = printableRef.current;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${show.name} - Show Details</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { width: 90%; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; }
            .print-button { display: none; }
            @media print {
              .print-button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${printContent.innerHTML}
            <br>
            <button class="print-button" onclick="window.print()">Print</button>
          </div>
          <script>
            document.querySelector('.print-button').style.display = 'block';
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  }, [show.name]);
  const handleDeleteShow = async () => {
    setIsDeleting(true);

    try {
      // First, get all items currently in the show
      const { data: showItems, error: fetchError } = await supabase
        .from("show_inventory")
        .select("*")
        .eq("show_id", show.show_id);

      if (fetchError) throw fetchError;

      // For each item, update the inventory
      for (const item of showItems) {
        const { error: updateError } = await supabase.rpc(
          "update_show_inventory",
          {
            p_inventory_id: item.inventory_id,
            p_new_quantity: 0, // Set to 0 to remove from show
            p_show_id: show.show_id,
          }
        );

        if (updateError) throw updateError;
      }

      // Now delete the show
      const { error: deleteError } = await supabase
        .from("shows")
        .delete()
        .eq("show_id", show.show_id);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Show deleted successfully and inventory updated.",
      });
      setShowSummary([]);
      setShowInventoryDetails([]);

      // Navigate back to the shows list or dashboard
      router.push("/shows");
    } catch (error) {
      console.error("Error during show deletion:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during show deletion.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>Manage Show Inventory</DialogTitle>
              </DialogHeader>
              <div className="flex-grow overflow-auto p-6 pt-0">
                <ManageShowInventory
                  show={show}
                  onClose={handleManageInventoryDialogClose}
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handlePrint}>Print</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Show</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  show and return all assigned items to the inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteShow}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-center mt-2">
          {showInventoryDetails.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"
                  >
                    Firework
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"
                  >
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {showInventoryDetails.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                      {item.firework_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
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
        {show && showSummary.length > 0 && (
          <div style={{ display: "none" }}>
            <div ref={printableRef}>
              <PrintableShowDetails
                show={show}
                showSummary={showSummary[0]}
                showInventoryDetails={showInventoryDetails}
              />
            </div>
          </div>
        )}
        <Toaster />
      </div>
    </div>
  );
}
