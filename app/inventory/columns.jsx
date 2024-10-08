"use client";
import { useState } from "react";
import { ArrowUpDown, MoreHorizontal, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { deleteInventory } from "../data/inventoryData";
import VideoModal from "@/app/inventory/inventoryComponents/VideoModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const columns = [
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
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
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
    header: "Video",
    cell: ({ row }) => {
      const url = row.getValue("video_url");
      const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

      if (!url) return null;

      return (
        <>
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => setIsVideoModalOpen(true)}
          >
            <Film className="h-4 w-4 mr-2" />
            Watch Video
          </Button>
          <VideoModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            videoUrl={url}
            title={row.getValue("name")}
          />
        </>
      );
    },
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const rowId = row.original;
      const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

      const handleDelete = async () => {
        try {
          await deleteInventory(rowId.inventory_id);
          setIsDeleteDialogOpen(false);
        } catch (error) {
          console.error("Error deleting item:", error);
          // Handle error (e.g., show an error message to the user)
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/inventory/item/${rowId.inventory_id}`}>
                  Edit Item
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 focus:text-red-600 hover:bg-red-100 focus:bg-red-100"
              >
                Delete Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {rowId.video_url && rowId.video_url.trim() !== "" && (
            <VideoModal
              isOpen={isVideoModalOpen}
              onClose={() => setIsVideoModalOpen(false)}
              videoUrl={rowId.video_url}
              title={rowId.name}
            />
          )}
        </>
      );
    },
  },
];
