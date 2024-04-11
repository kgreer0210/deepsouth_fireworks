import { Roboto as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Deep South Fireworks",
  description: "Deep South Fireworks Inventory Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
