"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Shows from "./showComponents/showCard";
import { useRealTimeShows } from "./showComponents/useRealTimeShows";
import { Button } from "@/components/ui/button";
import AddNewShow from "./showComponents/addNewShow";
import React from "react";
import { CalendarDays } from "lucide-react";

export default function ShowsPageClient({ userRole }) {
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
            {userRole === 'admin' && (
              <Button onClick={() => setOpen(true)}>Add New Show</Button>
            )}
          </div>
          <TabsContent value="upcoming">
            {shows.length > 0 ? (
              <div className="text-left">
                <Shows
                  shows={shows}
                  currentDate={currentDate}
                  type="upcoming"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming shows</h3>
                <p className="text-sm text-muted-foreground">Shows you schedule will appear here.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="past">
            {shows.filter((show) => new Date(show.date_of_show) < currentDate)
              .length > 0 ? (
              <div className="text-left">
                <Shows shows={shows} currentDate={currentDate} type="past" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No past shows</h3>
                <p className="text-sm text-muted-foreground">Shows you schedule will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        {userRole === 'admin' && (
          <AddNewShow open={open} setOpen={setOpen} />
        )}
      </div>
    </div>
  );
}
