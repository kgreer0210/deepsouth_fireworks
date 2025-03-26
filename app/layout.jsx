import { Roboto as FontSans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

const fontSans = FontSans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Deep South Fireworks",
  description: "Deep South Fireworks Inventory Management System",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  let userData = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    userData = profile;
  }

  return (
    <html lang="en">
      <body
        className={cn(
          "h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="flex h-screen">
          {userData && <Sidebar initialUser={userData} />}
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
