"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const filterFunction = (row, columnId, value) => {
  const name = row.getValue("name")?.toLowerCase() ?? "";
  const category = row.getValue("category")?.toLowerCase() ?? "";
  const duration = row.getValue("duration")?.toLowerCase() ?? "";
  const filterValue = value.toLowerCase();
  return (
    name.includes(filterValue) ||
    category.includes(filterValue) ||
    duration.includes(filterValue)
  );
};

const supabase = createClient();

export function ShowInventoryDataTable({ columns, data, show, onClose }) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});
  const [quantityInputs, setQuantityInputs] = React.useState({});
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleQuantityChange = (inventoryId, value) => {
    setQuantityInputs((prev) => ({
      ...prev,
      [inventoryId]: Math.max(1, parseInt(value) || 1),
    }));
  };

  const handleAssignSelected = async () => {
    setIsProcessing(true);
    const selectedRows = table.getSelectedRowModel().rows;
    let successCount = 0;
    let errorCount = 0;
    let budgetExceededItems = [];

    for (const row of selectedRows) {
      const inventoryId = row.original.inventory_id;
      const quantity = quantityInputs[inventoryId] || 1;

      try {
        // Check if the item already exists in the show inventory
        const { data: existingItem, error: checkError } = await supabase
          .from("show_inventory")
          .select("quantity")
          .eq("show_id", show.show_id)
          .eq("inventory_id", inventoryId)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          throw checkError;
        }

        let result;
        if (existingItem) {
          // Update existing item
          result = await supabase.rpc("update_show_inventory", {
            p_inventory_id: inventoryId,
            p_new_quantity: existingItem.quantity + quantity,
            p_show_id: show.show_id,
          });
        } else {
          // Insert new item
          result = await supabase.rpc("insert_show_inventory", {
            p_inventory_id: inventoryId,
            p_quantity: quantity,
            p_show_id: show.show_id,
          });
        }

        if (result.error) {
          throw result.error;
        }

        successCount++;
        toast.success(
          `${row.original.name} (Quantity: ${quantity}) ${
            existingItem ? "updated" : "added"
          } successfully.`
        );
      } catch (error) {
        console.error("Error assigning/updating item to show:", error);
        errorCount++;
        if (
          error.message &&
          error.message.includes("exceed the show's budget")
        ) {
          budgetExceededItems.push(row.original.name);
        } else {
          toast.error(
            `Failed to add/update ${row.original.name}. ${error.message}`
          );
        }
      }
    }

    if (budgetExceededItems.length > 0) {
      toast.error(
        `Budget Exceeded: Cannot add/update the following items as they would exceed the show's budget: ${budgetExceededItems.join(
          ", "
        )}`
      );
    }

    setIsProcessing(false);
    setRowSelection({});
    setQuantityInputs({});

    // Show a summary toast
    toast(
      `Operation Complete: ${successCount} items processed successfully. ${errorCount} failed.${
        budgetExceededItems.length > 0
          ? ` ${budgetExceededItems.length} items exceeded budget.`
          : ""
      }`
    );

    onClose();
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: filterFunction,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      quantityInputs,
      handleQuantityChange,
    },
    initialState: {
      pagination: {
        pageSize: 10, // Set your desired page size
      },
    },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {" "}
      {/* Adjust the height as needed */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name, category, or duration..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm mr-2"
        />
      </div>
      <div className="rounded-md border flex-grow overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <Button
          onClick={handleAssignSelected}
          disabled={Object.keys(rowSelection).length === 0 || isProcessing}
        >
          {isProcessing ? "Processing..." : "Assign Selected to Show"}
        </Button>
      </div>
    </div>
  );
}
