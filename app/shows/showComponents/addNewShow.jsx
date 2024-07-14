"use client";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  revenue: z.number().min(1, "Revenue must be at least 1").optional(),
  budget: z.number().min(1, "Budget must be at least 1").optional(),
  duration: z.number().min(1, "Duration is required").optional(),
  dateOfShow: z.string().min(1, "Date of show is required"),
});

const AddNewShow = ({ open, setOpen }) => {
  const supabase = createClient();
  const [budgetPercentage, setBudgetPercentage] = React.useState(30);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      revenue: "",
      budget: "",
      duration: "",
      dateOfShow: new Date().toISOString().split("T")[0], // Default value in YYYY-MM-DD format
    },
  });

  const handleClose = () => {
    setOpen(false);
    form.reset({
      name: "",
      revenue: "",
      budget: "",
      duration: "",
      dateOfShow: new Date().toISOString().split("T")[0],
    });
    setBudgetPercentage(30);
  };

  const onSubmit = async (data) => {
    const { error } = await supabase.from("shows").insert([
      {
        name: data.name,
        revenue: data.revenue ? data.revenue : 0,
        budget: data.budget ? data.budget : 0,
        duration: data.duration ? data.duration : 0,
        date_of_show: new Date(data.dateOfShow), // Ensure the date is in the correct format for the database
      },
    ]);

    if (error) {
      console.error("Error adding show:", error);
    } else {
      toast.success("Show added successfully");

      handleClose();
    }
  };

  //function to calculate both budget and percentage
  const updateBudget = (revenue) => {
    const budget = revenue ? Math.round(revenue * 0.3) : "";
    form.setValue("budget", budget);
    if (revenue && budget) {
      const percentage = (budget / revenue) * 100;
      setBudgetPercentage(Math.round(percentage * 10) / 10); // Round to nearest tenth
    } else {
      setBudgetPercentage(30);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Show</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
              name="revenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Revenue</FormLabel>
                  <Input
                    type="number"
                    placeholder="Revenue"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        ? Number(e.target.value)
                        : "";
                      field.onChange(value);
                      updateBudget(value);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Budget (${budgetPercentage}% of Revenue)`}</FormLabel>
                  <Input
                    type="number"
                    placeholder="Budget"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        ? Number(e.target.value)
                        : "";
                      field.onChange(value);
                      const revenue = form.getValues("revenue");
                      if (revenue && value) {
                        const percentage = (value / revenue) * 100;
                        setBudgetPercentage(Math.round(percentage * 10) / 10);
                      }
                    }}
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
                  <Input
                    type="number"
                    placeholder="Duration"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfShow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Show</FormLabel>
                  <Input
                    type="date"
                    placeholder="Date of Show"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
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
                Add Show
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewShow;
