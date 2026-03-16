"use client";

import { usePathname } from "next/navigation";

const HIDE_SIDEBAR_PATHS = ["/auth/", "/login"];

export default function SidebarWrapper({ children }) {
  const pathname = usePathname();
  if (HIDE_SIDEBAR_PATHS.some((p) => pathname.startsWith(p))) {
    return null;
  }
  return children;
}
