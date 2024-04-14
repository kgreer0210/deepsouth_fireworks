"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createClient } from "@/app/utils/supabase/client";
import NewItemForm from "./newItemForm";

const formSchema = z.object({
  barcode: z.string().min(1, {
    message: "Barcode must be at least 1 character long",
  }),
});

export default function AddNewInventoryItem() {
  const [showNewItemForm, setShowNewItemForm] = React.useState(false);
  const [barcodeValue, setBarcodeValue] = React.useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: "",
    },
  });
  const supabase = createClient();

  async function validateBarcode(barcode) {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select()
        .eq("barcode", barcode);

      if (error) {
        console.error("Error validating barcode:", error);
        return false;
      }

      return data.length > 0; // Return true if barcode exists in the database
    } catch (error) {
      console.error("Error validating barcode:", error);
      return false;
    }
  }
  async function onSubmit(values) {
    const barcodeExists = await validateBarcode(values.barcode);

    if (!barcodeExists) {
      setBarcodeValue(values.barcode);
      setShowNewItemForm(true); // Update the state variable to show the form
      form.reset({ barcode: "" });
    } else {
      // Barcode exists, proceed with your form submission logic
      console.log("Barcode exists:", values.barcode);
      form.reset({ barcode: "" });
    }
  }

  return (
    <div>
      {showNewItemForm && (
        <NewItemForm
          open={true}
          setOpen={setShowNewItemForm}
          barcodeValue={barcodeValue}
        />
      )}
      <Dialog>
        <DialogTrigger className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-lg">
          Add Inventory Item
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
            <DialogDescription>
              Scan the barcode of the item you want to add to the inventory.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Barcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose asChild>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
