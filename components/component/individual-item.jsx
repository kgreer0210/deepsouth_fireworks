import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "../ui/button";

export function IndividualItem({
  nameOfItem,
  category,
  quantity,
  price,
  case_weight,
  items_per_case,
  duration,
  container,
  video_url,
  size,
  barcode,
  ex_number,
  notes,
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Link href="/">
          <ArrowLeftIcon className="h-5 w-5 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-semibold">Edit {nameOfItem}</h1>
      </div>
      <Card className="divide-y min-w-[800px]">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={nameOfItem} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" defaultValue={category} />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" defaultValue={quantity} />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" defaultValue={price} />
            </div>
            <div>
              <Label htmlFor="case_weight">Case Weight</Label>
              <Input id="case_weight" defaultValue={case_weight} />
            </div>
            <div>
              <Label htmlFor="items_per_case">Items Per Case</Label>
              <Input id="items_per_case" defaultValue={items_per_case} />
            </div>
            <div>
              <Label htmlFor="video_url">Video URL</Label>
              <Input id="video_url" defaultValue={video_url} />
            </div>
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" defaultValue={barcode} />
            </div>
            <div>
              <Label htmlFor="ex_number">EX Number</Label>
              <Input id="ex_number" defaultValue={ex_number} />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" defaultValue={notes} />
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Input id="size" defaultValue={size} />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" defaultValue={duration} />
            </div>
            <div>
              <Label htmlFor="container">Container</Label>
              <Input id="container" defaultValue={container} />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end mt-4 flex-cols-2 gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
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
