"use client";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const filterByNameOrCategory = (row, columnId, value, addMeta) => {
  const searchQuery = value.toLowerCase();
  const nameMatches = row.getValue("name").toLowerCase().includes(searchQuery);
  const categoryMatches = row
    .getValue("category")
    .toLowerCase()
    .includes(searchQuery);

  const passed = nameMatches || categoryMatches;

  addMeta({
    passed,
  });

  return passed;
};

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    filterFn: filterByNameOrCategory,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: filterByNameOrCategory,
  },
  // case_weight
  {
    accessorKey: "case_weight",
    header: "Case Weight",
  },
  //items_per_case
  {
    accessorKey: "items_per_case",
    header: "Items Per Case",
  },
  //video_url
  {
    accessorKey: "video_url",
    header: "Video URL",
  },
  //barcode
  {
    accessorKey: "barcode",
    header: "Barcode",
  },
  //ex_number
  {
    accessorKey: "ex_number",
    header: "EX Number",
  },
  //notes
  {
    accessorKey: "notes",
    header: "Notes",
  },
  //size
  {
    accessorKey: "size",
    header: "Size",
  },
  //container
  {
    accessorKey: "container",
    header: "Container",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit Item</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
