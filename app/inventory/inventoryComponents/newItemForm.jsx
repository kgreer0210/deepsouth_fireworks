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
import { createClient } from "@/utils/supabase/client";
const NewItemForm = ({ open, setOpen, barcodeValue }) => {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [caseWeight, setCaseWeight] = React.useState("");
  const [itemsPerCase, setItemsPerCase] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [container, setContainer] = React.useState("");

  const supabase = createClient();
  const handleClose = () => setOpen(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new item to Supabase

    const { data, error } = supabase
      .from("inventory")
      .insert([
        {
          name: name,
          barcode: barcodeValue,
          category: category,
          quantity: quantity,
          price: price,
          case_weight: caseWeight,
          items_per_case: itemsPerCase,
          duration: duration,
          container: container,
        },
      ])
      .select()
      .then(() => {
        alert("Item added to inventory");
      });

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle align={"center"}>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            id="barcode"
            label="barcode"
            type="text"
            fullWidth
            value={barcodeValue}
          />
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            id="category"
            label="Category"
            type="text"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            margin="normal"
            id="quantity"
            label="Quantity"
            type="text"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            margin="normal"
            id="price"
            label="Price"
            type="text"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            margin="normal"
            id="caseWeight"
            label="Case Weight"
            type="text"
            fullWidth
            value={caseWeight}
            onChange={(e) => setCaseWeight(e.target.value)}
          />
          <TextField
            margin="normal"
            id="itemsPerCase"
            label="Items Per Case"
            type="text"
            fullWidth
            value={itemsPerCase}
            onChange={(e) => setItemsPerCase(e.target.value)}
          />
          <TextField
            margin="normal"
            id="duration"
            label="Duration"
            type="text"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <TextField
            margin="normal"
            id="container"
            label="Container"
            type="text"
            fullWidth
            value={container}
            onChange={(e) => setContainer(e.target.value)}
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
