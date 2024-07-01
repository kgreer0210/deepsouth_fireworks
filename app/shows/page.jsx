"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Shows from "./showComponents/showCard";
import { useRealTimeShows } from "./showComponents/useRealTimeShows";
import { Button } from "@/components/ui/button";
import AddNewShow from "./showComponents/addNewShow";
import React from "react";

export default function ShowsPage() {
  const currentDate = new Date();
  const { shows, error } = useRealTimeShows();
  const [open, setOpen] = React.useState(false); // State to manage dialog open/close

  if (error) {
    return <div>Error loading shows: {error.message}</div>;
  }

  return (
    <div className="flex flex-1 overflow-auto">
      <div className="p-8 w-full">
        <Tabs defaultValue="upcoming">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Shows</TabsTrigger>
              <TabsTrigger value="past">Past Shows</TabsTrigger>
            </TabsList>
            <Button onClick={() => setOpen(true)}>Add New Show</Button>
          </div>
          <TabsContent value="upcoming">
            <div className="text-left">
              <Shows shows={shows} currentDate={currentDate} type="upcoming" />
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="text-left">
              <Shows shows={shows} currentDate={currentDate} type="past" />
            </div>
          </TabsContent>
        </Tabs>
        <AddNewShow open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
