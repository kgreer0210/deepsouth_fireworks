"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useRealTimeInventory() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase.from("inventory").select("*");
      if (error) {
        setError(error);
      } else {
        setInventory(data);
      }
    };

    fetchInventory();

    const channel = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setInventory((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setInventory((prev) =>
              prev.map((item) =>
                item.inventory_id === payload.new.inventory_id
                  ? payload.new
                  : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setInventory((prev) =>
              prev.filter(
                (item) => item.inventory_id !== payload.old.inventory_id
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { inventory, error };
}
