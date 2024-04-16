// ShowsPage.js
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Shows from "./showComponents/showCard";
import { getShows } from "../data/showData";

export default async function ShowsPage() {
  const currentDate = new Date();
  const shows = await getShows();

  return (
    <div className="flex flex-1 overflow-auto">
      <div className="p-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Shows</TabsTrigger>
            <TabsTrigger value="past">Past Shows</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div>
              <h1 className="text-2xl font-bold mb-4">Upcoming Shows</h1>
              <Shows shows={shows} currentDate={currentDate} type="upcoming" />
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div>
              <h1 className="text-2xl font-bold mb-4">Past Shows</h1>
              <Shows shows={shows} currentDate={currentDate} type="past" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
