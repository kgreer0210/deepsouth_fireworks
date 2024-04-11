import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function IndiviualShowHeader({ show }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Inventory Assigned to {show.name}
        </h2>
        <Progress value={25} className="w-[30%] m-4" />
        <div className="flex space-x-4">
          <Button>Print</Button>
          <Button variant="destructive">Delete Show</Button>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between mt-2">
          <h1>List of Items in Show Here</h1>
        </div>
      </div>
    </div>
  );
}
