"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useRealTimeShows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      const { data: shows, error } = await supabase.from("shows").select("*");
      if (error) {
        setError(error);
      } else {
        setShows(shows);
      }
    };

    fetchShows();

    const insertChannel = supabase
      .channel("schema-db-changes-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shows" },
        (payload) => {
          setShows((prevShows) => [...prevShows, payload.new]);
        }
      )
      .subscribe();

    const updateChannel = supabase
      .channel("schema-db-changes-update")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "shows" },
        (payload) => {
          setShows((prevShows) =>
            prevShows.map((show) =>
              show.show_id === payload.new.show_id ? payload.new : show
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertChannel);
      supabase.removeChannel(updateChannel);
    };
  }, []);

  return { shows, error };
}
