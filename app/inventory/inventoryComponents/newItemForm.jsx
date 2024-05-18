"use client";
import * as React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid number with up to two decimal places"
    ),
  caseWeight: z.number().min(1, "Case Weight must be at least 1"),
  itemsPerCase: z.number().min(1, "Items Per Case must be at least 1"),
  duration: z.string().regex(/^\d+$/, "Duration must be a valid number"),
  container: z.string().min(1, "Container is required"),
  barcode: z.string().min(1, "Barcode is required"),
});

const NewItemForm = ({ open, setOpen, barcodeValue }) => {
  const supabase = createClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 0,
      price: "",
      caseWeight: 0,
      itemsPerCase: 0,
      duration: "",
      container: "",
      barcode: barcodeValue,
    },
  });

  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    const { error } = await supabase.from("inventory").insert([
      {
        name: data.name,
        barcode: data.barcode,
        category: data.category,
        quantity: data.quantity,
        price: parseFloat(data.price),
        case_weight: data.caseWeight,
        items_per_case: data.itemsPerCase,
        duration: `${data.duration} Sec`,
        container: data.container,
      },
    ]);

    if (error) {
      console.error("Error adding item to inventory:", error);
    } else {
      alert("Item added to inventory");
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTrigger align={"center"}>Add New Item</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Add a new item to the inventory</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode</FormLabel>
                  <Input placeholder="Barcode" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input placeholder="Name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Input placeholder="Category" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <Input placeholder="Price" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caseWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Weight</FormLabel>
                  <Input
                    type="number"
                    placeholder="Case Weight"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemsPerCase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Items Per Case</FormLabel>
                  <Input
                    type="number"
                    placeholder="Items Per Case"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Input placeholder="Duration" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="container"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Container</FormLabel>
                  <Input placeholder="Container" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="ml-2" type="submit" variant="default">
                Add Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewItemForm;
