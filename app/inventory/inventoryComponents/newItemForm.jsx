"use client";
import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
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

  // Integrate react-hook-form with zod validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle align={"center"}>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            id="barcode"
            label="Barcode"
            type="text"
            fullWidth
            defaultValue={barcodeValue}
            {...register("barcode")}
            error={!!errors.barcode}
            helperText={errors.barcode?.message}
          />
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Name"
            type="text"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="normal"
            id="category"
            label="Category"
            type="text"
            fullWidth
            {...register("category")}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
          <TextField
            margin="normal"
            id="quantity"
            label="Quantity"
            type="number"
            defaultValue={0}
            fullWidth
            {...register("quantity", { valueAsNumber: true })}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
          />
          <TextField
            margin="normal"
            id="price"
            label="Price"
            type="text"
            fullWidth
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            margin="normal"
            id="caseWeight"
            label="Case Weight"
            type="number"
            defaultValue={0}
            fullWidth
            {...register("caseWeight", { valueAsNumber: true })}
            error={!!errors.caseWeight}
            helperText={errors.caseWeight?.message}
          />
          <TextField
            margin="normal"
            id="itemsPerCase"
            label="Items Per Case"
            type="number"
            defaultValue={0}
            fullWidth
            {...register("itemsPerCase", { valueAsNumber: true })}
            error={!!errors.itemsPerCase}
            helperText={errors.itemsPerCase?.message}
          />
          <TextField
            margin="normal"
            id="duration"
            label="Duration (Sec)"
            type="text"
            fullWidth
            {...register("duration")}
            error={!!errors.duration}
            helperText={errors.duration?.message}
          />
          <TextField
            margin="normal"
            id="container"
            label="Container"
            type="text"
            fullWidth
            {...register("container")}
            error={!!errors.container}
            helperText={errors.container?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewItemForm;
