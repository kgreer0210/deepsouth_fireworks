"use client";

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { editItemServer } from "./editItemAction";

export function IndividualItem({ item }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    try {
      const result = await editItemServer(formData, item.inventory_id);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/">
              <ArrowLeftIcon className="h-5 w-5 text-muted-foreground" />
            </Link>
            <h1 className="text-2xl font-semibold">Edit {item.name}</h1>
          </div>
          <Card className="divide-y min-w-[800px]">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    name="name"
                    defaultValue={item.name ? item.name : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    name="category"
                    defaultValue={item.category ? item.category : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    name="quantity"
                    defaultValue={item.quantity ? item.quantity : 0}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    name="price"
                    defaultValue={item.price ? item.price : 0}
                  />
                </div>
                <div>
                  <Label htmlFor="case_weight">Case Weight</Label>
                  <Input
                    name="case_weight"
                    defaultValue={item.case_weight ? item.case_weight : 0}
                  />
                </div>
                <div>
                  <Label htmlFor="items_per_case">Items Per Case</Label>
                  <Input
                    name="items_per_case"
                    defaultValue={item.items_per_case ? item.items_per_case : 0}
                  />
                </div>
                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    name="video_url"
                    defaultValue={item.video_url ? item.video_url : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    name="barcode"
                    defaultValue={item.barcode ? item.barcode : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="ex_number">EX Number</Label>
                  <Input
                    name="ex_number"
                    defaultValue={item.ex_number ? item.ex_number : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    name="notes"
                    defaultValue={item.notes ? item.notes : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input name="size" defaultValue={item.size ? item.size : 0} />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    name="duration"
                    defaultValue={item.duration ? item.duration : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="container">Connex Location</Label>
                  <Input
                    name="container"
                    defaultValue={item.container ? item.container : ""}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 flex-cols-2 gap-2">
                <Link href="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
      <Toaster />
    </>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
