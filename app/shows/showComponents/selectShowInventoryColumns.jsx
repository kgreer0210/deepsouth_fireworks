"use client";
import { useState } from "react";
import { ArrowUpDown, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import VideoModal from "@/app/inventory/inventoryComponents/VideoModal";

export const showInventoryColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "quantityToAdd",
    header: "Quantity to Add",
    cell: ({ row, table }) => {
      const inventoryId = row.original.inventory_id;
      // Access quantityInputs and handleQuantityChange from table.options.meta
      const { quantityInputs, handleQuantityChange } = table.options.meta;
      return (
        <Input
          type="number"
          min="1"
          value={quantityInputs[inventoryId] || 1}
          onChange={(e) => handleQuantityChange(inventoryId, e.target.value)}
          className="w-20"
        />
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Available Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "container",
    header: "Container",
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "video_url",
    header: "Video",
    cell: ({ row }) => {
      const url = row.getValue("video_url");
      const [isModalOpen, setIsModalOpen] = useState(false);

      if (!url) return null;

      return (
        <>
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => setIsModalOpen(true)}
          >
            <Film className="h-4 w-4 mr-2" />
            Watch Video
          </Button>
          <VideoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            videoUrl={url}
            title={row.getValue("name")}
          />
        </>
      );
    },
  },
];
