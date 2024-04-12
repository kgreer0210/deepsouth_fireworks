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

const formSchema = z.object({
  barcode: z.string().min(1, {
    message: "Barcode must be at least 1 character long",
  }),
});

export default function AddNewInventoryItem() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: "",
    },
  });
  function onSubmit(values) {
    // Do something with the form values.
    console.log(values);
    form.reset({ barcode: "" });
  }

  return (
    <div>
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
