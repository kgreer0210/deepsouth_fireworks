"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Shows({ shows, currentDate, type }) {
  const filteredShows = shows.filter((show) => {
    const showDate = new Date(show.date_of_show);
    if (type === "upcoming") {
      return showDate >= currentDate;
    } else {
      return showDate < currentDate;
    }
  });

  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-wrap justify-start gap-8">
        {filteredShows.map((show) => (
          <Link key={show.show_id} href={`/shows/${show.show_id}`}>
            <Card className="h-full w-60 cursor-pointer">
              <CardHeader>
                <CardTitle className="truncate ...">{show.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{show.date_of_show}</CardDescription>
              </CardContent>
              <CardFooter>
                <p>
                  {show.budget.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
