// showCard.js
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
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredShows.map((show) => (
          <Link key={show.show_id} href={`/shows/${show.show_id}`}>
            <Card className="h-full cursor-pointer">
              <CardHeader>
                <CardTitle>{show.name}</CardTitle>
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
