// ClientSideToast.js
"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export function ClientSideToast() {
  const { pending, data } = useFormStatus();

  useEffect(() => {
    if (!pending && data) {
      if (data.success) {
        toast.success(data.message, { duration: 3000 });
      } else {
        toast.error(data.message, { duration: 3000 });
      }
    }
  }, [pending, data]);

  return null;
}
