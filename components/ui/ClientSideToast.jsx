// ClientSideToast.js
"use client";

import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export function ClientSideToast() {
  const { toast } = useToast();
  const { pending, data } = useFormStatus();

  useEffect(() => {
    if (!pending && data) {
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }, [pending, data, toast]);

  return null;
}
